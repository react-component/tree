import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import {
  traverseTreeNodes, getStrictlyValue,
  getFullKeyList, getPosition, getDragNodesKeys,
  calcExpandedKeys, calcSelectedKeys,
  calcCheckedKeys, calcDropPosition,
  arrAdd, arrDel, posToArr,
  mapChildren,
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
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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

    onNodeClick: PropTypes.func,
    onNodeDoubleClick: PropTypes.func,
    onNodeExpand: PropTypes.func,
    onNodeSelect: PropTypes.func,
    onNodeMouseEnter: PropTypes.func,
    onNodeMouseLeave: PropTypes.func,
    onNodeContextMenu: PropTypes.func,
    onNodeDragStart: PropTypes.func,
    onNodeDragEnter: PropTypes.func,
    onNodeDragOver: PropTypes.func,
    onNodeDragLeave: PropTypes.func,
    onNodeDragEnd: PropTypes.func,
    onNodeDrop: PropTypes.func,
    onBatchNodeCheck: PropTypes.func,
    onCheckConductFinished: PropTypes.func,
  }),
};

class Tree extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
    defaultExpandParent: PropTypes.bool,
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
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    onLoad: PropTypes.func,
    loadData: PropTypes.func,
    loadedKeys: PropTypes.arrayOf(PropTypes.string),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onRightClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
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
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
  };

  constructor(props) {
    super(props);

    const {
      defaultExpandAll,
      defaultExpandParent,
      defaultExpandedKeys,
      defaultCheckedKeys,
      defaultSelectedKeys,
      expandedKeys,
    } = props;

    // Sync state with props
    const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(defaultCheckedKeys, props) || {};

    const state = {
      selectedKeys: calcSelectedKeys(defaultSelectedKeys, props),
      checkedKeys,
      halfCheckedKeys,

      loadedKeys: [],
      loadingKeys: [],
    };

    if (defaultExpandAll) {
      state.expandedKeys = getFullKeyList(props.children);
    } else if (defaultExpandParent) {
      state.expandedKeys = calcExpandedKeys(expandedKeys || defaultExpandedKeys, props);
    } else {
      state.expandedKeys = defaultExpandedKeys;
    }

    this.state = {
      ...state,
      ...(this.getSyncProps(props) || {}),
    };

    // Cache for check status to optimize
    this.checkedBatch = null;
  }

  getChildContext() {
    const {
      prefixCls, selectable, showIcon, icon, draggable, checkable, checkStrictly, disabled,
      loadData, filterTreeNode,
      openTransitionName, openAnimation,
    } = this.props;

    return {
      rcTree: {
        // root: this,

        prefixCls,
        selectable,
        showIcon,
        icon,
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

        onNodeClick: this.onNodeClick,
        onNodeDoubleClick: this.onNodeDoubleClick,
        onNodeExpand: this.onNodeExpand,
        onNodeSelect: this.onNodeSelect,
        onNodeLoad: this.onNodeLoad,
        onNodeMouseEnter: this.onNodeMouseEnter,
        onNodeMouseLeave: this.onNodeMouseLeave,
        onNodeContextMenu: this.onNodeContextMenu,
        onNodeDragStart: this.onNodeDragStart,
        onNodeDragEnter: this.onNodeDragEnter,
        onNodeDragOver: this.onNodeDragOver,
        onNodeDragLeave: this.onNodeDragLeave,
        onNodeDragEnd: this.onNodeDragEnd,
        onNodeDrop: this.onNodeDrop,
        onBatchNodeCheck: this.onBatchNodeCheck,
        onCheckConductFinished: this.onCheckConductFinished,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    // React 16 will not trigger update if new state is null
    this.setState((prevState) => (
      this.getSyncProps(nextProps, this.props, prevState)
    ));
  }

  onNodeDragStart = (event, node) => {
    const { expandedKeys } = this.state;
    const { onDragStart } = this.props;
    const { eventKey, children } = node.props;

    this.dragNode = node;

    this.setState({
      dragNodesKeys: getDragNodesKeys(children, node),
      expandedKeys: arrDel(expandedKeys, eventKey),
    });

    if (onDragStart) {
      onDragStart({ event, node });
    }
  };

  /**
   * [Legacy] Select handler is less small than node,
   * so that this will trigger when drag enter node or select handler.
   * This is a little tricky if customize css without padding.
   * Better for use mouse move event to refresh drag state.
   * But let's just keep it to avoid event trigger logic change.
   */
  onNodeDragEnter = (event, node) => {
    const { expandedKeys } = this.state;
    const { onDragEnter } = this.props;
    const { pos, eventKey } = node.props;

    if (!this.dragNode) return;

    const dropPosition = calcDropPosition(event, node);

    // Skip if drag node is self
    if (
      this.dragNode.props.eventKey === eventKey &&
      dropPosition === 0
    ) {
      this.setState({
        dragOverNodeKey: '',
        dropPosition: null,
      });
      return;
    }

    // Ref: https://github.com/react-component/tree/issues/132
    // Add timeout to let onDragLevel fire before onDragEnter,
    // so that we can clean drag props for onDragLeave node.
    // Macro task for this:
    // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
    setTimeout(() => {
      // Update drag over node
      this.setState({
        dragOverNodeKey: eventKey,
        dropPosition,
      });

      // Side effect for delay drag
      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {};
      }
      Object.keys(this.delayedDragEnterLogic).forEach((key) => {
        clearTimeout(this.delayedDragEnterLogic[key]);
      });
      this.delayedDragEnterLogic[pos] = setTimeout(() => {
        const newExpandedKeys = arrAdd(expandedKeys, eventKey);
        this.setState({
          expandedKeys: newExpandedKeys,
        });

        if (onDragEnter) {
          onDragEnter({ event, node, expandedKeys: newExpandedKeys });
        }
      }, 400);
    }, 0);
  };
  onNodeDragOver = (event, node) => {
    const { onDragOver } = this.props;
    const { eventKey } = node.props;

    // Update drag position
    if (this.dragNode && eventKey === this.state.dragOverNodeKey) {
      const dropPosition = calcDropPosition(event, node);

      if (dropPosition === this.state.dropPosition) return;

      this.setState({
        dropPosition,
      });
    }

    if (onDragOver) {
      onDragOver({ event, node });
    }
  };
  onNodeDragLeave = (event, node) => {
    const { onDragLeave } = this.props;

    this.setState({
      dragOverNodeKey: '',
    });

    if (onDragLeave) {
      onDragLeave({ event, node });
    }
  };
  onNodeDragEnd = (event, node) => {
    const { onDragEnd } = this.props;
    this.setState({
      dragOverNodeKey: '',
    });
    if (onDragEnd) {
      onDragEnd({ event, node });
    }
  };
  onNodeDrop = (event, node) => {
    const { dragNodesKeys = [], dropPosition } = this.state;
    const { onDrop } = this.props;
    const { eventKey, pos } = node.props;

    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: eventKey,
    });

    if (dragNodesKeys.indexOf(eventKey) !== -1) {
      warning(false, 'Can not drop to dragNode(include it\'s children node)');
      return;
    }

    const posArr = posToArr(pos);

    const dropResult = {
      event,
      node,
      dragNode: this.dragNode,
      dragNodesKeys: dragNodesKeys.slice(),
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
    };

    if (dropPosition !== 0) {
      dropResult.dropToGap = true;
    }

    if (onDrop) {
      onDrop(dropResult);
    }
  };

  onNodeClick = (e, treeNode) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e, treeNode);
    }
  };

  onNodeDoubleClick = (e, treeNode) => {
    const { onDoubleClick } = this.props;
    if (onDoubleClick) {
      onDoubleClick(e, treeNode);
    }
  };

  onNodeSelect = (e, treeNode) => {
    let { selectedKeys } = this.state;
    const { onSelect, multiple, children } = this.props;
    const { selected, eventKey } = treeNode.props;
    const targetSelected = !selected;

    // Update selected keys
    if (!targetSelected) {
      selectedKeys = arrDel(selectedKeys, eventKey);
    } else if (!multiple) {
      selectedKeys = [eventKey];
    } else {
      selectedKeys = arrAdd(selectedKeys, eventKey);
    }

    // [Legacy] Not found related usage in doc or upper libs
    // [Legacy] TODO: add optimize prop to skip node process
    const selectedNodes = [];
    if (selectedKeys.length) {
      traverseTreeNodes(children, ({ node, key }) => {
        if (selectedKeys.indexOf(key) !== -1) {
          selectedNodes.push(node);
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
        nativeEvent: e.nativeEvent,
      };
      onSelect(selectedKeys, eventObj);
    }
  };

  onNodeLoad = (treeNode) => {
    const { loadData, onLoad } = this.props;
    const { loadedKeys = [], loadingKeys = [] } = this.state;
    const { eventKey } = treeNode.props;

    if (!loadData || loadedKeys.indexOf(eventKey) !== -1 || loadingKeys.indexOf(eventKey) !== -1) {
      return null;
    }

    this.setState({
      loadingKeys: arrAdd(loadingKeys, eventKey),
    });
    const promise = loadData(treeNode);
    promise.then(() => {
      const newLoadedKeys = arrAdd(this.state.loadedKeys, eventKey);
      this.setUncontrolledState({
        loadedKeys: newLoadedKeys,
      });
      this.setState({
        loadingKeys: arrDel(this.state.loadingKeys, eventKey),
      });

      if (onLoad) {
        const eventObj = {
          event: 'load',
          node: treeNode,
        };
        onLoad(newLoadedKeys, eventObj);
      }
    });

    return promise;
  };

  /**
   * This will cache node check status to optimize update process.
   * When Tree get trigger `onCheckConductFinished` will flush all the update.
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
   * When top `onCheckConductFinished` called, will execute all batch update.
   * And trigger `onCheck` event.
   */
  onCheckConductFinished = (e) => {
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
      nativeEvent: e.nativeEvent,
    };

    if (checkStrictly) {
      selectedObj = getStrictlyValue(newCheckedKeys, newHalfCheckedKeys);

      // [Legacy] TODO: add optimize prop to skip node process
      eventObj.checkedNodes = [];
      traverseTreeNodes(children, ({ node, key }) => {
        if (checkedKeySet[key]) {
          eventObj.checkedNodes.push(node);
        }
      });

      this.setUncontrolledState({ checkedKeys: newCheckedKeys });
    } else {
      selectedObj = newCheckedKeys;

      // [Legacy] TODO: add optimize prop to skip node process
      eventObj.checkedNodes = [];
      eventObj.checkedNodesPositions = []; // [Legacy] TODO: not in API
      eventObj.halfCheckedKeys = newHalfCheckedKeys; // [Legacy] TODO: not in API
      traverseTreeNodes(children, ({ node, pos, key }) => {
        if (checkedKeySet[key]) {
          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node, pos });
        }
      });

      this.setUncontrolledState({
        checkedKeys: newCheckedKeys,
        halfCheckedKeys: newHalfCheckedKeys,
      });
    }

    if (onCheck) {
      onCheck(selectedObj, eventObj);
    }

    // Clean up
    this.checkedBatch = null;
  };

  onNodeExpand = (e, treeNode) => {
    let { expandedKeys } = this.state;
    const { onExpand, loadData } = this.props;
    const { eventKey, expanded } = treeNode.props;

    // Update selected keys
    const index = expandedKeys.indexOf(eventKey);
    const targetExpanded = !expanded;

    warning(
      (expanded && index !== -1) || (!expanded && index === -1)
    , 'Expand state not sync with index check');

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, eventKey);
    } else {
      expandedKeys = arrDel(expandedKeys, eventKey);
    }

    this.setUncontrolledState({ expandedKeys });

    if (onExpand) {
      onExpand(expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e.nativeEvent,
      });
    }

    // Async Load data
    if (targetExpanded && loadData) {
      const loadPromise = this.onNodeLoad(treeNode);
      return loadPromise ? loadPromise.then(() => {
        // [Legacy] Refresh logic
        this.setUncontrolledState({ expandedKeys });
      }) : null;
    }

    return null;
  };

  onNodeMouseEnter = (event, node) => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, node });
    }
  };

  onNodeMouseLeave = (event, node) => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave({ event, node });
    }
  };

  onNodeContextMenu = (event, node) => {
    const { onRightClick } = this.props;
    if (onRightClick) {
      event.preventDefault();
      onRightClick({ event, node });
    }
  };

  /**
   * Sync state with props if needed
   */
  getSyncProps = (props = {}, prevProps, preState) => {
    let needSync = false;
    const oriState = preState || this.state;
    const newState = {};
    const myPrevProps = prevProps || {};

    function checkSync(name) {
      if (props[name] !== myPrevProps[name]) {
        needSync = true;
        return true;
      }
      return false;
    }

    // Children change will affect check box status.
    // And no need to check when prev props not provided
    if (prevProps && checkSync('children')) {
      const newCheckedKeys = calcCheckedKeys(props.checkedKeys || oriState.checkedKeys, props);

      const { checkedKeys = [], halfCheckedKeys = [] } = newCheckedKeys || {};
      newState.checkedKeys = checkedKeys;
      newState.halfCheckedKeys = halfCheckedKeys;
    }

    // Re-calculate when autoExpandParent or expandedKeys changed
    if (prevProps && (checkSync('autoExpandParent') || checkSync('expandedKeys'))) {
      newState.expandedKeys = props.autoExpandParent ?
        calcExpandedKeys(props.expandedKeys, props) : props.expandedKeys;
    }

    if (checkSync('selectedKeys')) {
      newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props);
    }

    if (checkSync('checkedKeys')) {
      const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(props.checkedKeys, props) || {};
      newState.checkedKeys = checkedKeys;
      newState.halfCheckedKeys = halfCheckedKeys;
    }

    if (checkSync('loadedKeys')) {
      newState.loadedKeys = props.loadedKeys;
    }

    if (needSync) {
      return newState;
    }
    return null;
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }
  };

  isKeyChecked = (key) => {
    const { checkedKeys = [] } = this.state;
    return checkedKeys.indexOf(key) !== -1;
  };

  /**
   * [Legacy] Original logic use `key` as tracking clue.
   * We have to use `cloneElement` to pass `key`.
   */
  renderTreeNode = (child, index, level = 0) => {
    const {
      expandedKeys = [], selectedKeys = [], halfCheckedKeys = [],
      loadedKeys = [], loadingKeys = [],
      dragOverNodeKey, dropPosition,
    } = this.state;
    const {} = this.props;
    const pos = getPosition(level, index);
    const key = child.key || pos;

    return React.cloneElement(child, {
      key,
      eventKey: key,
      expanded: expandedKeys.indexOf(key) !== -1,
      selected: selectedKeys.indexOf(key) !== -1,
      loaded: loadedKeys.indexOf(key) !== -1,
      loading: loadingKeys.indexOf(key) !== -1,
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.indexOf(key) !== -1,
      pos,

      // [Legacy] Drag props
      dragOver: dragOverNodeKey === key && dropPosition === 0,
      dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
      dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
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
        {mapChildren(children, (node, index) => (
          this.renderTreeNode(node, index)
        ))}
      </ul>
    );
  }
}

export default Tree;
