import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import Animate from 'rc-animate';
import toArray from 'rc-util/lib/Children/toArray';
import { contextTypes } from './Tree';

const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

const LOAD_STATUS_NONE = 0;
const LOAD_STATUS_LOADING = 1;
const LOAD_STATUS_LOADED = 2;

const defaultTitle = '---';

let onlyTreeNodeWarned = false; // Only accept TreeNode

class TreeNode extends React.Component {
  static propTypes = {
    eventKey: PropTypes.string, // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    root: PropTypes.object,
    onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    halfChecked: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.node,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
  };

  static contextTypes = contextTypes;

  static defaultProps = {
    title: defaultTitle,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadStatus: LOAD_STATUS_NONE,
      dragNodeHighlight: false,
    };
  }

  onExpand = () => {
    const disabled = this.isDisabled();
    const { rcTree: { onExpand } } = this.context;

    if (disabled || !onExpand) return;
    // TODO: palceholder
  };

  setSelectHandle = (node) => {
    this.selectHandle = node;
  };

  getNodeChildren = () => {
    const { children } = this.props;
    const originList = toArray(children).filter(node => node);
    const targetList = originList.filter((node) => (
      node.type && node.type.isTreeNode
    ));

    if (originList.length !== targetList.length && !onlyTreeNodeWarned) {
      onlyTreeNodeWarned = true;
      warning(false, 'Tree only accept TreeNode as children.');
    }

    return targetList;
  };

  getNodeState = () => {
    const { expanded } = this.props;

    if (this.isLeaf()) {
      return null;
    }

    return expanded ? ICON_OPEN : ICON_CLOSE;
  };

  isLeaf = () => {
    const { loadStatus } = this.state;
    const { isLeaf } = this.props;
    const { rcTree: { loadData } } = this.context;

    const hasChildren = this.getNodeChildren().length !== 0;

    return (
      isLeaf ||
      (!loadData && !hasChildren) ||
      (loadData && loadStatus === LOAD_STATUS_LOADED && !hasChildren)
    );
  };

  isDisabled = () => {
    const { disabled } = this.props;
    const { rcTree: { disabled: treeDisabled } } = this.context;

    return treeDisabled || disabled;
  };

  // Switcher
  renderSwitcher = () => {
    const { loadStatus } = this.state;
    const { expanded } = this.props;
    const { rcTree: { prefixCls } } = this.context;
    const disabled = this.isDisabled();

    if (this.isLeaf() || loadStatus === LOAD_STATUS_LOADING) {
      return <span className={`${prefixCls}-switcher ${prefixCls}-switcher-noop`} />;
    }

    return (
      <span
        className={classNames(
          `${prefixCls}-switcher`,
          `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
          disabled && `${prefixCls}-switcher-disabled`,
        )}
        onClick={this.onExpand}
      />
    );
  };

  // Checkbox
  renderCheckbox = () => {
    const { checked, halfChecked, disableCheckbox } = this.props;
    const { rcTree: { prefixCls, checkable } } = this.context;
    const disabled = this.isDisabled();

    if (!checkable) return null;

    // [Legacy] Custom element should be separate with `checkable` in future
    const $custom = typeof checkable !== 'boolean' ? checkable : null;

    return (
      <span
        className={classNames(
          `${prefixCls}-checkbox`,
          checked && `${prefixCls}-checkbox-checked`,
          halfChecked && `${prefixCls}-checkbox-indeterminate`,
          (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`,
        )}
        onClick={this.onCheck}
      >
        {$custom}
      </span>
    );
  };

  // Icon + Title
  renderSelector = () => {
    const { loadStatus, dragNodeHighlight } = this.state;
    const { title, selected } = this.props;
    const { rcTree: { prefixCls, showIcon, draggable, loadData } } = this.context;
    const disabled = this.isDisabled();

    const wrapClass = `${prefixCls}-node-content-wrapper`;

    // Icon
    let $icon;
    if (showIcon || (loadData && loadStatus === LOAD_STATUS_LOADING)) {
      $icon = (
        <span
          className={classNames(
            `${prefixCls}-iconEle`,
            `${prefixCls}-icon__${this.getNodeState() || 'docu'}`,
            (loadStatus === LOAD_STATUS_LOADING) && `${prefixCls}-icon_loading`,
          )}
        />
      );
    }

    // Title
    const $title = <span className={`${prefixCls}-title`}>{title}</span>;

    // TODO: ref it
    // TODO: Event handler
    // TODO: Accessibility: `disabled` prop need map to dom attr.

    return (
      <span
        ref={this.setSelectHandle}
        title={typeof title === 'string' ? title : ''}
        className={classNames(
          `${wrapClass}`,
          `${wrapClass}-${this.getNodeState() || 'normal'}`,
          (!disabled && (selected || dragNodeHighlight)) && `${prefixCls}-node-selected`,
          (!disabled && draggable) && 'draggable'
        )}
        draggable={(!disabled && draggable) || undefined}
        aria-grabbed={(!disabled && draggable) || undefined}

        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        onClick={this.onClick}
        onDragStart={this.onDragStart}
      >
          {$icon}{$title}
        </span>
    );
  };

  // Children list wrapped with `Animation`
  renderChildren = () => {
    const { expanded, pos } = this.props;
    const { rcTree: {
      prefixCls,
      openTransitionName, openAnimation,
      renderTreeNode,
    } } = this.context;

    // [Legacy] Animation control
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    let transitionAppear = true;
    if (!renderFirst && expanded) {
      transitionAppear = false;
    }

    const animProps = {};
    if (openTransitionName) {
      animProps.transitionName = openTransitionName;
    } else if (typeof openAnimation === 'object') {
      animProps.animation = { ...openAnimation };
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }

    // Children TreeNode
    const nodeList = this.getNodeChildren();

    if (nodeList.length === 0) {
      return null;
    }

    let $children;
    if (expanded) {
      $children = (
        <ul
          className={classNames(
            `${prefixCls}-child-tree`,
            expanded && `${prefixCls}-child-tree-open`,
          )}
          data-expanded={expanded}
        >
          {React.Children.map(nodeList, (node, index) => (
            renderTreeNode(node, index, pos)
          ))}
        </ul>
      );
    }

    return (
      <Animate
        {...animProps}
        showProp="data-expanded"
        transitionAppear={transitionAppear}
        component=""
      >
        {$children}
      </Animate>
    );
  };

  render() {
    const {
      className,
      dragOver, dragOverGapTop, dragOverGapBottom,
    } = this.props;
    const { rcTree: {
      prefixCls,
      filterTreeNode,
    } } = this.context;
    const disabled = this.isDisabled();

    const domProps = {};

    return (
      <li
        {...domProps}
        className={classNames(className, {
          [`${prefixCls}-treenode-disabled`]: disabled,
          'drag-over': !disabled && dragOver,
          'drag-over-gap-top': !disabled && dragOverGapTop,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom,
          'filter-node': filterTreeNode && filterTreeNode(this),
        })}

        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onDragEnd={this.onDragEnd}
      >
        {this.renderSwitcher()}
        {this.renderCheckbox()}
        {/* {props.checkable ? this.renderCheckbox(props) : null} */}
        {this.renderSelector()}
        {this.renderChildren()}
      </li>
    );
  }
}

TreeNode.isTreeNode = 1;

export default TreeNode;
