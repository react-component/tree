webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(161);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _util = __webpack_require__(176);
	
	function isValid(iArray, nArray) {
	  return iArray.every(function (ii, i) {
	    return ii === nArray[i];
	  });
	}
	function getCheckedKeys(node, checkedKeys, allCheckedNodesKeys) {
	  var nodeKey = node.props.eventKey;
	  var newCks = [].concat(_toConsumableArray(checkedKeys));
	  var nodePos = undefined;
	  var unCheck = allCheckedNodesKeys.some(function (item) {
	    if (item.key === nodeKey) {
	      nodePos = item.pos;
	      return true;
	    }
	  });
	  if (unCheck) {
	    (function () {
	      var nArr = nodePos.split('-');
	      newCks = [];
	      allCheckedNodesKeys.forEach(function (item) {
	        var iArr = item.pos.split('-');
	        if (item.pos === nodePos || nArr.length > iArr.length && isValid(iArr, nArr) || nArr.length < iArr.length && isValid(nArr, iArr)) {
	          return;
	        }
	        newCks.push(item.key);
	      });
	    })();
	  } else {
	    newCks.push(nodeKey);
	  }
	  return newCks;
	}
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      checkedKeys: ['0-0-0'],
	      selectedKeys: ['0-0']
	    };
	  },
	  onCheck: function onCheck(info) {
	    console.log('check: ', info);
	    this.setState({
	      checkedKeys: getCheckedKeys(info.node, info.checkedKeys, info.allCheckedNodesKeys),
	      selectedKeys: ['0-3', '0-4']
	    });
	  },
	  onSelect: function onSelect(info) {
	    console.log('selected: ', info);
	    var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
	    var index = selectedKeys.indexOf(info.node.props.eventKey);
	    if (index > -1) {
	      selectedKeys.splice(index, 1);
	    } else {
	      selectedKeys.push(info.node.props.eventKey);
	    }
	    this.setState({
	      selectedKeys: selectedKeys
	    });
	  },
	  render: function render() {
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
	      null,
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'checked'
	      ),
	      _react2['default'].createElement(
	        _rcTree2['default'],
	        { defaultExpandAll: true, checkable: true, multiple: true,
	          onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
	          onSelect: this.onSelect, selectedKeys: this.state.selectedKeys },
	        loop(_util.gData)
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

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

/***/ }

});
//# sourceMappingURL=checked.js.map