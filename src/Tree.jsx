import React from 'react';
import {classSet} from 'rc-util';
// import TreeNode from './TreeNode';

let id = 1;
const uuid = () => {
  return id++;
};

// ['0-0','0-1', '0-0-1', '0-1-1'] => ['0-0', '0-1']
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
        _rootTree: this,
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

    if (!this._finishInit && !props._childTreeNode && !props._childTree) {
      this.handleChildren(props.children, this._obj = {}, this._propsCheckedArray = []);
      this._propsCheckedArray = filterMin(this._propsCheckedArray);
      this.handleCheckState(this._obj, this._propsCheckedArray);
      // console.log(this._obj);
      rootTrees[this._rootTreeId].treeNodesState = this._obj;
      this._finishInit = true;
    }

    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

    return (
      <ul {...domProps} ref="tree">
        {this.newChildren}
      </ul>
    );
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
  handleChildren(children, _obj, _propsCheckedArray, level) {
    React.Children.forEach(children, (child, index) => {
      const pos = (level || 0) + '-' + index;
      // console.log(child.props.checkbox);
      let props = child.props;
      if (child.props.checkbox) {
        props = child.props.checkbox.props;
      }
      _obj[pos] = {
        checkPart: child.props.checkPart || false,
        checked: props.checked || props.defaultChecked || false,
      };
      if (_obj[pos].checked) {
        _propsCheckedArray.push(pos);
      }
      let childChildren = child.props.children;
      if (childChildren && typeof childChildren.type === 'function' && typeof childChildren.type.TreeNode === 'function') {
        childChildren = [childChildren];
      }
      if (Array.isArray(childChildren)) {
        return this.handleChildren(childChildren, _obj, _propsCheckedArray, pos);
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
