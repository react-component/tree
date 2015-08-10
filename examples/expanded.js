webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24);


/***/ },

/***/ 24:
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
	    { className: 'myCls' },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', expanded: true },
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        null,
	        'leaf '
	      ),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-1', defaultExpanded: true },
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          null,
	          'leaf '
	        ),
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          null,
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
	        )
	      ),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-2', defaultExpanded: false },
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
	      )
	    )
	  )
	);
	
	_react2['default'].render(demo, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=expanded.js.map