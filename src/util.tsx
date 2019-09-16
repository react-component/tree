/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */

import React from 'react';
import warning from 'warning';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, Entity, DataEntity } from './interface';
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

export function isCheckDisabled(node: DataNode) {
  const { disabled, disableCheckbox, checkable } = (node || {}) as DataNode;
  return !!(disabled || disableCheckbox) || checkable === false;
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
export function calcDropPosition(event: React.MouseEvent, treeNode: NodeElement) {
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
 * Conduct check state by the keyList. It will conduct up & from the provided key.
 * If the conduct path reach the disabled or already checked / unchecked node will stop conduct.
 */
export function conductCheck(
  /** list of keys */
  keyList: Key[],
  /** is check the node or not */
  isCheck: boolean,
  /** parsed by `convertTreeToEntities` function in Tree */
  keyEntities: Record<Key, DataEntity>,
  /** Can pass current checked status for process (usually for uncheck operation) */
  checkStatus: { checkedKeys?: Key[]; halfCheckedKeys?: Key[] } = {},
) {
  const warningMissKeys: Key[] = [];

  const checkedKeyMap: Map<Key, boolean> = new Map();
  // Record the key has some child checked (include child half checked)
  const halfCheckedKeyMap: Map<Key, boolean> = new Map();

  (checkStatus.checkedKeys || []).forEach(key => {
    checkedKeyMap.set(key, true);
  });

  (checkStatus.halfCheckedKeys || []).forEach(key => {
    halfCheckedKeyMap.set(key, true);
  });

  // Conduct up
  function conductUp(key: Key) {
    if (checkedKeyMap.get(key) === isCheck) return;

    const entity = keyEntities[key];
    if (!entity) return;

    const { children, parent, node } = entity;

    if (isCheckDisabled(node)) return;

    // Check child node checked status
    let everyChildChecked = true;
    let someChildChecked = false; // Child checked or half checked

    if (children && children.length) {
      children.forEach(({ key: childKey, node: childNode }) => {
        if (isCheckDisabled(childNode)) return;

        const childChecked = checkedKeyMap.get(childKey);
        const childHalfChecked = halfCheckedKeyMap.get(childKey);

        if (childChecked || childHalfChecked) someChildChecked = true;
        if (!childChecked) everyChildChecked = false;
      });
    }

    // Update checked status
    if (isCheck) {
      checkedKeyMap.set(key, everyChildChecked);
    } else {
      checkedKeyMap.set(key, false);
    }
    halfCheckedKeyMap.set(key, someChildChecked);

    if (parent) {
      conductUp(parent.key);
    }
  }

  // Conduct down
  function conductDown(key: Key) {
    if (checkedKeyMap.get(key) === isCheck) return;

    const entity = keyEntities[key];
    if (!entity) return;

    const { children, node } = entity;

    if (isCheckDisabled(node)) return;

    checkedKeyMap.set(key, isCheck);

    (children || []).forEach(child => {
      conductDown(child.key);
    });
  }

  function conduct(key: Key) {
    const entity = keyEntities[key];

    if (!entity) {
      warningMissKeys.push(key);
      return;
    }

    const { children, parent, node } = entity;
    checkedKeyMap.set(key, isCheck);

    if (isCheckDisabled(node)) return;

    // Conduct down
    (children || [])
      .filter(child => !isCheckDisabled(child.node))
      .forEach(child => {
        conductDown(child.key);
      });

    // Conduct up
    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conduct(key);
  });

  const checkedKeyList = [];
  const halfCheckedKeyList = [];

  // Fill checked list
  checkedKeyMap.forEach((checked, key) => {
    if (checked) {
      checkedKeyList.push(key);
    }
  });

  // Fill half checked list
  halfCheckedKeyMap.forEach((halfChecked, key) => {
    if (!checkedKeyMap.get(key) && halfChecked) {
      halfCheckedKeyList.push(key);
    }
  });

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map(key => `'${key}'`)
      .join(', ')}`,
  );

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList,
  };
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
