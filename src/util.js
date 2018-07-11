import React, { Children } from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import warning from 'warning';
import TreeNode from './TreeNode';

const DRAG_SIDE_RANGE = 0.25;
const DRAG_MIN_GAP = 2;

export function arrDel(list, value) {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

export function arrAdd(list, value) {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

export function posToArr(pos) {
  return pos.split('-');
}

export function getPosition(level, index) {
  return `${level}-${index}`;
}

export function getNodeChildren(children) {
  const childList = Array.isArray(children) ? children : [children];
  return childList
    .filter(child => child && child.type && child.type.isTreeNode);
}

export function isCheckDisabled(node) {
  const { disabled, disableCheckbox } = node.props || {};
  return !!(disabled || disableCheckbox);
}

export function traverseTreeNodes(treeNodes, subTreeData, callback) {
  if (typeof subTreeData === 'function') {
    callback = subTreeData;
    subTreeData = false;
  }

  function processNode(node, index, parent) {
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

      // Children data is not must have
      if (subTreeData) {
        // Statistic children
        const subNodes = [];
        Children.forEach(childList, (subNode, subIndex) => {
          // Provide limit snapshot
          const subPos = getPosition(pos, index);
          subNodes.push({
            node: subNode,
            key: subNode.key || subPos,
            pos: subPos,
            index: subIndex,
          });
        });
        data.subNodes = subNodes;
      }

      // Can break traverse by return false
      if (callback(data) === false) {
        return;
      }
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
export function mapChildren(children, func) {
  const list = toArray(children).map(func);
  if (list.length === 1) {
    return list[0];
  }
  return list;
}

/**
 * [Legacy] Return halfChecked when it has value.
 * @param checkedKeys
 * @param halfChecked
 * @returns {*}
 */
export function getStrictlyValue(checkedKeys, halfChecked) {
  if (halfChecked) {
    return { checked: checkedKeys, halfChecked };
  }
  return checkedKeys;
}

export function getFullKeyList(treeNodes) {
  const keyList = [];
  traverseTreeNodes(treeNodes, ({ key }) => {
    keyList.push(key);
  });
  return keyList;
}

/**
 * Check position relation.
 * @param parentPos
 * @param childPos
 * @param directly only directly parent can be true
 * @returns {boolean}
 */
export function isParent(parentPos, childPos, directly = false) {
  if (!parentPos || !childPos || parentPos.length > childPos.length) return false;

  const parentPath = posToArr(parentPos);
  const childPath = posToArr(childPos);

  // Directly check
  if (directly && parentPath.length !== childPath.length - 1) return false;

  const len = parentPath.length;
  for (let i = 0; i < len; i += 1) {
    if (parentPath[i] !== childPath[i]) return false;
  }

  return true;
}

/**
 * Statistic TreeNodes info
 * @param treeNodes
 * @returns {{}}
 */
export function getNodesStatistic(treeNodes) {
  const statistic = {
    keyNodes: {},
    posNodes: {},
    nodeList: [],
  };

  traverseTreeNodes(treeNodes, true, ({ node, index, pos, key, subNodes, parentPos }) => {
    const data = { node, index, pos, key, subNodes, parentPos };
    statistic.keyNodes[key] = data;
    statistic.posNodes[pos] = data;
    statistic.nodeList.push(data);
  });

  return statistic;
}

export function getDragNodesKeys(treeNodes, node) {
  const { eventKey, pos } = node.props;
  const dragNodesKeys = [];

  traverseTreeNodes(treeNodes, ({ pos: nodePos, key }) => {
    if (isParent(pos, nodePos)) {
      dragNodesKeys.push(key);
    }
  });
  dragNodesKeys.push(eventKey || pos);
  return dragNodesKeys;
}

// Only used when drag, not affect SSR.
export function calcDropPosition(event, treeNode) {
  const { clientY } = event;
  const { top, bottom, height } = treeNode.selectHandle.getBoundingClientRect();
  const des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP);

  if (clientY <= top + des) {
    return -1;
  } else if (clientY >= bottom - des) {
    return 1;
  }

  return 0;
}

/**
 * Auto expand all related node when sub node is expanded
 * @param keyList
 * @param props
 * @returns [string]
 */
export function calcExpandedKeys(keyList, props) {
  if (!keyList) {
    return [];
  }

  const { children } = props;

  // Fill parent expanded keys
  const { keyNodes, nodeList } = getNodesStatistic(children);
  const needExpandKeys = {};
  const needExpandPathList = [];

  // Fill expanded nodes
  keyList.forEach((key) => {
    const node = keyNodes[key];
    if (node) {
      needExpandKeys[key] = true;
      needExpandPathList.push(node.pos);
    }
  });

  // Match parent by path
  nodeList.forEach(({ pos, key }) => {
    if (needExpandPathList.some(childPos => isParent(pos, childPos))) {
      needExpandKeys[key] = true;
    }
  });

  const calcExpandedKeyList = Object.keys(needExpandKeys);

  // [Legacy] Return origin keyList if calc list is empty
  return calcExpandedKeyList.length ? calcExpandedKeyList : keyList;
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys(selectedKeys, props) {
  if (!selectedKeys) {
    return undefined;
  }

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
 * Check conduct is by key level. It pass though up & down.
 * When conduct target node is check means already conducted will be skip.
 * @param treeNodes
 * @param checkedKeys
 * @returns {{checkedKeys: Array, halfCheckedKeys: Array}}
 */
export function calcCheckStateConduct(treeNodes, checkedKeys) {
  const { keyNodes, posNodes } = getNodesStatistic(treeNodes);

  const tgtCheckedKeys = {};
  const tgtHalfCheckedKeys = {};

  // Conduct up
  function conductUp(key, halfChecked) {
    if (tgtCheckedKeys[key]) return;

    const { subNodes = [], parentPos, node } = keyNodes[key];
    if (isCheckDisabled(node)) return;

    const allSubChecked = !halfChecked && subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .every(sub => tgtCheckedKeys[sub.key]);

    if (allSubChecked) {
      tgtCheckedKeys[key] = true;
    } else {
      tgtHalfCheckedKeys[key] = true;
    }

    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key, !allSubChecked);
    }
  }

  // Conduct down
  function conductDown(key) {
    if (tgtCheckedKeys[key]) return;
    const { subNodes = [], node } = keyNodes[key];

    if (isCheckDisabled(node)) return;

    tgtCheckedKeys[key] = true;

    subNodes.forEach((sub) => {
      conductDown(sub.key);
    });
  }

  function conduct(key) {
    if (!keyNodes[key]) {
      warning(false, `'${key}' does not exist in the tree.`);
      return;
    }

    const { subNodes = [], parentPos, node } = keyNodes[key];
    tgtCheckedKeys[key] = true;

    if (isCheckDisabled(node)) return;

    // Conduct down
    subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .forEach((sub) => {
        conductDown(sub.key);
      });

    // Conduct up
    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key);
    }
  }

  checkedKeys.forEach((key) => {
    conduct(key);
  });

  return {
    checkedKeys: Object.keys(tgtCheckedKeys),
    halfCheckedKeys: Object.keys(tgtHalfCheckedKeys)
      .filter(key => !tgtCheckedKeys[key]),
  };
}

/**
 * Since React internal will convert key to string,
 * we need do this to avoid `checkStrictly` use number match
 */
function keyListToString(keyList) {
  if (!keyList) return keyList;
  return keyList.map(key => String(key));
}

/**
 * Calculate the value of checked and halfChecked keys.
 * This should be only run in init or props changed.
 */
export function calcCheckedKeys(keys, props) {
  const { checkable, children, checkStrictly } = props;

  if (!checkable || !keys) {
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
    warning(false, '`CheckedKeys` is not an array or an object');
    return null;
  }

  keyProps.checkedKeys = keyListToString(keyProps.checkedKeys);
  keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys);

  // Do nothing if is checkStrictly mode
  if (checkStrictly) {
    return keyProps;
  }

  // Conduct calculate the check status
  const { checkedKeys = [] } = keyProps;
  return calcCheckStateConduct(children, checkedKeys);
}

