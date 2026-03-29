// TODO: Fully accessibility support
// Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview

import { clsx } from 'clsx';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import warning from '@rc-component/util/lib/warning';
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

  fieldNames: FieldNames;
}

export interface TreeRef<TreeDataType extends BasicDataNode = DataNode> {
  scrollTo: ScrollTo;
  focusedByMouse: boolean;
  listRef: React.RefObject<NodeListRef>;
  state: TreeState<TreeDataType>;
  destroyed: boolean;
  delayedDragEnterLogic: Record<SafeKey, number>;
  loadingRetryTimes: Record<SafeKey, number>;
  dragNodeProps: TreeNodeProps<TreeDataType> | null;
  currentMouseOverDroppableNodeKey: Key | null;
}

type TreeComponent = (<TreeDataType extends DataNode | BasicDataNode = DataNode>(
  props: TreeProps<TreeDataType> & React.RefAttributes<TreeRef<TreeDataType>>,
) => React.ReactElement) & {
  TreeNode: typeof TreeNode;
};

const defaultAllowDrop: AllowDrop = () => true;

const createInitialState = <
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

  fieldNames: fillFieldNames(),
});

const shallowEqual = (objA: object, objB: object) => {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(key => Object.is(objA[key], objB[key]));
};

const mergeState = <TreeDataType extends BasicDataNode = DataNode>(
  prevState: TreeState<TreeDataType>,
  patch?: Partial<TreeState<TreeDataType>> | null,
) =>
  patch && Object.keys(patch).length
    ? ({
        ...prevState,
        ...patch,
      } as TreeState<TreeDataType>)
    : prevState;

