// TODO: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/treeview/treeview-2/treeview-2a.html
// Fully accessibility support

import * as React from 'react';
import PropTypes from 'prop-types';
import warning from 'rc-util/lib/warning';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { TreeContext } from './contextTypes';
import {
  getDataAndAria,
  getDragNodesKeys,
  parseCheckedKeys,
  conductExpandParent,
  calcSelectedKeys,
  calcDropPosition,
  arrAdd,
  arrDel,
  posToArr,
  conductCheck,
} from './util';
import {
  DataNode,
  IconType,
  Key,
  FlattenNode,
  DataEntity,
  EventDataNode,
  NodeInstance,
} from './interface';
import {
  flattenTreeData,
  convertTreeToData,
  convertDataToEntities,
  warningWithoutKey,
  convertNodePropsToEventData,
} from './utils/treeUtil';
import NodeList, { MOTION_KEY, MotionEntity } from './NodeList';

interface CheckInfo {
  event: 'check';
  node: EventDataNode;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: DataNode[];
  checkedNodesPositions?: { node: DataNode; pos: string }[];
  halfCheckedKeys?: Key[];
}

export interface TreeProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  focusable?: boolean;
  tabIndex?: number;
  children?: React.ReactNode;
  treeData?: DataNode[]; // Generate treeNode by children
  showLine?: boolean;
  showIcon?: boolean;
  icon?: IconType;
  selectable?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean | React.ReactNode;
  checkStrictly?: boolean;
  draggable?: boolean;
  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  checkedKeys?: (Key)[] | { checked: (Key)[]; halfChecked: Key[] };
  defaultSelectedKeys?: Key[];
  selectedKeys?: Key[];
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void;
  onDoubleClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void;
  onExpand?: (
    expandedKeys: Key[],
    info: {
      node: EventDataNode;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => void;
  onCheck?: (checked: { checked: Key[]; halfChecked: Key[] } | Key[], info: CheckInfo) => void;
  onSelect?: (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => void;
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: 'load';
      node: EventDataNode;
    },
  ) => void;
  loadData?: (treeNode: EventDataNode) => Promise<void>;
  loadedKeys?: Key[];
  onMouseEnter?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onMouseLeave?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onRightClick?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDragStart?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDragEnter?: (info: {
    event: React.MouseEvent;
    node: EventDataNode;
    expandedKeys: Key[];
  }) => void;
  onDragOver?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDragLeave?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDragEnd?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDrop?: (info: {
    event: React.MouseEvent;
    node: EventDataNode;
    dragNode: EventDataNode;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => void;
  filterTreeNode?: (treeNode: EventDataNode) => boolean;
  motion?: any;
  switcherIcon?: IconType;

  // Virtual List
  height?: number;
  itemHeight?: number;
}

interface TreeState {
  keyEntities: Record<Key, DataEntity>;

  selectedKeys: Key[];
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
  loadedKeys: Key[];
  loadingKeys: Key[];
  expandedKeys: Key[];

  dragging: boolean;
  dragNodesKeys: Key[];
  dragOverNodeKey: Key;
  dropPosition: number;

  treeData: DataNode[];
  flattenNodes: FlattenNode[];

  prevProps: TreeProps;
  focused: boolean;
}

class Tree extends React.Component<TreeProps, TreeState> {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.any,
    treeData: PropTypes.array, // Generate treeNode by children
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    defaultExpandParent: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
      PropTypes.object,
    ]),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    onLoad: PropTypes.func,
    loadData: PropTypes.func,
    loadedKeys: PropTypes.arrayOf(PropTypes.string),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onRightClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    filterTreeNode: PropTypes.func,
    motion: PropTypes.object,
    switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
  };

  delayedDragEnterLogic: Record<Key, number>;

  state: TreeState = {
    keyEntities: {},

    selectedKeys: [],
    checkedKeys: [],
    halfCheckedKeys: [],
    loadedKeys: [],
    loadingKeys: [],
    expandedKeys: [],

    dragging: false,
    dragNodesKeys: [],
    dragOverNodeKey: null,
    dropPosition: null,

    treeData: [],
    flattenNodes: [],

    focused: false,

    prevProps: null,
  };

  dragNode: NodeInstance;

  static getDerivedStateFromProps(props: TreeProps, prevState: TreeState) {
    const { prevProps } = prevState;
    const newState: Partial<TreeState> = {
      prevProps: props,
    };

    function needSync(name: string) {
      return (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name]);
    }

    // ================== Tree Node ==================
    let treeData: DataNode[];

    // Check if `treeData` or `children` changed and save into the state.
    if (needSync('treeData')) {
      ({ treeData } = props);
    } else if (needSync('children')) {
      warning(false, '`children` of Tree is deprecated. Please use `treeData` instead.');
      treeData = convertTreeToData(props.children);
    }

    // Save flatten nodes info and convert `treeData` into keyEntities
    if (treeData) {
      newState.treeData = treeData;
      const entitiesMap = convertDataToEntities(treeData);
      newState.keyEntities = {
        [MOTION_KEY]: MotionEntity,
        ...entitiesMap.keyEntities,
      };

      // Warning if treeNode not provide key
      if (process.env.NODE_ENV !== 'production') {
        warningWithoutKey(treeData);
      }
    }

    const keyEntities = newState.keyEntities || prevState.keyEntities;

    // ================ expandedKeys =================
    if (needSync('expandedKeys') || (prevProps && needSync('autoExpandParent'))) {
      newState.expandedKeys =
        props.autoExpandParent || (!prevProps && props.defaultExpandParent)
          ? conductExpandParent(props.expandedKeys, keyEntities)
          : props.expandedKeys;
    } else if (!prevProps && props.defaultExpandAll) {
      const cloneKeyEntities = { ...keyEntities };
      delete cloneKeyEntities[MOTION_KEY];
      newState.expandedKeys = Object.keys(cloneKeyEntities).map(key => cloneKeyEntities[key].key);
    } else if (!prevProps && props.defaultExpandedKeys) {
      newState.expandedKeys =
        props.autoExpandParent || props.defaultExpandParent
          ? conductExpandParent(props.defaultExpandedKeys, keyEntities)
          : props.defaultExpandedKeys;
    }

    // ================ flattenNodes =================
    if (treeData || newState.expandedKeys) {
      const flattenNodes: FlattenNode[] = flattenTreeData(
        treeData || prevState.treeData,
        newState.expandedKeys || prevState.expandedKeys,
      );
      newState.flattenNodes = flattenNodes;
    }

    // ================ selectedKeys =================
    if (props.selectable) {
      if (needSync('selectedKeys')) {
        newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props);
      } else if (!prevProps && props.defaultSelectedKeys) {
        newState.selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props);
      }
    }

    // ================= checkedKeys =================
    if (props.checkable) {
      let checkedKeyEntity;

      if (needSync('checkedKeys')) {
        checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {};
      } else if (!prevProps && props.defaultCheckedKeys) {
        checkedKeyEntity = parseCheckedKeys(props.defaultCheckedKeys) || {};
      } else if (treeData) {
        // If `treeData` changed, we also need check it
        checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {
          checkedKeys: prevState.checkedKeys,
          halfCheckedKeys: prevState.halfCheckedKeys,
        };
      }

      if (checkedKeyEntity) {
        let { checkedKeys = [], halfCheckedKeys = [] } = checkedKeyEntity;

        if (!props.checkStrictly) {
          const conductKeys = conductCheck(checkedKeys, true, keyEntities);
          ({ checkedKeys, halfCheckedKeys } = conductKeys);
        }

        newState.checkedKeys = checkedKeys;
        newState.halfCheckedKeys = halfCheckedKeys;
      }
    }
    // ================= loadedKeys ==================
    if (needSync('loadedKeys')) {
      newState.loadedKeys = props.loadedKeys;
    }

    return newState;
  }

  onNodeDragStart = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { expandedKeys, keyEntities } = this.state;
    const { onDragStart } = this.props;
    const { eventKey } = node.props;

    this.dragNode = node;

    this.setState({
      dragging: true,
      dragNodesKeys: getDragNodesKeys(eventKey, keyEntities),
      expandedKeys: arrDel(expandedKeys, eventKey),
    });

    if (onDragStart) {
      onDragStart({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  /**
   * [Legacy] Select handler is less small than node,
   * so that this will trigger when drag enter node or select handler.
   * This is a little tricky if customize css without padding.
   * Better for use mouse move event to refresh drag state.
   * But let's just keep it to avoid event trigger logic change.
   */
  onNodeDragEnter = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { expandedKeys, keyEntities } = this.state;
    const { onDragEnter } = this.props;
    const { pos, eventKey } = node.props;

    if (!this.dragNode) return;

    const dropPosition = calcDropPosition(event, node);

    // Skip if drag node is self
    if (this.dragNode.props.eventKey === eventKey && dropPosition === 0) {
      this.setState({
        dragOverNodeKey: '',
        dropPosition: null,
      });
      return;
    }

    // Ref: https://github.com/react-component/tree/issues/132
    // Add timeout to let onDragLevel fire before onDragEnter,
    // so that we can clean drag props for onDragLeave node.
    // Macro task for this:
    // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
    setTimeout(() => {
      // Update drag over node
      this.setState({
        dragOverNodeKey: eventKey,
        dropPosition,
      });

      // Side effect for delay drag
      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {};
      }
      Object.keys(this.delayedDragEnterLogic).forEach(key => {
        clearTimeout(this.delayedDragEnterLogic[key]);
      });
      this.delayedDragEnterLogic[pos] = window.setTimeout(() => {
        if (!this.state.dragging) return;

        let newExpandedKeys = [...expandedKeys];
        const entity = keyEntities[eventKey];

        if (entity && (entity.children || []).length) {
          newExpandedKeys = arrAdd(expandedKeys, eventKey);
        }

        if (!('expandedKeys' in this.props)) {
          this.setState({
            expandedKeys: newExpandedKeys,
          });
        }

        if (onDragEnter) {
          onDragEnter({
            event,
            node: convertNodePropsToEventData(node.props),
            expandedKeys: newExpandedKeys,
          });
        }
      }, 400);
    }, 0);
  };

  onNodeDragOver = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { onDragOver } = this.props;
    const { eventKey } = node.props;

    // Update drag position
    if (this.dragNode && eventKey === this.state.dragOverNodeKey) {
      const dropPosition = calcDropPosition(event, node);

      if (dropPosition === this.state.dropPosition) return;

      this.setState({
        dropPosition,
      });
    }

    if (onDragOver) {
      onDragOver({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  onNodeDragLeave = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { onDragLeave } = this.props;

    this.setState({
      dragOverNodeKey: '',
    });

    if (onDragLeave) {
      onDragLeave({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  onNodeDragEnd = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { onDragEnd } = this.props;
    this.setState({
      dragOverNodeKey: '',
    });
    this.cleanDragState();

    if (onDragEnd) {
      onDragEnd({ event, node: convertNodePropsToEventData(node.props) });
    }

    this.dragNode = null;
  };

  onNodeDrop = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { dragNodesKeys = [], dropPosition } = this.state;
    const { onDrop } = this.props;
    const { eventKey, pos } = node.props;

    this.setState({
      dragOverNodeKey: '',
    });
    this.cleanDragState();

    if (dragNodesKeys.indexOf(eventKey) !== -1) {
      warning(false, "Can not drop to dragNode(include it's children node)");
      return;
    }

    const posArr = posToArr(pos);

    const dropResult = {
      event,
      node: convertNodePropsToEventData(node.props),
      dragNode: convertNodePropsToEventData(this.dragNode.props),
      dragNodesKeys: dragNodesKeys.slice(),
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
      dropToGap: false,
    };

    if (dropPosition !== 0) {
      dropResult.dropToGap = true;
    }

    if (onDrop) {
      onDrop(dropResult);
    }

    this.dragNode = null;
  };

  cleanDragState = () => {
    const { dragging } = this.state;
    if (dragging) {
      this.setState({
        dragging: false,
      });
    }
  };

  onNodeClick = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e, treeNode);
    }
  };

  onNodeDoubleClick = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    const { onDoubleClick } = this.props;
    if (onDoubleClick) {
      onDoubleClick(e, treeNode);
    }
  };

  onNodeSelect = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    let { selectedKeys } = this.state;
    const { keyEntities } = this.state;
    const { onSelect, multiple } = this.props;
    const { selected, key } = treeNode;
    const targetSelected = !selected;

    // Update selected keys
    if (!targetSelected) {
      selectedKeys = arrDel(selectedKeys, key);
    } else if (!multiple) {
      selectedKeys = [key];
    } else {
      selectedKeys = arrAdd(selectedKeys, key);
    }

    // [Legacy] Not found related usage in doc or upper libs
    const selectedNodes = selectedKeys
      .map(selectedKey => {
        const entity = keyEntities[selectedKey];
        if (!entity) return null;

        return entity.node;
      })
      .filter(node => node);

    this.setUncontrolledState({ selectedKeys });

    if (onSelect) {
      onSelect(selectedKeys, {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
        nativeEvent: e.nativeEvent,
      });
    }
  };

  onNodeCheck = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode,
    checked: boolean,
  ) => {
    const {
      keyEntities,
      checkedKeys: oriCheckedKeys,
      halfCheckedKeys: oriHalfCheckedKeys,
    } = this.state;
    const { checkStrictly, onCheck } = this.props;
    const { key } = treeNode;

    // Prepare trigger arguments
    let checkedObj;
    const eventObj: Partial<CheckInfo> = {
      event: 'check',
      node: treeNode,
      checked,
      nativeEvent: e.nativeEvent,
    };

    if (checkStrictly) {
      const checkedKeys = checked ? arrAdd(oriCheckedKeys, key) : arrDel(oriCheckedKeys, key);
      const halfCheckedKeys = arrDel(oriHalfCheckedKeys, key);
      checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys };

      eventObj.checkedNodes = checkedKeys
        .map(checkedKey => keyEntities[checkedKey])
        .filter(entity => entity)
        .map(entity => entity.node);

      this.setUncontrolledState({ checkedKeys });
    } else {
      const { checkedKeys, halfCheckedKeys } = conductCheck([key], checked, keyEntities, {
        checkedKeys: oriCheckedKeys,
        halfCheckedKeys: oriHalfCheckedKeys,
      });

      checkedObj = checkedKeys;

      // [Legacy] This is used for `rc-tree-select`
      eventObj.checkedNodes = [];
      eventObj.checkedNodesPositions = [];
      eventObj.halfCheckedKeys = halfCheckedKeys;

      checkedKeys.forEach(checkedKey => {
        const entity = keyEntities[checkedKey];
        if (!entity) return;

        const { node, pos } = entity;

        eventObj.checkedNodes.push(node);
        eventObj.checkedNodesPositions.push({ node, pos });
      });

      this.setUncontrolledState({
        checkedKeys,
        halfCheckedKeys,
      });
    }

    if (onCheck) {
      onCheck(checkedObj, eventObj as CheckInfo);
    }
  };

  onNodeLoad = (treeNode: EventDataNode) =>
    new Promise(resolve => {
      // We need to get the latest state of loading/loaded keys
      this.setState(({ loadedKeys = [], loadingKeys = [] }): any => {
        const { loadData, onLoad } = this.props;
        const { key } = treeNode;

        if (!loadData || loadedKeys.indexOf(key) !== -1 || loadingKeys.indexOf(key) !== -1) {
          // react 15 will warn if return null
          return {};
        }

        // Process load data
        const promise = loadData(treeNode);
        promise.then(() => {
          const { loadedKeys: currentLoadedKeys, loadingKeys: currentLoadingKeys } = this.state;
          const newLoadedKeys = arrAdd(currentLoadedKeys, key);
          const newLoadingKeys = arrDel(currentLoadingKeys, key);

          // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
          // https://github.com/ant-design/ant-design/issues/12464
          if (onLoad) {
            onLoad(newLoadedKeys, {
              event: 'load',
              node: treeNode,
            });
          }

          this.setUncontrolledState({
            loadedKeys: newLoadedKeys,
          });
          this.setState({
            loadingKeys: newLoadingKeys,
          });

          resolve();
        });

        return {
          loadingKeys: arrAdd(loadingKeys, key),
        };
      });
    });

  onNodeExpand = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    let { expandedKeys } = this.state;
    const { treeData } = this.state;
    const { onExpand, loadData } = this.props;
    const { key, expanded } = treeNode;

    // Update selected keys
    const index = expandedKeys.indexOf(key);
    const targetExpanded = !expanded;

    warning(
      (expanded && index !== -1) || (!expanded && index === -1),
      'Expand state not sync with index check',
    );

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, key);
    } else {
      expandedKeys = arrDel(expandedKeys, key);
    }

    const flattenNodes: FlattenNode[] = flattenTreeData(treeData, expandedKeys);
    this.setUncontrolledState({ expandedKeys, flattenNodes });

    if (onExpand) {
      onExpand(expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e.nativeEvent,
      });
    }

    // Async Load data
    if (targetExpanded && loadData) {
      const loadPromise = this.onNodeLoad(treeNode);
      return loadPromise
        ? loadPromise.then(() => {
            // [Legacy] Refresh logic
            const newFlattenTreeData = flattenTreeData(this.state.treeData, expandedKeys);
            this.setUncontrolledState({ flattenNodes: newFlattenTreeData });
          })
        : null;
    }

    return null;
  };

  onNodeMouseEnter = (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, node });
    }
  };

  onNodeMouseLeave = (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave({ event, node });
    }
  };

  onNodeContextMenu = (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => {
    const { onRightClick } = this.props;
    if (onRightClick) {
      event.preventDefault();
      onRightClick({ event, node });
    }
  };

  onFocus: React.FocusEventHandler<HTMLDivElement> = (...args) => {
    const { onFocus } = this.props;
    this.setState({ focused: true });
    if (onFocus) {
      onFocus(...args);
    }
  };

  onBlur: React.FocusEventHandler<HTMLDivElement> = (...args) => {
    const { onBlur } = this.props;
    this.setState({ focused: false });
    if (onBlur) {
      onBlur(...args);
    }
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = state => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }
  };

  render() {
    const {
      focused,
      flattenNodes,
      keyEntities,
      expandedKeys,
      selectedKeys,
      checkedKeys,
      loadedKeys,
      loadingKeys,
      halfCheckedKeys,
      dragging,
      dragOverNodeKey,
      dropPosition,
    } = this.state;
    const {
      prefixCls,
      className,
      style,
      showLine,
      focusable,
      tabIndex = 0,
      selectable,
      showIcon,
      icon,
      switcherIcon,
      draggable,
      checkable,
      checkStrictly,
      disabled,
      motion,
      loadData,
      filterTreeNode,
      height,
      itemHeight,
      onKeyDown,
    } = this.props;
    const domProps: React.HTMLAttributes<HTMLDivElement> = getDataAndAria(this.props);

    return (
      <TreeContext.Provider
        value={{
          prefixCls,
          selectable,
          showIcon,
          icon,
          switcherIcon,
          draggable,
          checkable,
          checkStrictly,
          disabled,
          keyEntities,

          loadData,
          filterTreeNode,

          onNodeClick: this.onNodeClick,
          onNodeDoubleClick: this.onNodeDoubleClick,
          onNodeExpand: this.onNodeExpand,
          onNodeSelect: this.onNodeSelect,
          onNodeCheck: this.onNodeCheck,
          onNodeLoad: this.onNodeLoad,
          onNodeMouseEnter: this.onNodeMouseEnter,
          onNodeMouseLeave: this.onNodeMouseLeave,
          onNodeContextMenu: this.onNodeContextMenu,
          onNodeDragStart: this.onNodeDragStart,
          onNodeDragEnter: this.onNodeDragEnter,
          onNodeDragOver: this.onNodeDragOver,
          onNodeDragLeave: this.onNodeDragLeave,
          onNodeDragEnd: this.onNodeDragEnd,
          onNodeDrop: this.onNodeDrop,
        }}
      >
        <NodeList
          className={classNames(prefixCls, className, {
            [`${prefixCls}-show-line`]: showLine,
            [`${prefixCls}-focused`]: focused,
          })}
          prefixCls={prefixCls}
          style={style}
          data={flattenNodes}
          selectable={selectable}
          checkable={!!checkable}
          keyEntities={keyEntities}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          checkedKeys={checkedKeys}
          loadedKeys={loadedKeys}
          loadingKeys={loadingKeys}
          halfCheckedKeys={halfCheckedKeys}
          dragOverNodeKey={dragOverNodeKey}
          dropPosition={dropPosition}
          motion={motion}
          dragging={dragging}
          height={height}
          itemHeight={itemHeight}
          focusable={focusable}
          focused={focused}
          tabIndex={tabIndex}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={onKeyDown}
          {...domProps}
        />
      </TreeContext.Provider>
    );
  }
}

polyfill(Tree);

export default Tree;
