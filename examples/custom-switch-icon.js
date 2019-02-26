webpackJsonp([11],{

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(209);


/***/ }),

/***/ 209:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_extends__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rc_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_tree_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rc_tree_assets_index_less__);





/* eslint no-console:0 */
/* eslint no-alert:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */






var arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' + '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' + '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' + '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

var getSvgIcon = function getSvgIcon(path) {
  var iStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'i',
    { style: iStyle },
    __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
      'svg',
      {
        viewBox: '0 0 1024 1024',
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        style: __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_extends___default()({ verticalAlign: '-.125em' }, style)
      },
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('path', { d: path })
    )
  );
};

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo(props) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).call(this, props));

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
      var switcherIcon = function switcherIcon(obj) {
        if (obj.isLeaf) {
          return getSvgIcon(arrowPath, { cursor: 'pointer', backgroundColor: 'white' }, { transform: 'rotate(270deg)' });
        }
        return getSvgIcon(arrowPath, { cursor: 'pointer', backgroundColor: 'white' }, { transform: 'rotate(' + (obj.expanded ? 90 : 0) + 'deg)' });
      };
      var treeCls = 'myCls' + (this.state.useIcon && ' customIcon' || '');

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { id: 'demo', style: { margin: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'h2',
          null,
          'custom switch icon'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8_rc_tree___default.a,
          {
            className: treeCls, showLine: true, checkable: true, defaultExpandAll: true,
            defaultExpandedKeys: this.state.defaultExpandedKeys,
            defaultSelectedKeys: this.state.defaultSelectedKeys,
            defaultCheckedKeys: this.state.defaultCheckedKeys,
            switcherIcon: switcherIcon
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
            { title: 'parent 1', key: '0-0' },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
              { title: 'leaf', key: '0-0-0' },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-0' }),
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'leaf', key: '0-0-0-1' })
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
              { title: 'parent 1-1', key: '0-0-1' },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-1-0', key: '0-0-1-0', disableCheckbox: true }),
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-1-1', key: '0-0-1-1' })
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
              { title: 'parent 1-2', key: '0-0-2', disabled: true },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-2-0', key: '0-0-2-0', disabled: true }),
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-2-1', key: '0-0-2-1' })
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"],
              { title: 'parent 1-3', key: '0-0-3' },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-3-0', key: '0-0-3-0' }),
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree__["TreeNode"], { title: 'parent 1-3-1', key: '0-0-3-1' })
            )
          )
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

Demo.propTypes = {
  keys: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array
};
Demo.defaultProps = {
  keys: ['0-0-0-0']
};


__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[208]);
//# sourceMappingURL=custom-switch-icon.js.map