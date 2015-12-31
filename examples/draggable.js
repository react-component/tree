webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(220);


/***/ },

/***/ 176:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var x = 3;
	var y = 2;
	var z = 1;
	var gData = [];
	
	var generateData = function generateData(_level, _preKey, _tns) {
	  var preKey = _preKey || '0';
	  var tns = _tns || gData;
	
	  var children = [];
	  for (var i = 0; i < x; i++) {
	    var key = preKey + '-' + i;
	    tns.push({ title: key, key: key });
	    if (i < y) {
	      children.push(key);
	    }
	  }
	  if (_level < 0) {
	    return tns;
	  }
	  var __level = _level - 1;
	  children.forEach(function (key, index) {
	    tns[index].children = [];
	    return generateData(__level, key, tns[index].children);
	  });
	};
	generateData(z);
	
	exports.gData = gData;

/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	__webpack_require__(2);
	
	__webpack_require__(221);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(161);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _util = __webpack_require__(176);
	
	var TreeDemo = (function (_React$Component) {
	  _inherits(TreeDemo, _React$Component);
	
	  function TreeDemo(props) {
	    var _this = this;
	
	    _classCallCheck(this, TreeDemo);
	
	    _get(Object.getPrototypeOf(TreeDemo.prototype), 'constructor', this).call(this, props);
	    ['handleDragStart', 'handleDragEnter', 'handleDrop', 'handleCheck', 'handleSelect'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	    this.state = {
	      gData: _util.gData,
	      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
	      checkedKeys: [],
	      selectedKeys: []
	    };
	  }
	
	  _createClass(TreeDemo, [{
	    key: 'handleDragStart',
	    value: function handleDragStart() {}
	  }, {
	    key: 'handleDragEnter',
	    value: function handleDragEnter(info) {
	      // console.log(info);
	      this.setState({
	        expandedKeys: info.expandedKeys
	      });
	    }
	  }, {
	    key: 'handleDrop',
	    value: function handleDrop(info) {
	      console.log(info);
	      var dropKey = info.node.props.eventKey;
	      var dragKey = info.dragNode.props.eventKey;
	      // const dragNodesKeys = info.dragNodesKeys;
	      var loop = function loop(data, key, callback) {
	        data.forEach(function (item, index, arr) {
	          if (item.key === key) {
	            return callback(item, index, arr);
	          }
	          if (item.children) {
	            return loop(item.children, key, callback);
	          }
	        });
	      };
	      var data = [].concat(_toConsumableArray(this.state.gData));
	      var dragObj = undefined;
	      loop(data, dragKey, function (item, index, arr) {
	        arr.splice(index, 1);
	        dragObj = item;
	      });
	      if (info.dropToGap) {
	        var ar = undefined;
	        var i = undefined;
	        loop(data, dropKey, function (item, index, arr) {
	          ar = arr;
	          i = index;
	        });
	        ar.splice(i, 0, dragObj);
	      } else {
	        loop(data, dropKey, function (item) {
	          item.children = item.children || [];
	          // where to insert 示例添加到尾部，可以是随意位置
	          item.children.push(dragObj);
	        });
	      }
	      this.setState({
	        gData: data,
	        expandedKeys: info.originExpandedKeys
	      });
	    }
	  }, {
	    key: 'handleCheck',
	    value: function handleCheck(info) {
	      // console.log('check: ', info);
	      this.setState({
	        checkedKeys: [info.node.props.eventKey]
	      });
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect(info) {
	      // console.log('selected: ', info);
	      this.setState({
	        selectedKeys: [info.node.props.eventKey]
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var loop = function loop(data) {
	        return data.map(function (item) {
	          if (item.children) {
	            return _react2['default'].createElement(
	              _rcTree.TreeNode,
	              { key: item.key, title: item.key },
	              loop(item.children)
	            );
	          }
	          return _react2['default'].createElement(_rcTree.TreeNode, { key: item.key, title: item.key });
	        });
	      };
	      return _react2['default'].createElement(
	        'div',
	        { className: 'draggable-demo' },
	        _react2['default'].createElement(
	          'h2',
	          null,
	          'draggable '
	        ),
	        _react2['default'].createElement(
	          'p',
	          null,
	          'drag a node into another node'
	        ),
	        _react2['default'].createElement(
	          'div',
	          { className: 'draggable-container' },
	          _react2['default'].createElement(
	            _rcTree2['default'],
	            { defaultExpandedKeys: this.state.expandedKeys, draggable: true,
	              onTreeDragStart: this.handleDragStart, onTreeDragEnter: this.handleDragEnter, onTreeDrop: this.handleDrop,
	              checkable: false, onCheck: this.handleCheck, checkedKeys: this.state.checkedKeys,
	              onSelect: this.handleSelect, selectedKeys: this.state.selectedKeys },
	            loop(this.state.gData)
	          )
	        )
	      );
	    }
	  }]);
	
	  return TreeDemo;
	})(_react2['default'].Component);
	
	_reactDom2['default'].render(_react2['default'].createElement(TreeDemo, null), document.getElementById('__react-content'));

/***/ },

/***/ 221:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=draggable.js.map