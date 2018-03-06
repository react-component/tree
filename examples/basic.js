webpackJsonp([5],{

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(174);


/***/ }),

/***/ 174:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_tree__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_tree_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__basic_less__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__basic_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__basic_less__);



/* eslint no-console:0 */
/* eslint no-alert:0 */







var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo(props) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    var _this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call(this, props));

    var keys = props.keys;
    _this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true
    };
    return _this;
  }

  Demo.prototype.onExpand = function onExpand(expandedKeys) {
    console.log('onExpand', expandedKeys, arguments);
  };

  Demo.prototype.onSelect = function onSelect(selectedKeys, info) {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };

  Demo.prototype.onCheck = function onCheck(checkedKeys, info) {
    console.log('onCheck', checkedKeys, info);
  };

  Demo.prototype.onEdit = function onEdit() {
    var _this2 = this;

    setTimeout(function () {
      console.log('current key: ', _this2.selKey);
    }, 0);
  };

  Demo.prototype.onDel = function onDel(e) {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };

  Demo.prototype.render = function render() {
    var customLabel = __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'span',
      { className: 'cus-label' },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'span',
        null,
        'operations: '
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'span',
        { style: { color: 'blue' }, onClick: this.onEdit },
        'Edit'
      ),
      '\xA0',
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'label',
        { onClick: function onClick(e) {
            return e.stopPropagation();
          } },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', { type: 'checkbox' }),
        ' checked'
      ),
      ' \xA0',
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'span',
        { style: { color: 'red' }, onClick: this.onDel },
        'Delete'
      )
    );
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      { style: { margin: '0 20px' } },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h2',
        null,
        'simple'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_tree___default.a,
        {
          className: 'myCls', showLine: true, checkable: true, defaultExpandAll: true,
          defaultExpandedKeys: this.state.defaultExpandedKeys,
          onExpand: this.onExpand,
          defaultSelectedKeys: this.state.defaultSelectedKeys,
          defaultCheckedKeys: this.state.defaultCheckedKeys,
          onSelect: this.onSelect, onCheck: this.onCheck
        },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"],
          { title: 'parent 1', key: '0-0' },
          __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"],
            { title: customLabel, key: '0-0-0' },
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-0' }),
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-1' })
          ),
          __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"],
            { title: 'parent 1-1', key: '0-0-1' },
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'parent 1-1-0', key: '0-0-1-0', disableCheckbox: true }),
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'parent 1-1-1', key: '0-0-1-1' })
          )
        )
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h2',
        null,
        'Check on Click TreeNode'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6_rc_tree___default.a,
        {
          className: 'myCls',
          showLine: true,
          checkable: true,
          selectable: false,
          defaultExpandAll: true,
          onExpand: this.onExpand,
          defaultSelectedKeys: this.state.defaultSelectedKeys,
          defaultCheckedKeys: this.state.defaultCheckedKeys,
          onSelect: this.onSelect,
          onCheck: this.onCheck
        },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"],
          { title: 'parent 1', key: '0-0' },
          __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"],
            { title: 'parent 1-1', key: '0-0-1' },
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'parent 1-1-0', key: '0-0-1-0', disableCheckbox: true }),
            __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_tree__["TreeNode"], { title: 'parent 1-1-1', key: '0-0-1-1' })
          )
        )
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_3_react___default.a.Component);

Demo.propTypes = {
  keys: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.array
};
Demo.defaultProps = {
  keys: ['0-0-0-0']
};


__WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 175:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[173]);
//# sourceMappingURL=basic.js.map