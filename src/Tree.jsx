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
  arraysEqual,
} from './util';

function noop() {}

export const contextTypes = {
  rcTree: PropTypes.shape({
    showLine: PropTypes.bool,
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

    this.checkedKeysChange = true;
    this.state = {
      expandedKeys: this.getDefaultExpandedKeys(props),
      checkedKeys: this.getDefaultCheckedKeys(props),
      selectedKeys: this.getDefaultSelectedKeys(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: '',
    };
  }

  getChildContext() {
    const { showLine, selectable } = this.props;
    return {
      rcTree: {
        showLine,
        selectable,
      },
    };
  }


  componentWillReceiveProps(nextProps) {
    const expandedKeys = this.getDefaultExpandedKeys(nextProps, true);
    const checkedKeys = this.getDefaultCheckedKeys(nextProps, true);
    const selectedKeys = this.getDefaultSelectedKeys(nextProps, true);
    const st = {};
    if (expandedKeys) {
      st.expandedKeys = expandedKeys;
    }
    if (checkedKeys) {
      if (nextProps.checkedKeys === this.props.checkedKeys) {
        this.checkedKeysChange = false;
      } else {
        this.checkedKeysChange = true;
      }
      st.checkedKeys = checkedKeys;
    }
    if (selectedKeys) {
      st.selectedKeys = selectedKeys;
    }
    this.setState(st);
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
    const offsetTop = getOffset(treeNode.refs.selectHandle).top;
    const offsetHeight = treeNode.refs.selectHandle.offsetHeight;
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
    let checked = !treeNode.props.checked;
    if (treeNode.props.halfChecked) {
      checked = true;
    }
    const key = treeNode.props.eventKey;
    let checkedKeys = [...this.state.checkedKeys];
    const index = checkedKeys.indexOf(key);

    const newSt = {
      event: 'check',
      node: treeNode,
      checked,
    };

    if (this.props.checkStrictly) {
      if (checked && index === -1) {
        checkedKeys.push(key);
      }
      if (!checked && index > -1) {
        checkedKeys.splice(index, 1);
      }
      newSt.checkedNodes = [];
      traverseTreeNodes(this.props.children, (item, idx, pos, k) => {
        if (checkedKeys.indexOf(k) !== -1) {
          newSt.checkedNodes.push(item);
        }
      });
      if (!('checkedKeys' in this.props)) {
        this.setState({
          checkedKeys,
        });
      }
      const halfChecked = this.props.checkedKeys ? this.props.checkedKeys.halfChecked : [];
      this.props.onCheck(getStrictlyValue(checkedKeys, halfChecked), newSt);
    } else {
      if (checked && index === -1) {
        this.treeNodesStates[treeNode.props.pos].checked = true;
        updateCheckState(this.treeNodesStates, treeNode.props.pos, true);
      }
      if (!checked) {
        this.treeNodesStates[treeNode.props.pos].checked = false;
        this.treeNodesStates[treeNode.props.pos].halfChecked = false;
        updateCheckState(this.treeNodesStates, treeNode.props.pos, false);
      }
      const checkKeys = getCheck(this.treeNodesStates);
      newSt.checkedNodes = checkKeys.checkedNodes;
      newSt.checkedNodesPositions = checkKeys.checkedNodesPositions;
      newSt.halfCheckedKeys = checkKeys.halfCheckedKeys;
      this.checkKeys = checkKeys;

      this._checkedKeys = checkedKeys = checkKeys.checkedKeys;
      if (!('checkedKeys' in this.props)) {
        this.setState({
          checkedKeys,
        });
      }
      this.props.onCheck(checkedKeys, newSt);
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
    const eventKey = treeNode.props.eventKey;
    this.setState({ selectedKeys: [eventKey] });
    this.props.onRightClick({ event: e, node: treeNode });
  }

  // all keyboard events callbacks run from here at first
  onKeyDown = (e) => {
    e.preventDefault();
  }

  getFilterExpandedKeys(props, expandKeyProp, expandAll) {
    const keys = props[expandKeyProp];
    if (!expandAll && !props.autoExpandParent) {
      return keys || [];
    }
    const expandedPositionArr = [];
    if (props.autoExpandParent) {
      traverseTreeNodes(props.children, (item, index, pos, key) => {
        if (keys.indexOf(key) > -1) {
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
    return filterExpandedKeys.length ? filterExpandedKeys : keys;
  }

  getDefaultExpandedKeys(props, willReceiveProps) {
    let expandedKeys = willReceiveProps ? undefined :
          this.getFilterExpandedKeys(
            props,
            'defaultExpandedKeys',
            props.defaultExpandedKeys.length ? false : props.defaultExpandAll
          );
    if ('expandedKeys' in props) {
      expandedKeys = (
        props.autoExpandParent ?
          this.getFilterExpandedKeys(props, 'expandedKeys', false) :
          props.expandedKeys
      ) || [];
    }
    return expandedKeys;
  }

  getDefaultCheckedKeys(props, willReceiveProps) {
    let checkedKeys = willReceiveProps ? undefined : props.defaultCheckedKeys;
    if ('checkedKeys' in props) {
      checkedKeys = props.checkedKeys || [];
      if (props.checkStrictly) {
        if (props.checkedKeys.checked) {
          checkedKeys = props.checkedKeys.checked;
        } else if (!Array.isArray(props.checkedKeys)) {
          checkedKeys = [];
        }
      }
    }
    return checkedKeys;
  }

  getDefaultSelectedKeys(props, willReceiveProps) {
    const getKeys = (keys) => {
      if (props.multiple) {
        return [...keys];
      }
      if (keys.length) {
        return [keys[0]];
      }
      return keys;
    };
    let selectedKeys = willReceiveProps ? undefined : getKeys(props.defaultSelectedKeys);
    if ('selectedKeys' in props) {
      selectedKeys = getKeys(props.selectedKeys);
    }
    return selectedKeys;
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
    traverseTreeNodes(this.props.children, (item, index, pos, key) => {
      const pArr = pos.split('-');
      if (treeNode.props.pos === pos || tPArr.length < pArr.length && isInclude(tPArr, pArr)) {
        dragNodesKeys.push(key);
      }
    });
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

    const cloneProps = {
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
      cloneProps.checkable = props.checkable;
      if (props.checkStrictly) {
        if (state.checkedKeys) {
          cloneProps.checked = state.checkedKeys.indexOf(key) !== -1;
        }
        if (props.checkedKeys && props.checkedKeys.halfChecked) {
          cloneProps.halfChecked = props.checkedKeys.halfChecked.indexOf(key) !== -1;
        } else {
          cloneProps.halfChecked = false;
        }
      } else {
        if (this.checkedKeys) {
          cloneProps.checked = this.checkedKeys.indexOf(key) !== -1;
        }
        cloneProps.halfChecked = this.halfCheckedKeys.indexOf(key) !== -1;
      }
    }
    if (this.treeNodesStates && this.treeNodesStates[pos]) {
      Object.assign(cloneProps, this.treeNodesStates[pos].positionFlag);
    }
    return React.cloneElement(child, cloneProps);
  }

  render() {
    const props = this.props;
    const domProps = {
      className: classNames(props.prefixCls, props.className),
      role: 'tree-node',
    };
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }
    const updateTreeNodesStates = () => {
      this.treeNodesStates = {};
      traverseTreeNodes(props.children, (item, index, pos, key, positionFlag) => {
        this.treeNodesStates[pos] = {
          positionFlag,
        };
      });
    };
    if (props.showLine && !props.checkable) {
      updateTreeNodesStates();
    }
    if (props.checkable && (this.checkedKeysChange || props.loadData)) {
      if (props.checkStrictly) {
        updateTreeNodesStates();
      } else {
        const checkedKeys = this.state.checkedKeys;
        let checkKeys;
        if (
          !props.loadData &&
            this.checkKeys &&
            this._checkedKeys &&
            arraysEqual(this._checkedKeys, checkedKeys)
        ) {
          // if checkedKeys the same as _checkedKeys from onCheck, use _checkedKeys.
          checkKeys = this.checkKeys;
        } else {
          const checkedPositions = [];
          this.treeNodesStates = {};
          traverseTreeNodes(
            props.children,
            (item, index, pos, key, positionFlag, childrenPos, parentPos) => {
              this.treeNodesStates[pos] = {
                node: item,
                key,
                checked: false,
                halfChecked: false,
                positionFlag,
                childrenPos,
                parentPos,
              };
              if (checkedKeys.indexOf(key) !== -1) {
                this.treeNodesStates[pos].checked = true;
                checkedPositions.push(pos);
              }
            });
          // if the parent node's key exists, it all children node will be checked
          checkedPositions.forEach(checkedPosition => {
            updateCheckState(this.treeNodesStates, checkedPosition, true);
          });
          checkKeys = getCheck(this.treeNodesStates);
        }
        this.halfCheckedKeys = checkKeys.halfCheckedKeys;
        this.checkedKeys = checkKeys.checkedKeys;
      }
    }

    return (
      <ul {...domProps} unselectable>
        {React.Children.map(props.children, this.renderTreeNode, this)}
      </ul>
    );
  }
}

export default Tree;
