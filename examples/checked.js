webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcTree = __webpack_require__(4);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	function handleCheck(info) {
	  console.log('check: ', info);
	}
	
	var demo = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'checked'
	  ),
	  _react2['default'].createElement(
	    _rcTree2['default'],
	    { defaultExpandAll: true, checkable: true,
	      onCheck: handleCheck, defaultCheckedKeys: ['p1', 'p22'] },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', key: 'p1' },
	      _react2['default'].createElement(_rcTree.TreeNode, { key: 'p10', title: 'leaf' }),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-1', key: 'p11' },
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          { title: 'parent 2-1', key: 'p21' },
	          _react2['default'].createElement(
	            _rcTree.TreeNode,
	            null,
	            'test'
	          ),
	          _react2['default'].createElement(_rcTree.TreeNode, { title: _react2['default'].createElement(
	              'span',
	              null,
	              'sss'
	            ) })
	        ),
	        _react2['default'].createElement(_rcTree.TreeNode, { key: 'p22', title: 'leaf' })
	      )
	    ),
	    _react2['default'].createElement(_rcTree.TreeNode, { key: 'p12', title: 'leaf' })
	  )
	);
	
	_react2['default'].render(demo, document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=checked.js.map