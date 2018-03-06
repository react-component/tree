/* eslint no-loop-func: 0*/
import { Children } from 'react';

export function getPosition(level, index) {
  return `${level}-${index}`;
}

// TODO: Refactor this when TreeNode is not tacked by `key`
/**
 * [Legacy] Loop the TreeNode by children.
 * `pos` re-calculation can't avoid since Tree children is by `cloneElement`.
 * @param treeNodes
 * @param callback
 */
export function traverseTreeNodes(treeNodes, callback) {
  const traverse = (subTreeNodes, level, parentsChildrenPos, parentPos) => {
    if (Array.isArray(subTreeNodes)) {
      subTreeNodes = subTreeNodes.filter(item => !!item);
    }
    Children.forEach(subTreeNodes, (item, index) => {
      const pos = getPosition(level, index);
      parentsChildrenPos.push(pos); // Note: side effect

      const childrenPos = [];
      const stopTraverse = callback(
        item,
        index,
        pos,
        item.key || pos,
        childrenPos,
        parentPos
      ) === false;
      if (!stopTraverse && (
        item.props.children && item.type && item.type.isTreeNode
      )) {
        traverse(item.props.children, pos, childrenPos, pos);
      }
    });
  };
  traverse(treeNodes, 0, []);
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
  traverseTreeNodes(treeNodes, (item, index, pos, key) => {
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
  if (!parentPos || !childPos || parentPos.length <= childPos.length) return false;

  const parentPath = parentPos.split('-');
  const childPath = childPos.split('-');

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

  traverseTreeNodes(treeNodes, (node, index, pos, key) => {
    const data = { node, index, pos, key };
    statistic.keyNodes[key] = data;
    statistic.posNodes[pos] = data;
    statistic.nodeList.push(data);
  });

  return statistic;
}
