import React from 'react';
import {classSet} from 'rc-util';
// import TreeNode from './TreeNode';

let id = 1;
function uuid() {
  return id++;
}

const rootTrees = {};

class Tree extends React.Component {
  static statics() {
    return {
      rootTrees: rootTrees,
    };
  }
  constructor(props) {
    super(props);
    ['handleKeyDown', 'handleChecked', 'handleSelect'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });

    // get root tree, run one time
    if (!props._childTreeNode && !props._childTree) {
      // console.log('root tree', this);
      this._rootTreeId = uuid();
      const rootConfig = {
        prefixCls: props.prefixCls,
        showLine: props.showLine,
        showIcon: props.showIcon,
        expandAll: props.expandAll,
        checkable: props.checkable,
        defaultSelectedKeys: props.defaultSelectedKeys,
        selectedKeys: props.selectedKeys,
        onChecked: this.handleChecked,
        onSelect: this.handleSelect,
      };
      rootTrees[this._rootTreeId] = {
        _rootTreeId: this._rootTreeId,
        rootConfig: rootConfig,
        treeNodesState: {},
        trees: [],
        selectedKeys: props.selectedKeys.length && props.selectedKeys || props.defaultSelectedKeys,
      };
    }
    // if (props._childTree) {
    //   console.log('child tree', this);
    // }
  }
  renderTreeNode(child, index) {
    const props = this.props;
    const pos = (props._pos || 0) + '-' + index;
    const _rootTreeId = this._rootTreeId || props._rootTreeId;
    const cloneProps = {
      ref: 'treeNode',
      _rootTreeId: _rootTreeId,
      _key: child.key || pos,
      _pos: pos,
      _level: props._level || 0,
      _index: index,
      _len: this.childrenLength,
      checked: child.props.checked || props.checked,
      checkPart: props.checkPart,
    };
    Object.keys(rootTrees[_rootTreeId].rootConfig).forEach((item) => {
      cloneProps[item] = rootTrees[_rootTreeId].rootConfig[item];
    });

    if (rootTrees[_rootTreeId].selectedKeys.indexOf(child.key) > -1) {
      cloneProps.selected = true;
    }
    return React.cloneElement(child, cloneProps);
  }
  render() {
    const props = this.props;
    const domProps = {
      className: classSet(props.className, props.prefixCls),
      onKeyDown: this.handleKeyDown,
      role: 'tree-node',
      'aria-activedescendant': '',
      'aria-labelledby': '',
      'aria-expanded': props.expanded ? 'true' : 'false',
      'aria-selected': props.selected ? 'true' : 'false',
      'aria-level': '',
    };
    if (props._childTree) {
      domProps.style = props.expanded ? {display: 'block'} : {display: 'none'};
    }

    if (!props._childTreeNode && !props._childTree) {
      this._obj = {};
      this.handleChildren(props.children);
      // console.log(this._obj);
      this.handleObj(this._obj);
      // console.log(this._obj);
      rootTrees[this._rootTreeId].treeNodesState = this._obj;
    }

    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

    return (
      <ul {...domProps} ref="tree">
        {this.newChildren}
      </ul>
    );
  }
  handleObj(obj, unCheckEvent, pos) {
    if (unCheckEvent) {
      Object.keys(obj).forEach((i) => {
        if (i.indexOf(pos) === 0) {
          obj[i].checked = false;
          obj[i].checkPart = false;
        }
      });
      // return;
    } else if (pos) {
      Object.keys(obj).forEach((i) => {
        if (i.indexOf(pos) === 0) {
          obj[i].checked = true;
          obj[i].checkPart = false;
        }
      });
    }
    const checkedArr = Object.keys(obj).filter((key) => {
      return obj[key].checked;
    });
    // console.log(checkedArr);
    // todo 过滤掉checkedArr中的重复项
    checkedArr.forEach((key) => {
      const keyLen = key.length;
      const loop = (len) => {
        if (len <= 3) {
          Object.keys(obj).forEach((i) => {
            if (i.indexOf(key) === 0) {
              obj[i].checked = true;
              obj[i].checkPart = false;
            }
          });
          return;
        }
        let lenIndex = 0;
        let chkIndex = 0;
        Object.keys(obj).forEach((i) => {
          if (i.length === len && i.substring(0, len - 2) === key.substring(0, len - 2)) {
            lenIndex++;
            if (obj[i].checked) {
              chkIndex++;
            }
          } else if (i.length > len && i.indexOf(key) === 0) {
            obj[i].checked = true;
          }
        });
        // 子项全选，向上递归
        const parent = obj[key.substring(0, len - 2)];
        if (chkIndex === lenIndex) {
          parent.checked = true;
          loop(len - 2);
        } else {
          parent.checkPart = true;
          loop(len - 2, true);
        }
      };
      loop(keyLen);
    });
  }
  handleChildren(children, level) {
    React.Children.forEach(children, (child, index) => {
      const pos = (level || 0) + '-' + index;
      // console.log(child.props.checkbox);
      let props = child.props;
      if (child.props.checkbox) {
        props = child.props.checkbox.props;
      }
      this._obj[pos] = {
        checkPart: child.props.checkPart || false,
        checked: props.checked || props.defaultChecked || false,
      };
      let childChildren = child.props.children;
      if (childChildren && typeof childChildren.type === 'function' && typeof childChildren.type.TreeNode === 'function') {
        childChildren = [childChildren];
      }
      if (Array.isArray(childChildren)) {
        return this.handleChildren(childChildren, pos);
      }
      return null;
    });
  }
  handleChecked(isChk, c) {
    if (this.props.onChecked) {
      this.props.onChecked(isChk, c);
    }
  }
  handleSelect(isSel, c, selectedKeys) {
    if (this.props.onSelect) {
      this.props.onSelect(isSel, c, selectedKeys);
    }
  }
  // all keyboard events callbacks run from here at first
  handleKeyDown(e) {
    e.preventDefault();
  }
}

Tree.propTypes = {
  prefixCls: React.PropTypes.string,
  checkable: React.PropTypes.bool,
  showLine: React.PropTypes.bool,
  showIcon: React.PropTypes.bool,
  expandAll: React.PropTypes.bool,
  onChecked: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  defaultSelectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string),
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  checkable: false,
  showLine: true,
  showIcon: true,
  expandAll: false,
  defaultSelectedKeys: [],
  selectedKeys: [],
};

export default Tree;
