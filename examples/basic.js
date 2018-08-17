webpackJsonp([9],{

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(197);


/***/ }),

/***/ 197:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_tree__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__basic_less__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__basic_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__basic_less__);




/* eslint no-console:0 */
/* eslint no-alert:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */







var treeData = [{ key: '0-0', title: 'parent 1', children: [{ key: '0-0-0', title: 'parent 1-1', children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }]
  }, { key: '0-0-1', title: 'parent 1-2', children: [{ key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true }, { key: '0-0-1-1', title: 'parent 1-2-1' }]
  }]
}];

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo(props) {
    var _arguments = arguments;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).call(this, props));

    _this.onExpand = function (expandedKeys) {
      console.log('onExpand', expandedKeys, _arguments);
    };

    _this.onSelect = function (selectedKeys, info) {
      console.log('selected', selectedKeys, info);
      _this.selKey = info.node.props.eventKey;
    };

    _this.onCheck = function (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    };

    _this.onEdit = function () {
      setTimeout(function () {
        console.log('current key: ', _this.selKey);
      }, 0);
    };

    _this.onDel = function (e) {
      if (!window.confirm('sure to delete?')) {
        return;
      }
      e.stopPropagation();
    };

    var keys = props.keys;
    _this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys
    };
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'render',
    value: function render() {
      var customLabel = __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'span',
        { className: 'cus-label' },
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'span',
          null,
          'operations: '
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'span',
          { style: { color: 'blue' }, onClick: this.onEdit },
          'Edit'
        ),
        '\xA0',
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'label',
          { onClick: function onClick(e) {
              return e.stopPropagation();
            } },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { type: 'checkbox' }),
          ' checked'
        ),
        '\xA0',
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'span',
          { style: { color: '#EB0000' }, onClick: this.onDel },
          'Delete'
        )
      );

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'div',
        { style: { margin: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'h2',
          null,
          'simple'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_7_rc_tree___default.a,
          {
            className: 'myCls', showLine: true, checkable: true, defaultExpandAll: true,
            defaultExpandedKeys: this.state.defaultExpandedKeys,
            onExpand: this.onExpand,
            defaultSelectedKeys: this.state.defaultSelectedKeys,
            defaultCheckedKeys: this.state.defaultCheckedKeys,
            onSelect: this.onSelect, onCheck: this.onCheck
          },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"],
            { title: 'parent 1', key: '0-0' },
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"],
              { title: customLabel, key: '0-0-0' },
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-0', style: { background: 'rgba(255, 0, 0, 0.1)' } }),
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-1' })
            ),
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"],
              { title: 'parent 1-1', key: '0-0-1' },
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'parent 1-1-0', key: '0-0-1-0', disableCheckbox: true }),
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'parent 1-1-1', key: '0-0-1-1' })
            ),
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"],
              { title: 'parent 1-2', key: '0-0-2', disabled: true },
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'parent 1-2-0', key: '0-0-2-0', disabled: true }),
              __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree__["TreeNode"], { title: 'parent 1-2-1', key: '0-0-2-1' })
            )
          )
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'h2',
          null,
          'Check on Click TreeNode'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7_rc_tree___default.a, {
          className: 'myCls',
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
        })
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

Demo.propTypes = {
  keys: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.array
};
Demo.defaultProps = {
  keys: ['0-0-0-0']
};


__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 76:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[196]);
//# sourceMappingURL=basic.js.map