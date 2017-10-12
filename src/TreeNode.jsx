import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'rc-animate';
import toArray from 'rc-util/lib/Children/toArray';
import { contextTypes } from './Tree';

const defaultTitle = '---';

class TreeNode extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    expanded: PropTypes.bool,
    isLeaf: PropTypes.bool,
    root: PropTypes.object,
    onSelect: PropTypes.func,
  };

  static contextTypes = contextTypes;

  static defaultProps = {
    title: defaultTitle,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataLoading: false,
      dragNodeHighlight: false,
    };
  }

  onCheck = () => {
    this.props.root.onCheck(this);
  }

  onSelect() {
    this.props.root.onSelect(this);
  }

  onMouseEnter = (e) => {
    e.preventDefault();
    this.props.root.onMouseEnter(e, this);
  }

  onMouseLeave = (e) => {
    e.preventDefault();
    this.props.root.onMouseLeave(e, this);
  }

  onContextMenu = (e) => {
    this.props.root.onContextMenu(e, this);
  }

  onDragStart = (e) => {
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: true,
    });
    this.props.root.onDragStart(e, this);
    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch (error) {
      // empty
    }
  }

  onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.root.onDragEnter(e, this);
  }

  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.root.onDragOver(e, this);
  }

  onDragLeave = (e) => {
    e.stopPropagation();
    this.props.root.onDragLeave(e, this);
  }

  onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false,
    });
    this.props.root.onDrop(e, this);
  }

  onDragEnd = (e) => {
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false,
    });
    this.props.root.onDragEnd(e, this);
  }

  onExpand = () => {
    const callbackPromise = this.props.root.onExpand(this);
    if (callbackPromise && typeof callbackPromise === 'object') {
      const setLoading = (dataLoading) => {
        this.setState({ dataLoading });
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
  onKeyDown(e) {
    e.preventDefault();
  }

  isSelectable() {
    const { props, context } = this;
    return 'selectable' in props ? props.selectable : context.rcTree.selectable;
  }

  saveSelectHandle = (node) => {
    this.selectHandle = node;
  }

  renderSwitcher(props, expandedState) {
    const prefixCls = props.prefixCls;
    const switcherCls = classNames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expandedState}`, {
        [`${prefixCls}-switcher-disabled`]: props.disabled,
      });
    return <span className={switcherCls} onClick={props.disabled ? null : this.onExpand} />;
  }

  renderCheckbox(props) {
    const prefixCls = props.prefixCls;
    const checkboxCls = {
      [`${prefixCls}-checkbox`]: true,
    };
    if (props.checked) {
      checkboxCls[`${prefixCls}-checkbox-checked`] = true;
    } else if (props.halfChecked) {
      checkboxCls[`${prefixCls}-checkbox-indeterminate`] = true;
    }
    let customEle = null;
    if (typeof props.checkable !== 'boolean') {
      customEle = props.checkable;
    }
    if (props.disabled || props.disableCheckbox) {
      checkboxCls[`${prefixCls}-checkbox-disabled`] = true;
      return <span className={classNames(checkboxCls)}>{customEle}</span>;
    }
    return (
      <span
        className={classNames(checkboxCls) }
        onClick={this.onCheck}
      >{customEle}</span>);
  }

  renderChildren(props) {
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    let transitionAppear = true;
    if (!renderFirst && props.expanded) {
      transitionAppear = false;
    }
    let children = null;
    if (props.children) {
      children = toArray(props.children).filter(item => !!item);
    }
    let newChildren = children;
    if (children &&
      (Array.isArray(children) && children.length &&
        children.every((item) => item.type && item.type.isTreeNode) ||
        (children.type && children.type.isTreeNode))) {
      const animProps = {};
      if (props.openTransitionName) {
        animProps.transitionName = props.openTransitionName;
      } else if (typeof props.openAnimation === 'object') {
        animProps.animation = { ...props.openAnimation };
        if (!transitionAppear) {
          delete animProps.animation.appear;
        }
      }
      const cls = classNames(`${props.prefixCls}-child-tree`, {
        [`${props.prefixCls}-child-tree-open`]: props.expanded,
      });
      newChildren = (
        <Animate
          {...animProps}
          showProp="data-expanded"
          transitionAppear={transitionAppear}
          component=""
        >
          {!props.expanded ? null : (
            <ul className={cls} data-expanded={props.expanded}>
              {React.Children.map(children, (item, index) => {
                return props.root.renderTreeNode(item, index, props.pos);
              }, props.root)}
            </ul>
          )}
        </Animate>
      );
    }
    return newChildren;
  }

  render() {
    const { props } = this;
    const prefixCls = props.prefixCls;
    const expandedState = props.expanded ? 'open' : 'close';
    let iconState = expandedState;

    let canRenderSwitcher = true;
    const content = props.title;
    let newChildren = this.renderChildren(props);
    if (!newChildren || newChildren === props.children) {
      // content = newChildren;
      newChildren = null;
      if (!props.loadData || props.isLeaf) {
        canRenderSwitcher = false;
        iconState = 'docu';
      }
    }
    // For performance, does't render children into dom when `!props.expanded` (move to Animate)
    // if (!props.expanded) {
    //   newChildren = null;
    // }

    const iconEleCls = {
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon_loading`]: this.state.dataLoading,
      [`${prefixCls}-icon__${iconState}`]: true,
    };

    const selectHandle = () => {
      const icon = (props.showIcon || props.loadData && this.state.dataLoading) ?
        <span className={classNames(iconEleCls)}></span> : null;
      const title = <span className={`${prefixCls}-title`}>{content}</span>;
      const wrap = `${prefixCls}-node-content-wrapper`;
      const domProps = {
        className: `${wrap} ${wrap}-${iconState === expandedState ? iconState : 'normal'}`,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onContextMenu: this.onContextMenu,
      };
      if (!props.disabled) {
        if (props.selected || this.state.dragNodeHighlight) {
          domProps.className += ` ${prefixCls}-node-selected`;
        }
        domProps.onClick = (e) => {
          if (this.isSelectable()) {
            e.preventDefault();
            this.onSelect();
          } else if (props.checkable && !props.disableCheckbox) {
            e.preventDefault();
            // && !props.disabled is checked on line 259
            this.onCheck();
          }
        };
        if (props.draggable) {
          domProps.className += ' draggable';
          domProps.draggable = true;
          domProps['aria-grabbed'] = true;
          domProps.onDragStart = this.onDragStart;
        }
      }
      return (
        <span
          ref={this.saveSelectHandle}
          title={typeof content === 'string' ? content : ''}
          {...domProps}
        >
          {icon}{title}
        </span>
      );
    };

    const liProps = {};
    if (props.draggable) {
      liProps.onDragEnter = this.onDragEnter;
      liProps.onDragOver = this.onDragOver;
      liProps.onDragLeave = this.onDragLeave;
      liProps.onDrop = this.onDrop;
      liProps.onDragEnd = this.onDragEnd;
    }

    let disabledCls = '';
    let dragOverCls = '';
    if (props.disabled) {
      disabledCls = `${prefixCls}-treenode-disabled`;
    } else if (props.dragOver) {
      dragOverCls = 'drag-over';
    } else if (props.dragOverGapTop) {
      dragOverCls = 'drag-over-gap-top';
    } else if (props.dragOverGapBottom) {
      dragOverCls = 'drag-over-gap-bottom';
    }

    const filterCls = props.filterTreeNode(this) ? 'filter-node' : '';

    const renderNoopSwitcher = () => (
      <span className={`${prefixCls}-switcher ${prefixCls}-switcher-noop`} />
    );

    return (
      <li
        {...liProps}
        className={classNames(props.className, disabledCls, dragOverCls, filterCls) }
      >
        {canRenderSwitcher ? this.renderSwitcher(props, expandedState) : renderNoopSwitcher()}
        {props.checkable ? this.renderCheckbox(props) : null}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
}

TreeNode.isTreeNode = 1;

export default TreeNode;
