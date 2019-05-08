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
/******/ 		"examples/dropdown": 0
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
/******/ 	deferredModules.push([7,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/dropdown.js":
/*!******************************!*\
  !*** ./examples/dropdown.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rc-tree/assets/index.less */ "./assets/index.less");
/* harmony import */ var rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rc_tree_assets_index_less__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rc_tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rc-tree */ "./index.js");
/* harmony import */ var rc_tree__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(rc_tree__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var rc_trigger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rc-trigger */ "./node_modules/rc-trigger/es/index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./examples/util.js");
/* harmony import */ var _dropdown_less__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dropdown.less */ "./examples/dropdown.less");
/* harmony import */ var _dropdown_less__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_dropdown_less__WEBPACK_IMPORTED_MODULE_7__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint react/no-multi-comp:0 */

/* eslint no-console:0 */

/* eslint react/no-string-refs:0 */








var placements = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: {
      adjustX: 1,
      adjustY: 1
    },
    offset: [0, -3],
    targetOffset: [0, 0]
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: {
      adjustX: 1,
      adjustY: 1
    },
    offset: [0, 3],
    targetOffset: [0, 0]
  }
};

var DropdownTree =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DropdownTree, _React$Component);

  function DropdownTree(_props) {
    var _this;

    _classCallCheck(this, DropdownTree);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownTree).call(this, _props));

    _defineProperty(_assertThisInitialized(_this), "onChange", function (value) {
      console.log('change', value);
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (value) {
      console.log('select ', value);
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function (e) {
      var props = _this.props;
      var overlayProps = props.overlay.props;

      if (!('visible' in props)) {
        _this.setState({
          visible: false
        });
      }

      if (overlayProps.onClick) {
        overlayProps.onClick(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onVisibleChange", function (v) {
      var props = _this.props;

      if (!('visible' in props)) {
        _this.setState({
          visible: v
        });
      }

      props.onVisibleChange(v);
    });

    _defineProperty(_assertThisInitialized(_this), "getPopupElement", function () {
      var props = _this.props;
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.cloneElement(props.overlay, {
        // prefixCls: `${props.prefixCls}-menu`,
        onClick: _this.onClick
      });
    });

    if ('visible' in _props) {
      _this.state = {
        visible: _props.visible
      };
      return _possibleConstructorReturn(_this);
    }

    _this.state = {
      visible: _props.defaultVisible
    };
    return _this;
  }

  _createClass(DropdownTree, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if ('visible' in props) {
        this.setState({
          visible: props.visible
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          prefixCls = _this$props.prefixCls,
          children = _this$props.children,
          transitionName = _this$props.transitionName,
          animation = _this$props.animation,
          align = _this$props.align,
          placement = _this$props.placement,
          overlayClassName = _this$props.overlayClassName,
          overlayStyle = _this$props.overlayStyle,
          trigger = _this$props.trigger;
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_trigger__WEBPACK_IMPORTED_MODULE_5__["default"], {
        prefixCls: prefixCls,
        ref: "trigger",
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: placements,
        action: trigger,
        popupPlacement: placement,
        popupAlign: align,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        popupVisible: this.state.visible,
        popup: this.getPopupElement(),
        onPopupVisibleChange: this.onVisibleChange
      }, children);
    }
  }]);

  return DropdownTree;
}(react__WEBPACK_IMPORTED_MODULE_1___default.a.Component);

_defineProperty(DropdownTree, "propTypes", {
  onVisibleChange: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.func,
  prefixCls: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  children: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.any,
  transitionName: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  overlayClassName: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  animation: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.any,
  align: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object,
  overlayStyle: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object,
  placement: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  trigger: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.array,
  defaultVisible: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.bool,
  visible: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.bool
});

_defineProperty(DropdownTree, "defaultProps", {
  prefixCls: 'demo-dropdown-tree',
  trigger: ['hover'],
  overlayClassName: '',
  overlayStyle: {},
  defaultVisible: false,
  onVisibleChange: function onVisibleChange() {},
  placement: 'bottomLeft'
});

var Demo =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Demo, _React$Component2);

  function Demo() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Demo)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this2), "state", {
      visible: false,
      inputValue: '',
      sel: '',
      expandedKeys: [],
      autoExpandParent: true
    });

    _defineProperty(_assertThisInitialized(_this2), "onChange", function (event) {
      _this2.filterKeys = [];

      _this2.setState({
        inputValue: event.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "onVisibleChange", function (visible) {
      _this2.setState({
        visible: visible
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "onSelect", function (selectedKeys, info) {
      console.log('selected: ', info);

      _this2.setState({
        visible: false,
        sel: info.node.props.title
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "onExpand", function (expandedKeys) {
      _this2.filterKeys = undefined;
      console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded chilren keys.

      _this2.setState({
        expandedKeys: expandedKeys,
        autoExpandParent: false
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "filterTreeNode", function (treeNode) {
      console.log(treeNode); // 根据 key 进行搜索，可以根据其他数据，如 value

      return _this2.filterFn(treeNode.props.eventKey);
    });

    _defineProperty(_assertThisInitialized(_this2), "filterFn", function (key) {
      if (_this2.state.inputValue && key.indexOf(_this2.state.inputValue) > -1) {
        return true;
      }

      return false;
    });

    return _this2;
  }

  _createClass(Demo, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var loop = function loop(data) {
        return data.map(function (item) {
          if (_this3.filterKeys && _this3.filterFn(item.key)) {
            _this3.filterKeys.push(item.key);
          }

          if (item.children) {
            return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_4__["TreeNode"], {
              key: item.key,
              title: item.key
            }, loop(item.children));
          }

          return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_4__["TreeNode"], {
            key: item.key,
            title: item.key
          });
        });
      };

      var expandedKeys = this.state.expandedKeys;
      var autoExpandParent = this.state.autoExpandParent;

      if (this.filterKeys) {
        expandedKeys = this.filterKeys;
        autoExpandParent = true;
      }

      var overlay = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("input", {
        placeholder: "\u8BF7\u7B5B\u9009",
        value: this.state.inputValue,
        onChange: this.onChange
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree__WEBPACK_IMPORTED_MODULE_4___default.a, {
        onExpand: this.onExpand,
        expandedKeys: expandedKeys,
        autoExpandParent: autoExpandParent,
        onSelect: this.onSelect,
        filterTreeNode: this.filterTreeNode
      }, loop(_util__WEBPACK_IMPORTED_MODULE_6__["gData"])));
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          padding: '10px 30px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h3", null, "tree in dropdown"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(DropdownTree, {
        trigger: ['click'],
        onVisibleChange: this.onVisibleChange,
        visible: this.state.visible,
        closeOnSelect: false,
        overlay: overlay,
        animation: "slide-up"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "demo-dropdown-trigger"
      }, this.state.sel)));
    }
  }]);

  return Demo;
}(react__WEBPACK_IMPORTED_MODULE_1___default.a.Component);

react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ "./examples/dropdown.less":
/*!********************************!*\
  !*** ./examples/dropdown.less ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 7:
/*!************************************!*\
  !*** multi ./examples/dropdown.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/dropdown.js */"./examples/dropdown.js");


/***/ })

/******/ });
//# sourceMappingURL=dropdown.js.map