import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import {
  traverseTreeNodes,
  updateCheckState,
  getOffset,
  getCheck,
  getStrictlyValue,
  isInclude,
} from './util';

function noop() {}

export const contextTypes = {
  rcTree: PropTypes.shape({
    selectable: PropTypes.bool,
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
    onExpand: noop,
    onCheck: noop,
    onSelect: noop,
    onDragStart: noop,
    onDragEnter: noop,
    onDragOver: noop,
    onDragLeave: noop,
    onDrop: noop,
    onDragEnd: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onRightClick: noop,
  };

  constructor(props) {
    super(props);

    const checkedKeys = this.calcCheckedKeys(props);
    this.state = {
      expandedKeys: this.calcExpandedKeys(props),
      checkedKeys: checkedKeys.checkedKeys,
      halfCheckedKeys: checkedKeys.halfCheckedKeys,
      selectedKeys: this.calcSelectedKeys(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: '',
    };
  }

  getChildContext() {
    const { selectable } = this.props;
    return {
      rcTree: {
        selectable,
      },
    };
  }


  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const newState = {};
    const expandedKeys = nextProps.expandedKeys !== props.expandedKeys ?
      this.calcExpandedKeys(nextProps, true) : undefined;
    if (expandedKeys) {
      newState.expandedKeys = expandedKeys;
    }

    const checkedKeys = nextProps.checkedKeys !== props.checkedKeys ?
      this.calcCheckedKeys(nextProps, true) : undefined;
    if (checkedKeys) {
      newState.checkedKeys = checkedKeys.checkedKeys;
      newState.halfCheckedKeys = checkedKeys.halfCheckedKeys;
    }

    const selectedKeys = nextProps.selectedKeys !== props.selectedKeys ?
      this.calcSelectedKeys(nextProps, true) : undefined;
    if (selectedKeys) {
      newState.selectedKeys = selectedKeys;
    }
    this.setState(newState);
  }

  onDragStart(e, treeNode) {
    this.dragNode = treeNode;
    this.dragNodesKeys = this.getDragNodes(treeNode);
    const st = {
      dragNodesKeys: this.dragNodesKeys,
    };
    const expandedKeys = this.getExpandedKeys(treeNode, false);
    if (expandedKeys) {
      // Controlled expand, save and then reset
      this.getRawExpandedKeys();
      st.expandedKeys = expandedKeys;
    }
    this.setState(st);
    this.props.onDragStart({
      event: e,
      node: treeNode,
    });
    this._dropTrigger = false;
  }

  onDragEnterGap(e, treeNode) {
    const offsetTop = getOffset(treeNode.selectHandle).top;
    const offsetHeight = treeNode.selectHandle.offsetHeight;
    const pageY = e.pageY;
    const gapHeight = 2; // TODO: remove hard code
    if (pageY > offsetTop + offsetHeight - gapHeight) {
      this.dropPosition = 1;
      return 1;
    }
    if (pageY < offsetTop + gapHeight) {
      this.dropPosition = -1;
      return -1;
    }
    this.dropPosition = 0;
    return 0;
  }

  onDragEnter(e, treeNode) {
    const enterGap = this.onDragEnterGap(e, treeNode);
    if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
      this.setState({
        dragOverNodeKey: '',
      });
      return;
    }
    this.setState({
      dragOverNodeKey: treeNode.props.eventKey,
    });

    if (!this.delayedDragEnterLogic) {
      this.delayedDragEnterLogic = {};
    }
    Object.keys(this.delayedDragEnterLogic).forEach((key) => {
      clearTimeout(this.delayedDragEnterLogic[key]);
    });
    this.delayedDragEnterLogic[treeNode.props.pos] = setTimeout(() => {
      const expandedKeys = this.getExpandedKeys(treeNode, true);
      if (expandedKeys) {
        this.getRawExpandedKeys();
        this.setState({ expandedKeys });
      }
      this.props.onDragEnter({
        event: e,
        node: treeNode,
        expandedKeys: expandedKeys && [...expandedKeys] || [...this.state.expandedKeys],
      });
    }, 400);
  }

  onDragOver(e, treeNode) {
    this.props.onDragOver({ event: e, node: treeNode });
  }

  onDragLeave(e, treeNode) {
    this.props.onDragLeave({ event: e, node: treeNode });
  }

  onDrop(e, treeNode) {
    const key = treeNode.props.eventKey;
    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: key,
    });
    if (this.dragNodesKeys.indexOf(key) > -1) {
      warning(false, 'can not drop to dragNode(include it\'s children node)');
      return false;
    }

    const posArr = treeNode.props.pos.split('-');
    const res = {
      event: e,
      node: treeNode,
      dragNode: this.dragNode,
      dragNodesKeys: [...this.dragNodesKeys],
      dropPosition: this.dropPosition + Number(posArr[posArr.length - 1]),
    };
    if (this.dropPosition !== 0) {
      res.dropToGap = true;
    }
    if ('expandedKeys' in this.props) {
      res.rawExpandedKeys = [...this._rawExpandedKeys] || [...this.state.expandedKeys];
    }
    this.props.onDrop(res);
    this._dropTrigger = true;
  }

  onDragEnd(e, treeNode) {
    this.setState({
      dragOverNodeKey: '',
    });
    this.props.onDragEnd({ event: e, node: treeNode });
  }

  onExpand(treeNode) {
    const expanded = !treeNode.props.expanded;
    const controlled = 'expandedKeys' in this.props;
    const expandedKeys = [...this.state.expandedKeys];
    const index = expandedKeys.indexOf(treeNode.props.eventKey);
    if (expanded && index === -1) {
      expandedKeys.push(treeNode.props.eventKey);
    } else if (!expanded && index > -1) {
      expandedKeys.splice(index, 1);
    }
    if (!controlled) {
      this.setState({ expandedKeys });
    }
    this.props.onExpand(expandedKeys, { node: treeNode, expanded });

    // after data loaded, need set new expandedKeys
    if (expanded && this.props.loadData) {
      return this.props.loadData(treeNode).then(() => {
        if (!controlled) {
          this.setState({ expandedKeys });
        }
      });
    }
  }

  onCheck = (treeNode) => {
    const { props, state } = this;
    const checked = !treeNode.props.checked || treeNode.props.halfChecked;
    const key = treeNode.props.eventKey;
    const checkedKeys = [...state.checkedKeys];
    const index = checkedKeys.indexOf(key);

    const eventObj = {
      event: 'check',
      node: treeNode,
      checked,
    };

    if (props.checkStrictly) {
      if (checked && index === -1) {
        checkedKeys.push(key);
      }
      if (!checked && index > -1) {
        checkedKeys.splice(index, 1);
      }
      eventObj.checkedNodes = [];
      traverseTreeNodes(props.children, (item, idx, pos, k) => {
        if (checkedKeys.indexOf(k) !== -1) {
          eventObj.checkedNodes.push(item);
        }
      });
      if (!('checkedKeys' in props)) {
        this.setState({
          checkedKeys,
        });
      }
      props.onCheck(getStrictlyValue(checkedKeys, state.halfCheckedKeys), eventObj);
    } else {
      // TODO
      const checkedPositions = [];
      const treeNodesStates = {};
      traverseTreeNodes(props.children, (item, _, pos, k, childrenPos, parentPos) => {
        treeNodesStates[pos] = {
          node: item,
          key: k,
          checked: false,
          halfChecked: false,
          disabled: item.props.disabled,
          disableCheckbox: item.props.disableCheckbox,
          childrenPos,
          parentPos,
        };
        if (state.checkedKeys.indexOf(k) !== -1) {
          treeNodesStates[pos].checked = true;
          checkedPositions.push(pos);
        }
      });
      checkedPositions.forEach(checkedPosition => {
        updateCheckState(treeNodesStates, checkedPosition, true);
      });
      treeNodesStates[treeNode.props.pos].checked = checked;
      treeNodesStates[treeNode.props.pos].halfChecked = false;
      updateCheckState(treeNodesStates, treeNode.props.pos, checked);

      const checkKeys = getCheck(treeNodesStates);
      eventObj.checkedNodes = checkKeys.checkedNodes;
      eventObj.checkedNodesPositions = checkKeys.checkedNodesPositions; // TODO: not in API
      eventObj.halfCheckedKeys = checkKeys.halfCheckedKeys; // TODO: not in API

      if (!('checkedKeys' in props)) {
        this.setState({
          checkedKeys: checkKeys.checkedKeys,
          halfCheckedKeys: checkKeys.halfCheckedKeys,
        });
      }
      props.onCheck(checkKeys.checkedKeys, eventObj);
    }
  }

  onSelect(treeNode) {
    const props = this.props;
    const selectedKeys = [...this.state.selectedKeys];
    const eventKey = treeNode.props.eventKey;
    const index = selectedKeys.indexOf(eventKey);
    let selected;
    if (index !== -1) {
      selected = false;
      selectedKeys.splice(index, 1);
    } else {
      selected = true;
      if (!props.multiple) {
        selectedKeys.length = 0;
      }
      selectedKeys.push(eventKey);
    }
    const selectedNodes = [];
    if (selectedKeys.length) {
      traverseTreeNodes(this.props.children, (item) => {
        if (selectedKeys.indexOf(item.key) !== -1) {
          selectedNodes.push(item);
        }
      });
    }
    const newSt = {
      event: 'select',
      node: treeNode,
      selected,
      selectedNodes,
    };
    if (!('selectedKeys' in this.props)) {
      this.setState({
        selectedKeys,
      });
    }
    props.onSelect(selectedKeys, newSt);
  }

  onMouseEnter(e, treeNode) {
    this.props.onMouseEnter({ event: e, node: treeNode });
  }

  onMouseLeave(e, treeNode) {
    this.props.onMouseLeave({ event: e, node: treeNode });
  }

  onContextMenu(e, treeNode) {
    this.props.onRightClick({ event: e, node: treeNode });
  }

  // all keyboard events callbacks run from here at first
  onKeyDown = (e) => {
    e.preventDefault();
  }

  getRawExpandedKeys() {
    if (!this._rawExpandedKeys && ('expandedKeys' in this.props)) {
      this._rawExpandedKeys = [...this.state.expandedKeys];
    }
  }

  getOpenTransitionName() {
    const props = this.props;
    let transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  }

  getDragNodes(treeNode) {
    const dragNodesKeys = [];
    const tPArr = treeNode.props.pos.split('-');
    traverseTreeNodes(treeNode.props.children, (item, index, pos, key) => {
      const pArr = pos.split('-');
      if (treeNode.props.pos === pos || tPArr.length < pArr.length && isInclude(tPArr, pArr)) {
        dragNodesKeys.push(key);
      }
    });
    dragNodesKeys.push(treeNode.props.eventKey || treeNode.props.pos);
    return dragNodesKeys;
  }

  getExpandedKeys(treeNode, expand) {
    const key = treeNode.props.eventKey;
    const expandedKeys = this.state.expandedKeys;
    const expandedIndex = expandedKeys.indexOf(key);
    let exKeys;
    if (expandedIndex > -1 && !expand) {
      exKeys = [...expandedKeys];
      exKeys.splice(expandedIndex, 1);
      return exKeys;
    }
    if (expand && expandedKeys.indexOf(key) === -1) {
      return expandedKeys.concat([key]);
    }
  }

  calcExpandedKeys(props, isNotInit) {
    const expandedKeys = props.expandedKeys || (isNotInit ? undefined : props.defaultExpandedKeys);
    if (!expandedKeys) {
      return undefined;
    }
    const expandAll = isNotInit ? false : props.defaultExpandAll;
    if (!expandAll && !props.autoExpandParent) {
      return expandedKeys;
    }

    const expandedPositionArr = [];
    if (props.autoExpandParent) {
      traverseTreeNodes(props.children, (item, index, pos, key) => {
        if (expandedKeys.indexOf(key) > -1) {
          expandedPositionArr.push(pos);
        }
      });
    }
    const filterExpandedKeysSet = {};
    traverseTreeNodes(props.children, (item, index, pos, key) => {
      if (expandAll) {
        filterExpandedKeysSet[key] = true;
      } else if (props.autoExpandParent) {
        const isCurrentParentOfExpanded =
                expandedPositionArr.some(p => isInclude(pos.split('-'), p.split('-')));
        if (isCurrentParentOfExpanded) {
          filterExpandedKeysSet[key] = true;
        }
      }
    });
    const filterExpandedKeys = Object.keys(filterExpandedKeysSet);
    return filterExpandedKeys.length ? filterExpandedKeys : expandedKeys;
  }

  calcCheckedKeys(props, isNotInit) {
    if (!props.checkable) {
      return { checkedKeys: [], halfCheckedKeys: [] };
    }

    let checkedKeys = props.checkedKeys || (isNotInit ? undefined : props.defaultCheckedKeys);
    if (!checkedKeys) {
      return undefined;
    }
    if (Array.isArray(checkedKeys)) {
      checkedKeys = { checkedKeys, halfCheckedKeys: [] };
    } else if (typeof checkedKeys === 'object') {
      checkedKeys = { checkedKeys: checkedKeys.checked, halfCheckedKeys: checkedKeys.halfChecked };
    }

    if (!props.checkStrictly) {
      const checked = checkedKeys.checkedKeys || [];

      const checkedPositions = [];
      const treeNodesStates = {};
      traverseTreeNodes(props.children, (item, index, pos, key, childrenPos, parentPos) => {
        treeNodesStates[pos] = {
          node: item,
          key,
          checked: false,
          halfChecked: false,
          disabled: item.props.disabled,
          disableCheckbox: item.props.disableCheckbox,
          childrenPos,
          parentPos,
        };
        if (checked.indexOf(key) !== -1) {
          treeNodesStates[pos].checked = true;
          checkedPositions.push(pos);
        }
      });
      checkedPositions.forEach(checkedPosition => {
        updateCheckState(treeNodesStates, checkedPosition, true);
      });

      return getCheck(treeNodesStates);
    }

    return checkedKeys;
  }

  calcSelectedKeys(props, isNotInit) {
    const selectedKeys = props.selectedKeys || (isNotInit ? undefined : props.defaultSelectedKeys);
    if (!selectedKeys) {
      return undefined;
    }
    if (props.multiple) {
      return [...selectedKeys];
    }
    if (selectedKeys.length) {
      return [selectedKeys[0]];
    }
    return selectedKeys;
  }

  filterTreeNode(treeNode) {
    const filterTreeNode = this.props.filterTreeNode;
    if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, treeNode);
  }

  renderTreeNode(child, index, level = 0) {
    const { state, props } = this;
    const pos = `${level}-${index}`;
    const key = child.key || pos;

    const childProps = {
      root: this,
      eventKey: key,
      pos,
      loadData: props.loadData,
      prefixCls: props.prefixCls,
      showIcon: props.showIcon,
      draggable: props.draggable,
      dragOver: state.dragOverNodeKey === key && this.dropPosition === 0,
      dragOverGapTop: state.dragOverNodeKey === key && this.dropPosition === -1,
      dragOverGapBottom: state.dragOverNodeKey === key && this.dropPosition === 1,
      _dropTrigger: this._dropTrigger,
      expanded: state.expandedKeys.indexOf(key) !== -1,
      selected: state.selectedKeys.indexOf(key) !== -1,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      filterTreeNode: this.filterTreeNode.bind(this),
    };
    if (props.checkable) {
      childProps.checkable = props.checkable;
      childProps.checked = state.checkedKeys.indexOf(key) !== -1;
      childProps.halfChecked = state.halfCheckedKeys.indexOf(key) !== -1;
    }
    return React.cloneElement(child, childProps);
  }

  render() {
    const props = this.props;
    const className = classNames(props.prefixCls, props.className, {
      [`${props.prefixCls}-show-line`]: props.showLine,
    });
    const domProps = {};
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }

    return (
      <ul
        {...domProps}
        className={className}
        role="tree-node"
        unselectable
      >
        {React.Children.map(props.children, this.renderTreeNode, this)}
      </ul>
    );
  }
}

export default Tree;
