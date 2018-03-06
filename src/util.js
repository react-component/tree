/* eslint no-loop-func: 0*/
import { Children } from 'react';

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
      const pos = `${level}-${index}`;
      parentsChildrenPos.push(pos); // Note: side effect

      const childrenPos = [];
      if (item.props.children && item.type && item.type.isTreeNode) {
        traverse(item.props.children, pos, childrenPos, pos);
      }
      callback(
        item,
        index,
        pos,
        item.key || pos,
        childrenPos,
        parentPos
      );
    });
  };
  traverse(treeNodes, 0, []);
}

/**
 * [Legacy] Calculate is smallPos in the bigPos
 * @param smallPos
 * @param bigPos
 * @returns {boolean}
 */
export function isPositionPrefix(smallPos, bigPos) {
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if ((bigPos.length > smallPos.length) && (bigPos.charAt(smallPos.length) !== '-')) {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}

export function getFullKeyList(treeNodes) {
  const keyList = [];
  traverseTreeNodes(treeNodes, (item, index, pos, key) => {
    keyList.push(key);
  });
  return keyList;
}
