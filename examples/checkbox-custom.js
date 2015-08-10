webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23);


/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcTree = __webpack_require__(7);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	function handleChecked(checked, c) {
	  console.log('checked: ', checked, c);
	}
	
	var demo = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'checkbox'
	  ),
	  _react2['default'].createElement(
	    _rcTree2['default'],
	    { expandAll: true, checkable: true, onChecked: handleChecked },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', checkbox: _react2['default'].createElement('input', { type: 'checkbox', defaultChecked: true }) },
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        null,
	        'child1 '
	      ),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-1', checkbox: _react2['default'].createElement('input', { type: 'checkbox', defaultChecked: false }) },
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
	      null,
	      'leaf '
	    )
	  )
	);
	
	_react2['default'].render(demo, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=checkbox-custom.js.map