const getDerivedStateFromProps = <TreeDataType extends BasicDataNode = DataNode>(
  props: TreeProps<TreeDataType>,
  mergedProps: TreeProps<TreeDataType>,
  prevState: TreeState<TreeDataType>,
  prevProps: TreeProps<TreeDataType> | null,
) => {
  const newState: Partial<TreeState<TreeDataType>> = {};

  const needSync = (name: keyof TreeProps<TreeDataType>) =>
    (!prevProps && Object.prototype.hasOwnProperty.call(props, name)) ||
    (!!prevProps && prevProps[name] !== props[name]);

  // ================== Tree Node ==================
  let treeData: TreeDataType[];

  // fieldNames
  let { fieldNames } = prevState;
  if (needSync('fieldNames')) {
    fieldNames = fillFieldNames(mergedProps.fieldNames);
    newState.fieldNames = fieldNames;
  }

  // Check if `treeData` or `children` changed and save into the state.
  if (needSync('treeData')) {
    treeData = mergedProps.treeData;
  } else if (needSync('children')) {
    warning(false, '`children` of Tree is deprecated. Please use `treeData` instead.');
    treeData = convertTreeToData(mergedProps.children) as unknown as TreeDataType[];
  }

  // Save flatten nodes info and convert `treeData` into keyEntities
  if (treeData) {
    newState.treeData = treeData;
    const entitiesMap = convertDataToEntities(treeData as unknown as DataNode[], {
      fieldNames,
    }) as {
      keyEntities: KeyEntities<TreeDataType>;
    };
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
  if (needSync('expandedKeys') || needSync('autoExpandParent')) {
    newState.expandedKeys =
      mergedProps.autoExpandParent || (!prevProps && mergedProps.defaultExpandParent)
        ? conductExpandParent(mergedProps.expandedKeys, keyEntities)
        : mergedProps.expandedKeys;
  } else if (!prevProps && mergedProps.defaultExpandAll) {
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
  } else if (!prevProps && mergedProps.defaultExpandedKeys) {
    newState.expandedKeys =
      mergedProps.autoExpandParent || mergedProps.defaultExpandParent
        ? conductExpandParent(mergedProps.defaultExpandedKeys, keyEntities)
        : mergedProps.defaultExpandedKeys;
  }

  if (!newState.expandedKeys) {
    delete newState.expandedKeys;
  }

  // ================ flattenNodes =================
  if (treeData || newState.expandedKeys) {
    newState.flattenNodes = flattenTreeData<TreeDataType>(
      treeData || prevState.treeData,
      newState.expandedKeys || prevState.expandedKeys,
      fieldNames,
    );
  }

  // ================ selectedKeys =================
  if (mergedProps.selectable) {
    if (needSync('selectedKeys')) {
      newState.selectedKeys = calcSelectedKeys(
        mergedProps.selectedKeys,
        mergedProps as unknown as TreeProps,
      );
    } else if (!prevProps && mergedProps.defaultSelectedKeys) {
      newState.selectedKeys = calcSelectedKeys(
        mergedProps.defaultSelectedKeys,
        mergedProps as unknown as TreeProps,
      );
    }
  }

  // ================= checkedKeys =================
  if (mergedProps.checkable) {
    let checkedKeyEntity: { checkedKeys?: Key[]; halfCheckedKeys?: Key[] };

    if (needSync('checkedKeys')) {
      checkedKeyEntity = parseCheckedKeys(mergedProps.checkedKeys) || {};
    } else if (!prevProps && mergedProps.defaultCheckedKeys) {
      checkedKeyEntity = parseCheckedKeys(mergedProps.defaultCheckedKeys) || {};
    } else if (treeData) {
      // If `treeData` changed, we also need check it
      checkedKeyEntity = parseCheckedKeys(mergedProps.checkedKeys) || {
        checkedKeys: prevState.checkedKeys,
        halfCheckedKeys: prevState.halfCheckedKeys,
      };
    }

    if (checkedKeyEntity) {
      let { checkedKeys = [], halfCheckedKeys = [] } = checkedKeyEntity;

      if (!mergedProps.checkStrictly) {
        const conductKeys = conductCheck(checkedKeys, true, keyEntities);
        ({ checkedKeys, halfCheckedKeys } = conductKeys);
      }

      newState.checkedKeys = checkedKeys;
      newState.halfCheckedKeys = halfCheckedKeys;
    }
  }

  // ================= loadedKeys ==================
  if (needSync('loadedKeys')) {
    newState.loadedKeys = mergedProps.loadedKeys;
    newState.loadingKeys = prevState.loadingKeys.filter(
      key => !mergedProps.loadedKeys?.includes(key),
    );
  }

  return newState;
};

const Tree = React.forwardRef(
  <TreeDataType extends DataNode | BasicDataNode = DataNode>(
    props: TreeProps<TreeDataType>,
    ref: React.Ref<TreeRef<TreeDataType>>,
  ) => {
    const {
      prefixCls = 'rc-tree',
      className,
      style,
      styles,
      classNames: treeClassNames,
      focusable,
      activeKey,
      tabIndex = 0,
      children,
      treeData,
      fieldNames,
      showLine = false,
      showIcon = true,
      icon,
      selectable = true,
      expandAction = false,
      disabled = false,
      multiple = false,
      checkable = false,
      checkStrictly = false,
      draggable = false,
      defaultExpandParent = true,
      autoExpandParent = false,
      defaultExpandAll = false,
      defaultExpandedKeys = [],
      expandedKeys,
      defaultCheckedKeys = [],
      checkedKeys,
      defaultSelectedKeys = [],
      selectedKeys,
      titleRender,
      onContextMenu,
      onScroll,
      loadData,
      loadedKeys,
      filterTreeNode,
      motion,
      switcherIcon,
      height,
      itemHeight,
      scrollWidth,
      itemScrollOffset = 0,
      virtual,
      direction,
      rootClassName,
      rootStyle,
    } = props;

    const mergedAllowDrop = props.allowDrop ?? (defaultAllowDrop as AllowDrop<TreeDataType>);

    const mergedDropIndicatorRender = (props.dropIndicatorRender ?? DropIndicator) as (
      props: DropIndicatorProps,
    ) => React.ReactNode;

    const mergedProps = {
      ...props,
      prefixCls,
      tabIndex,
      children,
      treeData,
      fieldNames,
      showLine,
      showIcon,
      selectable,
      expandAction,
      disabled,
      multiple,
      checkable,
      checkStrictly,
      draggable,
      defaultExpandParent,
      autoExpandParent,
      defaultExpandAll,
      defaultExpandedKeys,
      expandedKeys,
      defaultCheckedKeys,
      checkedKeys,
      defaultSelectedKeys,
      selectedKeys,
      allowDrop: mergedAllowDrop,
      dropIndicatorRender: mergedDropIndicatorRender,
      loadData,
      loadedKeys,
      itemScrollOffset,
      activeKey,
      direction,
    } as TreeProps<TreeDataType>;

    const prevPropsRef = React.useRef<TreeProps<TreeDataType>>(null);
    const rawPropsRef = React.useRef(props);
    const mergedPropsRef = React.useRef(mergedProps);
    const destroyedRef = React.useRef(false);
    const delayedDragEnterLogicRef = React.useRef<Record<SafeKey, number> | null>(null);
    const loadingRetryTimesRef = React.useRef<Record<SafeKey, number>>({});
    const loadingKeysSetRef = React.useRef<Set<Key>>(new Set());
    const pendingLoadedKeysRef = React.useRef<Set<Key>>(new Set());
    const dragStartMousePositionRef = React.useRef<{ x: number; y: number } | null>(null);
    const dragNodePropsRef = React.useRef<TreeNodeProps<TreeDataType> | null>(null);
    const currentMouseOverDroppableNodeKeyRef = React.useRef<Key | null>(null);
    const focusedByMouseRef = React.useRef(false);
    const listRef = React.useRef<NodeListRef>(null);
    const onWindowDragEndRef = React.useRef<(event: DragEvent) => void>(null);

    rawPropsRef.current = props;
    mergedPropsRef.current = mergedProps;

    const [innerState, setInnerState] = React.useState<TreeState<TreeDataType>>(() =>
      createInitialState<TreeDataType>(),
    );

    const mergedState = React.useMemo(
      () =>
        mergeState(
          innerState,
          getDerivedStateFromProps(props, mergedProps, innerState, prevPropsRef.current),
        ),
      [innerState, mergedProps, props],
    );

    if (!shallowEqual(innerState, mergedState)) {
      setInnerState(mergedState);
    }

    prevPropsRef.current = rawPropsRef.current;

    const stateRef = React.useRef(mergedState);
    stateRef.current = mergedState;
    mergedState.loadedKeys.forEach(key => {
      pendingLoadedKeysRef.current.delete(key);
      loadingKeysSetRef.current.delete(key);
    });

    const setMergedState = React.useCallback(
      (
        updater:
          | Partial<TreeState<TreeDataType>>
          | ((
              state: TreeState<TreeDataType>,
            ) => Partial<TreeState<TreeDataType>> | TreeState<TreeDataType> | null),
      ) => {
        setInnerState(prevState => {
          const syncedState = mergeState(
            prevState,
            getDerivedStateFromProps(
              rawPropsRef.current,
              mergedPropsRef.current,
              prevState,
              prevPropsRef.current,
            ),
          );
          const patch = typeof updater === 'function' ? updater(syncedState) : updater;
          const nextState = mergeState(syncedState, patch);

          return shallowEqual(syncedState, nextState) ? syncedState : nextState;
        });
      },
      [],
    );

    const scrollTo = React.useCallback<ScrollTo>(scroll => {
      listRef.current?.scrollTo(scroll);
    }, []);

    const getTreeNodeRequiredProps = React.useCallback(() => {
      const {
        expandedKeys: currentExpandedKeys,
        selectedKeys: currentSelectedKeys,
        loadedKeys: currentLoadedKeys,
        loadingKeys: currentLoadingKeys,
        checkedKeys: currentCheckedKeys,
        halfCheckedKeys: currentHalfCheckedKeys,
        dragOverNodeKey,
        dropPosition,
        keyEntities,
      } = stateRef.current;

      return {
        expandedKeys: currentExpandedKeys || [],
        selectedKeys: currentSelectedKeys || [],
        loadedKeys: currentLoadedKeys || [],
        loadingKeys: currentLoadingKeys || [],
        checkedKeys: currentCheckedKeys || [],
        halfCheckedKeys: currentHalfCheckedKeys || [],
        dragOverNodeKey,
        dropPosition,
        keyEntities,
      };
    }, []);

    const getActiveItem = React.useCallback(() => {
      const { activeKey: currentActiveKey, flattenNodes } = stateRef.current;

      if (currentActiveKey === null) {
        return null;
      }

      return flattenNodes.find(({ key }) => key === currentActiveKey) || null;
    }, []);

    const setUncontrolledState = React.useCallback(
      (
        state: Partial<TreeState<TreeDataType>>,
        atomic: boolean = false,
        forceState: Partial<TreeState<TreeDataType>> | null = null,
      ) => {
        if (destroyedRef.current) {
          return;
        }

        let needSync = false;
        let allPassed = true;
        const newState: Partial<TreeState<TreeDataType>> = {};

        Object.keys(state).forEach(name => {
          if (Object.prototype.hasOwnProperty.call(rawPropsRef.current, name)) {
            allPassed = false;
            return;
          }

          needSync = true;
          newState[name] = state[name];
        });

        if (needSync && (!atomic || allPassed)) {
          setMergedState({ ...newState, ...forceState });
        }
      },
      [setMergedState],
    );

    const setExpandedKeys = React.useCallback(
      (nextExpandedKeys: Key[]) => {
        const { treeData: currentTreeData, fieldNames: currentFieldNames } = stateRef.current;
        const flattenNodes = flattenTreeData<TreeDataType>(
          currentTreeData,
          nextExpandedKeys,
          currentFieldNames,
        );

        setUncontrolledState({ expandedKeys: nextExpandedKeys, flattenNodes }, true);
      },
      [setUncontrolledState],
    );

    const onActiveChange = React.useCallback(
      (newActiveKey: Key | null) => {
        const { activeKey: currentActiveKey } = stateRef.current;

        if (currentActiveKey === newActiveKey) {
          return;
        }

        setMergedState({ activeKey: newActiveKey });

        if (newActiveKey !== null) {
          scrollTo({ key: newActiveKey, offset: mergedPropsRef.current.itemScrollOffset || 0 });
        }

        mergedPropsRef.current.onActiveChange?.(newActiveKey);
      },
      [scrollTo, setMergedState],
    );

    const resetDragState = React.useCallback(() => {
      setMergedState({
        dragOverNodeKey: null,
        dropPosition: null,
        dropLevelOffset: null,
        dropTargetKey: null,
        dropContainerKey: null,
        dropTargetPos: null,
        dropAllowed: false,
      });
    }, [setMergedState]);

    const cleanDragState = React.useCallback(() => {
      const { draggingNodeKey } = stateRef.current;

      if (draggingNodeKey !== null) {
        setMergedState({
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
    }, [setMergedState]);

    const onNodeLoad = React.useCallback(
      (treeNode: EventDataNode<TreeDataType>) => {
        const { key } = treeNode;
        const {
          keyEntities,
          loadedKeys: currentLoadedKeys,
          loadingKeys: currentLoadingKeys,
        } = stateRef.current;

        const entity = getEntity(keyEntities, key);
        const { loadData: currentLoadData } = mergedPropsRef.current;

        // Skip if has children already
        if (entity?.children?.length) {
          return;
        }

        if (
          !currentLoadData ||
          currentLoadedKeys.includes(key) ||
          currentLoadingKeys.includes(key) ||
          loadingKeysSetRef.current.has(key) ||
          pendingLoadedKeysRef.current.has(key)
        ) {
          return;
        }

        loadingKeysSetRef.current.add(key);
        setInnerState(prevState =>
          mergeState(
            mergeState(
              prevState,
              getDerivedStateFromProps(
                rawPropsRef.current,
                mergedPropsRef.current,
                prevState,
                prevPropsRef.current,
              ),
            ),
            {
              loadingKeys: arrAdd(prevState.loadingKeys || [], key),
            },
          ),
        );

        const loadPromise = new Promise<void>((resolve, reject) => {
          const promise = currentLoadData(treeNode);

          promise
            .then(() => {
              const { loadedKeys: latestLoadedKeys } = stateRef.current;
              const newLoadedKeys = arrAdd(latestLoadedKeys, key);
              const isLoadedKeysControlled = Object.prototype.hasOwnProperty.call(
                rawPropsRef.current,
                'loadedKeys',
              );

              if (isLoadedKeysControlled) {
                pendingLoadedKeysRef.current.add(key);
              } else {
                loadingKeysSetRef.current.delete(key);
              }

              // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
              // https://github.com/ant-design/ant-design/issues/12464
              mergedPropsRef.current.onLoad?.(newLoadedKeys, {
                event: 'load',
                node: treeNode,
              });

              setUncontrolledState({
                loadedKeys: newLoadedKeys,
              });

              setInnerState(prevState => {
                const nextState = mergeState(
                  prevState,
                  getDerivedStateFromProps(
                    rawPropsRef.current,
                    mergedPropsRef.current,
                    prevState,
                    prevPropsRef.current,
                  ),
                );

                return mergeState(nextState, {
                  loadingKeys: arrDel(nextState.loadingKeys, key),
                });
              });

              resolve();
            })
            .catch(error => {
              loadingKeysSetRef.current.delete(key);
              pendingLoadedKeysRef.current.delete(key);
              setInnerState(prevState => {
                const nextState = mergeState(
                  prevState,
                  getDerivedStateFromProps(
                    rawPropsRef.current,
                    mergedPropsRef.current,
                    prevState,
                    prevPropsRef.current,
                  ),
                );

                return mergeState(nextState, {
                  loadingKeys: arrDel(nextState.loadingKeys, key),
                });
              });

              loadingRetryTimesRef.current[key as SafeKey] =
                (loadingRetryTimesRef.current[key as SafeKey] || 0) + 1;

              if (loadingRetryTimesRef.current[key as SafeKey] >= MAX_RETRY_TIMES) {
                const { loadedKeys: latestLoadedKeys } = stateRef.current;

                warning(false, 'Retry for `loadData` many times but still failed. No more retry.');

                setUncontrolledState({
                  loadedKeys: arrAdd(latestLoadedKeys, key),
                });
                resolve();
                return;
              }

              reject(error);
            });
        });

        // Not care warning if we ignore this
        loadPromise.catch(() => {});

        return loadPromise;
      },
      [setUncontrolledState],
    );

    const onNodeExpand = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode<TreeDataType>) => {
        let { expandedKeys: currentExpandedKeys } = stateRef.current;
        const { listChanging, fieldNames: currentFieldNames } = stateRef.current;
        const { expanded } = treeNode;
        const key = treeNode[currentFieldNames.key];

        // Do nothing when motion is in progress
        if (listChanging) {
          return;
        }

        // Update selected keys
        const certain = currentExpandedKeys.includes(key);
        const targetExpanded = !expanded;

        warning(
          (expanded && certain) || (!expanded && !certain),
          'Expand state not sync with index check',
        );

        currentExpandedKeys = targetExpanded
          ? arrAdd(currentExpandedKeys, key)
          : arrDel(currentExpandedKeys, key);

        setExpandedKeys(currentExpandedKeys);

        mergedPropsRef.current.onExpand?.(currentExpandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e.nativeEvent,
        });

        // Async Load data
        if (targetExpanded && mergedPropsRef.current.loadData) {
          const loadPromise = onNodeLoad(treeNode);

          if (loadPromise) {
            loadPromise
              .then(() => {
                const newFlattenTreeData = flattenTreeData<TreeDataType>(
                  stateRef.current.treeData,
                  currentExpandedKeys,
                  currentFieldNames,
                );

                setUncontrolledState({ flattenNodes: newFlattenTreeData });
              })
              .catch(() => {
                const { expandedKeys: latestExpandedKeys } = stateRef.current;
                setExpandedKeys(arrDel(latestExpandedKeys, key));
              });
          }
        }
      },
      [onNodeLoad, setExpandedKeys, setUncontrolledState],
    );

    const triggerExpandActionExpand = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (e, treeNode) => {
        const { expandedKeys: currentExpandedKeys, flattenNodes } = stateRef.current;
        const { expanded, key, isLeaf } = treeNode;

        if (isLeaf || e.shiftKey || e.metaKey || e.ctrlKey) {
          return;
        }

        const node = flattenNodes.find(nodeItem => nodeItem.key === key);

        if (!node) {
          return;
        }

        const eventNode = convertNodePropsToEventData<TreeDataType>({
          ...getTreeNodeProps(key, getTreeNodeRequiredProps()),
          data: node.data,
        });

        setExpandedKeys(
          expanded ? arrDel(currentExpandedKeys, key) : arrAdd(currentExpandedKeys, key),
        );
        onNodeExpand(e as React.MouseEvent<HTMLDivElement>, eventNode);
      },
      [getTreeNodeRequiredProps, onNodeExpand, setExpandedKeys],
    );

    const onNodeClick = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (e, treeNode) => {
        if (mergedPropsRef.current.expandAction === 'click') {
          triggerExpandActionExpand(e, treeNode);
        }

        mergedPropsRef.current.onClick?.(e, treeNode);
      },
      [triggerExpandActionExpand],
    );

    const onNodeDoubleClick = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (e, treeNode) => {
        if (mergedPropsRef.current.expandAction === 'doubleClick') {
          triggerExpandActionExpand(e, treeNode);
        }

        mergedPropsRef.current.onDoubleClick?.(e, treeNode);
      },
      [triggerExpandActionExpand],
    );

    const onNodeSelect = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (e, treeNode) => {
        let { selectedKeys: currentSelectedKeys } = stateRef.current;
        const { keyEntities, fieldNames: currentFieldNames } = stateRef.current;
        const { selected } = treeNode;
        const key = treeNode[currentFieldNames.key];
        const targetSelected = !selected;

        // Update selected keys
        if (!targetSelected) {
          currentSelectedKeys = arrDel(currentSelectedKeys, key);
        } else if (!mergedPropsRef.current.multiple) {
          currentSelectedKeys = [key];
        } else {
          currentSelectedKeys = arrAdd(currentSelectedKeys, key);
        }

        // [Legacy] Not found related usage in doc or upper libs
        const selectedNodes = currentSelectedKeys
          .map(selectedKey => {
            const entity = getEntity(keyEntities, selectedKey);
            return entity ? entity.node : null;
          })
          .filter(Boolean);

        setUncontrolledState({ selectedKeys: currentSelectedKeys });

        mergedPropsRef.current.onSelect?.(currentSelectedKeys, {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes,
          nativeEvent: e.nativeEvent,
        });
      },
      [setUncontrolledState],
    );

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
        const { key } = treeNode;

        // Prepare trigger arguments
        let checkedObj: { checked: Key[]; halfChecked: Key[] } | React.Key[];

        const eventObj: Partial<CheckInfo<TreeDataType>> = {
          event: 'check',
          node: treeNode,
          checked,
          nativeEvent: e.nativeEvent,
        };

        if (mergedPropsRef.current.checkStrictly) {
          const nextCheckedKeys = checked
            ? arrAdd(oriCheckedKeys, key)
            : arrDel(oriCheckedKeys, key);
          const nextHalfCheckedKeys = arrDel(oriHalfCheckedKeys, key);
          checkedObj = { checked: nextCheckedKeys, halfChecked: nextHalfCheckedKeys };

          eventObj.checkedNodes = nextCheckedKeys
            .map(checkedKey => getEntity(keyEntities, checkedKey))
            .filter(Boolean)
            .map(entity => entity.node);

          setUncontrolledState({ checkedKeys: nextCheckedKeys });
        } else {
          // Always fill first
          let { checkedKeys: nextCheckedKeys, halfCheckedKeys: nextHalfCheckedKeys } = conductCheck(
            [...oriCheckedKeys, key],
            true,
            keyEntities,
          );

          // If remove, we do it again to correction
          if (!checked) {
            const keySet = new Set(nextCheckedKeys);
            keySet.delete(key);
            ({ checkedKeys: nextCheckedKeys, halfCheckedKeys: nextHalfCheckedKeys } = conductCheck(
              Array.from(keySet),
              { checked: false, halfCheckedKeys: nextHalfCheckedKeys },
              keyEntities,
            ));
          }

          checkedObj = nextCheckedKeys;

          // [Legacy] This is used for `rc-tree-select`
          eventObj.checkedNodes = [];
          eventObj.checkedNodesPositions = [];
          eventObj.halfCheckedKeys = nextHalfCheckedKeys;

          nextCheckedKeys.forEach(checkedKey => {
            const entity = getEntity(keyEntities, checkedKey);
            if (!entity) {
              return;
            }

            const { node, pos } = entity;
            eventObj.checkedNodes.push(node);
            eventObj.checkedNodesPositions.push({ node, pos });
          });

          setUncontrolledState({ checkedKeys: nextCheckedKeys }, false, {
            halfCheckedKeys: nextHalfCheckedKeys,
          });
        }

        mergedPropsRef.current.onCheck?.(checkedObj, eventObj as CheckInfo<TreeDataType>);
      },
      [setUncontrolledState],
    );

    const onNodeMouseEnter = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (event, node) => {
        mergedPropsRef.current.onMouseEnter?.({ event, node });
      },
      [],
    );

    const onNodeMouseLeave = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (event, node) => {
        mergedPropsRef.current.onMouseLeave?.({ event, node });
      },
      [],
    );

    const onNodeContextMenu = React.useCallback<NodeMouseEventHandler<TreeDataType>>(
      (event, node) => {
        if (mergedPropsRef.current.onRightClick) {
          event.preventDefault();
          mergedPropsRef.current.onRightClick({ event, node });
        }
      },
      [],
    );

    const onNodeDragEnd = React.useCallback<NodeDragEventHandler<TreeDataType>>(
      (event, nodeProps) => {
        setMergedState({
          dragOverNodeKey: null,
        });

        cleanDragState();

        const currentDragNodeProps = nodeProps || dragNodePropsRef.current;

        if (currentDragNodeProps) {
          mergedPropsRef.current.onDragEnd?.({
            event,
            node: convertNodePropsToEventData<TreeDataType>(currentDragNodeProps),
          });
        }

        dragNodePropsRef.current = null;
        if (onWindowDragEndRef.current) {
          window.removeEventListener('dragend', onWindowDragEndRef.current);
        }
      },
      [cleanDragState, setMergedState],
    );

    const onWindowDragEnd = React.useCallback(
      (event: DragEvent) => {
        onNodeDragEnd(
          event as unknown as React.DragEvent<HTMLDivElement>,
          dragNodePropsRef.current,
        );
        if (onWindowDragEndRef.current) {
          window.removeEventListener('dragend', onWindowDragEndRef.current);
        }
      },
      [onNodeDragEnd],
    );

    onWindowDragEndRef.current = onWindowDragEnd;

    const onNodeDragStart = React.useCallback<NodeDragEventHandler<TreeDataType, HTMLDivElement>>(
      (event, nodeProps) => {
        const { expandedKeys: currentExpandedKeys, keyEntities } = stateRef.current;
        const { eventKey } = nodeProps;

        dragNodePropsRef.current = nodeProps;
        dragStartMousePositionRef.current = {
          x: event.clientX,
          y: event.clientY,
        };

        const newExpandedKeys = arrDel(currentExpandedKeys, eventKey);

        setMergedState({
          draggingNodeKey: eventKey,
          dragChildrenKeys: getDragChildrenKeys(eventKey, keyEntities),
          indent: listRef.current?.getIndentWidth() ?? null,
        });

        setExpandedKeys(newExpandedKeys);
        if (onWindowDragEndRef.current) {
          window.addEventListener('dragend', onWindowDragEndRef.current);
        }

        mergedPropsRef.current.onDragStart?.({
          event,
          node: convertNodePropsToEventData<TreeDataType>(nodeProps),
        });
      },
      [onWindowDragEnd, setExpandedKeys, setMergedState],
    );

    /**
     * [Legacy] Select handler is smaller than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    const onNodeDragEnter = React.useCallback(
      (event: React.DragEvent<HTMLDivElement>, nodeProps: TreeNodeProps<TreeDataType>) => {
        const {
          expandedKeys: currentExpandedKeys,
          keyEntities,
          dragChildrenKeys,
          flattenNodes,
          indent,
        } = stateRef.current;
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
          mergedPropsRef.current.allowDrop,
          flattenNodes,
          keyEntities,
          currentExpandedKeys,
          mergedPropsRef.current.direction,
        );

        if (dragChildrenKeys.includes(dropTargetKey) || !dropAllowed) {
          // don't allow drop inside its children
          // don't allow drop when drop is not allowed caculated by calcDropPosition
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
          event.persist?.();
          delayedDragEnterLogicRef.current[pos] = window.setTimeout(() => {
            if (stateRef.current.draggingNodeKey === null) {
              return;
            }

            let newExpandedKeys = [...currentExpandedKeys];
            const entity = getEntity(keyEntities, nodeProps.eventKey);

            if (entity && (entity.children || []).length) {
              newExpandedKeys = arrAdd(currentExpandedKeys, nodeProps.eventKey);
            }

            if (!Object.prototype.hasOwnProperty.call(rawPropsRef.current, 'expandedKeys')) {
              setExpandedKeys(newExpandedKeys);
            }

            mergedPropsRef.current.onExpand?.(newExpandedKeys, {
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
        setMergedState({
          dragOverNodeKey,
          dropPosition,
          dropLevelOffset,
          dropTargetKey,
          dropContainerKey,
          dropTargetPos,
          dropAllowed,
        });

        mergedPropsRef.current.onDragEnter?.({
          event,
          node: convertNodePropsToEventData<TreeDataType>(nodeProps),
          expandedKeys: currentExpandedKeys,
        });
      },
      [resetDragState, setExpandedKeys, setMergedState],
    );

    const onNodeDragOver = React.useCallback(
      (event: React.DragEvent<HTMLDivElement>, nodeProps: TreeNodeProps<TreeDataType>) => {
        const {
          dragChildrenKeys,
          flattenNodes,
          keyEntities,
          expandedKeys: currentExpandedKeys,
          indent,
          dropPosition: currentDropPosition,
          dropLevelOffset: currentDropLevelOffset,
          dropTargetKey: currentDropTargetKey,
          dropContainerKey: currentDropContainerKey,
          dropTargetPos: currentDropTargetPos,
          dropAllowed: currentDropAllowed,
          dragOverNodeKey: currentDragOverNodeKey,
        } = stateRef.current;

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
          mergedPropsRef.current.allowDrop,
          flattenNodes,
          keyEntities,
          currentExpandedKeys,
          mergedPropsRef.current.direction,
        );

        if (dragChildrenKeys.includes(dropTargetKey) || !dropAllowed) {
          // don't allow drop inside its children
          // don't allow drop when drop is not allowed calculated by calcDropPosition
          return;
        }

        if (dragNodePropsRef.current.eventKey === dropTargetKey && dropLevelOffset === 0) {
          if (
            !(
              currentDropPosition === null &&
              currentDropLevelOffset === null &&
              currentDropTargetKey === null &&
              currentDropContainerKey === null &&
              currentDropTargetPos === null &&
              currentDropAllowed === false &&
              currentDragOverNodeKey === null
            )
          ) {
            resetDragState();
          }
        } else if (
          !(
            dropPosition === currentDropPosition &&
            dropLevelOffset === currentDropLevelOffset &&
            dropTargetKey === currentDropTargetKey &&
            dropContainerKey === currentDropContainerKey &&
            dropTargetPos === currentDropTargetPos &&
            dropAllowed === currentDropAllowed &&
            dragOverNodeKey === currentDragOverNodeKey
          )
        ) {
          setMergedState({
            dropPosition,
            dropLevelOffset,
            dropTargetKey,
            dropContainerKey,
            dropTargetPos,
            dropAllowed,
            dragOverNodeKey,
          });
        }

        mergedPropsRef.current.onDragOver?.({
          event,
          node: convertNodePropsToEventData<TreeDataType>(nodeProps),
        });
      },
      [resetDragState, setMergedState],
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

        mergedPropsRef.current.onDragLeave?.({
          event,
          node: convertNodePropsToEventData<TreeDataType>(nodeProps),
        });
      },
      [resetDragState],
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

        setMergedState({
          dragOverNodeKey: null,
        });
        cleanDragState();

        if (dropTargetKey === null || !dragNodePropsRef.current) {
          return;
        }

        const dropEntity = getEntity(stateRef.current.keyEntities, dropTargetKey);

        if (!dropEntity) {
          dragNodePropsRef.current = null;
          return;
        }

        const abstractDropNodeProps = {
          ...getTreeNodeProps(dropTargetKey, getTreeNodeRequiredProps()),
          active: getActiveItem()?.key === dropTargetKey,
          data: dropEntity.node,
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
          dragNode: convertNodePropsToEventData<TreeDataType>(dragNodePropsRef.current),
          dragNodesKeys: [dragNodePropsRef.current.eventKey].concat(dragChildrenKeys),
          dropToGap: dropPosition !== 0,
          dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
        };

        if (!outsideTree) {
          mergedPropsRef.current.onDrop?.(dropResult);
        }

        dragNodePropsRef.current = null;
      },
      [cleanDragState, getActiveItem, getTreeNodeRequiredProps, setMergedState],
    );

    const onMouseDown = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(event => {
      focusedByMouseRef.current = true;
      mergedPropsRef.current.onMouseDown?.(event);
    }, []);

    const onGlobalMouseUp = React.useCallback(() => {
      focusedByMouseRef.current = false;
    }, []);

    const onFocus = React.useCallback<React.FocusEventHandler<HTMLDivElement>>(
      (...args) => {
        const {
          activeKey: currentActiveKey,
          selectedKeys: currentSelectedKeys,
          flattenNodes,
        } = stateRef.current;

        if (
          !focusedByMouseRef.current &&
          !mergedPropsRef.current.disabled &&
          currentActiveKey === null
        ) {
          const visibleSelectedKey = currentSelectedKeys.find(key =>
            flattenNodes.some(nodeItem => nodeItem.key === key),
          );

          if (visibleSelectedKey !== undefined) {
            onActiveChange(visibleSelectedKey);
          } else {
            onActiveChange(flattenNodes?.[0]?.key || null);
          }
        }

        mergedPropsRef.current.onFocus?.(...args);
      },
      [onActiveChange],
    );

    const onBlur = React.useCallback<React.FocusEventHandler<HTMLDivElement>>(
      (...args) => {
        onActiveChange(null);
        mergedPropsRef.current.onBlur?.(...args);
      },
      [onActiveChange],
    );

    const onListChangeStart = React.useCallback(() => {
      setUncontrolledState({
        listChanging: true,
      });
    }, [setUncontrolledState]);

    const onListChangeEnd = React.useCallback(() => {
      setTimeout(() => {
        setUncontrolledState({
          listChanging: false,
        });
      });
    }, [setUncontrolledState]);

    const offsetActiveKey = React.useCallback(
      (offset: number) => {
        const { flattenNodes, activeKey: currentActiveKey } = stateRef.current;

        let index = flattenNodes.findIndex(({ key }) => key === currentActiveKey);

        // Align with index
        if (index === -1 && offset < 0) {
          index = flattenNodes.length;
        }

        index = (index + offset + flattenNodes.length) % flattenNodes.length;

        const item = flattenNodes[index];

        if (item) {
          onActiveChange(item.key);
        } else {
          onActiveChange(null);
        }
      },
      [onActiveChange],
    );

    const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
      event => {
        const {
          activeKey: currentActiveKey,
          expandedKeys: currentExpandedKeys,
          checkedKeys: currentCheckedKeys,
          flattenNodes,
          keyEntities,
        } = stateRef.current;

        if (mergedPropsRef.current.disabled) {
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
          const eventNode = convertNodePropsToEventData<TreeDataType>({
            ...getTreeNodeProps(currentActiveKey, getTreeNodeRequiredProps()),
            data: activeItem.data,
            active: true,
          });
          const entity = getEntity(keyEntities, currentActiveKey);
          const hasChildren = !!entity?.children?.length;
          const expandable = !isLeafNode(
            activeItem.data.isLeaf,
            mergedPropsRef.current.loadData,
            hasChildren,
            eventNode.loaded,
          );

          const canCheck =
            mergedPropsRef.current.checkable &&
            !eventNode.disabled &&
            eventNode.checkable !== false &&
            !eventNode.disableCheckbox;
          const canSelect =
            !mergedPropsRef.current.checkable &&
            mergedPropsRef.current.selectable &&
            !eventNode.disabled &&
            eventNode.selectable !== false;

          switch (event.key) {
            // >>> Expand
            case 'ArrowLeft': {
              // Collapse if possible
              if (expandable && currentExpandedKeys.includes(currentActiveKey)) {
                onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
              } else if (activeItem.parent) {
                onActiveChange(activeItem.parent.key);
              }
              event.preventDefault();
              break;
            }
            case 'ArrowRight': {
              // Expand if possible
              if (expandable && !currentExpandedKeys.includes(currentActiveKey)) {
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
                if (!currentCheckedKeys.includes(currentActiveKey)) {
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
                  !currentCheckedKeys.includes(currentActiveKey),
                );
              } else if (canSelect) {
                event.preventDefault();
                onNodeSelect({} as React.MouseEvent<HTMLDivElement>, eventNode);
              }
              break;
            }
          }
        }

        mergedPropsRef.current.onKeyDown?.(event);
      },
      [
        getActiveItem,
        getTreeNodeRequiredProps,
        offsetActiveKey,
        onActiveChange,
        onNodeCheck,
        onNodeExpand,
        onNodeSelect,
      ],
    );

    React.useEffect(() => {
      destroyedRef.current = false;
      window.addEventListener('mouseup', onGlobalMouseUp);

      return () => {
        window.removeEventListener('dragend', onWindowDragEnd);
        window.removeEventListener('mouseup', onGlobalMouseUp);
        destroyedRef.current = true;
      };
    }, [onGlobalMouseUp, onWindowDragEnd]);

    React.useEffect(() => {
      if (
        mergedPropsRef.current.activeKey !== undefined &&
        mergedPropsRef.current.activeKey !== stateRef.current.activeKey
      ) {
        setMergedState({
          activeKey: mergedPropsRef.current.activeKey,
        });

        if (mergedPropsRef.current.activeKey !== null) {
          scrollTo({
            key: mergedPropsRef.current.activeKey,
            offset: mergedPropsRef.current.itemScrollOffset || 0,
          });
        }
      }
    }, [activeKey, itemScrollOffset, scrollTo, setMergedState]);

    React.useImperativeHandle(
      ref,
      () => ({
        scrollTo,
        listRef,
        get state() {
          return stateRef.current;
        },
        get destroyed() {
          return destroyedRef.current;
        },
        set destroyed(value) {
          destroyedRef.current = value;
        },
        get delayedDragEnterLogic() {
          return delayedDragEnterLogicRef.current;
        },
        set delayedDragEnterLogic(value) {
          delayedDragEnterLogicRef.current = value;
        },
        get loadingRetryTimes() {
          return loadingRetryTimesRef.current;
        },
        set loadingRetryTimes(value) {
          loadingRetryTimesRef.current = value;
        },
        get dragNodeProps() {
          return dragNodePropsRef.current;
        },
        set dragNodeProps(value) {
          dragNodePropsRef.current = value;
        },
        get currentMouseOverDroppableNodeKey() {
          return currentMouseOverDroppableNodeKeyRef.current;
        },
        set currentMouseOverDroppableNodeKey(value) {
          currentMouseOverDroppableNodeKeyRef.current = value;
        },
        get focusedByMouse() {
          return focusedByMouseRef.current;
        },
        set focusedByMouse(value) {
          focusedByMouseRef.current = value;
        },
        resetDragState,
        cleanDragState,
        getTreeNodeRequiredProps,
        setExpandedKeys,
        onActiveChange,
        getActiveItem,
        offsetActiveKey,
        setUncontrolledState,
        onNodeLoad,
        onNodeExpand,
        triggerExpandActionExpand,
        onNodeClick,
        onNodeDoubleClick,
        onNodeSelect,
        onNodeCheck,
        onNodeMouseEnter,
        onNodeMouseLeave,
        onNodeContextMenu,
        onNodeDragStart,
        onNodeDragEnter,
        onNodeDragOver,
        onNodeDragLeave,
        onNodeDragEnd,
        onNodeDrop,
        onWindowDragEnd,
        onMouseDown,
        onGlobalMouseUp,
        onFocus,
        onBlur,
        onListChangeStart,
        onListChangeEnd,
        onKeyDown,
      }),
      [
        cleanDragState,
        getActiveItem,
        getTreeNodeRequiredProps,
        offsetActiveKey,
        onActiveChange,
        onBlur,
        onFocus,
        onGlobalMouseUp,
        onKeyDown,
        onListChangeEnd,
        onListChangeStart,
        onMouseDown,
        onNodeCheck,
        onNodeClick,
        onNodeContextMenu,
        onNodeDoubleClick,
        onNodeDragEnd,
        onNodeDragEnter,
        onNodeDragLeave,
        onNodeDragOver,
        onNodeDragStart,
        onNodeDrop,
        onNodeExpand,
        onNodeLoad,
        onNodeMouseEnter,
        onNodeMouseLeave,
        onNodeSelect,
        onWindowDragEnd,
        resetDragState,
        scrollTo,
        setExpandedKeys,
        setUncontrolledState,
        triggerExpandActionExpand,
      ],
    );

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
    } = mergedState;

    const domProps = React.useMemo(() => pickAttrs(props, { aria: true, data: true }), [props]);

    const draggableConfig = React.useMemo<DraggableConfig>(() => {
      if (!draggable) {
        return null;
      }

      if (typeof draggable === 'object') {
        return draggable;
      }

      if (typeof draggable === 'function') {
        return {
          nodeDraggable: draggable,
        };
      }

      return {};
    }, [draggable]);

    const memoizedValue = React.useMemo<TreeContextProps<TreeDataType>>(
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
        dropIndicatorRender: mergedDropIndicatorRender,
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
        checkStrictly,
        checkable,
        disabled,
        direction,
        dragOverNodeKey,
        draggableConfig,
        draggingNodeKey,
        dropContainerKey,
        dropLevelOffset,
        dropPosition,
        dropTargetKey,
        filterTreeNode,
        icon,
        indent,
        keyEntities,
        loadData,
        mergedDropIndicatorRender,
        onNodeCheck,
        onNodeClick,
        onNodeContextMenu,
        onNodeDoubleClick,
        onNodeDragEnd,
        onNodeDragEnter,
        onNodeDragLeave,
        onNodeDragOver,
        onNodeDragStart,
        onNodeDrop,
        onNodeExpand,
        onNodeLoad,
        onNodeMouseEnter,
        onNodeMouseLeave,
        onNodeSelect,
        prefixCls,
        selectable,
        showIcon,
        styles,
        switcherIcon,
        titleRender,
        treeClassNames,
      ],
    );

    return (
      <TreeContext.Provider value={memoizedValue}>
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
            {...getTreeNodeRequiredProps()}
            {...domProps}
          />
        </div>
      </TreeContext.Provider>
    );
  },
) as unknown as TreeComponent;

Tree.TreeNode = TreeNode;

export default Tree;
