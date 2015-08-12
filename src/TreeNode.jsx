import React from 'react';
import {joinClasses, classSet} from 'rc-util';
import Tree from './Tree';

const rootTrees = Tree.statics().rootTrees;

class TreeNode extends Tree {
  constructor(props) {
    super(props);
    const tnState = this.getTreeNodesState();
    this.state = {
      expanded: props.expandAll || props.expanded || props.defaultExpanded,
      selected: props.selected || false,
      checkPart: tnState.checkPart || false,
      checked: tnState.checked || false,
    };
    ['handleExpandedState'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }
  componentWillReceiveProps() {
    const tnState = this.getTreeNodesState();
    this.setState({
      checkPart: tnState.checkPart,
      checked: tnState.checked,
    });
  }
  getTreeNodesState() {
    return rootTrees[this.props._rootTreeId].treeNodesState[this.props._pos];
  }
  renderSwitcher(props, prefixCls, switchState) {
    const switcherCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-switcher`]: true,
    };
    if (props.disabled) {
      switcherCls[`${prefixCls}-switcher-disabled`] = true;
      return <span className={classSet(switcherCls)}></span>;
    }

    if (!props.showLine) {
      switcherCls[prefixCls + '-noline_' + switchState] = true;
    } else if (props._isChildTree && props._index === 0) {
      if (props._len !== 1) {
        switcherCls[prefixCls + '-center_' + switchState] = true;
      } else {
        switcherCls[prefixCls + '-bottom_' + switchState] = true;
      }
    } else if (props._index === 0) {
      switcherCls[prefixCls + '-roots_' + switchState] = true;
    } else if (props._index === props._len - 1) {
      switcherCls[prefixCls + '-bottom_' + switchState] = true;
    } else {
      switcherCls[prefixCls + '-center_' + switchState] = true;
    }
    return <span className={classSet(switcherCls)} onClick={this.handleExpandedState}></span>;
  }
  renderCheckbox(props, prefixCls, state) {
    const checkboxCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-chk`]: true,
    };
    if (!props.checkable) {
      return null;
    }
    if (props.disabled) {
      checkboxCls[`${prefixCls}-chk-disabled`] = true;
      return <span ref="checkbox" className={classSet(checkboxCls)}></span>;
    }
    if (state.checkPart) {
      checkboxCls[`${prefixCls}-checkbox_true_part`] = true;
    } else if (state.checked) {
      checkboxCls[`${prefixCls}-checkbox_true_full`] = true;
    } else {
      checkboxCls[`${prefixCls}-checkbox_false_full`] = true;
    }
    // console.log(props.checkbox.props);
    if (props.checkbox) {
      checkboxCls[`${prefixCls}-checkbox-custom`] = true;
      React.cloneElement(props.checkbox, {
        checked: state.checked,
        // defaultChecked: state.checked,
      });
      // props.checkbox.props.checked = state.checked;
    }
    return (<span ref="checkbox" className={classSet(checkboxCls)} onClick={this.handleChecked}>
      {props.checkbox ? props.checkbox : null}
    </span>);
  }
  renderChildren(props, children) {
    let newChildren = null;
    if (children.type === TreeNode || Array.isArray(children) &&
        children.every((item) => {
          return item.type === TreeNode;
        })) {
      const cls = {};
      cls[props.prefixCls + '-child-tree'] = true;
      if (props.showLine && props._index !== props._len - 1) {
        cls[props.prefixCls + '-line'] = true;
      }

      const treeProps = {
        _rootTreeId: props._rootTreeId,
        _pos: props._pos,
        _level: props._level + 1,
        _childTree: true,
        checked: this.state.checked,
        checkPart: this.state.checkPart,
        className: classSet(cls),
        expanded: this.state.expanded,
      };
      newChildren = this.newChildren = <Tree {...treeProps}>{children}</Tree>;
    } else {
      newChildren = children;
    }
    return newChildren;
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    const switchState = state.expanded ? 'open' : 'close';

    const iconEleCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon__${switchState}`]: true,
    };

    let content = props.title;
    let newChildren = this.renderChildren(props, props.children);
    if (newChildren === props.children) {
      content = newChildren;
      newChildren = null;
    }

    const selectHandle = () => {
      const icon = props.showIcon ? <span className={classSet(iconEleCls)}></span> : null;
      if (props.disabled) {
        return <a ref="selectHandle" title={content}>{icon}<span className="title">{content}</span></a>;
      }
      return (<a ref="selectHandle" title={content}
         className={state.selected ? `${prefixCls}-selected` : ''}
         onClick={this.handleSelect}>{icon}<span className="title">{content}</span>
      </a>);
    };

    return (
      <li className={joinClasses(props.className, `level-${props._level}`, `pos-${props._pos}`, props.disabled ? `${prefixCls}-treenode-disabled` : '')}>
        {this.renderSwitcher(props, prefixCls, switchState)}
        {this.renderCheckbox(props, prefixCls, state)}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
  handleExpandedState() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }
  handleSelect() {
    const selected = !this.state.selected;
    const arr = rootTrees[this.props._rootTreeId].selectedKeys;
    const index = arr.indexOf(this.props._key);
    if (selected) {
      if (index < 0) {
        arr.push(this.props._key);
      }
    } else {
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    this.setState({
      selected: selected,
    });
    if (this.props.onSelect) {
      this.props.onSelect(selected, this, arr);
    }
  }
  handleChecked() {
    const props = this.props;
    let checked = !this.state.checked;

    if (this.state.checkPart) {
      checked = true;
    }

    const nSt = {
      checkPart: false,
      checked: checked,
    };

    rootTrees[props._rootTreeId].treeNodesState[props._pos] = nSt;
    super.handleCheckState(rootTrees[props._rootTreeId].treeNodesState, [props._pos], !checked);
    // console.log(rootTrees[props._rootTreeId].treeNodesState);
    // this.setState(nSt);
    // 从rootTree更新
    rootTrees[props._rootTreeId]._rootTree.forceUpdate();

    if (props.onChecked) {
      props.onChecked(checked, this);
    }
  }
  // keyboard event support
  handleKeyDown(e) {
    e.preventDefault();
  }
}
TreeNode.propTypes = {
  _rootTreeId: React.PropTypes.number,
  _pos: React.PropTypes.string,
  _index: React.PropTypes.number,
  _len: React.PropTypes.number,
  _level: React.PropTypes.number,
  _key: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  selected: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
};
TreeNode.defaultProps = {
  _childTreeNode: true,
  title: '---',
  defaultExpanded: false,
  expanded: false,
};

export default TreeNode;
