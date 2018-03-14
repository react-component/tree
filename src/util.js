/* eslint no-loop-func: 0*/
import { Children } from 'react';

export function getPosition(level, index) {
  return `${level}-${index}`;
}

// TODO: replace traverseTreeNodes
export function traverseTreeNodes(treeNodes, subTreeData, callback) {
  if (typeof subTreeData === 'function') {
    callback = subTreeData;
    subTreeData = false;
  }

  function processNode(node, index, parentPos) {
    const children = node ? node.props.children : treeNodes;
    const pos = node ? getPosition(parentPos, index) : 0;

    // Filter children
    const childList = (Array.isArray(children) ? children : [children])
      .filter(child => child && child.type && child.type.isTreeNode);

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key || pos,
        parentPos,
      };

      // Children data is not must have
      if (subTreeData) {
        // Statistic children
        const subTree = [];
        Children.forEach(childList, (subNode, subIndex) => {
          subTree.push({
            node: subNode,
            index: subIndex,
          });
        });
        data.subTree = subTree;
      }

      // Can break traverse by return false
      if (callback(data) === false) {
        return;
      }
    }

    // Process children node
    Children.forEach(childList, (subNode, subIndex) => {
      processNode(subNode, subIndex, pos);
    });
  }

  processNode(null);
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

  traverseTreeNodes(treeNodes, true, ({ node, index, pos, key, childrenPos, parentPos }) => {
    const data = { node, index, pos, key, childrenPos, parentPos };
    statistic.keyNodes[key] = data;
    statistic.posNodes[pos] = data;
    statistic.nodeList.push(data);
  });

  return statistic;
}
