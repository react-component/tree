'use strict';

import React from 'react';
import {classSet, KeyCode} from 'rc-util';

class Tree extends React.Component {
  constructor(props) {
    super(props);
    ['handleKeyDown', 'handleChecked', 'handleSelect'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }
  static statics() {
    return {
      treeNodesState: { },
      trees: []
    };
  }
  handleChecked(isChk, c, e) {
    if (this.props.onChecked) {
      this.props.onChecked(isChk, c, e);
    }
  }
  handleSelect(isSel, c, e) {
    if (this.props.onSelect) {
      this.props.onSelect(isSel, c, e);
    }
  }
  // all keyboard events callbacks run from here at first
  handleKeyDown(e) {
    console.log(KeyCode);
    e.preventDefault();
  }
  render() {
    var props = this.props;
    var domProps = {
      className: classSet(props.className, props.prefixCls),
      onKeyDown: this.handleKeyDown,
      role: 'tree-node',
      'aria-activedescendant': '',
      'aria-labelledby': '',
      'aria-expanded': props.expanded ? 'true' : 'false',
      'aria-selected': props.selected ? 'true' : 'false',
      'aria-level': ''
    };
    if (props._isChildTree) {
      domProps.style = props.expanded ? {display: 'block'} : {display: 'none'};
    }
    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

    return (
      <ul {...domProps} ref="tree">
        {this.newChildren}
      </ul>
    );
  }
  renderTreeNode(child, index) {
    var props = this.props;
    var pos = (props._pos || 0) + '-' + index;
    var cloneProps = {
      ref: 'treeNode',
      _level: props._level || 0,
      _pos: pos,
      _isChildTree: props._isChildTree || false,
      _index: index,
      _len: this.childrenLength,
      _checked: props._checked,
      _checkPart: props._checkPart,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      showIcon: props.showIcon,
      expandAll: props.expandAll,
      checkable: props.checkable,
      onChecked: this.handleChecked,
      onSelect: this.handleSelect
    };
    return React.cloneElement(child, cloneProps);
  }
}

Tree.propTypes = {
  prefixCls: React.PropTypes.string,
  checkable: React.PropTypes.bool,
  showLine: React.PropTypes.bool,
  showIcon: React.PropTypes.bool,
  expandAll: React.PropTypes.bool,
  onChecked: React.PropTypes.func,
  onSelect: React.PropTypes.func
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  checkable: false,
  showLine: true,
  showIcon: true,
  expandAll: false
};

export default Tree;
