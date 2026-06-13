// TODO: Fully accessibility support
// Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview
/* eslint-disable @typescript-eslint/no-use-before-define */

import { clsx } from 'clsx';
import { pickAttrs, warning } from '@rc-component/util';
import * as React from 'react';

import type {
  NodeDragEventHandler,
  NodeDragEventParams,
  NodeMouseEventHandler,
  NodeMouseEventParams,
  TreeContextProps,
} from './contextTypes';
import { TreeContext } from './contextTypes';
import DropIndicator from './DropIndicator';
import type { DropIndicatorProps } from './DropIndicator';
import type {
  BasicDataNode,
  DataNode,
  Direction,
  EventDataNode,
  FieldNames,
  FlattenNode,
  IconType,
  Key,
  KeyEntities,
  SafeKey,
  ScrollTo,
  TreeNodeProps,
} from './interface';
import NodeList, { MOTION_KEY, MotionEntity, type NodeListRef } from './NodeList';
import TreeNode from './TreeNode';
import {
  arrAdd,
  arrDel,
  calcDropPosition,
  calcSelectedKeys,
  conductExpandParent,
  getDragChildrenKeys,
  parseCheckedKeys,
  posToArr,
} from './util';
import { conductCheck } from './utils/conductUtil';
import getEntity from './utils/keyUtil';
import {
  convertDataToEntities,
  convertNodePropsToEventData,
  convertTreeToData,
  fillFieldNames,
  flattenTreeData,
  getTreeNodeProps,
  isLeafNode,
  warningWithoutKey,
} from './utils/treeUtil';

const MAX_RETRY_TIMES = 10;

export interface CheckInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'check';
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: TreeDataType[];
  checkedNodesPositions?: { node: TreeDataType; pos: string }[];
  halfCheckedKeys?: Key[];
}

export interface AllowDropOptions<TreeDataType extends BasicDataNode = DataNode> {
  dragNode: TreeDataType;
  dropNode: TreeDataType;
  dropPosition: -1 | 0 | 1;
}

export type AllowDrop<TreeDataType extends BasicDataNode = DataNode> = (
  options: AllowDropOptions<TreeDataType>,
) => boolean;

export type DraggableFn = (node: DataNode) => boolean;

export type DraggableConfig = {
  icon?: React.ReactNode | false;
  nodeDraggable?: DraggableFn;
};

export type ExpandAction = false | 'click' | 'doubleClick';

export type SemanticName = 'itemIcon' | 'item' | 'itemTitle' | 'itemSwitcher';

