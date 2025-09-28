import React from 'react';
import { clsx } from 'clsx';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { TreeContext, UnstableContext } from './contextTypes';
import Indent from './Indent';
import type { TreeNodeProps } from './interface';
import getEntity from './utils/keyUtil';
import { convertNodePropsToEventData } from './utils/treeUtil';

const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

const defaultTitle = '---';

export type { TreeNodeProps } from './interface';

const TreeNode: React.FC<Readonly<TreeNodeProps>> = props => {
  const {
    eventKey,
    className,
    style,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    isLeaf,
    isStart,
    isEnd,
    expanded,
    selected,
    checked,
    halfChecked,
    loading,
    domRef,
    active,
    data,
    onMouseMove,
    selectable,
    ...otherProps
  } = props;

  const context = React.useContext(TreeContext);
  const { classNames: treeClassNames, styles } = context || {};

  const unstableContext = React.useContext(UnstableContext);

  const selectHandleRef = React.useRef<HTMLSpanElement>(null);

  const [dragNodeHighlight, setDragNodeHighlight] = React.useState<boolean>(false);

  // ======= State: Disabled State =======
  const isDisabled = !!(context.disabled || props.disabled || unstableContext.nodeDisabled?.(data));

  const isCheckable = React.useMemo<React.ReactNode>(() => {
    // Return false if tree or treeNode is not checkable
    if (!context.checkable || props.checkable === false) {
      return false;
    }
    return context.checkable;
  }, [context.checkable, props.checkable]);

  // ======= Event Handlers: Selection and Check =======
  const onSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (isDisabled) {
      return;
    }
    context.onNodeSelect(e, convertNodePropsToEventData(props));
  };

  const onCheck = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (isDisabled) {
      return;
    }
    if (!isCheckable || props.disableCheckbox) {
      return;
    }
    context.onNodeCheck(e, convertNodePropsToEventData(props), !checked);
  };

  // ======= State: Selectable Check =======
  const isSelectable = React.useMemo<boolean>(() => {
    // Ignore when selectable is undefined or null
    if (typeof selectable === 'boolean') {
      return selectable;
    }
    return context.selectable;
  }, [selectable, context.selectable]);

  const onSelectorClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // Click trigger before select/check operation
    context.onNodeClick(e, convertNodePropsToEventData(props));
    if (isSelectable) {
      onSelect(e);
    } else {
      onCheck(e);
    }
  };

  const onSelectorDoubleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    context.onNodeDoubleClick(e, convertNodePropsToEventData(props));
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    context.onNodeMouseEnter(e, convertNodePropsToEventData(props));
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    context.onNodeMouseLeave(e, convertNodePropsToEventData(props));
  };

  const onContextMenu = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    context.onNodeContextMenu(e, convertNodePropsToEventData(props));
  };

  // ======= Drag: Drag Enabled =======
  const isDraggable = React.useMemo<boolean>(() => {
    return !!(
      context.draggable &&
      (!context.draggable.nodeDraggable || context.draggable.nodeDraggable(data))
    );
  }, [context.draggable, data]);

  // ======= Drag: Drag Event Handlers =======
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragNodeHighlight(true);
    context.onNodeDragStart(e, props);
    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch {
      // empty
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    context.onNodeDragEnter(e, props);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    context.onNodeDragOver(e, props);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    context.onNodeDragLeave(e, props);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragNodeHighlight(false);
    context.onNodeDragEnd(e, props);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragNodeHighlight(false);
    context.onNodeDrop(e, props);
  };

  // ======= Expand: Node Expansion =======
  const onExpand: React.MouseEventHandler<HTMLDivElement> = e => {
    if (loading) {
      return;
    }
    context.onNodeExpand(e, convertNodePropsToEventData(props));
  };

  // ======= State: Has Children =======
  const hasChildren = React.useMemo<boolean>(() => {
    const { children } = getEntity(context.keyEntities, eventKey) || {};
    return Boolean((children || []).length);
  }, [context.keyEntities, eventKey]);

  // ======= State: Leaf Check =======
  const memoizedIsLeaf = React.useMemo<boolean>(() => {
    if (isLeaf === false) {
      return false;
    }
    return (
      isLeaf ||
      (!context.loadData && !hasChildren) ||
      (context.loadData && props.loaded && !hasChildren)
    );
  }, [isLeaf, context.loadData, hasChildren, props.loaded]);

  // ============== Effect ==============
  React.useEffect(() => {
    // Load data to avoid default expanded tree without data
    if (loading) {
      return;
    }
    // read from state to avoid loadData at same time
    if (typeof context.loadData === 'function' && expanded && !memoizedIsLeaf && !props.loaded) {
      // We needn't reload data when has children in sync logic
      // It's only needed in node expanded
      context.onNodeLoad(convertNodePropsToEventData(props));
    }
  }, [loading, context.loadData, context.onNodeLoad, expanded, memoizedIsLeaf, props]);

  // ==================== Render: Drag Handler ====================
  const dragHandlerNode = React.useMemo<React.ReactNode>(() => {
    if (!context.draggable?.icon) {
      return null;
    }
    return <span className={`${context.prefixCls}-draggable-icon`}>{context.draggable.icon}</span>;
  }, [context.draggable]);

  // ====================== Render: Switcher ======================
  const renderSwitcherIconDom = (isInternalLeaf: boolean) => {
    const switcherIcon = props.switcherIcon || context.switcherIcon;
    // if switcherIconDom is null, no render switcher span
    if (typeof switcherIcon === 'function') {
      return switcherIcon({ ...props, isLeaf: isInternalLeaf });
    }
    return switcherIcon;
  };

  // Switcher
  const renderSwitcher = () => {
    if (memoizedIsLeaf) {
      // if switcherIconDom is null, no render switcher span
      const switcherIconDom = renderSwitcherIconDom(true);
      return switcherIconDom !== false ? (
        <span
          className={clsx(`${context.prefixCls}-switcher`, `${context.prefixCls}-switcher-noop`)}
        >
          {switcherIconDom}
        </span>
      ) : null;
    }
    const switcherIconDom = renderSwitcherIconDom(false);
    return switcherIconDom !== false ? (
      <span
        onClick={onExpand}
        className={clsx(
          `${context.prefixCls}-switcher`,
          `${context.prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
        )}
      >
        {switcherIconDom}
      </span>
    ) : null;
  };

  // ====================== Checkbox ======================
  const checkboxNode = React.useMemo<React.ReactNode>(() => {
    if (!isCheckable) {
      return null;
    }

    // [Legacy] Custom element should be separate with `checkable` in future
    const $custom = typeof isCheckable !== 'boolean' ? isCheckable : null;

    return (
      <span
        className={clsx(`${context.prefixCls}-checkbox`, {
          [`${context.prefixCls}-checkbox-checked`]: checked,
          [`${context.prefixCls}-checkbox-indeterminate`]: !checked && halfChecked,
          [`${context.prefixCls}-checkbox-disabled`]: isDisabled || props.disableCheckbox,
        })}
        onClick={onCheck}
        role="checkbox"
        aria-checked={halfChecked ? 'mixed' : checked}
        aria-disabled={isDisabled || props.disableCheckbox}
        aria-label={`Select ${typeof props.title === 'string' ? props.title : 'tree node'}`}
      >
        {$custom}
      </span>
    );
  }, [isCheckable, checked, halfChecked, isDisabled, props.disableCheckbox, props.title]);

  // ============== State: Node State (Open/Close) ==============
  const nodeState = React.useMemo<typeof ICON_OPEN | typeof ICON_CLOSE>(() => {
    if (memoizedIsLeaf) {
      return null;
    }
    return expanded ? ICON_OPEN : ICON_CLOSE;
  }, [memoizedIsLeaf, expanded]);

  // ==================== Render: Title + Icon ====================
  const iconNode = React.useMemo<React.ReactNode>(() => {
    return (
      <span
        className={clsx(
          treeClassNames?.itemIcon,
          `${context.prefixCls}-iconEle`,
          `${context.prefixCls}-icon__${nodeState || 'docu'}`,
          { [`${context.prefixCls}-icon_loading`]: loading },
        )}
        style={styles?.itemIcon}
      />
    );
  }, [context.prefixCls, nodeState, loading]);

  // =================== Drop Indicator ===================
  const dropIndicatorNode = React.useMemo<React.ReactNode>(() => {
    const rootDraggable = Boolean(context.draggable);
    // allowDrop is calculated in Tree.tsx, there is no need for calc it here
    const showIndicator = !props.disabled && rootDraggable && context.dragOverNodeKey === eventKey;
    if (!showIndicator) {
      return null;
    }
    return context.dropIndicatorRender({
      dropPosition: context.dropPosition,
      dropLevelOffset: context.dropLevelOffset,
      indent: context.indent,
      prefixCls: context.prefixCls,
      direction: context.direction,
    });
  }, [
    context.dropPosition,
    context.dropLevelOffset,
    context.indent,
    context.prefixCls,
    context.direction,
    context.draggable,
    context.dragOverNodeKey,
    context.dropIndicatorRender,
  ]);

  // Icon + Title
  const selectorNode = React.useMemo<React.ReactNode>(() => {
    const { title = defaultTitle } = props;

    const wrapClass = `${context.prefixCls}-node-content-wrapper`;

    // Icon - Still show loading icon when loading without showIcon
    let $icon: React.ReactNode;

    if (context.showIcon) {
      const currentIcon = props.icon || context.icon;

      $icon = currentIcon ? (
        <span
          className={clsx(
            treeClassNames?.itemIcon,
            `${context.prefixCls}-iconEle`,
            `${context.prefixCls}-icon__customize`,
          )}
          style={styles?.itemIcon}
        >
          {typeof currentIcon === 'function' ? currentIcon(props) : currentIcon}
        </span>
      ) : (
        iconNode
      );
    } else if (context.loadData && loading) {
      $icon = iconNode;
    }

    // Title
    let titleNode: React.ReactNode;
    if (typeof title === 'function') {
      titleNode = title(data);
    } else if (context.titleRender) {
      titleNode = context.titleRender(data);
    } else {
      titleNode = title;
    }

    return (
      <span
        ref={selectHandleRef}
        title={typeof title === 'string' ? title : ''}
        className={clsx(wrapClass, `${wrapClass}-${nodeState || 'normal'}`, {
          [`${context.prefixCls}-node-selected`]: !isDisabled && (selected || dragNodeHighlight),
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        onClick={onSelectorClick}
        onDoubleClick={onSelectorDoubleClick}
      >
        {$icon}
        <span
          className={clsx(`${context.prefixCls}-title`, treeClassNames?.itemTitle)}
          style={styles?.itemTitle}
        >
          {titleNode}
        </span>
        {dropIndicatorNode}
      </span>
    );
  }, [
    context.prefixCls,
    context.showIcon,
    props,
    context.icon,
    iconNode,
    context.titleRender,
    data,
    nodeState,
    onMouseEnter,
    onMouseLeave,
    onContextMenu,
    onSelectorClick,
    onSelectorDoubleClick,
  ]);

  const dataOrAriaAttributeProps = pickAttrs(otherProps, { aria: true, data: true });

  const { level } = getEntity(context.keyEntities, eventKey) || {};

  const isEndNode = isEnd[isEnd.length - 1];

  const draggableWithoutDisabled = !isDisabled && isDraggable;

  const dragging = context.draggingNodeKey === eventKey;
  const ariaSelected = selectable !== undefined ? { 'aria-selected': !!selectable } : undefined;
  return (
    <div
      ref={domRef}
      role="treeitem"
      aria-expanded={isLeaf ? undefined : expanded}
      className={clsx(className, `${context.prefixCls}-treenode`, treeClassNames?.item, {
        [`${context.prefixCls}-treenode-disabled`]: isDisabled,
        [`${context.prefixCls}-treenode-switcher-${expanded ? 'open' : 'close'}`]: !isLeaf,
        [`${context.prefixCls}-treenode-checkbox-checked`]: checked,
        [`${context.prefixCls}-treenode-checkbox-indeterminate`]: halfChecked,
        [`${context.prefixCls}-treenode-selected`]: selected,
        [`${context.prefixCls}-treenode-loading`]: loading,
        [`${context.prefixCls}-treenode-active`]: active,
        [`${context.prefixCls}-treenode-leaf-last`]: isEndNode,
        [`${context.prefixCls}-treenode-draggable`]: isDraggable,
        dragging,
        'drop-target': context.dropTargetKey === eventKey,
        'drop-container': context.dropContainerKey === eventKey,
        'drag-over': !isDisabled && dragOver,
        'drag-over-gap-top': !isDisabled && dragOverGapTop,
        'drag-over-gap-bottom': !isDisabled && dragOverGapBottom,
        'filter-node': context.filterTreeNode?.(convertNodePropsToEventData(props)),
        [`${context.prefixCls}-treenode-leaf`]: memoizedIsLeaf,
      })}
      style={{ ...style, ...styles?.item }}
      // Draggable config
      draggable={draggableWithoutDisabled}
      onDragStart={draggableWithoutDisabled ? onDragStart : undefined}
      // Drop config
      onDragEnter={isDraggable ? onDragEnter : undefined}
      onDragOver={isDraggable ? onDragOver : undefined}
      onDragLeave={isDraggable ? onDragLeave : undefined}
      onDrop={isDraggable ? onDrop : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      onMouseMove={onMouseMove}
      {...ariaSelected}
      {...dataOrAriaAttributeProps}
    >
      <Indent prefixCls={context.prefixCls} level={level} isStart={isStart} isEnd={isEnd} />
      {dragHandlerNode}
      {renderSwitcher()}
      {checkboxNode}
      {selectorNode}
    </div>
  );
};

(TreeNode as any).isTreeNode = 1;

if (process.env.NODE_ENV !== 'production') {
  TreeNode.displayName = 'TreeNode';
}

export default TreeNode;
