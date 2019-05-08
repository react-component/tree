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
/******/ 		"examples/custom-switch-icon": 0
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
/******/ 	deferredModules.push([5,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/custom-switch-icon.js":
/*!****************************************!*\
  !*** ./examples/custom-switch-icon.js ***!
  \****************************************/
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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint no-console:0 */

/* eslint no-alert:0 */

/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */





var arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' + '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' + '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' + '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

var getSvgIcon = function getSvgIcon(path) {
  var iStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    style: iStyle
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    style: _objectSpread({
      verticalAlign: '-.125em'
    }, style)
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: path
  })));
};

var Demo =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo(props) {
    var _this;

    _classCallCheck(this, Demo);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Demo).call(this, props));
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
      var switcherIcon = function switcherIcon(obj) {
        if (obj.isLeaf) {
          return getSvgIcon(arrowPath, {
            cursor: 'pointer',
            backgroundColor: 'white'
          }, {
            transform: 'rotate(270deg)'
          });
        }

        return getSvgIcon(arrowPath, {
          cursor: 'pointer',
          backgroundColor: 'white'
        }, {
          transform: "rotate(".concat(obj.expanded ? 90 : 0, "deg)")
        });
      };

      var treeCls = "myCls".concat(this.state.useIcon && ' customIcon' || '');
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "demo",
        style: {
          margin: '0 20px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "custom switch icon"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3___default.a, {
        className: treeCls,
        showLine: true,
        checkable: true,
        defaultExpandAll: true,
        defaultExpandedKeys: this.state.defaultExpandedKeys,
        defaultSelectedKeys: this.state.defaultSelectedKeys,
        defaultCheckedKeys: this.state.defaultCheckedKeys,
        switcherIcon: switcherIcon
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1",
        key: "0-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "leaf",
        key: "0-0-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "leaf",
        key: "0-0-0-0"
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
        disabled: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-2-1",
        key: "0-0-2-1"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-3",
        key: "0-0-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-3-0",
        key: "0-0-3-0"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_3__["TreeNode"], {
        title: "parent 1-3-1",
        key: "0-0-3-1"
      })))));
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

/***/ 5:
/*!**********************************************!*\
  !*** multi ./examples/custom-switch-icon.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/custom-switch-icon.js */"./examples/custom-switch-icon.js");


/***/ })

/******/ });
//# sourceMappingURL=custom-switch-icon.js.map