/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */

import React from 'react';
import warning from 'rc-util/lib/warning';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, Entity, DataEntity, NodeInstance } from './interface';
import { TreeProps } from './Tree';

const DRAG_SIDE_RANGE = 0.25;
const DRAG_MIN_GAP = 2;

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

export function getDragNodesKeys(dragNodeKey: Key, keyEntities: Record<Key, DataEntity>): Key[] {
  const dragNodesKeys = [dragNodeKey];

  const entity = keyEntities[dragNodeKey];
  function dig(list: DataEntity[] = []) {
    list.forEach(({ key, children }) => {
      dragNodesKeys.push(key);
      dig(children);
    });
  }

  dig(entity.children);

  return dragNodesKeys;
}

// Only used when drag, not affect SSR.
export function calcDropPosition(event: React.MouseEvent, treeNode: NodeInstance) {
  const { clientY } = event;
  const { top, bottom, height } = treeNode.selectHandle.getBoundingClientRect();
  const des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP);

  if (clientY <= top + des) {
    return -1;
  }
  if (clientY >= bottom - des) {
    return 1;
  }

  return 0;
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
export function conductExpandParent(keyList: Key[], keyEntities: Record<Key, DataEntity>) {
  const expandedKeys = {};

  function conductUp(key: Key) {
    if (expandedKeys[key]) return;

    const entity = keyEntities[key];
    if (!entity) return;

    expandedKeys[key] = true;

    const { parent, node } = entity;

    if (node.disabled) return;

    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key);
  });

  return Object.keys(expandedKeys);
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
