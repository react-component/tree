/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */

import React from 'react';
import warning from 'rc-util/lib/warning';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, Entity, DataEntity, NodeInstance } from './interface';
import { TreeProps } from './Tree';

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
  // for left or right drag
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

function getEntity (treeNode: NodeInstance): DataEntity {
  return ((treeNode.props as any).context.keyEntities as any)[treeNode.props.eventKey]
}

function isLastChild (treeNodeEntity: DataEntity) {
  if (treeNodeEntity.parent) {
    const posArr = posToArr(treeNodeEntity.pos)
    return Number(posArr[posArr.length - 1]) === treeNodeEntity.parent.children.length - 1;
  } else {
    return false
  }
}

// Only used when drag, not affect SSR.
export function calcDropPosition(
  event: React.MouseEvent,
  targetNode: NodeInstance,
  indent: number,
  startMousePosition: {
    x: number,
    y: number,
  }
) : [-1 | 0 | 1, number, DataEntity] {
  const { clientX } = event;
  const { left: selectHandleX } = targetNode.selectHandle.getBoundingClientRect();
  const horizontalMouseOffset = startMousePosition.x - clientX;
  const levelToAscend = horizontalMouseOffset / indent;
  const targetEntity = getEntity(targetNode);

  let abstractDropNodeEntity: DataEntity = getEntity(targetNode);
  let dropPosition: -1 | 0 | 1 = 0;
  let elevatedDropLevel = 0;
  if (
    abstractDropNodeEntity.parent // has parent
  ) {
    for (let i = 0; i < levelToAscend; i += 1) {
      if (isLastChild(abstractDropNodeEntity)) {
        abstractDropNodeEntity = abstractDropNodeEntity.parent;
        elevatedDropLevel += 1;
      } else {
        break;
      }
    }
  }

  // TODO, for the very first item, set dropPosition to -1 on top half area

  if (
    elevatedDropLevel === 0
  ) {
    if (!targetEntity.children?.length) {
      // has no child
      if (levelToAscend > -1) {
        dropPosition = 1;
      } else {
        dropPosition = 0;
      }
    } else {
      // has children
      dropPosition = 0;
    }
  } else {
    dropPosition = 1;
  }

  return [
    dropPosition,
    elevatedDropLevel,
    abstractDropNodeEntity,
  ];
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

// TODO: ========================= NEW LOGIC =========================
interface Wrapper {
  posEntities: Record<string, Entity>;
  keyEntities: Record<Key, Entity>;
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
