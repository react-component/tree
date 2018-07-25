import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Item from './Item';
import {
  TYPE_KEEP,
  getHeight, diffList,
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
      itemList: [],
      scrollPtg: 0,
      targetItemIndex: 0,
      targetItemOffsetPtg: -1,
      useVirtualList: true,
      needSyncScroll: true,

      // Save the styles to the item
      itemStyles: {},

      prevProps: {},
    };

    this.nodes = {};
  }

  componentDidMount() {
    this.calculatePosition();
    this.syncPosition();
  }

  static getDerivedStateFromProps(props, prevState) {
    const { prevProps } = prevState;
    const { dataSource, rowKey, transitionName, animation } = props;
    const newState = {
      prevProps: props,
    };

    if (prevProps.dataSource !== dataSource) {
      if (!rowKey || !prevProps.dataSource || (!transitionName && !animation)) {
        newState.itemList = [{ type: TYPE_KEEP, list: dataSource }];
      } else {
        // Only has `rowKey` & animation props can do the animation
        newState.itemList = diffList(prevProps.dataSource, dataSource);
      }
    }

    return newState;
  }

  componentDidUpdate() {
    this.calculatePosition();
    this.syncPosition();
  }

  onScroll = (...args) => {
    const { onScroll } = this.props;

    if (onScroll) {
      onScroll(...args);
    }

    this.calculatePosition();
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
      const len = type === TYPE_KEEP ? list.length : 1;
      if (current < len) {
        return list[current];
      }
      current -= len;
    }

    return null;
  };

  calculatePosition = () => {
    const { targetItemIndex, targetItemOffsetPtg, useVirtualList } = this.state;

    const total = this.getItemCount();
    if (total === 0) return;

    const { scrollTop, scrollHeight, clientHeight } = this.$container;
    const scrollRange = scrollHeight - clientHeight;

    // Skip if needn't scroll
    // TODO: Process collapse logic
    if (scrollRange === 0) {
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

    if (!needSyncScroll) return;

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

  renderNode = (index) => {
    const { itemStyles, useVirtualList } = this.state;
    const { children, rowKey } = this.props;
    const item = this.getItem(index);
    if (!item) return null;

    if (typeof children !== 'function') {
      return children;
    }

    const nodeRef = node => {
      this.nodes[index] = node;
    };

    let style = {};
    if (useVirtualList) {
      style = {
        position: 'absolute',
        left: 0,
        right: 0,

        ...itemStyles[index],
      };
    }

    // TODO: Replace `key` with `rowKey`
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

    const mergedStyle = {
      ...style,
      overflowY: 'auto',
      height,
      padding: 0,
    };

    let innerStyle;
    if (useVirtualList) {
      innerStyle = {
        height: itemMinHeight * this.getItemCount(),
        padding: 0,
        margin: 0,
        position: 'relative',
        overflowY: 'hidden',
      };
    } else {
      innerStyle = {
        padding: 0,
        margin: 0,
      };
    }

    return (
      <div
        style={mergedStyle}
        {...restProps}
        ref={this.setContainerRef}
        onScroll={this.onScroll}
      >
        <InnerComponent style={innerStyle}>
          {/* Top items */}
          {[...new Array(topCount)].map((_, index) => (
            this.renderNode(targetItemIndex - (topCount - index))
          ))}

          {/* Target item */}
          {this.renderNode(targetItemIndex)}

          {/* Bottom items */}
          {[...new Array(bottomCount)].map((_, index) => (
            this.renderNode(targetItemIndex + index + 1)
          ))}
        </InnerComponent>
      </div>
    );
  }
}

polyfill(VirtualList);

export default VirtualList;
