import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import { getFullKeyList } from './util';

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */
export const contextTypes = {
  rcTree: PropTypes.shape({
    root: PropTypes.object,

    prefixCls: PropTypes.string,
    selectable: PropTypes.bool,
    showIcon: PropTypes.bool,
    draggable: PropTypes.bool,
    checkable: PropTypes.bool,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    loadData: PropTypes.func,
    filterTreeNode: PropTypes.func,
    renderTreeNode: PropTypes.func,

    onExpand: PropTypes.func,
  }),
};

class Tree extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    selectable: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object,
    ]),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    loadData: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onRightClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
    onDragEnd: PropTypes.func,
    filterTreeNode: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  static childContextTypes = contextTypes;

  static defaultProps = {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    checkStrictly: false,
    draggable: false,
    autoExpandParent: true,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    onExpand: null,
    onCheck: null,
    onSelect: null,
    onDragStart: null,
    onDragEnter: null,
    onDragOver: null,
    onDragLeave: null,
    onDrop: null,
    onDragEnd: null,
    onMouseEnter: null,
    onMouseLeave: null,
  };

  constructor(props) {
    super(props);

    const {
      defaultExpandAll,
      defaultExpandedKeys,
      defaultCheckedKeys,
      defaultSelectedKeys,
    } = props;

    // Sync state with props
    // TODO: Default logic
    this.state = {
      expandedKeys: defaultExpandAll ? getFullKeyList(props.children) : [],
      selectedKeys: [],

      ...(this.getSyncProps(props) || {}),
    };
  }

  componentWillReceiveProps(nextProps) {
    // React 16 will not trigger update if new state is null
    this.setState(this.getSyncProps(nextProps));
  }

  getChildContext() {
    const {
      prefixCls, selectable, showIcon, draggable, checkable,
      loadData, filterTreeNode,
      openTransitionName, openAnimation,
    } = this.props;

    return {
      rcTree: {
        root: this,

        prefixCls,
        selectable,
        showIcon,
        draggable,
        checkable,
        openTransitionName,
        openAnimation,

        loadData,
        filterTreeNode,
        renderTreeNode: this.renderTreeNode,

        onExpand: this.onExpand,
      },
    };
  }

  onExpand = () => {
    // TODO: Palceholder
  };

  /**
   * Sync state with props if needed
   */
  getSyncProps = (props) => {
    let needSync = false;
    const oriState = this.state || {};
    const oriProps = props || this.props || {};
    const newState = {};

    const syncList = ['expandedKeys', 'selectedKeys'];
    syncList.forEach((name) => {
      if (oriState[name] !== oriProps[name]) {
        newState[name] = props[name];
        needSync = true;
      }
    });

    return needSync ? newState : null;
  };


  /**
   * Since component is both affected by state & props,
   * use unique method to get high priority value
   */
  /* uniqueVal = (name) => {
    if (name in this.props) {
      return this.props[name];
    }
    return this.state[name];
  }; */

  // TODO: Remove `key` dep to support HOC.
  /**
   * [Legacy] Original logic use `key` as tracking clue.
   * We have to use `cloneElement` to pass `key`.
   * @param child
   * @param index
   * @param level
   * @returns {*}
   */
  renderTreeNode = (child, index, level = 0) => {
    const { expandedKeys, selectedKeys } = this.state;
    const {} = this.props;
    const pos = `${level}-${index}`;
    const key = child.key || pos;

    /* const childProps = {
      root: this,
      dragOver: state.dragOverNodeKey === key && state.dropPosition === 0,
      dragOverGapTop: state.dragOverNodeKey === key && state.dropPosition === -1,
      dragOverGapBottom: state.dragOverNodeKey === key && state.dropPosition === 1,
      expanded: state.expandedKeys.indexOf(key) !== -1,
      selected: state.selectedKeys.indexOf(key) !== -1,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      filterTreeNode: this.filterTreeNode,
    };
    if (props.checkable) {
      childProps.checkable = props.checkable;
      childProps.checked = state.checkedKeys.indexOf(key) !== -1;
      childProps.halfChecked = state.halfCheckedKeys.indexOf(key) !== -1;
    } */

    const clone = React.cloneElement(child, {
      eventKey: key,
      expanded: expandedKeys.includes(key),
      selected: selectedKeys.includes(key),
      pos,
    });

    return clone;
  };

  render() {
    const {
      prefixCls, className, focusable,
      showLine,
      children,
    } = this.props;
    const domProps = {};

    // [Legacy] Commit: 0117f0c9db0e2956e92cb208f51a42387dfcb3d1
    if (focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }

    return (
      <ul
        {...domProps}
        className={classNames(prefixCls, className, {
          [`${prefixCls}-show-line`]: showLine,
        })}
        role="tree-node"
        unselectable="on"
      >
        {React.Children.map(children, this.renderTreeNode, this)}
      </ul>
    );
  }
}

export default Tree;
