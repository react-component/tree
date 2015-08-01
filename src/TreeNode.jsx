'use strict';

import React from 'react';
import rcUtil, {joinClasses, classSet} from 'rc-util';
import Tree from './Tree';

Tree.statics = Tree.statics();

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.expanded,
      selected: this.props.selected || false,
      checkPart: false,
      checked: this.props._checked || false
    };
    ['handleExpandedState', 'handleSelect', 'handleChecked'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      //selected: nextProps.selected,
      checked: nextProps._checked
    });
  }

  switchExpandedState (newState, onStateChangeComplete) {
    this.setState({
      expanded: newState
    }, onStateChangeComplete);
  }

  // keyboard event support
  handleKeyDown (e) {
    e.preventDefault();
  }

  handleExpandedState () {
    this.switchExpandedState(!this.state.expanded);
  }

  handleSelect () {
    this.setState({
      selected: !this.state.selected
    });
    if (this.props.onSelect) {
      this.props.onSelect(!this.state.selected, this);
    }
  }

  handleChecked () {
    if (this.state.checkPart) {
      return;
    }

    var checked = !this.state.checked;
    var nSt = {
      checkPart: false,
      checked: checked
    };
    this.setState(nSt);

    var _pos = this.props._pos;

    var sortedTree = Tree.statics.trees.sort(function (a, b) {
      return b.props._pos.length - a.props._pos.length;
    });

    sortedTree.forEach(function (c) {
      var cPos = c.props._pos;
      if (_pos.indexOf(cPos) === 0 && _pos !== cPos) {
        var childArr = rcUtil.Children.toArray(c.props.children),
            len = childArr.length;

        var checkedNumbers = 0;

        //先计算已经选中的节点数
        for (var i = 0; i < len; i++) {
          var checkSt = Tree.statics.treeNodesState[cPos + '-' + i];
          if (checkSt.checked) {
            checkedNumbers++;
          } else if (checkSt.checkPart) {
            checkedNumbers += 0.5;
          }
        }

        //点击节点的 直接父级
        if (_pos.length - cPos.length <= 2) {
          if (checked) {
            //如果原来是半选
            if (Tree.statics.treeNodesState[_pos].checkPart) {
              checkedNumbers += 0.5;
            } else {
              checkedNumbers++;
            }
          } else {
            checkedNumbers--;
          }
        }

        var newSt;
        if (checkedNumbers === 0) {
          //都不选
          newSt = {
            checkPart: false,
            checked: false
          };
        } else if (checkedNumbers === len) {
          //全选
          newSt = {
            checkPart: false,
            checked: true
          };
        } else {
          //部分选择
          newSt = {
            checkPart: true,
            checked: false
          };
        }
        c.setState(newSt);
        Tree.statics.treeNodesState[cPos] = newSt;
      }
    });

    Tree.statics.treeNodesState[_pos] = nSt;

    if (this.props.onChecked) {
      this.props.onChecked(checked, this);
    }
  }

  componentDidUpdate () {
    if (this.newChildren) {
      for (var i = 0; i < Tree.statics.trees.length; i++) {
        var obj = Tree.statics.trees[i];
        if (obj.props._pos === this.props._pos) {
          Tree.statics.trees.splice(i--, 1);
        }
      }
      Tree.statics.trees.push(this);
    }
    //add treeNodes checked state
    Tree.statics.treeNodesState[this.props._pos] = {
      checked: this.state.checked,
      checkPart: this.state.checkPart
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    var checkbox = this.refs.checkbox;
    if (checkbox) {
      var cls = checkbox.getDOMNode().className;
      var checkSt = Tree.statics.treeNodesState[this.props._pos] || {};
      checkSt.checkPart = nextState.checkPart;
      checkSt.checked = nextState.checked;
      if (nextState.checkPart) {
        checkbox.getDOMNode().className = cls + ' checkbox_true_part';
        return false;
      } else {
        checkbox.getDOMNode().className = cls.replace(/checkbox_true_part/g, '');
      }
    }
    return true;
  }

  render () {
    var props = this.props;
    var state = this.state;

    var prefixCls = props.prefixCls;
    var switchState = state.expanded ? 'open' : 'close';

    var switcherCls = {};
    switcherCls.button = true;
    switcherCls[prefixCls + '-treenode-switcher'] = true;
    switcherCls[prefixCls + '-switcher__' + switchState] = true;
    if (props._isChildTree && props._index === 0) {
      if (props._len !== 1) {
        switcherCls['center_' + switchState] = true;
      } else {
        switcherCls['bottom_' + switchState] = true;
      }
    } else if (props._index === 0) {
      switcherCls['roots_' + switchState] = true;
    } else if (props._index === props._len - 1) {
      switcherCls['bottom_' + switchState] = true;
    } else {
      switcherCls['center_' + switchState] = true;
    }

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
      checkbox = <span ref="checkbox" className={classSet(checkboxCls)} onClick={this.handleChecked}></span>;
    }

    var iconEleCls = {};
    iconEleCls.button = true;
    iconEleCls[prefixCls + '-iconEle'] = true;
    iconEleCls[prefixCls + '-icon__' + switchState] = true;

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
      <li className={joinClasses('level' + props._level, 'pos-' + props._pos)}>
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
  }
  renderChildren(children) {
    var newChildren = null;
    if (children.type === TreeNode || Array.isArray(children) &&
        children.every(function (item) {
          return item.type === TreeNode;
        })) {

      var cls = {};
      cls[this.props.prefixCls + '-child-tree'] = true;
      if (this.props.showLine && this.props._index !== this.props._len - 1) {
        cls.line = true;
      }

      var treeProps = {
        _level: this.props._level + 1,
        _pos: this.props._pos,
        _isChildTree: true,
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
  }
  componentDidMount() {
    //console.log( this.newChildren );
    //if (this.newChildren) {
    //  Tree.statics.trees.push(this);
    //}
  }
}
TreeNode.propTypes = {
  selected: React.PropTypes.bool,
  iconEle: React.PropTypes.node,
  onSelect: React.PropTypes.func
};
TreeNode.defaultProps = {
  title: '---',
  expanded: true
};

export default TreeNode;
