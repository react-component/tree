/** @jsx React.DOM */
var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
//var KeyCode = rcUtil.KeyCode;

var Tree = require('./Tree');

var TreeNode = React.createClass({
  propTypes: {

  },
  getDefaultProps() {
    return {
      title: '---',
      expanded: true,
      selected: false,
      checked: false,
      icon: true
    };
  },
  getInitialState: function () {
    return {
      expanded: this.props.expanded,
      selected: this.props.selected,
      checked: this.props.checked
    };
  },

  componentWillReceiveProps(nextProps) {
    var sta = {
      selected: nextProps.selected,
      checked: nextProps.selected
    };
    this.setState(sta);
  },

  switchExpandedState: function (newState, onStateChangeComplete) {
    this.setState({
      expanded: newState
    }, onStateChangeComplete);
  },

  // keyboard event support
  handleKeyDown: function (e) {
    e.preventDefault();
  },

  handleExpandedState: function () {
    this.switchExpandedState(!this.state.expanded);
  },

  handleSelect: function (e) {
    e.preventDefault();
    this.setState({
      selected: !this.state.selected
    });
  },

  handleChecked: function () {
    var checked = !this.state.checked;
    this.setState({
      checked: checked,
      selected: checked
    });
  },
  render: function () {
    var props = this.props;
    var state = this.state;

    var prefixCls = props.prefixCls;
    var switchCls = state.expanded ? 'open' : 'close';

    var switcherCls = {};
    switcherCls[prefixCls + '-treenode-switcher'] = true;
    switcherCls[prefixCls + '-switch__' + switchCls] = true;

    var iconEleCls = {};
    iconEleCls[prefixCls + '-iconEle'] = true;
    iconEleCls[prefixCls + '-icon__' + switchCls] = true;

    var switchPorps = {
      className: joinClasses(props.className, classSet(switcherCls)),
      onClick: this.handleExpandedState
    };

    var content = props.title;
    var newChildren = this.renderChildren(props.children);
    if (newChildren === props.children) {
      content = newChildren;
      newChildren = null;
    }

    // can replace with checkbox
    var iconEle = props.icon ?
        <span className={classSet(iconEleCls)} onClick={this.handleChecked}>
          {state.expanded ? <span>&#9801;</span> : <span>&#9800;</span>}
        </span> : null;

    return (
      <li>
        <span {...switchPorps}>{state.expanded ? '-' : '+'}</span>
        <a title={content}>
          {iconEle}
          <span className={state.selected ? prefixCls + '-selected' : ''}
                onClick={this.handleSelect}>{content}</span>
        </a>
        {newChildren}
      </li>
    );
  },
  renderChildren(children) {
    var childrenCount = React.Children.count(children);
    if (childrenCount === 1 && children.type === Tree) {
      this._cache = React.cloneElement(children, {
        expanded: this.state.expanded,
        selected: this.state.checked,
        checked: this.state.checked
      });
    } else {
      this._cache = children;
    }
    return this._cache;
  }
});

module.exports = TreeNode;