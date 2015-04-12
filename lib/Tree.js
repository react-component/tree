/** @jsx React.DOM */
var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
//var KeyCode = rcUtil.KeyCode;

var Tree = React.createClass({
  propTypes: {
    focusable: React.PropTypes.bool,
    checkable: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    selected: React.PropTypes.bool
  },
  getDefaultProps() {
    return {
      prefixCls: 'rc-tree',
      expanded: true
    };
  },
  // all keyboard events callbacks run from here at first
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

    this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderTreeNode, this);

    return (
      <ul
        {...domProps}>
      {this.newChildren}
      </ul>
    );
  },
  renderTreeNode: function (child) {
    var props = this.props;
    return React.cloneElement(child, {
      prefixCls: props.prefixCls,
      selected: props.selected
    });
  }
});

module.exports = Tree;