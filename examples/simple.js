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
	
	function handleSelect(info) {
	  console.log('selected', info);
	}
	
	var demo = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'simple'
	  ),
	  _react2['default'].createElement(
	    _rcTree2['default'],
	    { className: 'myCls', onSelect: handleSelect, defaultSelectedKeys: ['0-1', '0-1-1'], multiple: true,
	      defaultExpandAll: true, showIcon: false, showLine: true },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', key: '0-1' },
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-0', key: '0-1-1' },
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
	        { title: 'parent 1-1' },
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
//# sourceMappingURL=simple.js.map