// TODO: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/treeview/treeview-2/treeview-2a.html
// Fully accessibility support

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import warning from 'rc-util/lib/warning';
import classNames from 'classnames';

import {
  TreeContext,
  NodeMouseEventHandler,
  NodeDragEventHandler,
  NodeDragEventParams,
  NodeMouseEventParams,
} from './contextTypes';
import {
  getDataAndAria,
  getDragChildrenKeys,
  parseCheckedKeys,
  conductExpandParent,
  calcSelectedKeys,
  calcDropPosition,
  arrAdd,
  arrDel,
  posToArr,
} from './util';
import {
  DataNode,
  IconType,
  Key,
  FlattenNode,
  DataEntity,
  EventDataNode,
  NodeInstance,
  ScrollTo,
} from './interface';
import {
  flattenTreeData,
  convertTreeToData,
  convertDataToEntities,
  warningWithoutKey,
  convertNodePropsToEventData,
  getTreeNodeProps,
} from './utils/treeUtil';
import NodeList, { MOTION_KEY, MotionEntity, NodeListRef } from './NodeList';
import TreeNode from './TreeNode';
import { conductCheck } from './utils/conductUtil';

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
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultSelectedKeys?: Key[];
  selectedKeys?: Key[];
  indent?: number;
  titleRender?: (node: DataNode) => React.ReactNode;
  dropIndicatorRender?: (dropPosition: -1 | 0 | 1, levelAscended: number) => React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onClick?: NodeMouseEventHandler;
  onDoubleClick?: NodeMouseEventHandler;
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
  onMouseEnter?: (info: NodeMouseEventParams) => void;
  onMouseLeave?: (info: NodeMouseEventParams) => void;
  onRightClick?: (info: { event: React.MouseEvent; node: EventDataNode }) => void;
  onDragStart?: (info: NodeDragEventParams) => void;
  onDragEnter?: (info: NodeDragEventParams & { expandedKeys: Key[] }) => void;
  onDragOver?: (info: NodeDragEventParams) => void;
  onDragLeave?: (info: NodeDragEventParams) => void;
  onDragEnd?: (info: NodeDragEventParams) => void;
  onDrop?: (
    info: NodeDragEventParams & {
      dragNode: EventDataNode;
      dragNodesKeys: Key[];
      dropPosition: number;
      dropToGap: boolean;
    },
  ) => void;
  /**
   * Used for `rc-tree-select` only.
   * Do not use in your production code directly since this will be refactor.
   */
  onActiveChange?: (key: Key) => void;
  filterTreeNode?: (treeNode: EventDataNode) => boolean;
  motion?: any;
  switcherIcon?: IconType;

  // Virtual List
  height?: number;
  itemHeight?: number;
  virtual?: boolean;
}

const DEFAULT_INDENT = 24;
const DEFAULT_DROP_INDICATOR_RENDER = function (dropPosition: -1 | 0 | 1, elevatedDropLevel: number, indent: number) {
  const style: React.CSSProperties = {
    position: 'absolute',
  };
  if (dropPosition === -1) {
    style.top = 0;
    style.height = 2;
    style.right = 0;
    style.backgroundColor = 'red';
    style.left = -elevatedDropLevel * indent;
  } else if (dropPosition === 1) {
    style.bottom = 0;
    style.height = 2;
    style.right = 0;
    style.backgroundColor = 'red';
    style.left = -elevatedDropLevel * indent;
  } else {
    style.bottom = 0;
    style.height = 2;
    style.right = 0;
    style.backgroundColor = 'red';
    style.left = indent;
  }
  return <div style={style} />
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
  dragChildrenKeys: Key[];
  dragOverNodeKey: Key;
  
  dropPosition: -1 | 0 | 1 | null;
  abstractDropNodeParentEntity: DataEntity | null;
  abstractDropNodeEntity: DataEntity | null;
  elevatedDropLevel: number | null;

  treeData: DataNode[];
  flattenNodes: FlattenNode[];

  focused: boolean;
  activeKey: Key;

  // Record if list is changing
  listChanging: boolean;

  prevProps: TreeProps;
}

class Tree extends React.Component<TreeProps, TreeState> {
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

  static TreeNode = TreeNode;

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
    dragChildrenKeys: [],
    dragOverNodeKey: null,
    
