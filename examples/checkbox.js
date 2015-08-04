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
	
	function handleSelect(selected, c) {
	  console.log('selected: ', selected, c);
	}
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
	    { className: 'myCls', onSelect: handleSelect, onChecked: handleChecked,
	      checkable: true, showLine: false, expandAll: false },
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
	        { title: 'parent 1-1', expanded: true, defaultExpanded: false },
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          { title: 'parent 2-1' },
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
	    ),
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      null,
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        null,
	        'leaf '
	      )
	    )
	  )
	);
	
	_react2['default'].render(demo, document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=checkbox.js.map