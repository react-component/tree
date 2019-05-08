/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"examples/basic": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([2,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/basic.js":
/*!***************************!*\
  !*** ./examples/basic.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rc_tree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-tree */ "./index.js");
/* harmony import */ var rc_tree__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rc_tree__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rc-tree/assets/index.less */ "./assets/index.less");
/* harmony import */ var rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _basic_less__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./basic.less */ "./examples/basic.less");
/* harmony import */ var _basic_less__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_basic_less__WEBPACK_IMPORTED_MODULE_5__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint no-console:0 */

/* eslint no-alert:0 */

/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */






var treeData = [{
  key: '0-0',
  title: 'parent 1',
  children: [{
    key: '0-0-0',
    title: 'parent 1-1',
    children: [{
      key: '0-0-0-0',
      title: 'parent 1-1-0'
    }]
  }, {
    key: '0-0-1',
    title: 'parent 1-2',
    children: [{
      key: '0-0-1-0',
      title: 'parent 1-2-0',
      disableCheckbox: true
    }, {
      key: '0-0-1-1',
      title: 'parent 1-2-1'
    }]
  }]
}];

var Demo =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo(props) {
    var _this;

    _classCallCheck(this, Demo);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Demo).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onExpand", function () {
      var _console;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['onExpand'].concat(args));
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (selectedKeys, info) {
      console.log('selected', selectedKeys, info);
      _this.selKey = info.node.props.eventKey;

      if (_this.tree) {
        console.log('Selected DOM node:', selectedKeys.map(function (key) {
          return react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.findDOMNode(_this.tree.domTreeNodes[key]);
        }));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onCheck", function (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    });

    _defineProperty(_assertThisInitialized(_this), "onEdit", function () {
      setTimeout(function () {
        console.log('current key: ', _this.selKey);
      }, 0);
    });

    _defineProperty(_assertThisInitialized(_this), "onDel", function (e) {
      if (!window.confirm('sure to delete?')) {
        return;
      }

      e.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "setTreeRef", function (tree) {
      _this.tree = tree;
    });

    var keys = props.keys;
    _this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys
    };
    return _this;
  }

  _createClass(Demo, [{
    key: "render",
    value: function render() {
      var customLabel = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "cus-label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "operations: "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: {
          color: 'blue'
        },
        onClick: this.onEdit
      }, "Edit"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        onClick: function onClick(e) {
          return e.stopPropagation();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox"
      }), " checked"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: {
          color: '#EB0000'
        },
        onClick: this.onDel
      }, "Delete"));
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          margin: '0 20px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "simple"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3___default.a, {
        ref: this.setTreeRef,
        className: "myCls",
        showLine: true,
        checkable: true,
        defaultExpandAll: true,
        defaultExpandedKeys: this.state.defaultExpandedKeys,
        onExpand: this.onExpand,
        defaultSelectedKeys: this.state.defaultSelectedKeys,
        defaultCheckedKeys: this.state.defaultCheckedKeys,
        onSelect: this.onSelect,
        onCheck: this.onCheck
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1",
        key: "0-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: customLabel,
        key: "0-0-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "leaf",
        key: "0-0-0-0",
        style: {
          background: 'rgba(255, 0, 0, 0.1)'
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "leaf",
        key: "0-0-0-1"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-1",
        key: "0-0-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-1-0",
        key: "0-0-1-0",
        disableCheckbox: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-1-1",
        key: "0-0-1-1"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-2",
        key: "0-0-2",
        disabled: true
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-2-0",
        key: "0-0-2-0",
        checkable: false
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-2-1",
        key: "0-0-2-1"
      })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Check on Click TreeNode"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3___default.a, {
        className: "myCls",
        showLine: true,
        checkable: true,
        selectable: false,
        defaultExpandAll: true,
        onExpand: this.onExpand,
        defaultSelectedKeys: this.state.defaultSelectedKeys,
        defaultCheckedKeys: this.state.defaultCheckedKeys,
        onSelect: this.onSelect,
        onCheck: this.onCheck,
        treeData: treeData
      }));
    }
  }]);

  return Demo;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

_defineProperty(Demo, "propTypes", {
  keys: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
});

_defineProperty(Demo, "defaultProps", {
  keys: ['0-0-0-0']
});

react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 2:
/*!*********************************!*\
  !*** multi ./examples/basic.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/basic.js */"./examples/basic.js");


/***/ })

/******/ });
//# sourceMappingURL=basic.js.map