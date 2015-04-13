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
    checkable: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      prefixCls: 'rc-tree',
      expanded: true
    };
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
    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

    return (
      <ul {...domProps}>
        {this.newChildren}
      </ul>
    );
  },
  renderTreeNode: function (child) {
    var props = this.props;
    var cloneProps = {
      prefixCls: props.prefixCls,
      checkable: props.checkable,
      selected: props.selected,
      onSelect: createChainedFunction(child.props.onSelect, this.handleSelect)
    };
    return React.cloneElement(child, cloneProps);
  }
});

module.exports = Tree;