import React from 'react';
import assign from 'object-assign';
import classNames from 'classnames';
import Animate from 'rc-animate';
import { browser } from './util';

const browserUa = browser(window.navigator.userAgent || '');
const ieOrEdge = /.*(IE|Edge).+/.test(browserUa);
// const uaArray = browserUa.split(' ');
// const gtIE8 = uaArray.length !== 2 || uaArray[0].indexOf('IE') === -1 || Number(uaArray[1]) > 8;

const defaultTitle = '---';

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    ['handleExpand', 'handleCheck', 'handleContextMenu', 'handleDragStart', 'handleDragEnter', 'handleDragOver', 'handleDragLeave', 'handleDrop'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
    this.state = {
      dataLoading: false,
      dragNodeHighlight: false,
    };
  }

  getPosition(pos) {
    const obj = {
      last: false,
      center: false,
    };
    const siblings = Object.keys(this.props.root.treeNodesStates).filter((item) => {
      const len = pos.length;
      return len === item.length && pos.substring(0, len - 2) === item.substring(0, len - 2);
    });
    const sLen = siblings.length;
    const posIndex = Number(pos.substr(-1, 1));
    if (sLen === 1 || posIndex === sLen - 1) {
      obj.last = true;
    } else {
      obj.center = true;
    }
    return obj;
  }

  handleCheck() {
    this.props.root.handleCheck(this);
  }
  handleSelect() {
    this.props.root.handleSelect(this);
  }
  handleContextMenu(e) {
    e.preventDefault();
    this.props.root.handleContextMenu(e, this);
  }

  handleDragStart(e) {
    // console.log('dragstart', this.props.eventKey, e);
    // e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: true,
    });
    this.props.root.handleDragStart(e, this);
  }
  handleDragEnter(e) {
    // console.log('dragenter', this.props.eventKey, e);
    e.preventDefault();
    e.stopPropagation();
    this.props.root.handleDragEnter(e, this);
  }
  handleDragOver(e) {
    // console.log(this.props.eventKey, e);
    // todo disabled
    e.preventDefault();
    e.stopPropagation();
    this.props.root.handleDragOver(e, this);
    return false;
  }
  handleDragLeave(e) {
    // console.log(this.props.eventKey, e);
    e.stopPropagation();
    this.props.root.handleDragLeave(e, this);
  }
  handleDrop(e) {
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false,
    });
    this.props.root.handleDrop(e, this);
  }

  handleExpand() {
    const callbackPromise = this.props.root.handleExpand(this);
    if (callbackPromise && typeof callbackPromise === 'object') {
      const setLoading = (dataLoading) => {
        this.setState({
          dataLoading,
        });
      };
      setLoading(true);
      callbackPromise.then(() => {
        setLoading(false);
      }, () => {
        setLoading(false);
      });
    }
  }

  // keyboard event support
  handleKeyDown(e) {
    e.preventDefault();
  }

  renderSwitcher(props, expandedState) {
    const prefixCls = props.prefixCls;
    const switcherCls = {
      [`${prefixCls}-switcher`]: true,
    };
    if (props.disabled) {
      switcherCls[`${prefixCls}-switcher-disabled`] = true;
      return <span className={classNames(switcherCls)}></span>;
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
    return <span className={classNames(switcherCls)} onClick={this.handleExpand}></span>;
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
      return <span ref="checkbox" className={classNames(checkboxCls)}>{customEle}</span>;
    }
    return (<span ref="checkbox" className={classNames(checkboxCls)} onClick={this.handleCheck}>{customEle}</span>);
  }

  renderChildren(props) {
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    let transitionAppear = true;
    if (!renderFirst && props.expanded) {
      transitionAppear = false;
    }
    const children = props.children;
    let newChildren = children;
    if (!children) {
      return children;
    }
    if (children.type === TreeNode || Array.isArray(children) &&
      children.every((item) => {
        return item.type === TreeNode;
      })) {
      const cls = {
        [`${props.prefixCls}-child-tree`]: true,
        [`${props.prefixCls}-child-tree-open`]: props.expanded,
      };
      if (props.showLine) {
        cls[`${props.prefixCls}-line`] = this.getPosition(props.pos).center;
      }
      const animProps = {};
      if (props.openTransitionName) {
        animProps.transitionName = props.openTransitionName;
      } else if (typeof props.openAnimation === 'object') {
        animProps.animation = assign({}, props.openAnimation);
        if (!transitionAppear) {
          delete animProps.animation.appear;
        }
      }
      newChildren = this.newChildren = (
        <Animate {...animProps}
          showProp="expanded"
          transitionAppear={transitionAppear}
          component="">
          <ul className={classNames(cls)} expanded={props.expanded}>
            {React.Children.map(children, (item, index) => {
              return props.root.renderTreeNode(item, index, props.pos);
            }, props.root)}
          </ul>
        </Animate>
      );
    }
    return newChildren;
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const expandedState = props.expanded ? 'open' : 'close';

    const iconEleCls = {
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon_loading`]: this.state.dataLoading,
      [`${prefixCls}-icon__${expandedState}`]: true,
    };

    let canRenderSwitcher = true;
    const content = props.title;
    let newChildren = this.renderChildren(props);
    if (!newChildren || newChildren === props.children) {
      // content = newChildren;
      newChildren = null;
      if (!props.onDataLoaded) {
        canRenderSwitcher = false;
      }
    }

    const selectHandle = () => {
      const icon = (props.showIcon || props.onDataLoaded && this.state.dataLoading) ? <span className={classNames(iconEleCls)}></span> : null;
      const title = <span className={`${prefixCls}-title`}>{content}</span>;
      const domProps = {};
      if (!props.disabled) {
        if (props.selected || this.state.dragNodeHighlight) {
          domProps.className = `${prefixCls}-node-selected`;
        }
        domProps.onClick = (e) => {
          e.preventDefault();
          this.handleSelect();
          if (props.checkable) {
            this.handleCheck();
          }
        };
        if (props.onRightClick) {
          domProps.onContextMenu = this.handleContextMenu;
        }
        if (props.draggable) {
          if (ieOrEdge) {
            // ie bug!
            domProps.href = '#';
          }
          domProps.draggable = true;
          domProps['aria-grabbed'] = true;
          domProps.onDragStart = this.handleDragStart;
        }
      }
      return (
        <a ref="selectHandle" title={content} {...domProps}>
          {icon}{title}
        </a>
      );
    };

    const liProps = {};
    if (props.draggable) {
      liProps.onDragEnter = this.handleDragEnter;
      liProps.onDragOver = this.handleDragOver;
      liProps.onDragLeave = this.handleDragLeave;
      liProps.onDrop = this.handleDrop;
    }

    let disabledCls = '';
    let dragOverCls = '';
    if (props.disabled) {
      disabledCls = `${prefixCls}-treenode-disabled`;
    } else if (props.dragOver) {
      dragOverCls = 'drag-over';
    }

    return (
      <li {...liProps} ref="li" className={classNames(props.className, disabledCls, dragOverCls)}>
        {canRenderSwitcher ? this.renderSwitcher(props, expandedState) : <span className={`${prefixCls}-switcher-noop`}></span>}
        {props.checkable ? this.renderCheckbox(props) : null}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
}
TreeNode.propTypes = {
  prefixCls: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  root: React.PropTypes.object,
  onSelect: React.PropTypes.func,
};
TreeNode.defaultProps = {
  title: defaultTitle,
};

export default TreeNode;
