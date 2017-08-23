webpackJsonp([5],{

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__basic_less__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__basic_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__basic_less__);
/* eslint no-console:0 */
/* eslint no-alert:0 */







var Demo = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'Demo',

  propTypes: {
    keys: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.array
  },
  getDefaultProps: function getDefaultProps() {
    return {
      keys: ['0-0-0-0']
    };
  },
  getInitialState: function getInitialState() {
    var keys = this.props.keys;
    return {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true
    };
  },
  onExpand: function onExpand(expandedKeys) {
    console.log('onExpand', expandedKeys, arguments);
  },
  onSelect: function onSelect(selectedKeys, info) {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  },
  onCheck: function onCheck(checkedKeys, info) {
    console.log('onCheck', checkedKeys, info);
  },
  onEdit: function onEdit() {
    var _this = this;

    setTimeout(function () {
      console.log('current key: ', _this.selKey);
    }, 0);
  },
  onDel: function onDel(e) {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  },
  render: function render() {
    var customLabel = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'span',
      { className: 'cus-label' },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'span',
        null,
        'operations: '
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'span',
        { style: { color: 'blue' }, onClick: this.onEdit },
        'Edit'
      ),
      '\xA0',
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'label',
        { onClick: function onClick(e) {
            return e.stopPropagation();
          } },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'checkbox' }),
        ' checked'
      ),
      ' \xA0',
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'span',
        { style: { color: 'red' }, onClick: this.onDel },
        'Delete'
      )
    );
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      { style: { margin: '0 20px' } },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'h2',
        null,
        'simple'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_3_rc_tree___default.a,
        {
          className: 'myCls', showLine: true, checkable: true, defaultExpandAll: true,
          defaultExpandedKeys: this.state.defaultExpandedKeys,
          onExpand: this.onExpand,
          defaultSelectedKeys: this.state.defaultSelectedKeys,
          defaultCheckedKeys: this.state.defaultCheckedKeys,
          onSelect: this.onSelect, onCheck: this.onCheck
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
          { title: 'parent 1', key: '0-0' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
            { title: customLabel, key: '0-0-0' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-0' }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-1' })
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
            { title: 'parent 1-1', key: '0-0-1' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'parent 1-1-0', key: '0-0-1-0', disableCheckbox: true }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'parent 1-1-1', key: '0-0-1-1' })
          )
        )
      )
    );
  }
});

__WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 233:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(173);


/***/ })

},[351]);
//# sourceMappingURL=basic.js.map