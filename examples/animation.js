webpackJsonp([11],{

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(119);


/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_assets_index_less__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_tree_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_tree__);
/* eslint no-console:0, react/no-danger: 0 */





var STYLE = '\n.rc-tree-child-tree {\n  display: block;\n}\n\n.node-motion {\n  transition: all .3s;\n  overflow-y: hidden;\n}\n\n.node-motion-enter,\n.node-motion-leave-active {\n  height: 0;\n}\n';

var onEnterActive = function onEnterActive(node) {
  return { height: node.scrollHeight };
};

var motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onEnterActive: onEnterActive,
  onLeaveStart: function onLeaveStart(node) {
    return { height: node.offsetHeight };
  }
};

var demo = __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
    'h2',
    null,
    'expanded'
  ),
  __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement('style', { dangerouslySetInnerHTML: { __html: STYLE } }),
  __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_3_rc_tree___default.a,
    {
      defaultExpandAll: false,
      defaultExpandedKeys: ['p1'],
      motion: motion
    },
    __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
      { title: 'parent 1', key: 'p1' },
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { key: 'p10', title: 'leaf' }),
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
        { title: 'parent 1-1', key: 'p11' },
        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"],
          { title: 'parent 2-1', key: 'p21' },
          __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'leaf' }),
          __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { title: 'leaf' })
        ),
        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree__["TreeNode"], { key: 'p22', title: 'leaf' })
      )
    )
  )
);

__WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(demo, document.getElementById('__react-content'));

/***/ })

},[118]);
//# sourceMappingURL=animation.js.map