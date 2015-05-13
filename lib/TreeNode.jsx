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
    selected: React.PropTypes.bool,
    iconEle: React.PropTypes.node,
    onSelect: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      title: '---',
      expanded: true
    };
  },
  getInitialState: function () {
    return {
      expanded: this.props.expanded,
      selected: this.props.selected || false,
      checkPart: false,
      checked: this.props._checked || false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      //selected: nextProps.selected,
      checked: nextProps._checked
    });
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
      //selected: checked,
      checked: checked
    });
    Tree.trees.forEach(function (c) {
      var _pos = this.props._pos;
      var cPos = c.props._pos;
      if (_pos.length > cPos.length && _pos.indexOf(cPos) === 0){
        //c.checkPart()
      }
    }, this);
    if (this.props.onChecked) {
      this.props.onChecked(checked, this);
    }
  },

  checkPart: function () {
    this.setState({
      checkPart: true
    });
  },

  render: function () {
    var props = this.props;
    var state = this.state;

    var prefixCls = props.prefixCls;
    var switchCls = state.expanded ? 'open' : 'close';

    var switcherCls = {};
    switcherCls.button = true;
    switcherCls[prefixCls + '-treenode-switcher'] = true;
    switcherCls[prefixCls + '-switcher__' + switchCls] = true;

    var checkbox = null;
    var checkboxCls = {};
    if (props.checkable) {
      checkboxCls.button = true;
      checkboxCls.chk = true;
      /* jshint ignore:start */
      if (state.checkPart) {
        checkboxCls.checkbox_true_part = true;
      } else if (state.checked) {
        checkboxCls.checkbox_true_full = true;
      } else {
        checkboxCls.checkbox_false_full = true;
      }
      /* jshint ignore:end */
      checkbox = <span className={classSet(checkboxCls)} onClick={this.handleChecked}></span>;
    }

    var iconEleCls = {};
    iconEleCls.button = true;
    iconEleCls[prefixCls + '-iconEle'] = true;
    iconEleCls[prefixCls + '-icon__' + switchCls] = true;

    var userIconEle = null;
    if (props.iconEle && React.isValidElement(props.iconEle)) {
      userIconEle = props.iconEle;
    }

    var content = props.title;
    var newChildren = this.renderChildren(props.children);
    if (newChildren === props.children) {
      content = newChildren;
      newChildren = null;
    }

    return (
      <li className={'level' + props._level}>
        <span className={joinClasses(props.className, classSet(switcherCls))}
              onClick={this.handleExpandedState}></span>
        {checkbox}
        <a title={content}
           className={state.selected ? prefixCls + '-selected' : ''}
           onClick={this.handleSelect}>
          <span className={classSet(iconEleCls)}>{userIconEle}</span>
          <span>{content}</span>
        </a>
        {newChildren}
      </li>
    );
  },
  renderChildren(children) {
    var newChildren = null;
    if (children.type === TreeNode || Array.isArray(children) &&
        children.every(function (item) {
          return item.type === TreeNode;
        })) {

      var cls = {};
      cls[this.props.prefixCls + '-child-tree'] = true;
      if (this.props.showLine) {
        cls.line = true;
      }

      var treeProps = {
        _level: this.props._level + 1,
        _pos: this.props._pos,
        className: classSet(cls),
        expanded: this.state.expanded,
        //selected: this.state.checked,
        _checked: this.state.checked,
        checkable: this.props.checkable, //只是为了传递根节点上的checkable设置,是否有更好做法?
        onChecked: this.props.onChecked,
        onSelect: this.props.onSelect
      };
      newChildren = this.newChildren = <Tree {...treeProps}>{children}</Tree>;
    } else {
      newChildren = children;
    }

    return newChildren;
  },
  componentDidMount: function () {
    //console.log( this.newChildren );
    if (this.newChildren) {
      Tree.trees.push(this);
    }
  }
});

module.exports = TreeNode;