import React from 'react';
import {joinClasses, classSet} from 'rc-util';

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    ['handleExpand', 'handleCheck'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }
  getPosition(pos) {
    const obj = {
      last: false,
      center: false,
    };
    const siblings = Object.keys(this.props.root.treeNodesChkStates).filter((item) => {
      const len = pos.length;
      return len === item.length && pos.substring(0, len - 2) === item.substring(0, len - 2);
    });
    const sLen = siblings.length;
    const posIndex = Number(pos.substr(-1, 1));
    if (sLen === 1 ||  posIndex === sLen - 1) {
      obj.last = true;
    } else {
      obj.center = true;
    }
    return obj;
  }
  renderSwitcher(props, expandedState) {
    const prefixCls = props.prefixCls;
    const switcherCls = {
      [`${prefixCls}-switcher`]: true,
    };
    if (props.disabled) {
      switcherCls[`${prefixCls}-switcher-disabled`] = true;
      return <span className={classSet(switcherCls)}></span>;
    }

    const posObj = this.getPosition(props.pos);

    if (!props.showLine) {
      switcherCls[prefixCls + '-noline_' + expandedState] = true;
    } else if (props.pos === '0-0') {
      switcherCls[`${prefixCls}-roots_${expandedState}`] = true;
    } else {
      switcherCls[`${prefixCls}-center_${expandedState}`] = posObj.center;
      switcherCls[`${prefixCls}-bottom_${expandedState}`] = posObj.last;
    }
    return <span className={classSet(switcherCls)} onClick={this.handleExpand}></span>;
  }
  renderCheckbox(props) {
    const prefixCls = props.prefixCls;
    const checkboxCls = {
      [`${prefixCls}-checkbox`]: true,
    };
    if (props.checkPart) {
      checkboxCls[`${prefixCls}-checkbox-indeterminate`] = true;
    } else if (props.checked) {
      checkboxCls[`${prefixCls}-checkbox-checked`] = true;
    }
    let customEle = null;
    if (typeof props.checkable !== 'boolean') {
      customEle = props.checkable;
    }
    if (props.disabled) {
      checkboxCls[`${prefixCls}-checkbox-disabled`] = true;
      return <span ref="checkbox" className={classSet(checkboxCls)}>{customEle}</span>;
    }
    return (<span ref="checkbox" className={classSet(checkboxCls)}  onClick={this.handleCheck}>{customEle}</span>);
  }
  renderChildren(props) {
    let newChildren = null;
    const children = props.children;
    if (children.type === TreeNode || Array.isArray(children) &&
        children.every((item) => {
          return item.type === TreeNode;
        })) {
      const style = props.expanded ? {display: 'block'} : {display: 'none'};
      const cls = {};
      cls[`${props.prefixCls}-child-tree`] = true;
      if (props.showLine) {
        cls[`${props.prefixCls}-line`] = this.getPosition(props.pos).center;
      }
      newChildren = this.newChildren = (
        <ul className={classSet(cls)} style={style}>
          {React.Children.map(children, (item, index) => {
            return props.root.renderTreeNode(item, index, props.pos);
          }, props.root)}
        </ul>
      );
    } else {
      newChildren = children;
    }
    return newChildren;
  }
  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    // const expandedState = (props.defaultExpandAll || props.expanded) ? 'open' : 'close';
    const expandedState = props.expanded ? 'open' : 'close';

    const iconEleCls = {
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon__${expandedState}`]: true,
    };

    let content = props.title;
    let newChildren = this.renderChildren(props);
    if (newChildren === props.children) {
      content = newChildren;
      newChildren = null;
    }

    const selectHandle = () => {
      const icon = props.showIcon ? <span className={classSet(iconEleCls)}></span> : null;
      const title = <span className={`${prefixCls}-title`}>{content}</span>;
      const domProps = {};
      if (!props.disabled) {
        if (props.selected) {
          domProps.className = `${prefixCls}-selected`;
        }
        domProps.onClick = () => {
          this.handleSelect();
          if (props.checkable) {
            this.handleCheck();
          }
        };
      }
      return (
        <a ref="selectHandle" title={content} {...domProps}>
          {icon}{title}
        </a>
      );
    };

    return (
      <li className={joinClasses(props.className, props.disabled ? `${prefixCls}-treenode-disabled` : '')}>
        {this.renderSwitcher(props, expandedState)}
        {props.checkable ? this.renderCheckbox(props) : null}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
  handleCheck() {
    this.props.root.handleCheck(this);
  }
  handleSelect() {
    this.props.root.handleSelect(this);
  }
  handleExpand() {
    this.props.root.handleExpand(this);
  }
  // keyboard event support
  handleKeyDown(e) {
    e.preventDefault();
  }
}
TreeNode.propTypes = {
  prefixCls: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  root: React.PropTypes.object,
  onSelect: React.PropTypes.func,
};
TreeNode.defaultProps = {
  title: '---',
};

export default TreeNode;
