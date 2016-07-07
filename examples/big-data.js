webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(197);


/***/ },

/***/ 190:
/***/ function(module, exports) {

	/* eslint no-loop-func: 0*/
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.generateData = generateData;
	exports.calcTotal = calcTotal;
	exports.isInclude = isInclude;
	exports.filterParentPosition = filterParentPosition;
	exports.getFilterExpandedKeys = getFilterExpandedKeys;
	exports.getRadioSelectKeys = getRadioSelectKeys;
	
	function generateData() {
	  var x = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];
	  var y = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
	  var z = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	  var gData = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
	
	  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
	  function _loop(_level, _preKey, _tns) {
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
	      return _loop(__level, key, tns[index].children);
	    });
	  }
	  _loop(z);
	  return gData;
	}
	
	function calcTotal() {
	  var x = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];
	  var y = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
	  var z = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	
	  /* eslint no-param-reassign:0*/
	  var rec = function rec(n) {
	    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
	  };
	  return rec(z + 1);
	}
	
	console.log('总节点数（单个tree）：', calcTotal());
	// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。
	
	var gData = generateData();
	
	exports.gData = gData;
	
	function isInclude(smallArray, bigArray) {
	  return smallArray.every(function (ii, i) {
	    return ii === bigArray[i];
	  });
	}
	
	// console.log(isInclude(['0', '1'], ['0', '10', '1']));
	
	// arr.length === 628, use time: ~20ms
	
	function filterParentPosition(arr) {
	  var levelObj = {};
	  arr.forEach(function (item) {
	    var posLen = item.split('-').length;
	    if (!levelObj[posLen]) {
	      levelObj[posLen] = [];
	    }
	    levelObj[posLen].push(item);
	  });
	  var levelArr = Object.keys(levelObj).sort();
	
	  var _loop2 = function (i) {
	    if (levelArr[i + 1]) {
	      levelObj[levelArr[i]].forEach(function (ii) {
	        var _loop3 = function (j) {
	          levelObj[levelArr[j]].forEach(function (_i, index) {
	            if (isInclude(ii.split('-'), _i.split('-'))) {
	              levelObj[levelArr[j]][index] = null;
	            }
	          });
	          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(function (p) {
	            return p;
	          });
	        };
	
	        for (var j = i + 1; j < levelArr.length; j++) {
	          _loop3(j);
	        }
	      });
	    }
	  };
	
	  for (var i = 0; i < levelArr.length; i++) {
	    _loop2(i);
	  }
	  var nArr = [];
	  levelArr.forEach(function (i) {
	    nArr = nArr.concat(levelObj[i]);
	  });
	  return nArr;
	}
	
	// console.log(filterParentPosition(['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']));
	
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