export function convertDataToTree(treeData) {
  if (!treeData) return [];
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = (children || []).map(convertDataToTree);

    return (
      <TreeNode {...props}>
        {childrenNodes}
      </TreeNode>
    );
  });
}

// TODO: ========================= NEW LOGIC =========================
/**
 * Calculate treeNodes entities.
 * @param treeNodes
 * @param processTreeEntity  User can customize the entity
 */
export function convertTreeToEntities(treeNodes, processTreeEntity) {
  const posEntities = {};
  const keyEntities = {};
  const wrapper = {
    posEntities,
    keyEntities,
  };

  traverseTreeNodes(treeNodes, (item) => {
    const { node, index, pos, key, parentPos } = item;
    const entity = { node, index, key, pos };

    posEntities[pos] = entity;
    keyEntities[key] = entity;

    // Fill children
    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }

    if (processTreeEntity) {
      processTreeEntity(entity, wrapper);
    }
  });

  return wrapper;
}

export function conductCheck(keyList, isCheck, keyEntities, checkStatus = {}) {
  const checkedKeys = {};
  const halfCheckedKeys = {}; // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach((key) => {
    checkedKeys[key] = true;
  });

  (checkStatus.halfCheckedKeys || []).forEach((key) => {
    halfCheckedKeys[key] = true;
  });

  // Conduct up
  function conductUp(key) {
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
  function conductDown(key) {
    if (checkedKeys[key] === isCheck) return;

    const entity = keyEntities[key];
    if (!entity) return;

    const { children, node } = entity;

    if (isCheckDisabled(node)) return;

    checkedKeys[key] = isCheck;

    (children || []).forEach((child) => {
      conductDown(child.key);
    });
  }

  function conduct(key) {
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
      .forEach((child) => {
        conductDown(child.key);
      });

    // Conduct up
    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach((key) => {
    conduct(key);
  });

  const checkedKeyList = [];
  const halfCheckedKeyList = [];

  // Fill checked list
  Object.keys(checkedKeys).forEach((key) => {
    if (checkedKeys[key]) {
      checkedKeyList.push(key);
    }
  });

  // Fill half checked list
  Object.keys(halfCheckedKeys).forEach((key) => {
    if (!checkedKeys[key] && halfCheckedKeys[key]) {
      halfCheckedKeyList.push(key);
    }
  });

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList,
  };
}
