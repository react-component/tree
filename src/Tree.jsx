import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import {
  traverseTreeNodes, isPositionPrefix,
  getFullKeyList, getPosition,
} from './util';

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
    checkable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    checkStrictly: PropTypes.bool,
    disabled: PropTypes.bool,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    loadData: PropTypes.func,
    filterTreeNode: PropTypes.func,
    renderTreeNode: PropTypes.func,

    isKeyChecked: PropTypes.func,

    onExpand: PropTypes.func,
    onNodeSelect: PropTypes.func,
    onBatchNodeCheck: PropTypes.func,
    onUpCheckConduct: PropTypes.func,
  }),
};

class Tree extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    focusable: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
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
    disabled: false,
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
      // defaultCheckedKeys,
      // defaultSelectedKeys,
    } = props;

    // Sync state with props
    // TODO: Default logic
    this.state = {
      expandedKeys: defaultExpandAll ?
        getFullKeyList(props.children) :
        this.calcExpandedKeys(defaultExpandedKeys, props),
      selectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],

      ...(this.getSyncProps(props) || {}),
    };

    // Cache for check status to optimize
    this.checkedBatch = null;
  }

  getChildContext() {
    const {
      prefixCls, selectable, showIcon, draggable, checkable, checkStrictly, disabled,
      loadData, filterTreeNode,
      openTransitionName, openAnimation,
    } = this.props;

    return {
      rcTree: {
        // root: this,

        prefixCls,
        selectable,
        showIcon,
        draggable,
        checkable,
        checkStrictly,
        disabled,
        openTransitionName,
        openAnimation,

        loadData,
        filterTreeNode,
        renderTreeNode: this.renderTreeNode,
        isKeyChecked: this.isKeyChecked,

        onExpand: this.onExpand,
        onNodeSelect: this.onNodeSelect,
        onBatchNodeCheck: this.onBatchNodeCheck,
        onUpCheckConduct: this.onUpCheckConduct,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    // React 16 will not trigger update if new state is null
    this.setState(this.getSyncProps(nextProps, this.props));
  }

  onNodeSelect = (e, treeNode) => {
    const { onSelect, multiple, children } = this.props;
    const { selected, eventKey } = treeNode.props;
    const targetSelected = !selected;

    // Update selected keys
    let selectedKeys = this.state.selectedKeys.slice();
    if (!targetSelected) {
      const index = selectedKeys.indexOf(eventKey);
      selectedKeys.splice(index, 1);
    } else if (!multiple) {
      selectedKeys = [eventKey];
    } else {
      selectedKeys.push(eventKey);
    }

    // [Legacy] Not found related usage in doc or upper libs
    // [Legacy] TODO: can be optimized if we remove selectedNodes in API
    const selectedNodes = [];
    if (selectedKeys.length) {
      traverseTreeNodes(children, (item) => {
        if (selectedKeys.indexOf(item.key) !== -1) {
          selectedNodes.push(item);
        }
      });
    }

    this.setUncontrolledState({ selectedKeys });

    if (onSelect) {
      const eventObj = {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
      };
      onSelect(selectedKeys, eventObj);
    }
  };

  /**
   * This will cache node check status to optimize update process.
   * When Tree get trigger `onUpCheckConduct` will flush all the update.
   */
  onBatchNodeCheck = (key, checked, halfChecked, startNode) => {
    if (startNode) {
      this.checkedBatch = {
        treeNode: startNode,
        checked,
        list: [],
      };
    }

    // This code should never called
    if (!this.checkedBatch) {
      this.checkedBatch = {
        list: [],
      };
      warning(
        false,
        'Checked batch not init. This should be a bug. Please fire a issue.'
      );
    }

    this.checkedBatch.list.push({ key, checked, halfChecked });
  };

  /**
   * When top `onUpCheckConduct` called, will execute all batch update.
   * And trigger `onCheck` event.
   */
  onUpCheckConduct = () => {
    const { checkedKeys, halfCheckedKeys } = this.state;
    const { onCheck, checkStrictly, children } = this.props;

    // Use map to optimize update speed
    const checkedKeySet = {};
    const halfCheckedKeySet = {};

    checkedKeys.forEach(key => {
      checkedKeySet[key] = true;
    });
    halfCheckedKeys.forEach(key => {
      halfCheckedKeySet[key] = true;
    });

    // Batch process
    this.checkedBatch.list.forEach(({ key, checked, halfChecked }) => {
      checkedKeySet[key] = checked;
      halfCheckedKeySet[key] = halfChecked;
    });
    const newCheckedKeys = Object.keys(checkedKeySet).filter(key => checkedKeySet[key]);
    const newHalfCheckedKeys = Object.keys(halfCheckedKeySet).filter(key => halfCheckedKeySet[key]);

    // Trigger onChecked
    let selectedObj;

    const eventObj = {
      event: 'check',
      node: this.checkedBatch.treeNode,
      checked: this.checkedBatch.checked,
    };

    if (checkStrictly) {
      // TODO: Handle on this
    } else {
      selectedObj = newCheckedKeys;

      // TODO: add optimize prop to skip node process
      eventObj.checkedNodes = [];
      eventObj.checkedNodesPositions = []; // TODO: not in API
      eventObj.halfCheckedKeys = newHalfCheckedKeys; // TODO: not in API
      traverseTreeNodes(children, (node, index, pos, key) => {
        if (checkedKeySet[key]) {
          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node, pos });
        }
      });
    }

    if (onCheck) {
      onCheck(selectedObj, eventObj);
    }

    // Clean up
    this.checkedBatch = null;
  };

  onExpand = () => {
    // TODO: Palceholder
  };

  /**
   * Sync state with props if needed
   */
  getSyncProps = (props = {}, prevProps = {}) => {
    let needSync = false;
    const newState = {};

    function checkSync(name) {
      if (props[name] !== prevProps[name]) {
        needSync = true;
        return true;
      }
      return false;
    }

    if (checkSync('expandedKeys')) {
      newState.expandedKeys = this.calcExpandedKeys(props.expandedKeys, props);
    }

    // TODO: SelectKeys

    return needSync ? newState : null;
  };

  /**
   * Only update the value which is not in props
   * @param state
   */
  setUncontrolledState = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    this.setState(needSync ? newState : null);
  };

  isKeyChecked = (key) => {
    const { checkedKeys } = this.state;
    return checkedKeys.includes(key);
  };

  calcExpandedKeys = (keyList, props) => {
    if (!keyList) {
      return undefined;
    }

    const { autoExpandParent, children } = props || this.props || {};

    // Do nothing if not auto expand parent
    if (!autoExpandParent) {
      return keyList;
    }

    // Collect the TreeNode list which need be expanded by path
    const needExpandPathList = [];
    if (autoExpandParent) {
      traverseTreeNodes(children, (item, index, pos, key) => {
        if (keyList.indexOf(key) > -1) {
          needExpandPathList.push(pos);
        }
      });
    }

    // Expand the path for matching position
    const needExpandKeys = {};
    traverseTreeNodes(children, (item, index, pos, key) => {
      if (needExpandPathList.some(bigPos => isPositionPrefix(pos, bigPos))) {
        needExpandKeys[key] = true;
      }
    });
    const calcExpandedKeyList = Object.keys(needExpandKeys);

    // [Legacy] Return origin keyList if calc list is empty
    return calcExpandedKeyList.length ? calcExpandedKeyList : keyList;
  };

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
    const { expandedKeys, selectedKeys, halfCheckedKeys } = this.state;
    const {} = this.props;
    const pos = getPosition(level, index);
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

    return React.cloneElement(child, {
      eventKey: key,
      expanded: expandedKeys.includes(key),
      selected: selectedKeys.includes(key),
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.includes(key),
      pos,
    });
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
