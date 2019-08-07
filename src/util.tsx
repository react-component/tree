import React, { Children } from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import warning from 'warning';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, Entity } from './interface';
import { TreeProps } from './Tree';

const DRAG_SIDE_RANGE = 0.25;
const DRAG_MIN_GAP = 2;

let onlyTreeNodeWarned = false;

export function warnOnlyTreeNode() {
  if (onlyTreeNodeWarned) return;

  onlyTreeNodeWarned = true;
  warning(false, 'Tree only accept TreeNode as children.');
}

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

export function getNodeChildren(children: React.ReactNode) {
  return toArray(children).filter(isTreeNode);
}

export function isCheckDisabled(node: NodeElement) {
  const { disabled, disableCheckbox, checkable } = (node.props || {}) as NodeElement['props'];
  return !!(disabled || disableCheckbox) || checkable === false;
}

export function traverseTreeNodes(
  treeNodes: NodeElement[],
  callback: (data: {
    node: NodeElement;
    index: number;
    pos: string | number;
    key: Key;
    parentPos: string | number;
  }) => void,
) {
  function processNode(
    node: NodeElement,
    index?: number,
    parent?: { node: NodeElement; pos: string | number },
  ) {
    const children = node ? node.props.children : treeNodes;
    const pos = node ? getPosition(parent.pos, index) : 0;

    // Filter children
    const childList = getNodeChildren(children);

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null,
      };

      callback(data);
    }

    // Process children node
    Children.forEach(childList, (subNode, subIndex) => {
      processNode(subNode, subIndex, { node, pos });
    });
  }

  processNode(null);
}

/**
 * Use `rc-util` `toArray` to get the children list which keeps the key.
 * And return single node if children is only one(This can avoid `key` missing check).
 */
export function mapChildren(
  children: React.ReactNode,
  func: (node: NodeElement, index: number) => React.ReactElement,
) {
  const list = toArray(children).map(func);
  if (list.length === 1) {
    return list[0];
  }
  return list;
}

export function getDragNodesKeys(treeNodes: NodeElement[], node: NodeElement) {
  const { eventKey, pos } = node.props;
  const dragNodesKeys = [];

  traverseTreeNodes(treeNodes, ({ key }) => {
    dragNodesKeys.push(key);
  });
  dragNodesKeys.push(eventKey || pos);
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

/**
 * Since React internal will convert key to string,
 * we need do this to avoid `checkStrictly` use number match
 */
function keyListToString(keyList: Key[]) {
  if (!keyList) return keyList;
  return keyList.map(key => String(key));
}

const internalProcessProps = (props: DataNode): Partial<TreeNodeProps> => props;
export function convertDataToTree(
  treeData: DataNode[],
  processor?: { processProps: (prop: DataNode) => any },
): React.ReactNode {
  if (!treeData) return [];

  const { processProps = internalProcessProps } = processor || {};
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = convertDataToTree(children, processor);

    return <TreeNode {...processProps(props)}>{childrenNodes}</TreeNode>;
  });
}

// TODO: ========================= NEW LOGIC =========================
interface Wrapper {
  posEntities: Record<string, Entity>;
  keyEntities: Record<Key, Entity>;
}

/**
 * Calculate treeNodes entities. `processTreeEntity` is used for `rc-tree-select`
 * @param treeNodes
 * @param processTreeEntity  User can customize the entity
 */
export function convertTreeToEntities(
  treeNodes: NodeElement[],
  {
    initWrapper,
    processEntity,
    onProcessFinished,
  }: {
    initWrapper?: (wrapper: Wrapper) => Wrapper;
    processEntity?: (entity: Entity, wrapper: Wrapper) => void;
    onProcessFinished?: (wrapper: Wrapper) => void;
  } = {},
) {
  const posEntities = {};
  const keyEntities = {};
  let wrapper = {
    posEntities,
    keyEntities,
  };

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }

  traverseTreeNodes(treeNodes, item => {
    const { node, index, pos, key, parentPos } = item;
    const entity: Entity = { node, index, key, pos };

    posEntities[pos] = entity;
    keyEntities[key] = entity;

    // Fill children
    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }

    if (processEntity) {
      processEntity(entity, wrapper);
    }
  });

  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }

  return wrapper;
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

  keyProps.checkedKeys = keyListToString(keyProps.checkedKeys);
  keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys);

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
  keyEntities: Record<Key, Entity>,
  /** Can pass current checked status for process (usually for uncheck operation) */
  checkStatus: { checkedKeys?: Key[]; halfCheckedKeys?: Key[] } = {},
) {
  const checkedKeys = {};
  const halfCheckedKeys = {}; // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach(key => {
    checkedKeys[key] = true;
  });

  (checkStatus.halfCheckedKeys || []).forEach(key => {
    halfCheckedKeys[key] = true;
  });

  // Conduct up
  function conductUp(key: Key) {
    if (checkedKeys[key] === isCheck) return;

    const entity = keyEntities[key];
    if (!entity) return;

    const { children, parent, node } = entity;

    if (isCheckDisabled(node)) return;

    // Check child node checked status
    let everyChildChecked = true;
    let someChildChecked = false; // Child checked or half checked

    (children || [])
      .filter(child => !isCheckDisabled(child.node))
      .forEach(({ key: childKey }) => {
        const childChecked = checkedKeys[childKey];
        const childHalfChecked = halfCheckedKeys[childKey];

        if (childChecked || childHalfChecked) someChildChecked = true;
        if (!childChecked) everyChildChecked = false;
      });

    // Update checked status
    if (isCheck) {
      checkedKeys[key] = everyChildChecked;
    } else {
      checkedKeys[key] = false;
    }
    halfCheckedKeys[key] = someChildChecked;

    if (parent) {
      conductUp(parent.key);
    }
  }

  // Conduct down
  function conductDown(key: Key) {
    if (checkedKeys[key] === isCheck) return;

    const entity = keyEntities[key];
    if (!entity) return;

    const { children, node } = entity;

    if (isCheckDisabled(node)) return;

    checkedKeys[key] = isCheck;

    (children || []).forEach(child => {
      conductDown(child.key);
    });
  }

  function conduct(key: Key) {
    const entity = keyEntities[key];

    if (!entity) {
      warning(false, `'${key}' does not exist in the tree.`);
      return;
    }

    const { children, parent, node } = entity;
    checkedKeys[key] = isCheck;

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
  Object.keys(checkedKeys).forEach(key => {
    if (checkedKeys[key]) {
      checkedKeyList.push(key);
    }
  });

  // Fill half checked list
  Object.keys(halfCheckedKeys).forEach(key => {
    if (!checkedKeys[key] && halfCheckedKeys[key]) {
      halfCheckedKeyList.push(key);
    }
  });

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
export function conductExpandParent(keyList: Key[], keyEntities: Record<Key, Entity>) {
  const expandedKeys = {};

  function conductUp(key: Key) {
    if (expandedKeys[key]) return;

    const entity = keyEntities[key];
    if (!entity) return;

    expandedKeys[key] = true;

    const { parent, node } = entity;

    if (isCheckDisabled(node)) return;

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
  return Object.keys(props).reduce((prev, key) => {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
}
