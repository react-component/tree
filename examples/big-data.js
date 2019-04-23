webpackJsonp([4],{

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(194);


/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__big_data_generator__ = __webpack_require__(195);




/* eslint no-console:0 */







var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _ref,
        _arguments = arguments;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      gData: [],
      expandedKeys: [],
      checkedKeys: [],
      checkedKeys1: [],
      selectedKeys: []
    }, _this.onCheck = function (checkedKeys) {
      _this.setState({
        checkedKeys: checkedKeys
      });
    }, _this.onCheckStrictly = function (checkedKeys1) /* extra */{
      console.log(_arguments);
      _this.setState({
        checkedKeys1: checkedKeys1
      });
    }, _this.onSelect = function (selectedKeys, info) {
      console.log('onSelect', selectedKeys, info);
      _this.setState({
        selectedKeys: selectedKeys
      });
    }, _this.onGen = function (data) {
      _this.setState({
        gData: data,
        expandedKeys: ['0-0-0-key'],
        // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
        checkedKeys: ['0-0-0-key'],
        checkedKeys1: ['0-0-0-key'],
        selectedKeys: []
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      // invoked immediately before rendering with new props or state, not for initial 'render'
      // see componentWillReceiveProps if you need to call setState
      // console.log(nextState.gData === this.state.gData);
      if (nextState.gData === this.state.gData) {
        this.notReRender = true;
      } else {
        this.notReRender = false;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var loop = function loop(data) {
        return data.map(function (item) {
          if (item.children) {
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
              { key: item.key, title: item.title },
              loop(item.children)
            );
          }
          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { key: item.key, title: item.title });
        });
      };
      // const s = Date.now();
      // const treeNodes = loop(this.state.gData);
      var treeNodes = void 0;
      if (this.treeNodes && this.notReRender) {
        treeNodes = this.treeNodes;
      } else {
        treeNodes = loop(this.state.gData);
        this.treeNodes = treeNodes;
      }
      // console.log(Date.now()-s);
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { style: { padding: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__big_data_generator__["a" /* default */], { onGen: this.onGen }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { style: { border: '1px solid red', width: 700, padding: 10 } },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'h5',
            { style: { margin: 10 } },
            '\u5927\u6570\u636E\u91CF\u4E0B\u4F18\u5316\u5EFA\u8BAE\uFF1A'
          ),
          '\u521D\u59CB\u5C55\u5F00\u7684\u8282\u70B9\u5C11\uFF0C\u5411dom\u4E2D\u63D2\u5165\u8282\u70B9\u5C31\u4F1A\u5C11\uFF0C\u901F\u5EA6\u66F4\u5FEB\u3002 ',
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('br', null),
          'treeNodes \u603B\u6570\u636E\u91CF\u5C3D\u91CF\u5C11\u53D8\u5316\uFF0C\u7F13\u5B58\u5E76\u590D\u7528\u8BA1\u7B97\u51FA\u7684 treeNodes\uFF0C\u53EF\u5728 componentWillUpdate \u7B49\u65F6\u673A\u505A\u5224\u65AD\u3002 ',
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('br', null)
        ),
        this.state.gData.length ? __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { style: { display: 'flex' } },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'div',
            { style: { marginRight: 20 } },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'h3',
              null,
              'normal check'
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree___default.a,
              {
                checkable: true, multiple: this.props.multiple,
                defaultExpandedKeys: this.state.expandedKeys,
                onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
                onSelect: this.onSelect, selectedKeys: this.state.selectedKeys
              },
              treeNodes
            )
          ),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'div',
            null,
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'h3',
              null,
              'checkStrictly'
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree___default.a,
              {
                checkable: true, checkStrictly: true, multiple: this.props.multiple,
                defaultExpandedKeys: this.state.expandedKeys,
                onCheck: this.onCheckStrictly, checkedKeys: this.state.checkedKeys1,
                onSelect: this.onSelect, selectedKeys: this.state.selectedKeys
              },
              treeNodes
            )
          )
        ) : null
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

