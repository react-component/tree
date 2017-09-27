webpackJsonp([3],{

/***/ 176:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__draggable_less__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__draggable_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__draggable_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util__ = __webpack_require__(29);

/* eslint no-console:0 */







var Demo = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createClass({
  displayName: 'Demo',
  getInitialState: function getInitialState() {
    return {
      gData: __WEBPACK_IMPORTED_MODULE_6__util__["a" /* gData */],
      autoExpandParent: true,
      expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key']
    };
  },
  onDragStart: function onDragStart(info) {
    console.log('start', info);
  },
  onDragEnter: function onDragEnter(info) {
    console.log('enter', info);
    this.setState({
      expandedKeys: info.expandedKeys
    });
  },
  onDrop: function onDrop(info) {
    console.log('drop', info);
    var dropKey = info.node.props.eventKey;
    var dragKey = info.dragNode.props.eventKey;
    // const dragNodesKeys = info.dragNodesKeys;
    var loop = function loop(data, key, callback) {
      data.forEach(function (item, index, arr) {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    var data = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(this.state.gData));
    var dragObj = void 0;
    loop(data, dragKey, function (item, index, arr) {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      var ar = void 0;
      var i = void 0;
      loop(data, dropKey, function (item, index, arr) {
        ar = arr;
        i = index;
      });
      ar.splice(i, 0, dragObj);
    } else {
      loop(data, dropKey, function (item) {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      gData: data
    });
  },
  onExpand: function onExpand(expandedKeys) {
    console.log('onExpand', arguments);
    this.setState({
      expandedKeys: expandedKeys,
      autoExpandParent: false
    });
  },
  render: function render() {
    var loop = function loop(data) {
      return data.map(function (item) {
        if (item.children && item.children.length) {
          return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5_rc_tree__["TreeNode"],
            { key: item.key, title: item.title },
            loop(item.children)
          );
        }
        return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_rc_tree__["TreeNode"], { key: item.key, title: item.title });
      });
    };
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      { className: 'draggable-demo' },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h2',
        null,
        'draggable '
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'p',
        null,
        'drag a node into another node'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { className: 'draggable-container' },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_5_rc_tree___default.a,
          {
            expandedKeys: this.state.expandedKeys,
            onExpand: this.onExpand, autoExpandParent: this.state.autoExpandParent,
            draggable: true,
            onDragStart: this.onDragStart,
            onDragEnter: this.onDragEnter,
            onDrop: this.onDrop
          },
          loop(this.state.gData)
        )
      )
    );
  }
});

__WEBPACK_IMPORTED_MODULE_4_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 235:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = generateData;
/* harmony export (immutable) */ __webpack_exports__["c"] = calcTotal;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return gData; });
/* unused harmony export isInclude */
/* unused harmony export filterParentPosition */
/* unused harmony export getFilterExpandedKeys */
/* harmony export (immutable) */ __webpack_exports__["d"] = getRadioSelectKeys;
/* eslint no-loop-func: 0*/
/* eslint no-console:0 */

function generateData() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var gData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    var preKey = _preKey || '0';
    var tns = _tns || gData;

    var children = [];
    for (var i = 0; i < x; i++) {
      var key = preKey + '-' + i;
      tns.push({ title: key + '-label', key: key + '-key' });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    var __level = _level - 1;
    children.forEach(function (key, index) {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });
  }
  _loop(z);
  return gData;
}
function calcTotal() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  /* eslint no-param-reassign:0*/
  var rec = function rec(n) {
    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
  };
  return rec(z + 1);
}
console.log('总节点数（单个tree）：', calcTotal());
// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。

var gData = generateData();

function isInclude(smallArray, bigArray) {
  return smallArray.every(function (ii, i) {
    return ii === bigArray[i];
  });
}
// console.log(isInclude(['0', '1'], ['0', '10', '1']));


// arr.length === 628, use time: ~20ms
function filterParentPosition(arr) {
  var levelObj = {};
  arr.forEach(function (item) {
    var posLen = item.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  var levelArr = Object.keys(levelObj).sort();

  var _loop2 = function _loop2(i) {
    if (levelArr[i + 1]) {
      levelObj[levelArr[i]].forEach(function (ii) {
        var _loop3 = function _loop3(j) {
          levelObj[levelArr[j]].forEach(function (_i, index) {
            if (isInclude(ii.split('-'), _i.split('-'))) {
              levelObj[levelArr[j]][index] = null;
            }
          });
          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(function (p) {
            return p;
          });
        };

        for (var j = i + 1; j < levelArr.length; j++) {
          _loop3(j);
        }
      });
    }
  };

  for (var i = 0; i < levelArr.length; i++) {
    _loop2(i);
  }
  var nArr = [];
  levelArr.forEach(function (i) {
    nArr = nArr.concat(levelObj[i]);
  });
  return nArr;
}
// console.log(filterParentPosition(
//   ['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']
// ));


function loopData(data, callback) {
  var loop = function loop(d) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    d.forEach(function (item, index) {
      var pos = level + '-' + index;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function spl(str) {
  return str.split('-');
}
function splitLen(str) {
  return str.split('-').length;
}

function getFilterExpandedKeys(data, expandedKeys) {
  var expandedPosArr = [];
  loopData(data, function (item, index, pos) {
    if (expandedKeys.indexOf(item.key) > -1) {
      expandedPosArr.push(pos);
    }
  });
  var filterExpandedKeys = [];
  loopData(data, function (item, index, pos) {
    expandedPosArr.forEach(function (p) {
      if ((splitLen(pos) < splitLen(p) && p.indexOf(pos) === 0 || pos === p) && filterExpandedKeys.indexOf(item.key) === -1) {
        filterExpandedKeys.push(item.key);
      }
    });
  });
  return filterExpandedKeys;
}

function isSibling(pos, pos1) {
  pos.pop();
  pos1.pop();
  return pos.join(',') === pos1.join(',');
}

function getRadioSelectKeys(data, selectedKeys, key) {
  var res = [];
  var pkObjArr = [];
  var selPkObjArr = [];
  loopData(data, function (item, index, pos) {
    if (selectedKeys.indexOf(item.key) > -1) {
      pkObjArr.push([pos, item.key]);
    }
    if (key && key === item.key) {
      selPkObjArr.push(pos, item.key);
    }
  });
  var lenObj = {};
  var getPosKey = function getPosKey(pos, k) {
    var posLen = splitLen(pos);
    if (!lenObj[posLen]) {
      lenObj[posLen] = [[pos, k]];
    } else {
      lenObj[posLen].forEach(function (pkArr, i) {
        if (isSibling(spl(pkArr[0]), spl(pos))) {
          // 后来覆盖前者
          lenObj[posLen][i] = [pos, k];
        } else if (spl(pkArr[0]) !== spl(pos)) {
          lenObj[posLen].push([pos, k]);
        }
      });
    }
  };
  pkObjArr.forEach(function (pk) {
    getPosKey(pk[0], pk[1]);
  });
  if (key) {
    getPosKey(selPkObjArr[0], selPkObjArr[1]);
  }

  Object.keys(lenObj).forEach(function (item) {
    lenObj[item].forEach(function (i) {
      if (res.indexOf(i[1]) === -1) {
        res.push(i[1]);
      }
    });
  });
  return res;
}

/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(176);


/***/ })

},[354]);
//# sourceMappingURL=draggable.js.map