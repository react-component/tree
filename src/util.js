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

export function updateCheckState(obj, checkedPosition, checkIt) {
  const childrenLoop = (parentObj) => {
    parentObj.childrenPos.forEach(childPos => {
      const childObj = obj[childPos];
      // User click don't change disabled item checked state
      if (!childObj.disableCheckbox && !childObj.disabled) {
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
        return;
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