    dropPosition: null, // inside 0, top -1, bottom 1
    abstractDropNodeParentEntity: null,
    abstractDropNodeEntity: null,
    elevatedDropLevel: null,

    treeData: [],
    flattenNodes: [],

    focused: false,
    activeKey: null,

    listChanging: false,

    prevProps: null,
  };

  // since dragenter is triggered before dragleave (as DOM is)
  // it is required for record pending state to check whether the mouse enter another node
  // or just leave the drag area
  pendingDragOverNodeKey = null;

  dragNode: NodeInstance;

  listRef = React.createRef<NodeListRef>();

  nodeInstances: Map<Key, NodeInstance> = new Map();

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

    if (!newState.expandedKeys) {
      delete newState.expandedKeys;
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


  onNodeDragStart: NodeDragEventHandler = (event, node) => {
    const { expandedKeys, keyEntities } = this.state;
    const { onDragStart } = this.props;
    const { eventKey } = node.props;

    this.dragNode = node;

    const newExpandedKeys = arrDel(expandedKeys, eventKey);

    this.setState({
      dragging: true,
      dragChildrenKeys: getDragChildrenKeys(eventKey, keyEntities),
    });

    this.setExpandedKeys(newExpandedKeys);

    window.addEventListener('dragend', this.onWindowDragEnd);

    if (onDragStart) {
      onDragStart({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  /**
   * [Legacy] Select handler is smaller than node,
   * so that this will trigger when drag enter node or select handler.
   * This is a little tricky if customize css without padding.
   * Better for use mouse move event to refresh drag state.
   * But let's just keep it to avoid event trigger logic change.
   */
  onNodeDragEnter = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { expandedKeys, keyEntities, dragChildrenKeys } = this.state;
    const { onDragEnter, indent = DEFAULT_INDENT } = this.props;
    const { pos, eventKey } = node.props;

    // don't allow drop inside its children
    if (!this.dragNode || dragChildrenKeys.indexOf(eventKey) !== -1) return;

    const [dropPosition, elevatedDropLevel, abstractDropNodeParentEntity, abstractDropNodeEntity] = calcDropPosition(event, node, indent);

    // Update drag over node
    this.setState({
      dragOverNodeKey: eventKey,
    });

    // the key may be cleared by onDragLeave
    this.pendingDragOverNodeKey = eventKey;

    // Side effect for delay drag
    if (!this.delayedDragEnterLogic) {
      this.delayedDragEnterLogic = {};
    }
    Object.keys(this.delayedDragEnterLogic).forEach(key => {
      clearTimeout(this.delayedDragEnterLogic[key]);
    });

    // Skip if drag node is self
    if (this.dragNode.props.eventKey === eventKey && elevatedDropLevel === 0) {
      return;
    }

    this.setState({
      dropPosition,
      elevatedDropLevel,
      abstractDropNodeParentEntity,
      abstractDropNodeEntity,
    })

    event.persist();

    this.delayedDragEnterLogic[pos] = window.setTimeout(() => {
      if (!this.state.dragging) return;

      let newExpandedKeys = [...expandedKeys];
      const entity = keyEntities[eventKey];

      if (entity && (entity.children || []).length) {
        newExpandedKeys = arrAdd(expandedKeys, eventKey);
      }

      if (!('expandedKeys' in this.props)) {
        this.setExpandedKeys(newExpandedKeys);
      }

      if (onDragEnter) {
        onDragEnter({
          event,
          node: convertNodePropsToEventData(node.props),
          expandedKeys: newExpandedKeys,
        });
      }
    }, 400);
  };

  onNodeDragOver = (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => {
    const { dragChildrenKeys } = this.state;
    const { onDragOver, indent = DEFAULT_INDENT } = this.props;
    const { eventKey } = node.props;

    if (dragChildrenKeys.indexOf(eventKey) !== -1) {
      // don't allow drop inside its children
      return;
    }

    // Update drag position
    if (this.dragNode && eventKey === this.state.dragOverNodeKey) {

      const [dropPosition, elevatedDropLevel, abstractDropNodeParentEntity, abstractDropNodeEntity] = calcDropPosition(event, node, indent);
      if (this.dragNode.props.eventKey === eventKey && elevatedDropLevel === 0) {
        this.setState({
          dropPosition: null,
          elevatedDropLevel: 0,
          abstractDropNodeParentEntity: null,
          abstractDropNodeEntity: null
        });
        return;
      }

      if (
        dropPosition === this.state.dropPosition &&
        elevatedDropLevel === this.state.elevatedDropLevel &&
        abstractDropNodeParentEntity === this.state.abstractDropNodeParentEntity &&
        abstractDropNodeEntity === this.state.abstractDropNodeEntity
      ) return;
      
      this.setState({
        dropPosition,
        elevatedDropLevel,
        abstractDropNodeParentEntity,
        abstractDropNodeEntity
      });
    }

    if (onDragOver) {
      onDragOver({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  onNodeDragLeave: NodeDragEventHandler = (event, node) => {
    const { onDragLeave } = this.props;
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      if (!this.pendingDragOverNodeKey) {
        // Actually leave
        // do not clean drag state, clean drag state only on window dragend
        this.setState({
          dragOverNodeKey: '',
        });
      } else {
        this.pendingDragOverNodeKey = '';
      }
    }

    if (onDragLeave) {
      onDragLeave({ event, node: convertNodePropsToEventData(node.props) });
    }
  };

  // since stopPropagation() is called in treeNode
  // if onWindowDrag is called, whice means state is keeped, drag state should be cleared
  onWindowDragEnd = (event) => {
    this.onNodeDragEnd(event, null, true);
    window.removeEventListener('dragend', this.onWindowDragEnd);
  }

  // since stopPropagation() is called in treeNode
  // if onWindowDrop is called, it should apply drop too
  // onWindowDrop fires before onWindowDragEnd
  onWindowDrop = (event) => {
    this.onNodeDrop(event, null, true);
    window.removeEventListener('drop', this.onWindowDrop);
  }

  // if onNodeDragEnd is called, onWindowDragEnd won't be called since stopPropagation() is called
  onNodeDragEnd: NodeDragEventHandler = (event, node, fromWindow = false) => {
    const { onDragEnd } = this.props;
    this.setState({
      dragOverNodeKey: '',
    });

    this.cleanDragState();

    if (onDragEnd && !fromWindow) {
      onDragEnd({ event, node: convertNodePropsToEventData(node.props) });
    }

    this.dragNode = null;
  };

  onNodeDrop = (event: React.MouseEvent<HTMLDivElement>, node, fromWindow: boolean = false) => {
    const { dragChildrenKeys = [], dropPosition, abstractDropNodeEntity } = this.state;
    const { onDrop } = this.props;

    this.setState({
      dragOverNodeKey: '',
    });
    this.cleanDragState();

    if (!abstractDropNodeEntity) return

    const { key: targetKey, pos } = abstractDropNodeEntity

    const abstractDropNodeKey: Key = targetKey
    const abstractDropNode = this.nodeInstances.get(abstractDropNodeKey) ?? null

    if (abstractDropNode === null) {
      warning(false, "Can't find dropNode")
    }

    const { eventKey } = abstractDropNode.props;

    if (dragChildrenKeys.indexOf(eventKey) !== -1) {
      warning(false, "Can not drop to dragNode's children node");
      return;
    }

    const posArr = posToArr(pos);

    const dropResult = {
      event,
      node: convertNodePropsToEventData(abstractDropNode.props),
      dragNode: this.dragNode ? convertNodePropsToEventData(this.dragNode.props) : null,
      dragNodesKeys: [this.dragNode.props.eventKey].concat(dragChildrenKeys),
      dropToGap: dropPosition !== 0,
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
    };

    if (onDrop && !fromWindow) {
      onDrop(dropResult);
    }

    this.dragNode = null;
  };

  cleanDragState = () => {
    const { dragging } = this.state;
    if (dragging) {
      this.setState({
        dragging: false,
        dropPosition: null,
        abstractDropNodeParentEntity: null,
        abstractDropNodeEntity: null,
        elevatedDropLevel: null,
      });
    }
  };

  onNodeClick: NodeMouseEventHandler = (e, treeNode) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e, treeNode);
    }
  };

  onNodeDoubleClick: NodeMouseEventHandler = (e, treeNode) => {
    const { onDoubleClick } = this.props;
    if (onDoubleClick) {
      onDoubleClick(e, treeNode);
    }
  };

  onNodeSelect: NodeMouseEventHandler = (e, treeNode) => {
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
    e: React.MouseEvent<HTMLSpanElement>,
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
      // Always fill first
      let { checkedKeys, halfCheckedKeys } = conductCheck(
        [...oriCheckedKeys, key],
        true,
        keyEntities,
      );

      // If remove, we do it again to correction
      if (!checked) {
        const keySet = new Set(checkedKeys);
        keySet.delete(key);
        ({ checkedKeys, halfCheckedKeys } = conductCheck(
          Array.from(keySet),
          { checked: false, halfCheckedKeys },
          keyEntities,
        ));
      }

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

      this.setUncontrolledState(
        {
          checkedKeys,
        },
        false,
        {
          halfCheckedKeys,
        },
      );
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

  onNodeMouseEnter: NodeMouseEventHandler = (event, node) => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, node });
    }
  };

  onNodeMouseLeave: NodeMouseEventHandler = (event, node) => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave({ event, node });
    }
  };

  onNodeContextMenu: NodeMouseEventHandler = (event, node) => {
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
    this.onActiveChange(null);

    if (onBlur) {
      onBlur(...args);
    }
  };

  getTreeNodeRequiredProps = () => {
    const {
      expandedKeys,
      selectedKeys,
      loadedKeys,
      loadingKeys,
      checkedKeys,
      halfCheckedKeys,
      dragOverNodeKey,
      dropPosition,
      keyEntities,
    } = this.state;
    return {
      expandedKeys: expandedKeys || [],
      selectedKeys: selectedKeys || [],
      loadedKeys: loadedKeys || [],
      loadingKeys: loadingKeys || [],
      checkedKeys: checkedKeys || [],
      halfCheckedKeys: halfCheckedKeys || [],
      dragOverNodeKey,
      dropPosition,
      keyEntities,
    };
  };

  // =========================== Expanded ===========================
  /** Set uncontrolled `expandedKeys`. This will also auto update `flattenNodes`. */
  setExpandedKeys = (expandedKeys: Key[]) => {
    const { treeData } = this.state;

    const flattenNodes: FlattenNode[] = flattenTreeData(treeData, expandedKeys);
    this.setUncontrolledState(
      {
        expandedKeys,
        flattenNodes,
      },
      true,
    );
  };

  onNodeExpand = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    let { expandedKeys } = this.state;
    const { listChanging } = this.state;
    const { onExpand, loadData } = this.props;
    const { key, expanded } = treeNode;

    // Do nothing when motion is in progress
    if (listChanging) {
      return;
    }

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

    this.setExpandedKeys(expandedKeys);

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
      if (loadPromise) {
        loadPromise.then(() => {
          // [Legacy] Refresh logic
          const newFlattenTreeData = flattenTreeData(this.state.treeData, expandedKeys);
          this.setUncontrolledState({ flattenNodes: newFlattenTreeData });
        });
      }
    }
  };

  onListChangeStart = () => {
    this.setUncontrolledState({
      listChanging: true,
    });
  };

  onListChangeEnd = () => {
    setTimeout(() => {
      this.setUncontrolledState({
        listChanging: false,
      });
    });
  };

  // =========================== Keyboard ===========================
  onActiveChange = (newActiveKey: Key) => {
    const { activeKey } = this.state;
    const { onActiveChange } = this.props;

    if (activeKey === newActiveKey) {
      return;
    }

    this.setState({ activeKey: newActiveKey });
    if (newActiveKey !== null) {
      this.scrollTo({ key: newActiveKey });
    }

    if (onActiveChange) {
      onActiveChange(newActiveKey);
    }
  };

  getActiveItem = () => {
    const { activeKey, flattenNodes } = this.state;
    if (activeKey === null) {
      return null;
    }

    return flattenNodes.find(({ data: { key } }) => key === activeKey) || null;
  };

  offsetActiveKey = (offset: number) => {
    const { flattenNodes, activeKey } = this.state;

    let index = flattenNodes.findIndex(({ data: { key } }) => key === activeKey);

    // Align with index
    if (index === -1 && offset < 0) {
      index = flattenNodes.length;
    }

    index = (index + offset + flattenNodes.length) % flattenNodes.length;

    const item = flattenNodes[index];
    if (item) {
      const { key } = item.data;
      this.onActiveChange(key);
    } else {
      this.onActiveChange(null);
    }
  };

  onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    const { activeKey, expandedKeys, checkedKeys } = this.state;
    const { onKeyDown, checkable, selectable } = this.props;

    // >>>>>>>>>> Direction
    switch (event.which) {
      case KeyCode.UP: {
        this.offsetActiveKey(-1);
        event.preventDefault();
        break;
      }
      case KeyCode.DOWN: {
        this.offsetActiveKey(1);
        event.preventDefault();
        break;
      }
    }

    // >>>>>>>>>> Expand & Selection
    const activeItem = this.getActiveItem();
    if (activeItem && activeItem.data) {
      const treeNodeRequiredProps = this.getTreeNodeRequiredProps();

      const expandable =
        activeItem.data.isLeaf === false || !!(activeItem.data.children || []).length;
      const eventNode = convertNodePropsToEventData({
        ...getTreeNodeProps(activeKey, treeNodeRequiredProps),
        data: activeItem.data,
        active: true,
      });

      switch (event.which) {
        // >>> Expand
        case KeyCode.LEFT: {
          // Collapse if possible
          if (expandable && expandedKeys.includes(activeKey)) {
            this.onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.parent) {
            this.onActiveChange(activeItem.parent.data.key);
          }
          event.preventDefault();
          break;
        }
        case KeyCode.RIGHT: {
          // Expand if possible
          if (expandable && !expandedKeys.includes(activeKey)) {
            this.onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.children && activeItem.children.length) {
            this.onActiveChange(activeItem.children[0].data.key);
          }
          event.preventDefault();
          break;
        }

        // Selection
        case KeyCode.ENTER:
        case KeyCode.SPACE: {
          if (
            checkable &&
            !eventNode.disabled &&
            eventNode.checkable !== false &&
            !eventNode.disableCheckbox
          ) {
            this.onNodeCheck(
              {} as React.MouseEvent<HTMLDivElement>,
              eventNode,
              !checkedKeys.includes(activeKey),
            );
          } else if (
            !checkable &&
            selectable &&
            !eventNode.disabled &&
            eventNode.selectable !== false
          ) {
            this.onNodeSelect({} as React.MouseEvent<HTMLDivElement>, eventNode);
          }
          break;
        }
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (
    state: Partial<TreeState>,
    atomic: boolean = false,
    forceState: Partial<TreeState> | null = null,
  ) => {
    let needSync = false;
    let allPassed = true;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) {
        allPassed = false;
        return;
      }

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync && (!atomic || allPassed)) {
      this.setState({
        ...newState,
        ...forceState,
      } as TreeState);
    }
  };

  scrollTo: ScrollTo = scroll => {
    this.listRef.current.scrollTo(scroll);
  };

  render() {
    const {
      focused,
      flattenNodes,
      keyEntities,
      dragging,
      activeKey,
      elevatedDropLevel,
      abstractDropNodeParentEntity,
      dropPosition,
    } = this.state;
    const dropContainerKey = abstractDropNodeParentEntity && abstractDropNodeParentEntity.key
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
      virtual,
      titleRender,
      indent = DEFAULT_INDENT,
      dropIndicatorRender = DEFAULT_DROP_INDICATOR_RENDER,
    } = this.props;
    const {
      nodeInstances
    } = this
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
          elevatedDropLevel,
          nodeInstances,
          dropContainerKey,
          dropPosition,
          indent,
          dropIndicatorRender,

          loadData,
          filterTreeNode,

          titleRender,

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
        <div
          className={classNames(prefixCls, className, {
            [`${prefixCls}-show-line`]: showLine,
            [`${prefixCls}-focused`]: focused,
            [`${prefixCls}-active-focused`]: activeKey !== null,
          })}
        >
          <NodeList
            ref={this.listRef}
            prefixCls={prefixCls}
            style={style}
            data={flattenNodes}
            disabled={disabled}
            selectable={selectable}
            checkable={!!checkable}
            motion={motion}
            dragging={dragging}
            height={height}
            itemHeight={itemHeight}
            virtual={virtual}
            focusable={focusable}
            focused={focused}
            tabIndex={tabIndex}
            activeItem={this.getActiveItem()}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            onActiveChange={this.onActiveChange}
            onListChangeStart={this.onListChangeStart}
            onListChangeEnd={this.onListChangeEnd}
            {...this.getTreeNodeRequiredProps()}
            {...domProps}
          />
        </div>
      </TreeContext.Provider>
    );
  }
}

export default Tree;