/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(35);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(172);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _bigDataGenerator = __webpack_require__(198);
	
	var _bigDataGenerator2 = _interopRequireDefault(_bigDataGenerator);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    multiple: _react.PropTypes.bool
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {};
	  },
	  getInitialState: function getInitialState() {
	    return {
	      gData: [],
	      expandedKeys: [],
	      checkedKeys: [],
	      checkedKeys1: [],
	      selectedKeys: []
	    };
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    // invoked immediately before rendering with new props or state, not for initial 'render'
	    // see componentWillReceiveProps if you need to call setState
	    // console.log(nextState.gData === this.state.gData);
	    if (nextState.gData === this.state.gData) {
	      this.notReRender = true;
	    } else {
	      this.notReRender = false;
	    }
	  },
	  onCheck: function onCheck(checkedKeys) {
	    this.setState({
	      checkedKeys: checkedKeys
	    });
	  },
	  onCheckStrictly: function onCheckStrictly(checkedKeys1) /* extra*/{
	    console.log(arguments);
	    this.setState({
	      checkedKeys1: checkedKeys1
	    });
	  },
	  onSelect: function onSelect(selectedKeys, info) {
	    console.log('onSelect', selectedKeys, info);
	    this.setState({
	      selectedKeys: selectedKeys
	    });
	  },
	  onGen: function onGen(data) {
	    this.setState({
	      gData: data,
	      expandedKeys: ['0-0-0-key'],
	      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
	      checkedKeys: ['0-0-0-key'],
	      checkedKeys1: ['0-0-0-key'],
	      selectedKeys: []
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTree.TreeNode,
	            { key: item.key, title: item.title },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTree.TreeNode, { key: item.key, title: item.title });
	      });
	    };
	    // const s = Date.now();
	    // const treeNodes = loop(this.state.gData);
	    var treeNodes = undefined;
	    if (this.treeNodes && this.notReRender) {
	      treeNodes = this.treeNodes;
	    } else {
	      treeNodes = loop(this.state.gData);
	      this.treeNodes = treeNodes;
	    }
	    // console.log(Date.now()-s);
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2['default'].createElement(_bigDataGenerator2['default'], { onGen: this.onGen }),
	      _react2['default'].createElement(
	        'div',
	        { style: { border: '1px solid red', width: 700, padding: 10 } },
	        _react2['default'].createElement(
	          'h5',
	          { style: { margin: 10 } },
	          '大数据量下优化建议：'
	        ),
	        '初始展开的节点少，向dom中插入节点就会少，速度更快。 ',
	        _react2['default'].createElement('br', null),
	        'treeNodes 总数据量尽量少变化，缓存并复用计算出的 treeNodes，可在 componentWillUpdate 等时机做判断。 ',
	        _react2['default'].createElement('br', null)
	      ),
	      this.state.gData.length ? _react2['default'].createElement(
	        'div',
	        { style: { display: 'flex' } },
	        _react2['default'].createElement(
	          'div',
	          { style: { marginRight: 20 } },
	          _react2['default'].createElement(
	            'h3',
	            null,
	            'normal check'
	          ),
	          _react2['default'].createElement(
	            _rcTree2['default'],
	            { checkable: true, multiple: this.props.multiple,
	              defaultExpandedKeys: this.state.expandedKeys,
	              onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
	              onSelect: this.onSelect, selectedKeys: this.state.selectedKeys },
	            treeNodes
	          )
	        ),
	        _react2['default'].createElement(
	          'div',
	          null,
	          _react2['default'].createElement(
	            'h3',
	            null,
	            'checkStrictly'
	          ),
	          _react2['default'].createElement(
	            _rcTree2['default'],
	            { checkable: true, checkStrictly: true, multiple: this.props.multiple,
	              defaultExpandedKeys: this.state.expandedKeys,
	              onCheck: this.onCheckStrictly, checkedKeys: this.state.checkedKeys1,
	              onSelect: this.onSelect, selectedKeys: this.state.selectedKeys },
	            treeNodes
	          )
	        )
	      ) : null
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 198:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _util = __webpack_require__(190);
	
	var Gen = _react2['default'].createClass({
	  displayName: 'Gen',
	
	  propTypes: {
	    onGen: _react.PropTypes.func,
	    x: _react.PropTypes.number,
	    y: _react.PropTypes.number,
	    z: _react.PropTypes.number
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onGen: function onGen() {},
	      x: 20,
	      y: 18,
	      z: 1
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      nums: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	  },
	  onGen: function onGen(e) {
	    e.preventDefault();
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	    this.setState({
	      nums: (0, _util.calcTotal)(vals.x, vals.y, vals.z)
	    });
	  },
	  getVals: function getVals() {
	    return {
	      x: parseInt(this.refs.x.value, 10),
	      y: parseInt(this.refs.y.value, 10),
	      z: parseInt(this.refs.z.value, 10)
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var x = _props.x;
	    var y = _props.y;
	    var z = _props.z;
	
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'big data generator'
	      ),
	      _react2['default'].createElement(
	        'form',
	        { onSubmit: this.onGen },
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'x: ',
	          _react2['default'].createElement('input', { ref: 'x', defaultValue: x, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'y: ',
	          _react2['default'].createElement('input', { ref: 'y', defaultValue: y, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'z: ',
	          _react2['default'].createElement('input', { ref: 'z', defaultValue: z, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'button',
	          { type: 'submit' },
	          'Generate'
	        ),
	        _react2['default'].createElement(
	          'p',
	          null,
	          'total nodes: ',
	          this.state.nums || (0, _util.calcTotal)(x, y, z)
	        )
	      ),
	      _react2['default'].createElement(
	        'p',
	        { style: { fontSize: 12 } },
	        'x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）'
	      )
	    );
	  }
	});
	exports['default'] = Gen;
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=big-data.js.map