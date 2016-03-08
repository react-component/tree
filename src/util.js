import React from 'react';

export function browser(navigator) {
  let tem;
  const ua = navigator.userAgent;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  tem = ua.match(/version\/(\d+)/i);
  if (tem) {
    M.splice(1, 1, tem[1]);
  }
  return M.join(' ');
}

// export function getOffset(el) {
//   const obj = el.getBoundingClientRect();
//   return {
//     left: obj.left + document.body.scrollLeft,
//     top: obj.top + document.body.scrollTop,
//     width: obj.width,
//     height: obj.height
//   };
// }

// // iscroll offset
// offset = function (el) {
//   var left = -el.offsetLeft,
//     top = -el.offsetTop;

//   // jshint -W084
//   while (el = el.offsetParent) {
//     left -= el.offsetLeft;
//     top -= el.offsetTop;
//   }
//   // jshint +W084

//   return {
//     left: left,
//     top: top
//   };
// }

export function getOffset(ele) {
  let el = ele;
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

function getChildrenlength(children) {
  let len = 1;
  if (Array.isArray(children)) {
    len = children.length;
  }
  return len;
}

function getSiblingPosition(index, len, siblingPosition) {
  if (len === 1) {
    siblingPosition.first = true;
    siblingPosition.last = true;
  } else {
    siblingPosition.first = index === 0;
    siblingPosition.last = index === len - 1;
  }
  return siblingPosition;
}

export function loopAllChildren(childs, callback) {
  const loop = (children, level) => {
    const len = getChildrenlength(children);
    React.Children.forEach(children, (item, index) => {
      const pos = `${level}-${index}`;
      if (item.props.children && item.type && item.type.isTreeNode) {
        loop(item.props.children, pos);
      }
      callback(item, index, pos, item.key || pos, getSiblingPosition(index, len, {}));
    });
  };
  loop(childs, 0);
}

export function isInclude(smallArray, bigArray) {
  return smallArray.every((ii, i) => {
    return ii === bigArray[i];
  });
}
// console.log(isInclude(['0', '1'], ['0', '10', '1']));

function uniqueArray(arr) {
  const obj = {};
  arr.forEach(item => {
    if (!obj[item]) {
      obj[item] = true;
    }
  });
  return Object.keys(obj);
}
// console.log(uniqueArray(['11', '2', '2']));

export function filterParentPosition(arr) {
  const a = [].concat(arr);
  arr.forEach((item) => {
    const itemArr = item.split('-');
    a.forEach((ii, index) => {
      const iiArr = ii.split('-');
      if (itemArr.length <= iiArr.length && isInclude(itemArr, iiArr)) {
        a[index] = item;
      }
      if (itemArr.length > iiArr.length && isInclude(iiArr, itemArr)) {
        a[index] = ii;
      }
    });
  });
  return uniqueArray(a);
}
// console.log(filterParentPosition(['0-2', '0-10', '0-0-1', '0-1-1', '0-0','0-1', '0-10-0']));

// TODO 效率差, 需要缓存优化
function handleCheckState(obj, checkedPositionArr, checkIt) {
  const stripTail = (str) => {
    const arr = str.match(/(.+)(-[^-]+)$/);
    let st = '';
    if (arr && arr.length === 3) {
      st = arr[1];
    }
    return st;
  };
  // console.log(stripTail('0-101-000'));
  const splitPosition = (pos) => {
    return pos.split('-');
  };
  checkedPositionArr.forEach((_pos) => {
    // 设置子节点，全选或全不选
    const _posArr = splitPosition(_pos);
    Object.keys(obj).forEach((i) => {
      const iArr = splitPosition(i);
      if (iArr.length > _posArr.length && isInclude(_posArr, iArr)) {
        obj[i].checkPart = false;
        obj[i].checked = checkIt;
      }
    });
    // 循环设置父节点的 选中 或 半选状态
    const loop = (__pos) => {
      const _posLen = splitPosition(__pos).length;
      if (_posLen <= 2) { // e.g. '0-0', '0-1'
        return;
      }
      let sibling = 0;
      let siblingChecked = 0;
      const parentPosition = stripTail(__pos);
      Object.keys(obj).forEach((i) => {
        const iArr = splitPosition(i);
        if (iArr.length === _posLen && isInclude(splitPosition(parentPosition), iArr)) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
          } else if (obj[i].checkPart) {
            siblingChecked += 0.5;
          }
        }
      });
      const parent = obj[parentPosition];
      // sibling 不会等于0
      // 全不选 - 全选 - 半选
      if (siblingChecked === 0) {
        parent.checked = false;
        parent.checkPart = false;
      } else if (siblingChecked === sibling) {
        parent.checked = true;
        parent.checkPart = false;
      } else {
        parent.checkPart = true;
        parent.checked = false;
      }
      loop(parentPosition);
    };
    loop(_pos);
  });
}

function getCheckKeys(treeNodesStates) {
  const checkPartKeys = [];
  const checkedKeys = [];
  const checkedNodes = [];
  const checkedNodesPositions = [];
  Object.keys(treeNodesStates).forEach((item) => {
    const itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      checkedNodes.push(itemObj.node);
      checkedNodesPositions.push({node: itemObj.node, pos: item});
    } else if (itemObj.checkPart) {
      checkPartKeys.push(itemObj.key);
    }
  });
  return {
    checkPartKeys, checkedKeys, checkedNodes, checkedNodesPositions, treeNodesStates,
  };
}

export function getTreeNodesStates(children, checkedKeys, checkIt, unCheckKey) {
  const checkedPosition = [];
  const treeNodesStates = {};
  loopAllChildren(children, (item, index, pos, keyOrPos, siblingPosition) => {
    let checked = false;
    if (checkedKeys.indexOf(keyOrPos) !== -1) {
      checked = true;
      checkedPosition.push(pos);
    }
    treeNodesStates[pos] = {
      node: item,
      key: keyOrPos,
      checked: checked,
      checkPart: false,
      siblingPosition,
    };
  });

  // debugger
  handleCheckState(treeNodesStates, filterParentPosition(checkedPosition.sort()), true);

  if (!checkIt && unCheckKey) {
    let pos;
    Object.keys(treeNodesStates).forEach((item) => {
      const itemObj = treeNodesStates[item];
      if (itemObj.key === unCheckKey) {
        pos = item;
        itemObj.checked = checkIt;
        itemObj.checkPart = false;
      }
    });
    handleCheckState(treeNodesStates, [pos], checkIt);
  }

  return getCheckKeys(treeNodesStates);
}
