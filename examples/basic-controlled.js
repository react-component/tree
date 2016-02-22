webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(179);


/***/ },

/***/ 179:
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
	
	var _util = __webpack_require__(180);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    multiple: _react.PropTypes.bool
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      multiple: true
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      expandedKeys: (0, _util.getFilterExpandedKeys)(_util.gData, ['0-0-0-key']),
	      checkedKeys: ['0-0-0-key'],
	      selectedKeys: []
	    };
	  },
	  onExpand: function onExpand(treeNode, expand, expandedKeys) {
	    console.log('onExpand', expand, expandedKeys);
	    var index = expandedKeys.indexOf(treeNode.props.eventKey);
	    if (expand) {
	      if (index > -1) {
	        expandedKeys.splice(index, 1);
	      }
	    } else {
	      if (index === -1) {
	        expandedKeys.push(treeNode.props.eventKey);
	      }
	    }
	    this.setState({
	      expandedKeys: expandedKeys
	    });
	  },
	  onCheck: function onCheck(checkedKeys) {
	    this.setState({
	      checkedKeys: checkedKeys
	    });
	  },
	  onSelect: function onSelect(selectedKeys, info) {
	    console.log('onSelect', selectedKeys, info);
	    this.setState({
	      selectedKeys: selectedKeys
	    });
	  },
	  onRbSelect: function onRbSelect(selectedKeys, info) {
	    var _selectedKeys = selectedKeys;
	    if (info.selected) {
	      _selectedKeys = (0, _util.getRadioSelectKeys)(_util.gData, selectedKeys, info.node.props.eventKey);
	    }
	    this.setState({
	      selectedKeys: _selectedKeys
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTree.TreeNode,
	            { key: item.key, title: item.title,
	              disableCheckbox: item.key === '0-0-0-key' ? true : false },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTree.TreeNode, { key: item.key, title: item.title });
	      });
	    };
	    // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'controlled'
	      ),
	      _react2['default'].createElement(
	        _rcTree2['default'],
	        { checkable: true, multiple: this.props.multiple, defaultExpandAll: true,
	          onExpand: this.onExpand, expandedKeys: this.state.expandedKeys,
	          onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
	          onSelect: this.onSelect, selectedKeys: this.state.selectedKeys },
	        loop(_util.gData)
	      ),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'radio\'s behavior select (in the same level)'
	      ),
	      _react2['default'].createElement(
	        _rcTree2['default'],
	        { multiple: true, defaultExpandAll: true,
	          onSelect: this.onRbSelect,
	          selectedKeys: (0, _util.getRadioSelectKeys)(_util.gData, this.state.selectedKeys) },
	        loop(_util.gData)
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 180:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var x = 3;
	var y = 2;
	var z = 1;
	// x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
	// 总节点数：
	// const rec = (n) => n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
	// console.log(rec(z + 1));
	// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。
	
	var gData = [];
	
	var generateData = function generateData(_level, _preKey, _tns) {
	  var preKey = _preKey || '0';
	  var tns = _tns || gData;
	
	  var children = [];
	  for (var i = 0; i < x; i++) {
	    var key = preKey + '-' + i;
	    tns.push({ title: key + '-label', key: key + '-key' });
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
	
	function loopData(data, callback) {
	  var loop = function loop(d) {
	    var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	    d.forEach(function (item, index) {
	      var pos = level + '-' + index;
	      if (item.children) {
	        loop(item.children, pos);
	      }
	      callback(item, index, pos);
	    });
	  };
	  loop(data);
	}
	
	function spl(str) {
	  return str.split('-');
	}
	function splitLen(str) {
	  return str.split('-').length;
	}
	
	function getFilterExpandedKeys(data, expandedKeys) {
	  var expandedPosArr = [];
	  loopData(data, function (item, index, pos) {
	    if (expandedKeys.indexOf(item.key) > -1) {
	      expandedPosArr.push(pos);
	    }
	  });
	  var filterExpandedKeys = [];
	  loopData(data, function (item, index, pos) {
	    expandedPosArr.forEach(function (p) {
	      if ((splitLen(pos) < splitLen(p) && p.indexOf(pos) === 0 || pos === p) && filterExpandedKeys.indexOf(item.key) === -1) {
	        filterExpandedKeys.push(item.key);
	      }
	    });
	  });
	  return filterExpandedKeys;
	}
	
	function isSibling(pos, pos1) {
	  pos.pop();
	  pos1.pop();
	  return pos.join(',') === pos1.join(',');
	}
	
	function getRadioSelectKeys(data, selectedKeys, key) {
	  var res = [];
	  var pkObjArr = [];
	  var selPkObjArr = [];
	  loopData(data, function (item, index, pos) {
	    if (selectedKeys.indexOf(item.key) > -1) {
	      pkObjArr.push([pos, item.key]);
	    }
	    if (key && key === item.key) {
	      selPkObjArr.push(pos, item.key);
	    }
	  });
	  var lenObj = {};
	  var getPosKey = function getPosKey(pos, k) {
	    var posLen = splitLen(pos);
	    if (!lenObj[posLen]) {
	      lenObj[posLen] = [[pos, k]];
	    } else {
	      lenObj[posLen].forEach(function (pkArr, i) {
	        if (isSibling(spl(pkArr[0]), spl(pos))) {
	          // 后来覆盖前者
	          lenObj[posLen][i] = [pos, k];
	        } else if (spl(pkArr[0]) !== spl(pos)) {
	          lenObj[posLen].push([pos, k]);
	        }
	      });
	    }
	  };
	  pkObjArr.forEach(function (pk) {
	    getPosKey(pk[0], pk[1]);
	  });
	  if (key) {
	    getPosKey(selPkObjArr[0], selPkObjArr[1]);
	  }
	
	  Object.keys(lenObj).forEach(function (item) {
	    lenObj[item].forEach(function (i) {
	      if (res.indexOf(i[1]) === -1) {
	        res.push(i[1]);
	      }
	    });
	  });
	  return res;
	}
	
	exports.gData = gData;
	exports.getFilterExpandedKeys = getFilterExpandedKeys;
	exports.getRadioSelectKeys = getRadioSelectKeys;

/***/ }

});
//# sourceMappingURL=basic-controlled.js.map