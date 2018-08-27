import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSMotion } from 'rc-animate';
import { polyfill } from 'react-lifecycles-compat';
import bigNumber from 'bignumber.js';

import Item from './Item';
import {
  TYPE_KEEP, TYPE_ADD, TYPE_REMOVE,
  diffList, getBoxHeight, getContentHeight,
  getTargetItemByScroll, getScrollByTargetItem,
} from './util';

// TODO: Move this code to rc-virtual-list
/**
 * The mock container of item list's height is count * itemMinHeight * SCALE.
 * The SCALE value is to make the scrollHeight much bigger than origin
 * since we can get more accurate scrollTop percentage value.
 */
const ITEM_HEIGHT_SCALE = 1.5;

function heightProp(...args) {
  const [props, propName, Component] = args;
  const prop = props[propName];

  if (prop === false || typeof prop === 'number') {
    return null;
  }

  return new Error(
    `Invalid prop \`${propName}\` supplied to \`${Component}\`. ` +
    `Only accept boolean false or number value but get ${prop}`
  );
}

/**
 * Virtual List provide the container to hold list item.
 * The scroll bar pin element's height of scroll bar is always fixed.
 * We will dynamic calculate the list item position with the percentage position of pin bar.
 */
class VirtualList extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    dataSource: PropTypes.array,
    height: heightProp,
    innerComponent: PropTypes.any,
    itemMinHeight: PropTypes.number,
    rowKey: PropTypes.string,
    style: PropTypes.object,

    motion: PropTypes.shape({
      ...CSSMotion.propTypes,
    }),

    // Animation
    transitionName: PropTypes.string,

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
      scrollPtg: bigNumber(0),
      targetItemIndex: 0,
      targetItemOffsetPtg: bigNumber(-1),
      useVirtualList: true,
      needSyncScroll: true,

      // item with animation
      itemList: [],

      prevProps: {},
    };

    this.nodes = {};
  }

  componentDidMount() {
    this.onDomUpdated();
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
    this.onDomUpdated();
  }

  onDomUpdated = () => {
    const { height } = this.props;

    console.log('----------------------------------');

    // No height no calculate
    if (height) {
      const doRestore = this.restoreScroll();

      if (!doRestore) {
        this.calculatePosition();
        this.syncPosition();
      }
    }
  };

  onScroll = (...args) => {
    const { onScroll, height } = this.props;

    if (onScroll) {
      onScroll(...args);
    }

    // When `height` set to 0 will also trigger `onScroll` event. We needn't that.
    if (height) {
      this.calculatePosition();
    }
  };

  // TODO: support multi animation
  onMotionEnd = () => {
    const { dataSource } = this.props;
    this.setState({
      itemList: [{ type: TYPE_KEEP, list: dataSource }],
    });
  };

  setContainerRef = (ele) => {
    this.$container = ele;
  };

  getTopCount = (state) => {
    const { scrollPtg } = state || this.state;
    const { itemMinHeight, height } = this.props;
    return Math.max(
      Math.ceil(scrollPtg * height / itemMinHeight),
      0,
    );
  };

  getBottomCount = (state) => {
    const { scrollPtg } = state || this.state;
    const { itemMinHeight, height } = this.props;
    return Math.max(
      Math.ceil((1 - scrollPtg) * height / itemMinHeight),
      0,
    );
  };

  // Get real dom height
  getItemHeight = (index) => {
    const targetNode = this.nodes[index];
    const targetDom = ReactDOM.findDOMNode(targetNode);
    return getBoxHeight(targetDom) || 0;
  };

  getItemCount = (includeAnimatingItems) => {
    const { itemList } = this.state;


    if (includeAnimatingItems) {
      return itemList.reduce((count, { list }) => count + list.length, 0);
    }

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

  restoreScroll = () => {
    const { itemList, scrollPtg, targetItemIndex, targetItemOffsetPtg } = this.state;
    const needRestore = itemList.some((item) => {
      const { type } = item;

      // TODO: Not use this in prod env
      if (item.used === true) return false;

      item.used = true;
      return type !== TYPE_KEEP;
    });

    if (needRestore && this.$container) {
      const { scrollHeight, clientHeight } = this.$container;
      const total = this.getItemCount(true);
      const newScrollPtg = getScrollByTargetItem(targetItemIndex, targetItemOffsetPtg, total);
      const scrollRange = scrollHeight - clientHeight;
      
      const { itemIndex, itemOffsetPtg } = getTargetItemByScroll(newScrollPtg, total);
      this.$container.scrollTop = Math.round(
        newScrollPtg.multipliedBy(scrollRange)
      ); // scrollRange * newScrollPtg;

      console.log(
        'CCC:',
        newScrollPtg.multipliedBy(scrollRange).toNumber(),
        '/ Total:',
        total,
      );

      console.log(
        'Sync!',
        this.$container.scrollTop,
        scrollHeight - clientHeight,
        '-',
        newScrollPtg.toNumber(),
        itemIndex,
        itemOffsetPtg.toNumber(),
      );

      const mockScrollPtg = bigNumber(this.$container.scrollTop).div(scrollRange);
      const {
        itemIndex: mockItemIndex, itemOffsetPtg: mockItemOffsetPtg,
      } = getTargetItemByScroll(mockScrollPtg, total);
      this.setState({
        scrollPtg: mockScrollPtg,
        targetItemIndex: mockItemIndex,
        targetItemOffsetPtg: mockItemOffsetPtg,
        needSyncScroll: false,
      });

      return true;
    }
    console.log(
      'Last:',
      this.$container.scrollTop,
      '-',
      scrollPtg.toNumber(),
      targetItemIndex,
      targetItemOffsetPtg.toNumber(),
    );

    return false;
  };

  calculatePosition = () => {
    const { targetItemIndex, targetItemOffsetPtg, useVirtualList } = this.state;
    const { itemMinHeight, height } = this.props;

    const total = this.getItemCount(true);
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
    let scrollPtg = bigNumber(scrollTop).div(scrollRange); // scrollTop / scrollRange;

    // Mark as 0 if scrollRange is 0
    if (scrollPtg.isNaN()) {
      scrollPtg = bigNumber(0);
    }

    // Safari has the bump effect which will make scroll out of range. Need check this.
    const scrollPtgNum = scrollPtg.toNumber();
    if (scrollPtgNum < 0) {
      scrollPtg = bigNumber(0);
    } else if (scrollPtgNum > 1) {
      scrollPtg = bigNumber(1);
    }

    const { itemIndex, itemOffsetPtg } = getTargetItemByScroll(scrollPtg, total);

    if (
      targetItemIndex !== itemIndex ||
      targetItemOffsetPtg.toString() !== itemOffsetPtg.toString()
    ) {
      console.warn(
        'Update:',
        scrollTop,
        scrollRange,
        '-',
        scrollPtg.toNumber(),
        itemIndex,
        itemOffsetPtg.toNumber(),
      );
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

    // `targetItemOffsetPtg = -1` is only when the dom init
    if (!needSyncScroll || targetItemOffsetPtg.toNumber() === -1) return;

    const { scrollTop } = this.$container;

    // Calculate target item
    const targetItemHeight = this.getItemHeight(targetItemIndex);
    const targetItemTop = scrollPtg.multipliedBy(getContentHeight(this.$container)); // scrollPtg * getContentHeight(this.$container);
    const targetItemOffset = targetItemOffsetPtg.multipliedBy(targetItemHeight); // targetItemOffsetPtg * targetItemHeight;
    const targetItemMergedTop = bigNumber(scrollTop).plus(targetItemTop).minus(targetItemOffset); // scrollTop + targetItemTop - targetItemOffset;

    // Calculate top items
    let topItemsTop = targetItemMergedTop;
    const topCount = this.getTopCount();
    [...new Array(topCount)].forEach((_, i) => {
      const index = targetItemIndex - i - 1;
      topItemsTop = topItemsTop.minus(this.getItemHeight(index)); // topItemsTop - this.getItemHeight(index);
    });

    this.setState({
      needSyncScroll: false,
      topItemTop: topItemsTop.toNumber(),
    });
  };

  renderSingleNode = (item, index) => {
    const { children, rowKey } = this.props;

    if (typeof children !== 'function') {
      return children;
    }

    const nodeRef = node => {
      this.nodes[index] = node;
    };

    return (
      <Item key={rowKey ? item[rowKey] : index} ref={nodeRef}>
        {children({
          index,
          style: {}, // TODO: Maybe we can remove this
          props: item,
        })}
      </Item>
    );
  };

  renderNode = (index) => {
    const { height, itemMinHeight, motion } = this.props;
    const { type, item: itemList } = this.getItem(index) || {};

    if (!itemList) {
      return null;
    }

    if (type === TYPE_KEEP) {
      return this.renderSingleNode(itemList, index); // It's a item, not list actually
    }

    const visible = type !== TYPE_REMOVE;

    const nodeRef = node => {
      this.nodes[index] = node;
    };

    let filteredList = itemList;
    if (height) {
      const maxCount = Math.ceil(height / itemMinHeight);
      filteredList = itemList.slice(0, maxCount);
    }

    return (
      <CSSMotion
        key={`RC_VIRTUAL_${index}`}
        motionAppear={type === TYPE_ADD}
        motionEnter={false}
        motionLeave={type === TYPE_REMOVE}
        motionLeaveImmediately
        {...motion}
        onAppearEnd={this.onMotionEnd}
        onEnterEnd={this.onMotionEnd}
        onLeaveEnd={this.onMotionEnd}
        visible={visible}
      >
        {({ className, style }) => (
          <div className={className} style={style} ref={nodeRef}>
            {filteredList.map((item, j) => (
              this.renderSingleNode(item, `${index}_${j}`)
            ))}
          </div>
        )}
      </CSSMotion>
    );
  };

  render() {
    const { targetItemIndex, useVirtualList, topItemTop } = this.state;
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
    const totalCount = this.getItemCount(); // Count without animating items
    const totalItemCount = this.getItemCount(true); // Count includes animating items

    const mergedStyle = {
      ...style,
      overflowY: 'auto',
      height,
    };

    let innerStyle = {
      padding: 0,
      margin: 0,
    };

    console.log(
      'HEIGHT:',
      totalItemCount,
      'Top:',
      topItemTop,
      'Item Index',
      targetItemIndex,
    );
    // Virtual list render
    if (useVirtualList && height) {
      innerStyle = {
        ...innerStyle,
        height: Math.max(itemMinHeight * totalItemCount * ITEM_HEIGHT_SCALE, height),
        position: 'relative',
        overflowY: 'hidden',
      };

      const $children = [
        // Top items
        ...new Array(topCount),
        // Target item
        1,
        // Bottom items
        ...new Array(bottomCount),
      ].map((_, index) => (
        this.renderNode(targetItemIndex - (topCount - index))
      ));

      const ulStyle = {
        padding: 0,
        margin: 0,
        position: 'absolute',
        top: topItemTop,
        left: 0,
        right: 0,
        overflowAnchor: 'none',
      };

      return (
        <div
          style={mergedStyle}
          {...restProps}
          ref={this.setContainerRef}
          onScroll={this.onScroll}
        >
          <div style={innerStyle}>
            <InnerComponent style={ulStyle}>
              {$children}
            </InnerComponent>
          </div>
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
