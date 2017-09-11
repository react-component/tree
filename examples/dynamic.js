webpackJsonp([6],{

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_tree__);

/* eslint no-console:0 */





function generateTreeNodes(treeNode) {
  var arr = [];
  var key = treeNode.props.eventKey;
  for (var i = 0; i < 3; i++) {
    arr.push({ name: 'leaf ' + key + '-' + i, key: key + '-' + i });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  var loopLeaf = function loopLeaf(data, lev) {
    var l = lev - 1;
    data.forEach(function (item) {
      if (item.key.length > curKey.length ? item.key.indexOf(curKey) !== 0 : curKey.indexOf(item.key) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
  var loop = function loop(data) {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach(function (item) {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

var Demo = __WEBPACK_IMPORTED_MODULE_2_react___default.a.createClass({
  displayName: 'Demo',

  propTypes: {},
  getInitialState: function getInitialState() {
    return {
      treeData: [],
      checkedKeys: []
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    setTimeout(function () {
      _this.setState({
        treeData: [{ name: 'pNode 01', key: '0-0' }, { name: 'pNode 02', key: '0-1' }, { name: 'pNode 03', key: '0-2', isLeaf: true }],
        checkedKeys: ['0-0']
      });
    }, 100);
  },
  onSelect: function onSelect(info) {
    console.log('selected', info);
  },
  onCheck: function onCheck(checkedKeys) {
    console.log(checkedKeys);
    this.setState({
      checkedKeys: checkedKeys
    });
  },
  onLoadData: function onLoadData(treeNode) {
    var _this2 = this;

    return new Promise(function (resolve) {
      setTimeout(function () {
        var treeData = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(_this2.state.treeData));
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        _this2.setState({ treeData: treeData });
        resolve();
      }, 500);
    });
  },
  render: function render() {
    var loop = function loop(data) {
      return data.map(function (item) {
        if (item.children) {
          return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_4_rc_tree__["TreeNode"],
            { title: item.name, key: item.key },
            loop(item.children)
          );
        }
        return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_rc_tree__["TreeNode"], { title: item.name, key: item.key, isLeaf: item.isLeaf,
          disabled: item.key === '0-0-0'
        });
      });
    };
    var treeNodes = loop(this.state.treeData);
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'h2',
        null,
        'dynamic render'
      ),
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_4_rc_tree___default.a,
        {
          onSelect: this.onSelect,
          checkable: true, onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
          loadData: this.onLoadData
        },
        treeNodes
      )
    );
  }
});

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(178);


/***/ })

},[355]);
//# sourceMappingURL=dynamic.js.map