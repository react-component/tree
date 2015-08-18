import React from 'react';
import {classSet} from 'rc-util';

// sorted array ['0-0','0-1', '0-0-1', '0-1-1'] => ['0-0', '0-1']
const filterMin = (arr) => {
  const a = [];
  arr.forEach((item) => {
    const b = a.filter((i) => {
      return item.indexOf(i) === 0;
    });
    if (!b.length) {
      a.push(item);
    }
  });
  return a;
};

class Tree extends React.Component {
  constructor(props) {
    super(props);
    ['handleKeyDown', 'handleCheck'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
    const expandedKeys = props.defaultExpandedKeys;
    const checkedKeys = props.defaultCheckedKeys;
    this.defaultExpandAll = props.defaultExpandAll;
    const selectedKeys = props.multiple ? [...props.defaultCheckedKeys] : [props.defaultCheckedKeys[0]];
    this.state = {
      expandedKeys,
      checkedKeys,
      selectedKeys,
    };
  }
  getCheckKeys() {
    const checkPartKeys = [];
    const checkedKeys = [];
    Object.keys(this.treeNodesChkStates).forEach((item) => {
      const itemObj = this.treeNodesChkStates[item];
      if (itemObj.checked) {
        checkedKeys.push(itemObj.key);
      }else if (itemObj.checkPart) {
        checkPartKeys.push(itemObj.key);
      }
    });
    return {
      checkPartKeys, checkedKeys,
    };
  }
  renderTreeNode(child, index, level = 0) {
    const key = child.key || `${level}-${index}`;
    const state = this.state;
    const props = this.props;
    const cloneProps = {
      ref: 'treeNode',
      root: this,
      eventKey: key,
      pos: `${level}-${index}`,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      showIcon: props.showIcon,
      checkable: props.checkable,
      expanded: this.defaultExpandAll || state.expandedKeys.indexOf(key) !== -1,
      selected: state.selectedKeys.indexOf(key) !== -1,
      checked: this.checkedKeys.indexOf(key) !== -1,
      checkPart: this.checkPartKeys.indexOf(key) !== -1,
    };
    return React.cloneElement(child, cloneProps);
  }
  render() {
    const props = this.props;
    const domProps = {
      className: classSet(props.className, props.prefixCls),
      role: 'tree-node',
    };
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.handleKeyDown;
    }
    const checkedKeys = this.state.checkedKeys;
    const checkedPos = [];
    this.treeNodesChkStates = {};
    this.loopAllChildren(props.children, (item, index, pos) => {
      const key = item.key || pos;
      let checked = false;
      if (checkedKeys.indexOf(key) !== -1) {
        checked = true;
        checkedPos.push(pos);
      }
      this.treeNodesChkStates[pos] = {
        key: key,
        checked: checked,
        checkPart: false,
      };
    });
    this.handleCheckState(this.treeNodesChkStates, filterMin(checkedPos.sort()));
    const checkKeys = this.getCheckKeys();
    this.checkPartKeys = checkKeys.checkPartKeys;
    this.checkedKeys = checkKeys.checkedKeys;
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);
    return (
      <ul {...domProps} ref="tree">
        {this.newChildren}
      </ul>
    );
  }
  loopAllChildren(childs, callback) {
    const loop = (children, level) => {
      React.Children.forEach(children, (item, index) => {
        const pos = `${level}-${index}`;
        const newChildren = item.props.children;
        if (Array.isArray(newChildren)) {
          loop(newChildren, pos);
        }
        callback(item, index, pos);
      });
    };
    loop(childs, 0);
  }
  handleCheckState(obj, checkedArr, unCheckEvent) {
    let evt = false;
    if (typeof unCheckEvent === 'boolean') {
      evt = true;
    }
    checkedArr.forEach((_pos) => {
      Object.keys(obj).forEach((i) => {
        if (i.length > _pos.length && i.indexOf(_pos) === 0) {
          obj[i].checkPart = false;
          if (evt) {
            if (unCheckEvent) {
              obj[i].checked = false;
            } else {
              obj[i].checked = true;
            }
          } else {
            obj[i].checked = true;
          }
        }
      });
      const loop = (__pos) => {
        const _posLen = __pos.length;
        if (_posLen <= 3) {
          return;
        }
        let sibling = 0;
        let siblingChecked = 0;
        const parentPos = __pos.substring(0, _posLen - 2);
        Object.keys(obj).forEach((i) => {
          if (i.length === _posLen && i.substring(0, _posLen - 2) === parentPos) {
            sibling++;
            if (obj[i].checked) {
              siblingChecked++;
            } else if (obj[i].checkPart) {
              siblingChecked += 0.5;
            }
          }
        });
        const parent = obj[parentPos];
        // sibling 不会等于0
        // 全不选 - 全选 - 半选
        if (siblingChecked === 0) {
          parent.checked = false;
          parent.checkPart = false;
        } else if (siblingChecked === sibling) {
          parent.checked = true;
          parent.checkPart = false;
        } else {
          parent.checkPart = true;
          parent.checked = false;
        }
        loop(parentPos);
      };
      loop(_pos);
    });
  }
  handleCheck(treeNode) {
    const tnProps = treeNode.props;
    let checked = !tnProps.checked;
    if (tnProps.checkPart) {
      checked = true;
    }
    let pos;
    Object.keys(this.treeNodesChkStates).forEach((item) => {
      const itemObj = this.treeNodesChkStates[item];
      if (itemObj.key === (treeNode.key || tnProps.eventKey)) {
        pos = item;
        itemObj.checked = checked;
        itemObj.checkPart = false;
      }
    });
    this.handleCheckState(this.treeNodesChkStates, [pos], !checked);
    const checkKeys = this.getCheckKeys();
    this.checkPartKeys = checkKeys.checkPartKeys;
    this.setState({
      checkedKeys: checkKeys.checkedKeys,
    });
    if (this.props.onCheck) {
      this.props.onCheck({
        event: 'check',
        checked: checked,
        node: treeNode,
        checkedKeys: checkKeys.checkedKeys,
      });
    }
  }
  handleSelect(treeNode) {
    // should use defaultSelectedKeys
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
    this.setState({
      selectedKeys: selectedKeys,
    });
    if (props.onCheck) {
      props.onCheck({
        event: 'select',
        selected: selected,
        node: treeNode,
        selectedKeys: selectedKeys,
      });
    }
  }
  handleExpand(treeNode) {
    const thisProps = this.props;
    const tnProps = treeNode.props;
    const expandedKeys = this.state.expandedKeys.concat([]);
    const expanded = !tnProps.expanded;
    if (this.defaultExpandAll) {
      this.loopAllChildren(thisProps.children, (item, index, pos) => {
        const key = item.key || pos;
        if (expandedKeys.indexOf(key) === -1) {
          expandedKeys.push(key);
        }
      });
      this.defaultExpandAll = false;
    }
    const index = expandedKeys.indexOf(tnProps.eventKey);
    if (expanded) {
      if (index === -1) {
        expandedKeys.push(tnProps.eventKey);
      }
    } else {
      expandedKeys.splice(index, 1);
    }
    this.setState({
      expandedKeys: expandedKeys,
    });
  }
  // all keyboard events callbacks run from here at first
  handleKeyDown(e) {
    e.preventDefault();
  }
}

Tree.propTypes = {
  prefixCls: React.PropTypes.string,
  checkable: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.node,
  ]),
  showLine: React.PropTypes.bool,
  showIcon: React.PropTypes.bool,
  defaultExpandAll: React.PropTypes.bool,
  defaultExpandedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  defaultCheckedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  onCheck: React.PropTypes.func,
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  multiple: false,
  checkable: false,
  showLine: false,
  showIcon: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
};

export default Tree;
