webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31);


/***/ },

/***/ 31:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcTree = __webpack_require__(7);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var demo = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'expanded'
	  ),
	  _react2['default'].createElement(
	    _rcTree2['default'],
	    { defaultExpandedKeys: ['p1', 'p11'] },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', key: 'p1' },
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { key: 'p10' },
	        'leaf '
	      ),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-1', key: 'p11' },
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          { title: 'parent 2-1', key: 'p21' },
	          _react2['default'].createElement(
	            _rcTree.TreeNode,
	            null,
	            'leaf '
	          ),
	          _react2['default'].createElement(
	            _rcTree.TreeNode,
	            null,
	            'leaf '
	          )
	        ),
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          { key: 'p22' },
	          'leaf'
	        )
	      )
	    ),
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { key: 'p12' },
	      'leaf'
	    )
	  )
	);
	
	_react2['default'].render(demo, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=expanded.js.map