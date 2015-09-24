webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcTree = __webpack_require__(4);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	function handleCheck(info) {
	  console.log('check: ', info);
	}
	
	var TreeDemo = (function (_React$Component) {
	  _inherits(TreeDemo, _React$Component);
	
	  function TreeDemo(props) {
	    var _this = this;
	
	    _classCallCheck(this, TreeDemo);
	
	    _get(Object.getPrototypeOf(TreeDemo.prototype), 'constructor', this).call(this, props);
	    ['handleClick'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	    this.state = {
	      checkedKeys: []
	    };
	  }
	
	  _createClass(TreeDemo, [{
	    key: 'handleClick',
	    value: function handleClick() {
	      this.setState({
	        checkedKeys: ['p11']
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        'div',
	        null,
	        _react2['default'].createElement(
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
	              onCheck: handleCheck, defaultCheckedKeys: ['p1', 'p22'], checkedKeys: this.state.checkedKeys },
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
	        ),
	        _react2['default'].createElement(
	          'button',
	          { onClick: this.handleClick },
	          'check sth'
	        )
	      );
	    }
	  }]);
	
	  return TreeDemo;
	})(_react2['default'].Component);
	
	_react2['default'].render(_react2['default'].createElement(TreeDemo, null), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=checked.js.map