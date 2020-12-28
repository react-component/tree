/* eslint-disable no-lonely-if */
/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */

import React from 'react';
import warning from 'rc-util/lib/warning';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, DataEntity, NodeInstance, FlattenNode, Direction } from './interface';
import { TreeProps, AllowDrop } from './Tree';

export function arrDel(list: Key[], value: Key) {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

export function arrAdd(list: Key[], value: Key) {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

export function posToArr(pos: string) {
  return pos.split('-');
}

export function getPosition(level: string | number, index: number) {
  return `${level}-${index}`;
}

export function isTreeNode(node: NodeElement) {
  return node && node.type && node.type.isTreeNode;
}

export function getDragChildrenKeys(dragNodeKey: Key, keyEntities: Record<Key, DataEntity>): Key[] {
  // not contains self
  // self for left or right drag
  const dragChildrenKeys = [];

  const entity = keyEntities[dragNodeKey];
  function dig(list: DataEntity[] = []) {
    list.forEach(({ key, children }) => {
      dragChildrenKeys.push(key);
      dig(children);
    });
  }

  dig(entity.children);

  return dragChildrenKeys;
}

export function isLastChild (treeNodeEntity: DataEntity) {
  if (treeNodeEntity.parent) {
    const posArr = posToArr(treeNodeEntity.pos);
    return Number(posArr[posArr.length - 1]) === treeNodeEntity.parent.children.length - 1;
  }
  return false;
}

export function isFirstChild (treeNodeEntity: DataEntity) {
  const posArr = posToArr(treeNodeEntity.pos);
  return Number(posArr[posArr.length - 1]) === 0;
}

// Only used when drag, not affect SSR.
export function calcDropPosition(
  event: React.MouseEvent,
  targetNode: NodeInstance,
  indent: number,
  startMousePosition: {
    x: number,
    y: number,
  },
  allowDrop: AllowDrop,
  flattenedNodes: FlattenNode[],
  keyEntities: Record<Key, DataEntity>,
  expandKeys: Key[],
  direction: Direction,
): {
  dropPosition: -1 | 0 | 1,
  dropLevelOffset: number,
  dropTargetKey: Key,
  dropTargetPos: string,
  dropContainerKey: Key,
  dragOverNodeKey: Key,
  dropAllowed: boolean,
} {
  const { clientX, clientY } = event;
  const { top, height } = (event.target as HTMLElement).getBoundingClientRect();
  // optional chain for testing
  const horizontalMouseOffset = (direction === 'rtl' ? -1 : 1) * ((startMousePosition?.x || 0) - clientX);
  const rawDropLevelOffset = (horizontalMouseOffset - 12) / indent;

  // find abstract drop node by horizontal offset
  let abstractDropNodeEntity: DataEntity = keyEntities[targetNode.props.eventKey];

  if (clientY < top + height / 2) {
    // first half, set abstract drop node to previous node
    const nodeIndex = flattenedNodes.findIndex(
      flattenedNode => flattenedNode.data.key === abstractDropNodeEntity.key,
    );
    const prevNodeIndex = nodeIndex <= 0 ? 0 : nodeIndex - 1;
    const prevNodeKey = flattenedNodes[prevNodeIndex].data.key;
    abstractDropNodeEntity = keyEntities[prevNodeKey];
  }

  const abstractDragOverEntity = abstractDropNodeEntity;
  const dragOverNodeKey = abstractDropNodeEntity.key;

  let dropPosition: -1 | 0 | 1 = 0;
  let dropLevelOffset = 0;
  for (let i = 0; i < rawDropLevelOffset; i += 1) {
    if (
      isLastChild(abstractDropNodeEntity)
    ) {
      abstractDropNodeEntity = abstractDropNodeEntity.parent;
      dropLevelOffset += 1;
    } else {
      break;
    }
  }

  const abstractDropDataNode = abstractDropNodeEntity.node
  let dropAllowed = true;
  if (
    isFirstChild(abstractDropNodeEntity) &&
    abstractDropNodeEntity.level === 0 &&
    clientY < top + height / 2 &&
    allowDrop({
      dropNode: abstractDropDataNode,
      dropPosition: -1,
    }) &&
    abstractDropNodeEntity.key === targetNode.props.eventKey
  ) {
    // first half of first node in first level
    dropPosition = -1
  } else if (
    (abstractDragOverEntity.children || []).length &&
    expandKeys.includes(dragOverNodeKey)
  ) {
    // drop on expanded node
    // only allow drop inside
    if (allowDrop({
      dropNode: abstractDropDataNode,
      dropPosition: 0,
    })) {
      dropPosition = 0;
    } else {
      dropAllowed = false
    }
  } else if (
    dropLevelOffset === 0
  ) {
    if (rawDropLevelOffset > -1.5) {
      // | Node     | <- abstractDropNode
      // | -^-===== | <- mousePosition
      // 1. try drop after
      // 2. do not allow drop
      if (allowDrop({
        dropNode: abstractDropDataNode,
        dropPosition: 1,
      })) {
        dropPosition = 1;
      } else {
        dropAllowed = false;
      }
    } else {
      // | Node     | <- abstractDropNode
      // | ---==^== | <- mousePosition
      // whether it has children or doesn't has children
      // always
      // 1. try drop inside
      // 2. try drop after
      // 3. do not allow drop
      if (allowDrop({
        dropNode: abstractDropDataNode,
        dropPosition: 0,
      })) {
        dropPosition = 0;
      } else if (allowDrop({
        dropNode: abstractDropDataNode,
        dropPosition: 1,
      })) {
        dropPosition = 1;
      } else {
        dropAllowed = false;
      }
    }
  } else {
    // | Node1 | <- abstractDropNode
    //      |  Node2  |
    // --^--|----=====| <- mousePosition
    // 1. try insert after Node1
    // 2. do not allow drop
    if (allowDrop({
      dropNode: abstractDropDataNode,
      dropPosition: 1,
    })) {
      dropPosition = 1;
    } else {
      dropAllowed = false;
    }
  }

  return {
    dropPosition,
    dropLevelOffset,
    dropTargetKey: abstractDropNodeEntity.key,
    dropTargetPos: abstractDropNodeEntity.pos,
    dragOverNodeKey,
    dropContainerKey: dropPosition === 0 ? null : (abstractDropNodeEntity.parent?.key || null),
    dropAllowed,
  };
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys(selectedKeys: Key[], props: TreeProps) {
  if (!selectedKeys) return undefined;

  const { multiple } = props;
  if (multiple) {
    return selectedKeys.slice();
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]];
  }
  return selectedKeys;
}

const internalProcessProps = (props: DataNode): Partial<TreeNodeProps> => props;
export function convertDataToTree(
  treeData: DataNode[],
  processor?: { processProps: (prop: DataNode) => any },
): NodeElement[] {
  if (!treeData) return [];

  const { processProps = internalProcessProps } = processor || {};
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(
    ({ children, ...props }): NodeElement => {
      const childrenNodes = convertDataToTree(children, processor);

      return <TreeNode {...processProps(props)}>{childrenNodes}</TreeNode>;
    },
  );
}

/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
export function parseCheckedKeys(keys: Key[] | { checked: Key[]; halfChecked: Key[] }) {
  if (!keys) {
    return null;
  }

  // Convert keys to object format
  let keyProps;
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    };
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    };
  } else {
    warning(false, '`checkedKeys` is not an array or an object');
    return null;
  }

  return keyProps;
}

/**
 * If user use `autoExpandParent` we should get the list of parent node
 * @param keyList
 * @param keyEntities
 */
export function conductExpandParent(keyList: Key[], keyEntities: Record<Key, DataEntity>): Key[] {
  const expandedKeys = new Set<Key>();

  function conductUp(key: Key) {
    if (expandedKeys.has(key)) return;

    const entity = keyEntities[key];
    if (!entity) return;

    expandedKeys.add(key);

    const { parent, node } = entity;

    if (node.disabled) return;

    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key);
  });

  return [...expandedKeys];
}

/**
 * Returns only the data- and aria- key/value pairs
 */
export function getDataAndAria(props: Partial<TreeProps | TreeNodeProps>) {
  const omitProps: Record<string, string> = {};
  Object.keys(props).forEach(key => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      omitProps[key] = props[key];
    }
  });

  return omitProps;
}
