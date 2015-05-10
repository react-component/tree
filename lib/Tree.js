/** @jsx React.DOM */
var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var createChainedFunction = rcUtil.createChainedFunction;
//var KeyCode = rcUtil.KeyCode;

var Tree = React.createClass({
  propTypes: {
    focusable: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    showLine: React.PropTypes.bool,
    checkable: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      prefixCls: 'rc-tree',
      expanded: true,
      showLine: true
    };
  },

  statics: {
    trees: []
  },
  
  handleChecked: function (isChk, c, e) {
    if (this.props.onChecked) {
      this.props.onChecked(isChk, c, e);
    }
  },

  handleSelect: function (isSel, c, e) {
    if (this.props.onSelect) {
      this.props.onSelect(isSel, c, e);
    }
  },

  // all keyboard events callbacks run from here at first
  // todo
  handleKeyDown: function (e) {
    e.preventDefault();
  },

  render: function () {
    var props = this.props;
    //var state = this.state;

    var classes = {};
    var prefixCls = props.prefixCls;
    classes[prefixCls] = true;

    var domProps = {
      className: joinClasses(props.className, classSet(classes)),
      style: props.expanded ? {display: 'block'} : {display: 'none'},
      role: "tree-node",
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
  },
  renderTreeNode: function (child, index) {
    var props = this.props;
    var cloneProps = {
      _level: props._level || 0,
      _pos: (props._pos || 0) + '-' + index,
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

    //if (index === 0) {
    //  cloneProps._firstChild = true;
    //} else if (index === arr.length - 1) {
    //  cloneProps._lastChild = true;
    //} else {
    //  cloneProps._centerChild = true;
    //}

    return React.cloneElement(child, cloneProps);
  }
});

module.exports = Tree;