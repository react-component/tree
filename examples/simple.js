webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(243);


/***/ },

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(161);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	function handleSelect(info) {
	  console.log('selected', info);
	}
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    defaultSelectedKeys: _react.PropTypes.array
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      defaultSelectedKeys: ['0-1', 'random']
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      defaultSelectedKeys: this.props.defaultSelectedKeys,
	      switchIt: true
	    };
	  },
	  change: function change() {
	    this.setState({
	      defaultSelectedKeys: [this.props.defaultSelectedKeys[this.state.switchIt ? 0 : 1]],
	      switchIt: !this.state.switchIt
	    });
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'simple'
	      ),
	      _react2['default'].createElement(
	        _rcTree2['default'],
	        { className: 'myCls', defaultSelectedKeys: this.state.defaultSelectedKeys, onSelect: handleSelect, multiple: true,
	          checkable: true, defaultExpandAll: true, showIcon: false, showLine: true },
	        _react2['default'].createElement(
	          _rcTree.TreeNode,
	          { title: 'parent 1', key: '0-1' },
	          _react2['default'].createElement(
	            _rcTree.TreeNode,
	            { title: 'parent 1-0', key: '0-1-1' },
	            _react2['default'].createElement(_rcTree.TreeNode, { title: 'leaf', key: 'random' }),
	            _react2['default'].createElement(_rcTree.TreeNode, { title: 'leaf' })
	          ),
	          _react2['default'].createElement(
	            _rcTree.TreeNode,
	            { title: 'parent 1-1' },
	            _react2['default'].createElement(_rcTree.TreeNode, { title: _react2['default'].createElement(
	                'span',
	                { style: { color: 'red' } },
	                'sss'
	              ) })
	          )
	        )
	      ),
	      _react2['default'].createElement(
	        'button',
	        { onClick: this.change },
	        'change state'
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map