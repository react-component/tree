/* eslint no-loop-func: 0*/
import { Children } from 'react';

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
  if (!clone.includes(value)) {
    clone.push(value);
  }
  return clone;
}

export function posToArr(pos) {
  return pos.split('-');
}

// Only used when drag, not affect SSR.
export function getOffset(ele) {
  if (!ele.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = ele.getBoundingClientRect();
  if (rect.width || rect.height) {
    const doc = ele.ownerDocument;
    const win = doc.defaultView;
    const docElem = doc.documentElement;

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft,
    };
  }

  return rect;
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
  return disabled || disableCheckbox;
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

export function calcDropPosition(event, treeNode) {
  const offsetTop = getOffset(treeNode.selectHandle).top;
  const offsetHeight = treeNode.selectHandle.offsetHeight;
  const pageY = event.pageY;
  const gapHeight = 2; // TODO: remove hard code
  if (pageY > offsetTop + offsetHeight - gapHeight) {
    return 1;
  }
  if (pageY < offsetTop + gapHeight) {
    return -1;
  }
  return 0;
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

  const calcCheckedKeys = {};
  const calcHalfCheckedKeys = {};

  // Conduct up
  function conductUp(key) {
    if (calcCheckedKeys[key]) return;

    const { subNodes = [], parentPos, node } = keyNodes[key];
    if (isCheckDisabled(node)) return;

    calcCheckedKeys[key] = true;

    const allSubChecked = subNodes
      .filter(sub => !isCheckDisabled(sub))
      .every(sub => calcCheckedKeys[sub.key]);

    if (allSubChecked) {
      calcCheckedKeys[key] = true;

      if (parentPos !== null) {
        conductUp(posNodes[parentPos].key);
      }
    }
  }

  // Conduct down
  function conductDown(key) {
    if (calcCheckedKeys[key]) return;
    const { subNodes = [] } = keyNodes[key];

    calcCheckedKeys[key] = true;

    subNodes.forEach((sub) => {
      conductDown(sub.key);
    });
  }

  function conduct(key) {
    const { subNodes = [], parentPos, node } = keyNodes[key];
    if (isCheckDisabled(node)) return;

    calcCheckedKeys[key] = true;

    // Conduct down
    subNodes
      .filter(sub => !isCheckDisabled(sub))
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

  // TODO: half checked

  return {
    checkedKeys: Object.keys(calcCheckedKeys),
    halfCheckedKeys: Object.keys(calcHalfCheckedKeys),
  };
}
