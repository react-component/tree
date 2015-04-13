/** @jsx React.DOM */
var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
//var createChainedFunction = rcUtil.createChainedFunction;
//var KeyCode = rcUtil.KeyCode;

var Tree = require('./Tree');

var TreeNode = React.createClass({
  propTypes: {
    checkable: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    iconEle: React.PropTypes.node,
    onSelect: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      title: '---',
      expanded: true,
      selected: false,
      checked: false
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

  handleSelect: function () {
    this.setState({
      selected: !this.state.selected
    });
    if (this.props.onSelect) {
      this.props.onSelect(!this.state.selected, this);
    }
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
    switcherCls[prefixCls + '-switcher__' + switchCls] = true;

    var switcherProps = {
      className: joinClasses(props.className, classSet(switcherCls)),
      onClick: this.handleExpandedState
    };

    var iconEleCls = {};
    iconEleCls[prefixCls + '-iconEle'] = true;
    iconEleCls[prefixCls + '-icon__' + switchCls] = true;

    // can replace with checkbox
    var userIconEle = null;
    if (props.iconEle && React.isValidElement(props.iconEle)) {
      userIconEle = props.iconEle;
    }
    var iconEleProps = {
      className: classSet(iconEleCls)
    };
    if (props.checkable) {
      iconEleProps.onClick = this.handleChecked;
    }

    var content = props.title;
    var newChildren = this.renderChildren(props.children);
    if (newChildren === props.children) {
      content = newChildren;
      newChildren = null;
    }

    return (
      <li>
        <span {...switcherProps}></span>
        <a title={content}>
          <span {...iconEleProps}>{userIconEle}</span>
          <span className={state.selected ? prefixCls + '-selected' : ''}
                onClick={this.handleSelect}>{content}</span>
        </a>
        {newChildren}
      </li>
    );
  },
  //renderChildren(children) {
  //  var childrenCount = React.Children.count(children);
  //  if (childrenCount === 1 && children.type === Tree) {
  //    this._cache = React.cloneElement(children, {
  //      expanded: this.state.expanded,
  //      selected: this.state.checked,
  //      checked: this.state.checked,
  //      onSelect: this.props.onSelect
  //    });
  //  } else {
  //    this._cache = children;
  //  }
  //  return this._cache;
  //},
  renderChildren(children) {
    var newChildren = null;
    if (children.type === TreeNode || Array.isArray(children) &&
        children.every(function (item) {
          return item.type === TreeNode;
        })) {
      var treeProps = {
        className: this.props.prefixCls + '-child-tree',
        expanded: this.state.expanded,
        selected: this.state.checked,
        checked: this.state.checked,
        checkable: this.props.checkable,
        onSelect: this.props.onSelect
      };
      newChildren = <Tree {...treeProps}>{children}</Tree>;
    } else {
      newChildren = children;
    }

    return newChildren;
  }
});

module.exports = TreeNode;