export interface TreeProps<TreeDataType extends BasicDataNode = DataNode> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticName, string>>;
  focusable?: boolean;
  activeKey?: Key | null;
  tabIndex?: number;
  children?: React.ReactNode;
  treeData?: TreeDataType[]; // Generate treeNode by children
  fieldNames?: FieldNames;
  showLine?: boolean;
  showIcon?: boolean;
  icon?: IconType;
  selectable?: boolean;
  expandAction?: ExpandAction;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean | React.ReactNode;
  checkStrictly?: boolean;
  draggable?: DraggableFn | boolean | DraggableConfig;
  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultSelectedKeys?: Key[];
  selectedKeys?: Key[];
  allowDrop?: AllowDrop<TreeDataType>;
  titleRender?: (node: TreeDataType) => React.ReactNode;
  dropIndicatorRender?: (props: DropIndicatorProps) => React.ReactNode;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: NodeMouseEventHandler<TreeDataType>;
  onDoubleClick?: NodeMouseEventHandler<TreeDataType>;
  onScroll?: React.UIEventHandler<HTMLElement>;
  onExpand?: (
    expandedKeys: Key[],
    info: {
      node: EventDataNode<TreeDataType>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => void;
  onCheck?: (
    checked: { checked: Key[]; halfChecked: Key[] } | Key[],
    info: CheckInfo<TreeDataType>,
  ) => void;
  onSelect?: (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<TreeDataType>;
      selectedNodes: TreeDataType[];
      nativeEvent: MouseEvent;
    },
  ) => void;
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: 'load';
      node: EventDataNode<TreeDataType>;
    },
  ) => void;
  loadData?: (treeNode: EventDataNode<TreeDataType>) => Promise<any>;
  loadedKeys?: Key[];
  onMouseEnter?: (info: NodeMouseEventParams<TreeDataType>) => void;
  onMouseLeave?: (info: NodeMouseEventParams<TreeDataType>) => void;
  onRightClick?: (info: { event: React.MouseEvent; node: EventDataNode<TreeDataType> }) => void;
  onDragStart?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragEnter?: (info: NodeDragEventParams<TreeDataType> & { expandedKeys: Key[] }) => void;
  onDragOver?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragLeave?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragEnd?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDrop?: (
    info: NodeDragEventParams<TreeDataType> & {
      dragNode: EventDataNode<TreeDataType>;
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
  filterTreeNode?: (treeNode: EventDataNode<TreeDataType>) => boolean;
  motion?: any;
  switcherIcon?: IconType;

  // Virtual List
  height?: number;
  itemHeight?: number;
  scrollWidth?: number;
  itemScrollOffset?: number;
  virtual?: boolean;

  // direction for drag logic
  direction?: Direction;

  rootClassName?: string;
  rootStyle?: React.CSSProperties;
}

interface TreeState<TreeDataType extends BasicDataNode = DataNode> {
  keyEntities: KeyEntities<TreeDataType>;

  indent: number | null;

  selectedKeys: Key[];
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
  loadedKeys: Key[];
  loadingKeys: Key[];
  expandedKeys: Key[];

  draggingNodeKey: Key;
  dragChildrenKeys: Key[];

  // for details see comment in Tree.state
  dropPosition: -1 | 0 | 1 | null;
  dropLevelOffset: number | null;
  dropContainerKey: Key | null;
  dropTargetKey: Key | null;
  dropTargetPos: string | null;
  dropAllowed: boolean;
  dragOverNodeKey: Key | null;

  treeData: TreeDataType[];
  flattenNodes: FlattenNode<TreeDataType>[];

  activeKey: Key | null;

  // Record if list is changing
  listChanging: boolean;

  prevProps: TreeProps<TreeDataType>;

  fieldNames: FieldNames;
}

const DEFAULT_EXPANDED_KEYS: Key[] = [];
const DEFAULT_CHECKED_KEYS: Key[] = [];
const DEFAULT_SELECTED_KEYS: Key[] = [];

const defaultAllowDrop = () => true;

const getInitialState = <
  TreeDataType extends BasicDataNode = DataNode,
>(): TreeState<TreeDataType> => ({
  keyEntities: {},

  indent: null,

  selectedKeys: [],
  checkedKeys: [],
  halfCheckedKeys: [],
  loadedKeys: [],
  loadingKeys: [],
  expandedKeys: [],

  draggingNodeKey: null,
  dragChildrenKeys: [],

  // dropTargetKey is the key of abstract-drop-node
  // the abstract-drop-node is the real drop node when drag and drop
  // not the DOM drag over node
  dropTargetKey: null,
  dropPosition: null, // the drop position of abstract-drop-node, inside 0, top -1, bottom 1
  dropContainerKey: null, // the container key of abstract-drop-node if dropPosition is -1 or 1
  dropLevelOffset: null, // the drop level offset of abstract-drag-over-node
  dropTargetPos: null, // the pos of abstract-drop-node
  dropAllowed: true, // if drop to abstract-drop-node is allowed
  // the abstract-drag-over-node
  // if mouse is on the bottom of top dom node or no the top of the bottom dom node
  // abstract-drag-over-node is the top node
  dragOverNodeKey: null,

  treeData: [],
  flattenNodes: [],

  activeKey: null,

  listChanging: false,

  prevProps: null,

  fieldNames: fillFieldNames(),
});

const defaultDropIndicatorRender = DropIndicator as (props: DropIndicatorProps) => React.ReactNode;

const getDerivedStateFromProps = <TreeDataType extends BasicDataNode = DataNode>(
  props: TreeProps<TreeDataType>,
  prevState: TreeState<TreeDataType>,
) => {
  const { prevProps } = prevState;
  const newState: Partial<TreeState<TreeDataType>> = {
    prevProps: props,
  };

  const needSync = (name: string) => {
    return (
      (!prevProps && props.hasOwnProperty(name)) || (prevProps && prevProps[name] !== props[name])
    );
  };

  // ================== Tree Node ==================
  let treeData: TreeDataType[];

  // fieldNames
  let { fieldNames } = prevState;
  if (needSync('fieldNames')) {
    fieldNames = fillFieldNames(props.fieldNames);
    newState.fieldNames = fieldNames;
  }

  // Check if `treeData` or `children` changed and save into the state.
  if (needSync('treeData')) {
    ({ treeData } = props);
  } else if (needSync('children')) {
    warning(false, '`children` of Tree is deprecated. Please use `treeData` instead.');
    treeData = convertTreeToData(props.children) as unknown as TreeDataType[];
  }

  // Save flatten nodes info and convert `treeData` into keyEntities
  if (treeData) {
    newState.treeData = treeData;
    const entitiesMap = convertDataToEntities(treeData as unknown as DataNode[], { fieldNames });
    newState.keyEntities = {
      [MOTION_KEY]: MotionEntity,
      ...entitiesMap.keyEntities,
    } as KeyEntities<TreeDataType>;

    // Warning if treeNode not provide key
    if (process.env.NODE_ENV !== 'production') {
      warningWithoutKey(treeData as unknown as DataNode[], fieldNames);
    }
  }

  const keyEntities = newState.keyEntities || prevState.keyEntities;

  // ================ expandedKeys =================
  if (needSync('expandedKeys') || (prevProps && needSync('autoExpandParent'))) {
    newState.expandedKeys =
      props.autoExpandParent || (!prevProps && props.defaultExpandParent)
        ? conductExpandParent(props.expandedKeys, keyEntities as KeyEntities)
        : props.expandedKeys;
  } else if (!prevProps && props.defaultExpandAll) {
    const cloneKeyEntities = { ...keyEntities };
    delete cloneKeyEntities[MOTION_KEY];

    // Only take the key who has the children to enhance the performance
    const nextExpandedKeys: React.Key[] = [];
    Object.keys(cloneKeyEntities).forEach(key => {
      const entity = cloneKeyEntities[key];
      if (entity.children && entity.children.length) {
        nextExpandedKeys.push(entity.key);
      }
    });

    newState.expandedKeys = nextExpandedKeys;
  } else if (!prevProps && props.defaultExpandedKeys) {
    newState.expandedKeys =
      props.autoExpandParent || props.defaultExpandParent
        ? conductExpandParent(props.defaultExpandedKeys, keyEntities as KeyEntities)
        : props.defaultExpandedKeys;
  }

  if (!newState.expandedKeys) {
    delete newState.expandedKeys;
  }

  // ================ flattenNodes =================
  if (treeData || newState.expandedKeys) {
    const flattenNodes = flattenTreeData<TreeDataType>(
      treeData || prevState.treeData,
      newState.expandedKeys || prevState.expandedKeys,
      fieldNames,
    );
    newState.flattenNodes = flattenNodes;
  }

  // ================ selectedKeys =================
  if (props.selectable) {
    if (needSync('selectedKeys')) {
      newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props as unknown as TreeProps);
    } else if (!prevProps && props.defaultSelectedKeys) {
      newState.selectedKeys = calcSelectedKeys(
        props.defaultSelectedKeys,
        props as unknown as TreeProps,
      );
    }
  }

  // ================= checkedKeys =================
  if (props.checkable) {
    let checkedKeyEntity: { checkedKeys?: Key[]; halfCheckedKeys?: Key[] };

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
        const conductKeys = conductCheck(checkedKeys, true, keyEntities as KeyEntities);
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
};

export interface TreeRef {
  scrollTo: ScrollTo;
  readonly focusedByMouse: boolean;
}

type TreeComponent = (<TreeDataType extends DataNode | BasicDataNode = DataNode>(
  props: TreeProps<TreeDataType> & React.RefAttributes<TreeRef>,
) => React.ReactElement<any>) & {
  TreeNode: typeof TreeNode;
};

const InternalTree = <TreeDataType extends DataNode | BasicDataNode = DataNode>(
  rawProps: TreeProps<TreeDataType>,
  ref: React.Ref<TreeRef>,
) => {
  const {
    prefixCls: mergedPrefixCls = 'rc-tree',
    showLine: mergedShowLine = false,
    showIcon: mergedShowIcon = true,
    selectable: mergedSelectable = true,
    multiple: mergedMultiple = false,
    checkable: mergedCheckable = false,
    disabled: mergedDisabled = false,
    checkStrictly: mergedCheckStrictly = false,
    draggable: mergedDraggable = false,
    defaultExpandParent: mergedDefaultExpandParent = true,
    autoExpandParent: mergedAutoExpandParent = false,
    defaultExpandAll: mergedDefaultExpandAll = false,
    defaultExpandedKeys: mergedDefaultExpandedKeys = DEFAULT_EXPANDED_KEYS,
    defaultCheckedKeys: mergedDefaultCheckedKeys = DEFAULT_CHECKED_KEYS,
    defaultSelectedKeys: mergedDefaultSelectedKeys = DEFAULT_SELECTED_KEYS,
    dropIndicatorRender: mergedDropIndicatorRender = defaultDropIndicatorRender,
    allowDrop: mergedAllowDrop = defaultAllowDrop,
    expandAction: mergedExpandAction = false,
  } = rawProps;

  const props = React.useMemo<TreeProps<TreeDataType>>(
    () => ({
      ...rawProps,
      prefixCls: mergedPrefixCls,
      showLine: mergedShowLine,
      showIcon: mergedShowIcon,
      selectable: mergedSelectable,
      multiple: mergedMultiple,
      checkable: mergedCheckable,
      disabled: mergedDisabled,
      checkStrictly: mergedCheckStrictly,
      draggable: mergedDraggable,
      defaultExpandParent: mergedDefaultExpandParent,
      autoExpandParent: mergedAutoExpandParent,
      defaultExpandAll: mergedDefaultExpandAll,
      defaultExpandedKeys: mergedDefaultExpandedKeys,
      defaultCheckedKeys: mergedDefaultCheckedKeys,
      defaultSelectedKeys: mergedDefaultSelectedKeys,
      dropIndicatorRender: mergedDropIndicatorRender,
      allowDrop: mergedAllowDrop,
      expandAction: mergedExpandAction,
    }),
    [
      rawProps,
      mergedPrefixCls,
      mergedShowLine,
      mergedShowIcon,
      mergedSelectable,
      mergedMultiple,
      mergedCheckable,
      mergedDisabled,
      mergedCheckStrictly,
      mergedDraggable,
      mergedDefaultExpandParent,
      mergedAutoExpandParent,
      mergedDefaultExpandAll,
      mergedDefaultExpandedKeys,
      mergedDefaultCheckedKeys,
      mergedDefaultSelectedKeys,
      mergedDropIndicatorRender,
      mergedAllowDrop,
      mergedExpandAction,
    ],
  );

  const propsRef = React.useRef(props);
  propsRef.current = props;

  const listRef = React.useRef<NodeListRef>(null);
  const destroyedRef = React.useRef(false);
  const delayedDragEnterLogicRef = React.useRef<Record<SafeKey, number> | null>(null);
  const loadingRetryTimesRef = React.useRef<Record<SafeKey, number>>({});
  const dragStartMousePositionRef = React.useRef(null);
  const dragNodePropsRef = React.useRef<TreeNodeProps<TreeDataType>>(null);
  const currentMouseOverDroppableNodeKeyRef = React.useRef(null);
  const focusedByMouseRef = React.useRef(false);

  const [mergedState, setMergedState] = React.useState<TreeState<TreeDataType>>(() => {
    const initialState = getInitialState<TreeDataType>();
    return {
      ...initialState,
      ...getDerivedStateFromProps(props, initialState),
    };
  });

  const stateRef = React.useRef(mergedState);
  let state = mergedState;
  const derivedState = getDerivedStateFromProps(props, state);
  if (Object.keys(derivedState).some(key => state[key] !== derivedState[key])) {
    state = {
      ...state,
      ...derivedState,
    };
    stateRef.current = state;
    setMergedState(state);
  }
  stateRef.current = state;

  const setState = React.useCallback(
    (
      updater:
        | Partial<TreeState<TreeDataType>>
        | ((prevState: TreeState<TreeDataType>) => Partial<TreeState<TreeDataType>> | null),
    ) => {
      setMergedState(prevState => {
        const nextPartial = typeof updater === 'function' ? updater(prevState) : updater;
        if (!nextPartial) {
          return prevState;
        }

        const nextState = {
          ...prevState,
          ...nextPartial,
        };
        stateRef.current = nextState;
        return nextState;
      });
    },
    [],
  );

  const scrollTo = React.useCallback<ScrollTo>(scroll => {
    listRef.current?.scrollTo(scroll);
  }, []);

  const onUpdated = React.useCallback(() => {
    const { activeKey, itemScrollOffset = 0 } = propsRef.current;

    if (activeKey !== undefined && activeKey !== stateRef.current.activeKey) {
      setState({ activeKey });

      if (activeKey !== null) {
        scrollTo({ key: activeKey, offset: itemScrollOffset });
      }
    }
  }, []);

  const onNodeDragStart = React.useCallback<NodeDragEventHandler<TreeDataType, HTMLDivElement>>(
    (event, nodeProps) => {
      const { expandedKeys, keyEntities } = stateRef.current;
      const { onDragStart } = propsRef.current;
      const { eventKey } = nodeProps;

      dragNodePropsRef.current = nodeProps;
      dragStartMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      const newExpandedKeys = arrDel(expandedKeys, eventKey);

      setState({
        draggingNodeKey: eventKey,
        dragChildrenKeys: getDragChildrenKeys(eventKey, keyEntities),
        indent: listRef.current?.getIndentWidth(),
      });

      setExpandedKeys(newExpandedKeys);

      window.addEventListener('dragend', onWindowDragEnd);

      onDragStart?.({ event, node: convertNodePropsToEventData<TreeDataType>(nodeProps) });
    },
    [],
  );

  const onNodeDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeProps: TreeNodeProps<TreeDataType>) => {
      const { expandedKeys, keyEntities, dragChildrenKeys, flattenNodes, indent } =
        stateRef.current;
      const { onDragEnter, onExpand, allowDrop, direction } = propsRef.current;
      const { pos, eventKey } = nodeProps;

      // record the key of node which is latest entered, used in dragleave event.
      if (currentMouseOverDroppableNodeKeyRef.current !== eventKey) {
        currentMouseOverDroppableNodeKeyRef.current = eventKey;
      }

      if (!dragNodePropsRef.current) {
        resetDragState();
        return;
      }

      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
        dragOverNodeKey,
      } = calcDropPosition<TreeDataType>(
        event,
        dragNodePropsRef.current,
        nodeProps,
        indent,
        dragStartMousePositionRef.current,
        allowDrop,
        flattenNodes,
        keyEntities,
        expandedKeys,
        direction,
      );

      if (
        // don't allow drop inside its children
        dragChildrenKeys.includes(dropTargetKey) ||
        // don't allow drop when drop is not allowed caculated by calcDropPosition
        !dropAllowed
      ) {
        resetDragState();
        return;
      }

      // Side effect for delay drag
      if (!delayedDragEnterLogicRef.current) {
        delayedDragEnterLogicRef.current = {};
      }
      Object.keys(delayedDragEnterLogicRef.current).forEach(key => {
        clearTimeout(delayedDragEnterLogicRef.current[key]);
      });

      if (dragNodePropsRef.current.eventKey !== nodeProps.eventKey) {
        // hoist expand logic here
        // since if logic is on the bottom
        // it will be blocked by abstract dragover node check
        //   => if you dragenter from top, you mouse will still be consider as in the top node
        event.persist();
        delayedDragEnterLogicRef.current[pos] = window.setTimeout(() => {
          if (stateRef.current.draggingNodeKey === null) {
            return;
          }

          let newExpandedKeys = [...expandedKeys];
          const entity = getEntity(keyEntities, nodeProps.eventKey);

          if (entity && (entity.children || []).length) {
            newExpandedKeys = arrAdd(expandedKeys, nodeProps.eventKey);
          }

          if (!propsRef.current.hasOwnProperty('expandedKeys')) {
            setExpandedKeys(newExpandedKeys);
          }

          onExpand?.(newExpandedKeys, {
            node: convertNodePropsToEventData<TreeDataType>(nodeProps),
            expanded: true,
            nativeEvent: event.nativeEvent,
          });
        }, 800);
      }

      // Skip if drag node is self
      if (dragNodePropsRef.current.eventKey === dropTargetKey && dropLevelOffset === 0) {
        resetDragState();
        return;
      }

      // Update drag over node and drag state
      setState({
        dragOverNodeKey,
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
      });

      onDragEnter?.({
        event,
        node: convertNodePropsToEventData<TreeDataType>(nodeProps),
        expandedKeys,
      });
    },
    [],
  );

  const onNodeDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeProps: TreeNodeProps<TreeDataType>) => {
      const { dragChildrenKeys, flattenNodes, keyEntities, expandedKeys, indent } =
        stateRef.current;
      const { onDragOver, allowDrop, direction } = propsRef.current;

      if (!dragNodePropsRef.current) {
        return;
      }

      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
        dragOverNodeKey,
      } = calcDropPosition<TreeDataType>(
        event,
        dragNodePropsRef.current,
        nodeProps,
        indent,
        dragStartMousePositionRef.current,
        allowDrop,
        flattenNodes,
        keyEntities,
        expandedKeys,
        direction,
      );

      if (dragChildrenKeys.includes(dropTargetKey) || !dropAllowed) {
        // don't allow drop inside its children
        // don't allow drop when drop is not allowed calculated by calcDropPosition
        return;
      }

      // Update drag position

      if (dragNodePropsRef.current.eventKey === dropTargetKey && dropLevelOffset === 0) {
        if (
          !(
            stateRef.current.dropPosition === null &&
            stateRef.current.dropLevelOffset === null &&
            stateRef.current.dropTargetKey === null &&
            stateRef.current.dropContainerKey === null &&
            stateRef.current.dropTargetPos === null &&
            stateRef.current.dropAllowed === false &&
            stateRef.current.dragOverNodeKey === null
          )
        ) {
          resetDragState();
        }
      } else if (
        !(
          dropPosition === stateRef.current.dropPosition &&
          dropLevelOffset === stateRef.current.dropLevelOffset &&
          dropTargetKey === stateRef.current.dropTargetKey &&
          dropContainerKey === stateRef.current.dropContainerKey &&
          dropTargetPos === stateRef.current.dropTargetPos &&
          dropAllowed === stateRef.current.dropAllowed &&
          dragOverNodeKey === stateRef.current.dragOverNodeKey
        )
      ) {
        setState({
          dropPosition,
          dropLevelOffset,
          dropTargetKey,
          dropContainerKey,
          dropTargetPos,
          dropAllowed,
          dragOverNodeKey,
        });
      }

      onDragOver?.({ event, node: convertNodePropsToEventData<TreeDataType>(nodeProps) });
    },
    [],
  );

  const onNodeDragLeave = React.useCallback<NodeDragEventHandler<TreeDataType>>(
    (event, nodeProps) => {
      // if it is outside the droppable area
      // currentMouseOverDroppableNodeKey will be updated in dragenter event when into another droppable receiver.
      if (
        currentMouseOverDroppableNodeKeyRef.current === nodeProps.eventKey &&
        !event.currentTarget.contains(event.relatedTarget as Node)
      ) {
        resetDragState();
        currentMouseOverDroppableNodeKeyRef.current = null;
      }

      const { onDragLeave } = propsRef.current;

      onDragLeave?.({ event, node: convertNodePropsToEventData<TreeDataType>(nodeProps) });
    },
    [],
  );

  const onWindowDragEnd = React.useCallback(event => {
    onNodeDragEnd(event, null, true);
    window.removeEventListener('dragend', onWindowDragEnd);
  }, []);

  const onNodeDragEnd = React.useCallback<NodeDragEventHandler<TreeDataType>>(
    (event, nodeProps) => {
      const { onDragEnd } = propsRef.current;
      setState({
        dragOverNodeKey: null,
      });

      cleanDragState();

      onDragEnd?.({ event, node: convertNodePropsToEventData<TreeDataType>(nodeProps) });

      dragNodePropsRef.current = null;

      window.removeEventListener('dragend', onWindowDragEnd);
    },
    [],
  );

  const onNodeDrop = React.useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      _: TreeNodeProps<TreeDataType>,
      outsideTree: boolean = false,
    ) => {
      const { dragChildrenKeys, dropPosition, dropTargetKey, dropTargetPos, dropAllowed } =
        stateRef.current;

      if (!dropAllowed) {
        return;
      }

      const { onDrop } = propsRef.current;

      setState({
        dragOverNodeKey: null,
      });
      cleanDragState();

      if (dropTargetKey === null) return;

      const abstractDropNodeProps = {
        ...getTreeNodeProps(dropTargetKey, getTreeNodeRequiredProps()),
        active: getActiveItem()?.key === dropTargetKey,
        data: getEntity(stateRef.current.keyEntities, dropTargetKey).node,
      };

      const dropToChild = dragChildrenKeys.includes(dropTargetKey);

      warning(
        !dropToChild,
        "Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.",
      );

      const posArr = posToArr(dropTargetPos);

      const dropResult = {
        event,
        node: convertNodePropsToEventData<TreeDataType>(abstractDropNodeProps),
        dragNode: dragNodePropsRef.current
          ? convertNodePropsToEventData(dragNodePropsRef.current)
          : null,
        dragNodesKeys: [dragNodePropsRef.current.eventKey].concat(dragChildrenKeys),
        dropToGap: dropPosition !== 0,
        dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
      };

      if (!outsideTree) {
        onDrop?.(dropResult);
      }

      dragNodePropsRef.current = null;
    },
    [],
  );

  const resetDragState = React.useCallback(() => {
    setState({
      dragOverNodeKey: null,
      dropPosition: null,
      dropLevelOffset: null,
      dropTargetKey: null,
      dropContainerKey: null,
      dropTargetPos: null,
      dropAllowed: false,
    });
  }, []);

  const cleanDragState = React.useCallback(() => {
    const { draggingNodeKey } = stateRef.current;
    if (draggingNodeKey !== null) {
      setState({
        draggingNodeKey: null,
        dropPosition: null,
        dropContainerKey: null,
        dropTargetKey: null,
        dropLevelOffset: null,
        dropAllowed: true,
        dragOverNodeKey: null,
      });
    }
    dragStartMousePositionRef.current = null;
    currentMouseOverDroppableNodeKeyRef.current = null;
  }, []);

  const triggerExpandActionExpand = React.useCallback<NodeMouseEventHandler>((e, treeNode) => {
    const { expandedKeys, flattenNodes } = stateRef.current;
    const { expanded, key, isLeaf } = treeNode;

    if (isLeaf || e.shiftKey || e.metaKey || e.ctrlKey) {
      return;
    }

    const node = flattenNodes.filter(nodeItem => nodeItem.key === key)[0];
    const eventNode = convertNodePropsToEventData<TreeDataType>({
      ...getTreeNodeProps(key, getTreeNodeRequiredProps()),
      data: node.data,
    });

    setExpandedKeys(expanded ? arrDel(expandedKeys, key) : arrAdd(expandedKeys, key));
    onNodeExpand(e as React.MouseEvent<HTMLDivElement>, eventNode);
  }, []);

  const onNodeClick = React.useCallback<NodeMouseEventHandler<TreeDataType>>((e, treeNode) => {
    const { onClick, expandAction } = propsRef.current;

    if (expandAction === 'click') {
      triggerExpandActionExpand(e, treeNode);
    }

    onClick?.(e, treeNode);
  }, []);

  const onNodeDoubleClick = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
    (e, treeNode) => {
      const { onDoubleClick, expandAction } = propsRef.current;

      if (expandAction === 'doubleClick') {
        triggerExpandActionExpand(e, treeNode);
      }

      onDoubleClick?.(e, treeNode);
    },
    [],
  );

  const onNodeSelect = React.useCallback<NodeMouseEventHandler<TreeDataType>>((e, treeNode) => {
    let { selectedKeys } = stateRef.current;
    const { keyEntities, fieldNames } = stateRef.current;
    const { onSelect, multiple } = propsRef.current;
    const { selected } = treeNode;
    const key = treeNode[fieldNames.key];
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
        const entity = getEntity(keyEntities, selectedKey);
        return entity ? entity.node : null;
      })
      .filter(Boolean);

    setUncontrolledState({ selectedKeys });

    onSelect?.(selectedKeys, {
      event: 'select',
      selected: targetSelected,
      node: treeNode,
      selectedNodes,
      nativeEvent: e.nativeEvent,
    });
  }, []);

  const onNodeCheck = React.useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement>,
      treeNode: EventDataNode<TreeDataType>,
      checked: boolean,
    ) => {
      const {
        keyEntities,
        checkedKeys: oriCheckedKeys,
        halfCheckedKeys: oriHalfCheckedKeys,
      } = stateRef.current;
      const { checkStrictly, onCheck } = propsRef.current;
      const { key } = treeNode;

      // Prepare trigger arguments
      let checkedObj: { checked: Key[]; halfChecked: Key[] } | React.Key[];

      const eventObj: Partial<CheckInfo<TreeDataType>> = {
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
          .map(checkedKey => getEntity(keyEntities, checkedKey))
          .filter(Boolean)
          .map(entity => entity.node);

        setUncontrolledState({ checkedKeys });
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
          const entity = getEntity(keyEntities, checkedKey);
          if (!entity) return;

          const { node, pos } = entity;

          eventObj.checkedNodes?.push(node);
          eventObj.checkedNodesPositions?.push({ node, pos });
        });

        setUncontrolledState({ checkedKeys }, false, { halfCheckedKeys });
      }

      onCheck?.(checkedObj, eventObj as CheckInfo<TreeDataType>);
    },
    [],
  );

  const onNodeLoad = React.useCallback((treeNode: EventDataNode<TreeDataType>) => {
    const { key } = treeNode;
    const { keyEntities } = stateRef.current;

    // Skip if has children already
    const entity = getEntity(keyEntities, key);
    if (entity?.children?.length) {
      return;
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      // We need to get the latest state of loading/loaded keys
      setState(({ loadedKeys = [], loadingKeys = [] }) => {
        const { loadData, onLoad } = propsRef.current;

        if (!loadData || loadedKeys.includes(key) || loadingKeys.includes(key)) {
          return null;
        }

        // Process load data
        const promise = loadData(treeNode);
        promise
          .then(() => {
            const { loadedKeys: currentLoadedKeys } = stateRef.current;
            const newLoadedKeys = arrAdd(currentLoadedKeys, key);

            // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464
            onLoad?.(newLoadedKeys, {
              event: 'load',
              node: treeNode,
            });

            setUncontrolledState({
              loadedKeys: newLoadedKeys,
            });
            setState(prevState => ({
              loadingKeys: arrDel(prevState.loadingKeys, key),
            }));

            resolve();
          })
          .catch(e => {
            setState(prevState => ({
              loadingKeys: arrDel(prevState.loadingKeys, key),
            }));

            // If exceed max retry times, we give up retry
            loadingRetryTimesRef.current[key as SafeKey] =
              (loadingRetryTimesRef.current[key as SafeKey] || 0) + 1;
            if (loadingRetryTimesRef.current[key as SafeKey] >= MAX_RETRY_TIMES) {
              const { loadedKeys: currentLoadedKeys } = stateRef.current;

              warning(false, 'Retry for `loadData` many times but still failed. No more retry.');

              setUncontrolledState({
                loadedKeys: arrAdd(currentLoadedKeys, key),
              });
              resolve();
            }

            reject(e);
          });

        return {
          loadingKeys: arrAdd(loadingKeys, key),
        };
      });
    });

    // Not care warning if we ignore this
    loadPromise.catch(() => {});

    return loadPromise;
  }, []);

  const onNodeMouseEnter = React.useCallback<NodeMouseEventHandler<TreeDataType>>((event, node) => {
    const { onMouseEnter } = propsRef.current;

    onMouseEnter?.({ event, node });
  }, []);

  const onNodeMouseLeave = React.useCallback<NodeMouseEventHandler<TreeDataType>>((event, node) => {
    const { onMouseLeave } = propsRef.current;

    onMouseLeave?.({ event, node });
  }, []);

  const onNodeContextMenu = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
    (event, node) => {
      const { onRightClick } = propsRef.current;
      if (onRightClick) {
        event.preventDefault();
        onRightClick({ event, node });
      }
    },
    [],
  );

  const onMouseDown = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(event => {
    focusedByMouseRef.current = true;
    const { onMouseDown: onMouseDownProp } = propsRef.current;
    onMouseDownProp?.(event);
  }, []);

  const onGlobalMouseUp = React.useCallback(() => {
    focusedByMouseRef.current = false;
  }, []);

  const onFocus = React.useCallback<React.FocusEventHandler<HTMLDivElement>>((...args) => {
    const { onFocus: onFocusProp, disabled } = propsRef.current;
    const { activeKey, selectedKeys, flattenNodes } = stateRef.current;

    if (!focusedByMouseRef.current && !disabled && activeKey === null) {
      const visibleSelectedKey = selectedKeys.find(key => {
        return flattenNodes.some(nodeItem => nodeItem.key === key);
      });

      if (visibleSelectedKey !== undefined) {
        onActiveChange(visibleSelectedKey);
      } else {
        onActiveChange(flattenNodes?.[0]?.key || null);
      }
    }

    onFocusProp?.(...args);
  }, []);

  const onBlur = React.useCallback<React.FocusEventHandler<HTMLDivElement>>((...args) => {
    const { onBlur: onBlurProp } = propsRef.current;
    onActiveChange(null);

    onBlurProp?.(...args);
  }, []);

  const getTreeNodeRequiredProps = React.useCallback(() => {
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
    } = stateRef.current;
    return {
      expandedKeys: expandedKeys || [],
      selectedKeys: selectedKeys || [],
      loadedKeys: loadedKeys || [],
      loadingKeys: loadingKeys || [],
      checkedKeys: checkedKeys || [],
      halfCheckedKeys: halfCheckedKeys || [],
      dragOverNodeKey,
      dropPosition,
      keyEntities: keyEntities,
    };
  }, []);

  const setExpandedKeys = React.useCallback((expandedKeys: Key[]) => {
    const { treeData, fieldNames } = stateRef.current;
    const flattenNodes = flattenTreeData<TreeDataType>(treeData, expandedKeys, fieldNames);
    setUncontrolledState({ expandedKeys, flattenNodes }, true);
  }, []);

  const onNodeExpand = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode<TreeDataType>) => {
      let { expandedKeys } = stateRef.current;
      const { listChanging, fieldNames } = stateRef.current;
      const { onExpand, loadData } = propsRef.current;
      const { expanded } = treeNode;
      const key = treeNode[fieldNames.key];

      // Do nothing when motion is in progress
      if (listChanging) {
        return;
      }

      // Update selected keys
      const certain = expandedKeys.includes(key);
      const targetExpanded = !expanded;

      warning(
        (expanded && certain) || (!expanded && !certain),
        'Expand state not sync with index check',
      );

      expandedKeys = targetExpanded ? arrAdd(expandedKeys, key) : arrDel(expandedKeys, key);

      setExpandedKeys(expandedKeys);

      onExpand?.(expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e.nativeEvent,
      });

      // Async Load data
      if (targetExpanded && loadData) {
        const loadPromise = onNodeLoad(treeNode);
        if (loadPromise) {
          loadPromise
            .then(() => {
              // [Legacy] Refresh logic
              const newFlattenTreeData = flattenTreeData<TreeDataType>(
                stateRef.current.treeData,
                expandedKeys,
                fieldNames,
              );
              setUncontrolledState({ flattenNodes: newFlattenTreeData });
            })
            .catch(() => {
              const { expandedKeys: currentExpandedKeys } = stateRef.current;
              const expandedKeysToRestore = arrDel(currentExpandedKeys, key);
              setExpandedKeys(expandedKeysToRestore);
            });
        }
      }
    },
    [],
  );

  const onListChangeStart = React.useCallback(() => {
    setUncontrolledState({
      listChanging: true,
    });
  }, []);

  const onListChangeEnd = React.useCallback(() => {
    setTimeout(() => {
      setUncontrolledState({
        listChanging: false,
      });
    });
  }, []);

  const onActiveChange = React.useCallback((newActiveKey: Key | null) => {
    const { activeKey } = stateRef.current;
    const { onActiveChange: onActiveChangeProp, itemScrollOffset = 0 } = propsRef.current;

    if (activeKey === newActiveKey) {
      return;
    }

    setState({ activeKey: newActiveKey });
    if (newActiveKey !== null) {
      scrollTo({ key: newActiveKey, offset: itemScrollOffset });
    }

    onActiveChangeProp?.(newActiveKey);
  }, []);

  const getActiveItem = React.useCallback(() => {
    const { activeKey, flattenNodes } = stateRef.current;
    if (activeKey === null) {
      return null;
    }

    return flattenNodes.find(({ key }) => key === activeKey) || null;
  }, []);

  const offsetActiveKey = React.useCallback((offset: number) => {
    const { flattenNodes, activeKey } = stateRef.current;

    let index = flattenNodes.findIndex(({ key }) => key === activeKey);

    // Align with index
    if (index === -1 && offset < 0) {
      index = flattenNodes.length;
    }

    index = (index + offset + flattenNodes.length) % flattenNodes.length;

    const item = flattenNodes[index];
    if (item) {
      const { key } = item;
      onActiveChange(key);
    } else {
      onActiveChange(null);
    }
  }, []);

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLDivElement>>(event => {
    const { activeKey, expandedKeys, checkedKeys, flattenNodes, keyEntities } = stateRef.current;
    const {
      onKeyDown: onKeyDownProp,
      checkable,
      selectable,
      disabled,
      loadData,
    } = propsRef.current;

    if (disabled) {
      return;
    }

    // >>>>>>>>>> Direction
    switch (event.key) {
      case 'ArrowUp': {
        offsetActiveKey(-1);
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        offsetActiveKey(1);
        event.preventDefault();
        break;
      }
      case 'Home': {
        onActiveChange(flattenNodes?.[0]?.key);
        event.preventDefault();
        break;
      }
      case 'End': {
        onActiveChange(flattenNodes?.[flattenNodes.length - 1]?.key);
        event.preventDefault();
        break;
      }
    }

    // >>>>>>>>>> Expand & Selection
    const activeItem = getActiveItem();
    if (activeItem && activeItem.data) {
      const treeNodeRequiredProps = getTreeNodeRequiredProps();
      const eventNode = convertNodePropsToEventData<TreeDataType>({
        ...getTreeNodeProps(activeKey, treeNodeRequiredProps),
        data: activeItem.data,
        active: true,
      });
      const entity = getEntity(keyEntities, activeKey);
      const hasChildren = !!entity?.children?.length;
      const expandable = !isLeafNode(
        activeItem.data.isLeaf,
        loadData,
        hasChildren,
        eventNode.loaded,
      );

      const canCheck =
        checkable &&
        !eventNode.disabled &&
        eventNode.checkable !== false &&
        !eventNode.disableCheckbox;
      const canSelect =
        !checkable && selectable && !eventNode.disabled && eventNode.selectable !== false;

      switch (event.key) {
        // >>> Expand
        case 'ArrowLeft': {
          // Collapse if possible
          if (expandable && expandedKeys.includes(activeKey)) {
            onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.parent) {
            onActiveChange(activeItem.parent.key);
          }
          event.preventDefault();
          break;
        }
        case 'ArrowRight': {
          // Expand if possible
          if (expandable && !expandedKeys.includes(activeKey)) {
            onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.children && activeItem.children.length) {
            onActiveChange(activeItem.children[0].key);
          }
          event.preventDefault();
          break;
        }

        case 'Enter': {
          if (expandable) {
            event.preventDefault();
            onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (canCheck) {
            if (!checkedKeys.includes(activeKey)) {
              event.preventDefault();
              onNodeCheck({} as React.MouseEvent<HTMLDivElement>, eventNode, true);
            }
          } else if (canSelect && !eventNode.selected) {
            event.preventDefault();
            onNodeSelect({} as React.MouseEvent<HTMLDivElement>, eventNode);
          }
          break;
        }

        case ' ': {
          if (canCheck) {
            event.preventDefault();
            onNodeCheck(
              {} as React.MouseEvent<HTMLDivElement>,
              eventNode,
              !checkedKeys.includes(activeKey),
            );
          } else if (canSelect) {
            event.preventDefault();
            onNodeSelect({} as React.MouseEvent<HTMLDivElement>, eventNode);
          }
          break;
        }
      }
    }

    onKeyDownProp?.(event);
  }, []);

  const setUncontrolledState = React.useCallback(
    (
      nextState: Partial<TreeState<TreeDataType>>,
      atomic: boolean = false,
      forceState: Partial<TreeState<TreeDataType>> | null = null,
    ) => {
      if (!destroyedRef.current) {
        let needSync = false;
        let allPassed = true;
        const newState = {};

        Object.keys(nextState).forEach(name => {
          if (propsRef.current.hasOwnProperty(name)) {
            allPassed = false;
            return;
          }

          needSync = true;
          newState[name] = nextState[name];
        });

        if (needSync && (!atomic || allPassed)) {
          setState({
            ...newState,
            ...forceState,
          } as TreeState<TreeDataType>);
        }
      }
    },
    [],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      scrollTo,
      get focusedByMouse() {
        return focusedByMouseRef.current;
      },
    }),
    [scrollTo],
  );

  React.useEffect(() => {
    onUpdated();
  });

  React.useEffect(() => {
    destroyedRef.current = false;
    window.addEventListener('mouseup', onGlobalMouseUp);

    return () => {
      window.removeEventListener('dragend', onWindowDragEnd);
      window.removeEventListener('mouseup', onGlobalMouseUp);
      destroyedRef.current = true;
    };
  }, [onGlobalMouseUp, onWindowDragEnd]);

  const {
    flattenNodes,
    keyEntities,
    draggingNodeKey,
    dropLevelOffset,
    dropContainerKey,
    dropTargetKey,
    dropPosition,
    dragOverNodeKey,
    indent,
  } = stateRef.current;
  const {
    prefixCls,
    className,
    style,
    styles,
    classNames: treeClassNames,
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
    scrollWidth,
    virtual,
    titleRender,
    dropIndicatorRender,
    onContextMenu,
    onScroll,
    direction,
    rootClassName,
    rootStyle,
  } = propsRef.current;

  const domProps = React.useMemo<React.HTMLAttributes<HTMLDivElement>>(
    () =>
      pickAttrs(propsRef.current, {
        aria: true,
        data: true,
      }),
    [props],
  );

  const draggableConfig = React.useMemo<DraggableConfig>(() => {
    if (!draggable) {
      return undefined;
    }

    if (typeof draggable === 'object') {
      return draggable;
    }

    if (typeof draggable === 'function') {
      return { nodeDraggable: draggable };
    }

    return {};
  }, [draggable]);

  const treeNodeRequiredProps = getTreeNodeRequiredProps();

  const contextValue = React.useMemo<TreeContextProps<TreeDataType>>(
    () => ({
      styles,
      classNames: treeClassNames,
      prefixCls,
      selectable,
      showIcon,
      icon,
      switcherIcon,
      draggable: draggableConfig,
      draggingNodeKey,
      checkable,
      checkStrictly,
      disabled,
      keyEntities,
      dropLevelOffset,
      dropContainerKey,
      dropTargetKey,
      dropPosition,
      dragOverNodeKey,
      indent,
      direction,
      dropIndicatorRender,
      loadData,
      filterTreeNode,
      titleRender,
      onNodeClick,
      onNodeDoubleClick,
      onNodeExpand,
      onNodeSelect,
      onNodeCheck,
      onNodeLoad,
      onNodeMouseEnter,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeDragStart,
      onNodeDragEnter,
      onNodeDragOver,
      onNodeDragLeave,
      onNodeDragEnd,
      onNodeDrop,
    }),
    [
      styles,
      treeClassNames,
      prefixCls,
      selectable,
      showIcon,
      icon,
      switcherIcon,
      draggableConfig,
      draggingNodeKey,
      checkable,
      checkStrictly,
      disabled,
      keyEntities,
      dropLevelOffset,
      dropContainerKey,
      dropTargetKey,
      dropPosition,
      dragOverNodeKey,
      indent,
      direction,
      dropIndicatorRender,
      loadData,
      filterTreeNode,
      titleRender,
      onNodeClick,
      onNodeDoubleClick,
      onNodeExpand,
      onNodeSelect,
      onNodeCheck,
      onNodeLoad,
      onNodeMouseEnter,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeDragStart,
      onNodeDragEnter,
      onNodeDragOver,
      onNodeDragLeave,
      onNodeDragEnd,
      onNodeDrop,
    ],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <div
        className={clsx(prefixCls, className, rootClassName, {
          [`${prefixCls}-show-line`]: showLine,
        })}
        style={rootStyle}
      >
        <NodeList
          ref={listRef}
          prefixCls={prefixCls}
          style={style}
          data={flattenNodes}
          disabled={disabled}
          selectable={selectable}
          checkable={!!checkable}
          motion={motion}
          dragging={draggingNodeKey !== null}
          height={height}
          itemHeight={itemHeight}
          virtual={virtual}
          focusable={focusable}
          tabIndex={tabIndex}
          activeItem={getActiveItem()}
          onFocus={onFocus}
          onMouseDown={onMouseDown}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onActiveChange={onActiveChange}
          onListChangeStart={onListChangeStart}
          onListChangeEnd={onListChangeEnd}
          onContextMenu={onContextMenu}
          onScroll={onScroll}
          scrollWidth={scrollWidth}
          {...treeNodeRequiredProps}
          {...domProps}
        />
      </div>
    </TreeContext.Provider>
  );
};

const Tree = React.forwardRef(InternalTree) as unknown as TreeComponent;

Tree.TreeNode = TreeNode;

if (process.env.NODE_ENV !== 'production') {
  (Tree as any).displayName = 'Tree';
}

export default Tree;
