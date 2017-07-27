/* eslint no-loop-func: 0*/
import { Children } from 'react';

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

function getPositionFlag(index, len) {
  return {
    first: index === 0,
    last: index === len - 1,
  };
}

export function traverseTreeNodes(treeNodes, callback) {
  const traverse = (subTreeNodes, level, parentsChildrenPos, parentPos) => {
    const len = Children.count(subTreeNodes);
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
        getPositionFlag(index, len),
        childrenPos,
        parentPos
      );
    });
  };
  traverse(treeNodes, 0, []);
}

export function updateCheckState(obj, checkedPosition, checkIt) {
  const childrenLoop = (parentObj) => {
    parentObj.childrenPos.forEach(childPos => {
      const childObj = obj[childPos];
      if (!childObj.disableCheckbox) {
        childObj.halfChecked = false;
        childObj.checked = checkIt;
      }
      childrenLoop(childObj);
    });
  };

  childrenLoop(obj[checkedPosition]);

  const parentLoop = (childObj) => {
    if (!childObj.parentPos) return;
    const parentObj = obj[childObj.parentPos];

    let childrenCount = parentObj.childrenPos.length;

    let checkedChildrenCount = 0;
    parentObj.childrenPos.forEach(childPos => {
      if (obj[childPos].disableCheckbox) {
        childrenCount -= 1;
      }
      if (obj[childPos].checked === true) checkedChildrenCount++;
      else if (obj[childPos].halfChecked === true) checkedChildrenCount += 0.5;
    });

    if (checkedChildrenCount === childrenCount) {
      parentObj.checked = true;
      parentObj.halfChecked = false;
    } else if (checkedChildrenCount > 0) {
      parentObj.halfChecked = true;
      parentObj.checked = false;
    } else {
      parentObj.checked = false;
      parentObj.halfChecked = false;
    }
    parentLoop(parentObj);
  };

  parentLoop(obj[checkedPosition]);
}

export function getCheck(treeNodesStates) {
  const halfCheckedKeys = [];
  const checkedKeys = [];
  const checkedNodes = [];
  const checkedNodesPositions = [];
  Object.keys(treeNodesStates).forEach((item) => {
    const itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      checkedNodes.push(itemObj.node);
      checkedNodesPositions.push({ node: itemObj.node, pos: item });
    } else if (itemObj.halfChecked) {
      halfCheckedKeys.push(itemObj.key);
    }
  });
  return {
    halfCheckedKeys,
    checkedKeys,
    checkedNodes,
    checkedNodesPositions,
  };
}

export function getStrictlyValue(checkedKeys, halfChecked) {
  if (halfChecked) {
    return { checked: checkedKeys, halfChecked };
  }
  return checkedKeys;
}

export function isInclude(smallArray, bigArray) {
  return smallArray.every((item, index) => {
    return item === bigArray[index];
  });
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a === null || typeof a === 'undefined' || b === null || typeof b === 'undefined') {
    return false;
  }
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
