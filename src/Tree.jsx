'use strict';

import React from 'react';
import {joinClasses, classSet, createChainedFunction, KeyCode} from 'rc-util';

class Tree extends React.Component {
  constructor(props) {
    super(props);
    ['handleKeyDown', 'handleChecked'].forEach((m)=> {
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
    //var state = this.state;

    var classes = {};
    var prefixCls = props.prefixCls;
    classes[prefixCls] = true;

    var domProps = {
      className: joinClasses(props.className, classSet(classes)),
      style: props.expanded ? {display: 'block'} : {display: 'none'},
      role: 'tree-node',
      'aria-activedescendant': '',
      'aria-labelledby': '',
      'aria-expanded': props.expanded ? 'true' : 'false',
      'aria-selected': props.selected ? 'true' : 'false',
      'aria-level': ''
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.handleKeyDown;
    }

    //this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderTreeNode, this);
    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

    return (
      <ul {...domProps}>
        {this.newChildren}
      </ul>
    );
  }
  renderTreeNode(child, index) {
    var props = this.props;
    var pos = (props._pos || 0) + '-' + index;
    var cloneProps = {
      _level: props._level || 0,
      _pos: pos,
      _isChildTree: props._isChildTree || false,
      _index: index,
      _len: this.childrenLength,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      checkable: props.checkable,
      _checked: props._checked,
      onChecked: this.handleChecked,
      //selected: props.selected,
      onSelect: createChainedFunction(child.props.onSelect, this.handleSelect)
    };
    return React.cloneElement(child, cloneProps);
  }
}

Tree.propTypes = {
  focusable: React.PropTypes.bool,
  expanded: React.PropTypes.bool,
  showLine: React.PropTypes.bool,
  checkable: React.PropTypes.bool,
  onSelect: React.PropTypes.func
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  expanded: true,
  showLine: true
};

export default Tree;
