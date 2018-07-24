import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Item from './Item';
import { getHeight } from './util';

// TODO: Move this code to rc-virtual-list

/**
 * Virtual List provide the container to hold list item.
 * The scroll bar pin element's height of scroll bar is always fixed.
 * We will dynamic calculate the list item position with the percentage position of pin bar.
 */
class VirtualList extends React.Component {
  static propTypes = {
    innerComponent: PropTypes.any,
    children: PropTypes.func,
    dataSource: PropTypes.array,
    itemMinHeight: PropTypes.number,
    height: PropTypes.number.isRequired,
    style: PropTypes.object,
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
      targetItemOffsetPtg: 0,
      needSyncScroll: true,

      // Save the styles to the item
      itemStyles: {},
    };

    this.nodes = {};
  }

  componentDidMount() {
    this.calculatePosition();
    this.syncPosition();
  }

  componentDidUpdate() {
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

  getTopCount = () => {
    const { scrollPtg } = this.state;
    const { itemMinHeight, height } = this.props;
    return Math.ceil(scrollPtg * height / itemMinHeight);
  };

  getBottomCount = () => {
    const { scrollPtg } = this.state;
    const { itemMinHeight, height } = this.props;
    return Math.ceil((1 - scrollPtg) * height / itemMinHeight);
  };

  // Get real dom height
  getItemHeight = (index) => {
    const targetNode = this.nodes[index];
    const targetDom = ReactDOM.findDOMNode(targetNode);
    return getHeight(targetDom) || 0;
  };

  calculatePosition = () => {
    const { targetItemIndex, targetItemOffsetPtg } = this.state;
    const { dataSource } = this.props;

    const total = dataSource.length;
    if (total === 0) return;

    const { scrollTop, scrollHeight, clientHeight } = this.$container;

    // Get current scroll position (percentage)
    const scrollPtg = scrollTop / (scrollHeight - clientHeight);

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
    const { itemStyles } = this.state;
    const { dataSource, children } = this.props;
    const item = dataSource[index];
    if (!item) return null;

    if (typeof children !== 'function') {
      return children;
    }

    const nodeRef = node => {
      this.nodes[index] = node;
    };

    // TODO: Replace `key` with `rowKey`
    return (
      <Item key={index} ref={nodeRef}>
        {children({
          ...item,
          style: {
            position: 'absolute',
            left: 0,
            right: 0,

            ...itemStyles[index],
          },
        })}
      </Item>
    );
  };

  render() {
    const { targetItemIndex } = this.state;
    const {
      dataSource,
      innerComponent: InnerComponent,
      height = 0, itemMinHeight,
      style,
      ...restProps
    } = this.props;

    // Calculate the list before target item
    const topCount = this.getTopCount();
    const bottomCount = this.getBottomCount();

    const mergedStyle = {
      ...style,
      overflowY: 'auto',
      height,
      padding: 0,
    };

    return (
      <div
        style={mergedStyle}
        {...restProps}
        ref={this.setContainerRef}
        onScroll={this.onScroll}
      >
        <InnerComponent
          style={{
            height: itemMinHeight * dataSource.length,
            padding: 0,
            margin: 0,
            position: 'relative',
            overflowY: 'hidden',
          }}
        >
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