Demo.propTypes = {
  multiple: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool
};


__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util__ = __webpack_require__(25);




/* eslint react/no-string-refs:0 */





var Gen = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Gen, _React$Component);

  function Gen() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Gen);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Gen.__proto__ || Object.getPrototypeOf(Gen)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      nums: ''
    }, _this.onGen = function (e) {
      e.preventDefault();
      var vals = _this.getVals();
      _this.props.onGen(Object(__WEBPACK_IMPORTED_MODULE_6__util__["c" /* generateData */])(vals.x, vals.y, vals.z));
      _this.setState({
        nums: Object(__WEBPACK_IMPORTED_MODULE_6__util__["a" /* calcTotal */])(vals.x, vals.y, vals.z)
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Gen, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var vals = this.getVals();
      this.props.onGen(Object(__WEBPACK_IMPORTED_MODULE_6__util__["c" /* generateData */])(vals.x, vals.y, vals.z));
    }
  }, {
    key: 'getVals',
    value: function getVals() {
      return {
        x: parseInt(this.refs.x.value, 10),
        y: parseInt(this.refs.y.value, 10),
        z: parseInt(this.refs.z.value, 10)
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          z = _props.z;

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'div',
        { style: { padding: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'h2',
          null,
          'big data generator'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'form',
          { onSubmit: this.onGen },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'label',
            { style: { marginRight: 10 } },
            'x: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'x', defaultValue: x, type: 'number', min: '1', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'label',
            { style: { marginRight: 10 } },
            'y: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'y', defaultValue: y, type: 'number', min: '0', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'label',
            { style: { marginRight: 10 } },
            'z: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'z', defaultValue: z, type: 'number', min: '0', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'button',
            { type: 'submit' },
            'Generate'
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'p',
            null,
            'total nodes: ',
            this.state.nums || Object(__WEBPACK_IMPORTED_MODULE_6__util__["a" /* calcTotal */])(x, y, z)
          )
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'p',
          { style: { fontSize: 12 } },
          'x\uFF1A\u6BCF\u4E00\u7EA7\u4E0B\u7684\u8282\u70B9\u603B\u6570\u3002y\uFF1A\u6BCF\u7EA7\u8282\u70B9\u91CC\u6709y\u4E2A\u8282\u70B9\u3001\u5B58\u5728\u5B50\u8282\u70B9\u3002z\uFF1A\u6811\u7684level\u5C42\u7EA7\u6570\uFF080\u8868\u793A\u4E00\u7EA7\uFF09'
        )
      );
    }
  }]);

  return Gen;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

Gen.propTypes = {
  onGen: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  x: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  y: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  z: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number
};
Gen.defaultProps = {
  onGen: function onGen() {},
  x: 20,
  y: 18,
  z: 1
};

/* harmony default export */ __webpack_exports__["a"] = (Gen);

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = generateData;
/* harmony export (immutable) */ __webpack_exports__["a"] = calcTotal;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return gData; });
/* unused harmony export filterParentPosition */
/* unused harmony export getFilterExpandedKeys */
/* harmony export (immutable) */ __webpack_exports__["d"] = getRadioSelectKeys;
/* eslint no-loop-func: 0 */
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

    return null;
  }
  _loop(z);
  return gData;
}
function calcTotal() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  /* eslint no-param-reassign:0 */
  var rec = function rec(n) {
    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
  };
  return rec(z + 1);
}
console.log('总节点数（单个tree）：', calcTotal());
// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。

var gData = generateData();

function isPositionPrefix(smallPos, bigPos) {
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if (bigPos.length > smallPos.length && bigPos.charAt(smallPos.length) !== '-') {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}
// console.log(isPositionPrefix("0-1", "0-10-1"));


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
            if (isPositionPrefix(ii, _i)) {
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

/***/ })

},[193]);
//# sourceMappingURL=big-data.js.map