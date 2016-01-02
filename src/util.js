import React from 'react';
import TreeNode from './TreeNode';

export function browser(ua) {
  let tem;
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

function getSiblingPos(index, len, siblingPos) {
  if (len === 1) {
    siblingPos.first = true;
    siblingPos.last = true;
  } else {
    siblingPos.first = index === 0;
    siblingPos.last = index === len - 1;
  }
  return siblingPos;
}

export function loopAllChildren(childs, callback) {
  const loop = (children, level) => {
    const len = getChildrenlength(children);
    React.Children.forEach(children, (item, index) => {
      const pos = `${level}-${index}`;
      if (item.props.children && item.type === TreeNode) {
        loop(item.props.children, pos);
      }
      callback(item, index, pos, item.key || pos, getSiblingPos(index, len, {}));
    });
  };
  loop(childs, 0);
}

export function filterMinPos(arr) {
  const a = [];
  arr.forEach((item) => {
    const b = a.filter((i) => {
      return item.indexOf(i) === 0 && (item[i.length] === '-' || !item[i.length]);
    });
    if (!b.length) {
      a.push(item);
    }
  });
  return a;
}
// console.log(filterMinPos(['0-0','0-1', '0-10', '0-0-1', '0-1-1', '0-10-0']));


// stripTail('x-xx-sss-xx')
const stripTail = (str) => {
  const arr = str.match(/(.+)(-[^-]+)$/);
  let st = '';
  if (arr && arr.length === 3) {
    st = arr[1];
  }
  return st;
};
const splitPos = (pos) => {
  return pos.split('-');
};

function handleCheckState(obj, checkedPosArr, checkIt) {
  checkedPosArr.forEach((_pos) => {
    // 设置子节点，全选或全不选
    Object.keys(obj).forEach((i) => {
      if (splitPos(i).length > splitPos(_pos).length && i.indexOf(_pos) === 0) {
        obj[i].checkPart = false;
        obj[i].checked = checkIt;
      }
    });
    // 循环设置父节点的 选中 或 半选状态
    const loop = (__pos) => {
      const _posLen = splitPos(__pos).length;
      if (_posLen <= 2) { // e.g. '0-0', '0-1'
        return;
      }
      let sibling = 0;
      let siblingChecked = 0;
      const parentPos = stripTail(__pos);
      Object.keys(obj).forEach((i) => {
        if (splitPos(i).length === _posLen && i.indexOf(parentPos) === 0) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
          } else if (obj[i].checkPart) {
            siblingChecked += 0.5;
          }
        }
      });
      const parent = obj[parentPos];
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
      loop(parentPos);
    };
    loop(_pos);
  });
}

function getCheckKeys(treeNodesStates) {
  const checkPartKeys = [];
  const checkedKeys = [];
  const checkedNodes = [];
  const checkedNodesKeys = [];
  Object.keys(treeNodesStates).forEach((item) => {
    const itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      checkedNodes.push(itemObj.node);
      checkedNodesKeys.push({key: itemObj.key, node: itemObj.node, pos: item});
    } else if (itemObj.checkPart) {
      checkPartKeys.push(itemObj.key);
    }
  });
  return {
    checkPartKeys, checkedKeys, checkedNodes, checkedNodesKeys, treeNodesStates,
  };
}

export function getTreeNodesStates(children, checkedKeys, checkIt, unCheckKey) {
  const checkedPos = [];
  const treeNodesStates = {};
  loopAllChildren(children, (item, index, pos, newKey, siblingPos) => {
    let checked = false;
    if (checkedKeys.indexOf(newKey) !== -1) {
      checked = true;
      checkedPos.push(pos);
    }
    treeNodesStates[pos] = {
      node: item,
      key: newKey,
      checked: checked,
      checkPart: false,
      siblingPos,
    };
  });
// debugger
  handleCheckState(treeNodesStates, filterMinPos(checkedPos.sort()), true);

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
