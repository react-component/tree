import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSMotion } from 'rc-animate';
import { polyfill } from 'react-lifecycles-compat';

import Item from './Item';
import {
  TYPE_KEEP, TYPE_ADD, TYPE_REMOVE,
  getHeight, diffList, flattenChildren,
} from './util';

// TODO: Move this code to rc-virtual-list

/**
 * Virtual List provide the container to hold list item.
 * The scroll bar pin element's height of scroll bar is always fixed.
 * We will dynamic calculate the list item position with the percentage position of pin bar.
 */
class VirtualList extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    dataSource: PropTypes.array,
    height: PropTypes.number.isRequired,
    innerComponent: PropTypes.any,
    itemMinHeight: PropTypes.number,
    rowKey: PropTypes.string,
    style: PropTypes.object,

    motion: PropTypes.shape({
      ...CSSMotion.propTypes,
    }),

    // Animation
    transitionName: PropTypes.string,
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    // Event
    onScroll: PropTypes.func,
  };

  static defaultProps = {
    dataSource: [],
    innerComponent: 'div',
    itemMinHeight: 10,
  };

  constructor() {
    super();

    this.state = {
      scrollPtg: 0,
      targetItemIndex: 0,
      targetItemOffsetPtg: -1,
      useVirtualList: true,
      needSyncScroll: true,

      // item with animation
      itemList: [],
      animations: {},

      // Save the styles to the item
      itemStyles: {},

      prevProps: {},
    };

    this.nodes = {};
  }

  componentDidMount() {
    this.calculatePosition();
    this.syncPosition();
    this.processAnimation();
  }

  static getDerivedStateFromProps(props, prevState) {
    const { prevProps } = prevState;
    const { dataSource, rowKey, motion } = props;
    const newState = {
      prevProps: props,
    };

    if (prevProps.dataSource !== dataSource) {
      if (!rowKey || !prevProps.dataSource || !motion) {
        newState.itemList = [{ type: TYPE_KEEP, list: dataSource }];
      } else {
        // Only has `rowKey` & animation props can do the animation
        newState.itemList = diffList(prevProps.dataSource, dataSource, rowKey);
      }
    }

    return newState;
  }

  componentDidUpdate() {
    this.calculatePosition();
    this.syncPosition();
    this.processAnimation();
  }

  onScroll = (...args) => {
    const { onScroll } = this.props;

    if (onScroll) {
      onScroll(...args);
    }

    this.calculatePosition();
  };

  // TODO: support multi animation
  onMotionEnd = () => {
    const { dataSource } = this.props;
    this.setState({
      itemList: [{ type: TYPE_KEEP, list: dataSource }],
      animations: {},
    });
  };

  setContainerRef = (ele) => {
    this.$container = ele;
  };

  getTopCount = (state) => {
    const { scrollPtg } = state || this.state;
    const { itemMinHeight, height } = this.props;
    return Math.ceil(scrollPtg * height / itemMinHeight);
  };

  getBottomCount = (state) => {
    const { scrollPtg } = state || this.state;
    const { itemMinHeight, height } = this.props;
    return Math.ceil((1 - scrollPtg) * height / itemMinHeight);
  };

  // Get real dom height
  getItemHeight = (index) => {
    const targetNode = this.nodes[index];
    const targetDom = ReactDOM.findDOMNode(targetNode);
    return getHeight(targetDom) || 0;
  };

  getItemCount = () => {
    const { itemList } = this.state;
    let total = 0;

    itemList.forEach(({ type, list }) => {
      total += type === TYPE_KEEP ? list.length : 1;
    });

    return total;
  };

  getItem = (index) => {
    const { itemList } = this.state;
    let current = index;
    const listCount = itemList.length;

    for (let i = 0; i < listCount; i += 1) {
      const { type, list } = itemList[i];
      const isKeep = type === TYPE_KEEP;
      const len = isKeep ? list.length : 1;
      if (current < len) {
        return {
          type,
          item: isKeep ? list[current] : list,
        };
      }
      current -= len;
    }

    return null;
  };

  calculatePosition = () => {
    const { targetItemIndex, targetItemOffsetPtg, useVirtualList } = this.state;
    const { itemMinHeight, height } = this.props;

    const total = this.getItemCount();
    if (total === 0) return;

    const { scrollTop, scrollHeight, clientHeight } = this.$container;
    const scrollRange = scrollHeight - clientHeight;

    // Skip if needn't scroll
    if (total * itemMinHeight <= height) {
      if (useVirtualList !== false) {
        this.setState({
          useVirtualList: false,
        });
      }
      return;
    }

    // Get current scroll position (percentage)
    const scrollPtg = scrollTop / scrollRange;

    const itemIndex = Math.floor(total * scrollPtg);
    const itemTopPtg = itemIndex / (total);
    const itemBottomPtg = (itemIndex + 1) / (total);
    const itemOffsetPtg = (scrollPtg - itemTopPtg) / (itemBottomPtg - itemTopPtg);

    if (targetItemIndex !== itemIndex || targetItemOffsetPtg !== itemOffsetPtg) {
      this.setState({
        scrollPtg,
        targetItemIndex: itemIndex,
        targetItemOffsetPtg: itemOffsetPtg,
        needSyncScroll: true,
        useVirtualList: true,
      });
    }
  };

  syncPosition = () => {
    const { needSyncScroll, targetItemIndex, targetItemOffsetPtg, scrollPtg } = this.state;
    const { height } = this.props;

    // `targetItemOffsetPtg = -1` is only when the dom init
    if (!needSyncScroll || targetItemOffsetPtg === -1) return;

    const { scrollTop } = this.$container;
    const itemStyles = {};

    // Calculate target item
    const targetItemHeight = this.getItemHeight(targetItemIndex);
    const targetItemTop = scrollPtg * height;
    const targetItemOffset = targetItemOffsetPtg * targetItemHeight;
    const targetItemMergedTop = scrollTop + targetItemTop - targetItemOffset;

    itemStyles[targetItemIndex] = {
      top: targetItemMergedTop,
    };

    // Calculate top items
    let topItemsTop = targetItemMergedTop;
    const topCount = this.getTopCount();
    [...new Array(topCount)].forEach((_, i) => {
      const index = targetItemIndex - i - 1;
      topItemsTop -= this.getItemHeight(index);

      itemStyles[index] = {
        top: topItemsTop,
      };
    });

    // Calculate top items
    let bottomItemsTop = targetItemMergedTop + targetItemHeight;
    const bottomCount = this.getBottomCount();
    [...new Array(bottomCount)].forEach((_, i) => {
      const index = targetItemIndex + i + 1;

      itemStyles[index] = {
        top: bottomItemsTop,
      };

      bottomItemsTop += this.getItemHeight(index);
    });

    this.setState({
      needSyncScroll: false,
      itemStyles,
    });
  };

  /**
   * This is only used for the List which need animation process.
   * We will diff the `dataSource` to find the add or remove items and wrapped under a div.
   * It's OK for add animation.
   * But if is remove animation, we need to add list and then remove it to trigger rc-animate remove.
   */
  processAnimation = () => {
    const { animations, targetItemIndex } = this.state;
    const { motion } = this.props;
    if (!motion) return;

    const startIndex = targetItemIndex - this.getTopCount();
    const endIndex = targetItemIndex + this.getBottomCount();

    const newAnimations = {};
    let changed = false;

    for (let i = startIndex; i < endIndex; i += 1) {
      const { type } = this.getItem(i) || {};
      if (type === TYPE_REMOVE && !animations[i]) {
        newAnimations[i] = true;
        changed = true;
      }
    }

    if (changed) {
      this.setState({ animations: newAnimations });
    }
  };

  renderSingleNode = (item, index) => {
    const { itemStyles, useVirtualList } = this.state;
    const { children, rowKey } = this.props;

    if (typeof children !== 'function') {
      return children;
    }

    const itemStyle = itemStyles[index];
    const nodeRef = node => {
      this.nodes[index] = node;
    };

    let style = {};
    if (useVirtualList && itemStyle) {
      style = {
        position: 'absolute',
        left: 0,
        right: 0,

        ...itemStyle,
      };
    }

    return (
      <Item key={rowKey ? item[rowKey] : index} ref={nodeRef}>
        {children({
          index,
          style,
          props: item,
        })}
      </Item>
    );
  };

  renderNode = (index) => {
    const { animations } = this.state;
    const { height, itemMinHeight, motion } = this.props;
    const { type, item: itemList } = this.getItem(index) || {};

    if (!itemList) {
      return null;
    }

    if (type === TYPE_KEEP) {
      return this.renderSingleNode(itemList, index); // It's a item, not list actually
    }

    // Animate
    let visible;
    if (type === TYPE_REMOVE) {
      visible = !animations[index];
    } else {
      visible = true;
    }

    const maxCount = Math.ceil(height / itemMinHeight);
    return (
      <CSSMotion
        key={`RC_VIRTUAL_${index}`}
        motionAppear={type === TYPE_ADD}
        motionEnter={type === TYPE_ADD}
        motionLeave={type === TYPE_REMOVE}
        {...motion}
        onAppearEnd={this.onMotionEnd}
        onEnterEnd={this.onMotionEnd}
        onLeaveEnd={this.onMotionEnd}
        visible={visible}
      >
        {({ className, style }) => (
          <div className={className} style={style}>
            {itemList.slice(0, maxCount).map((item, j) => (
              this.renderSingleNode(item, `${index}_${j}`)
            ))}
          </div>
        )}
      </CSSMotion>
    );
  };

  render() {
    const { targetItemIndex, useVirtualList } = this.state;
    const {
      innerComponent: InnerComponent,
      height = 0, itemMinHeight,
      style,
      ...restProps
    } = this.props;

    delete restProps.dataSource;
    delete restProps.onVisibleChange;
    delete restProps.rowKey;
    delete restProps.transitionName;
    delete restProps.animation;

    // Calculate the list before target item
    const topCount = this.getTopCount();
    const bottomCount = this.getBottomCount();
    const totalCount = this.getItemCount();

    const mergedStyle = {
      ...style,
      overflowY: 'auto',
      height,
      padding: 0,
    };

    let innerStyle = {
      padding: 0,
      margin: 0,
    };

    // Virtual list render
    if (useVirtualList) {
      innerStyle = {
        ...innerStyle,
        height: Math.max(itemMinHeight * totalCount, height),
        position: 'relative',
        overflowY: 'hidden',
      };

      const $children = flattenChildren(
        // Top items
        [...new Array(topCount)].map((_, index) => (
          this.renderNode(targetItemIndex - (topCount - index))
        )),
        // Target item
        [this.renderNode(targetItemIndex)],
        // Bottom items
        [...new Array(bottomCount)].map((_, index) => (
          this.renderNode(targetItemIndex + index + 1)
        )),
      );

      return (
        <div
          style={mergedStyle}
          {...restProps}
          ref={this.setContainerRef}
          onScroll={this.onScroll}
        >
          <InnerComponent style={innerStyle}>
            {$children}
          </InnerComponent>
        </div>
      );
    }

    // Normal list
    return (
      <div
        style={mergedStyle}
        {...restProps}
        ref={this.setContainerRef}
        onScroll={this.onScroll}
      >
        <InnerComponent style={innerStyle}>
          {[...new Array(totalCount)].map((_, index) => (
            this.renderNode(index)
          ))}
        </InnerComponent>
      </div>
    );
  }
}

polyfill(VirtualList);

export default VirtualList;
