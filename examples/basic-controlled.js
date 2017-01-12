webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(197);


/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(34);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(180);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _util = __webpack_require__(198);
	
	__webpack_require__(199);
	
	var _rcDialog = __webpack_require__(200);
	
	var _rcDialog2 = _interopRequireDefault(_rcDialog);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint no-console:0 */
	
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    multiple: _react.PropTypes.bool
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      visible: false,
	      multiple: true
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
	      expandedKeys: ['0-0-0-key'],
	      autoExpandParent: true,
	      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
	      checkedKeys: ['0-0-0-key'],
	      checkStrictlyKeys: { checked: ['0-0-1-key'], halfChecked: [] },
	      selectedKeys: [],
	      treeData: []
	    };
	  },
	  onExpand: function onExpand(expandedKeys) {
	    console.log('onExpand', arguments);
	    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
	    // or, you can remove all expanded chilren keys.
	    this.setState({
	      expandedKeys: expandedKeys,
	      autoExpandParent: false
	    });
	  },
	  onCheck: function onCheck(checkedKeys) {
	    this.setState({
	      checkedKeys: checkedKeys
	    });
	  },
	  onCheckStrictly: function onCheckStrictly(checkedKeys) /* extra*/{
	    console.log(arguments);
	    // const { checkedNodesPositions } = extra;
	    // const pps = filterParentPosition(checkedNodesPositions.map(i => i.pos));
	    // console.log(checkedNodesPositions.filter(i => pps.indexOf(i.pos) > -1).map(i => i.node.key));
	    var cks = {
	      checked: checkedKeys.checked || checkedKeys,
	      halfChecked: ['0-0-' + parseInt(Math.random() * 3, 10) + '-key']
	    };
	    this.setState({
	      // checkedKeys,
	      checkStrictlyKeys: cks
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
	  onClose: function onClose() {
	    this.setState({
	      visible: false
	    });
	  },
	  handleOk: function handleOk() {
	    this.setState({
	      visible: false
	    });
	  },
	  showModal: function showModal() {
	    var _this = this;
	
	    this.setState({
	      expandedKeys: ['0-0-0-key', '0-0-1-key'],
	      checkedKeys: ['0-0-0-key'],
	      visible: true
	    });
	    // simulate Ajax
	    setTimeout(function () {
	      _this.setState({
	        treeData: [].concat(_toConsumableArray(_util.gData))
	      });
	    }, 2000);
	  },
	  triggerChecked: function triggerChecked() {
	    this.setState({
	      checkedKeys: ['0-0-' + parseInt(Math.random() * 3, 10) + '-key']
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2.default.createElement(
	            _rcTree.TreeNode,
	            {
	              key: item.key, title: item.title,
	              disableCheckbox: item.key === '0-0-0-key'
	            },
	            loop(item.children)
	          );
	        }
	        return _react2.default.createElement(_rcTree.TreeNode, { key: item.key, title: item.title });
	      });
	    };
	    // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
	    return _react2.default.createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2.default.createElement(
	        'h2',
	        null,
	        'dialog'
	      ),
	      _react2.default.createElement(
	        'button',
	        { className: 'btn btn-primary', onClick: this.showModal },
	        'show dialog'
	      ),
	      _react2.default.createElement(
	        _rcDialog2.default,
	        {
	          title: 'TestDemo', visible: this.state.visible,
	          onOk: this.handleOk, onClose: this.onClose
	        },
	        this.state.treeData.length ? _react2.default.createElement(
	          _rcTree2.default,
	          {
	            checkable: true, className: 'dialog-tree',
	            onExpand: this.onExpand, expandedKeys: this.state.expandedKeys,
	            autoExpandParent: this.state.autoExpandParent,
	            onCheck: this.onCheck, checkedKeys: this.state.checkedKeys
	          },
	          loop(this.state.treeData)
	        ) : 'loading...'
	      ),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'controlled'
	      ),
	      _react2.default.createElement(
	        _rcTree2.default,
	        {
	          checkable: true,
	          onExpand: this.onExpand, expandedKeys: this.state.expandedKeys,
	          autoExpandParent: this.state.autoExpandParent,
	          onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
	          onSelect: this.onSelect, selectedKeys: this.state.selectedKeys
	        },
	        loop(_util.gData)
	      ),
	      _react2.default.createElement(
	        'button',
	        { onClick: this.triggerChecked },
	        'trigger checked'
	      ),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'checkStrictly'
	      ),
	      _react2.default.createElement(
	        _rcTree2.default,
	        {
	          checkable: true, multiple: this.props.multiple, defaultExpandAll: true,
	          onExpand: this.onExpand, expandedKeys: this.state.expandedKeys,
	          onCheck: this.onCheckStrictly,
	          checkedKeys: this.state.checkStrictlyKeys,
	          checkStrictly: true
	        },
	        loop(_util.gData)
	      ),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'radio\'s behavior select (in the same level)'
	      ),
	      _react2.default.createElement(
	        _rcTree2.default,
	        {
	          multiple: true, defaultExpandAll: true,
	          onSelect: this.onRbSelect,
	          selectedKeys: (0, _util.getRadioSelectKeys)(_util.gData, this.state.selectedKeys)
	        },
	        loop(_util.gData)
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 198:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generateData = generateData;
	exports.calcTotal = calcTotal;
	exports.isInclude = isInclude;
	exports.filterParentPosition = filterParentPosition;
	exports.getFilterExpandedKeys = getFilterExpandedKeys;
	exports.getRadioSelectKeys = getRadioSelectKeys;
	/* eslint no-loop-func: 0*/
	/* eslint no-console:0 */
	
	function generateData() {
	  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
	  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	  var gData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	
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
	  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
	  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	
	  /* eslint no-param-reassign:0*/
	  var rec = function rec(n) {
	    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
	  };
	  return rec(z + 1);
	}
	console.log('总节点数（单个tree）：', calcTotal());
	// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。
	
	var gData = exports.gData = generateData();
	
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
	
	  var _loop2 = function _loop2(i) {
	    if (levelArr[i + 1]) {
	      levelObj[levelArr[i]].forEach(function (ii) {
	        var _loop3 = function _loop3(j) {
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
	// console.log(filterParentPosition(
	//   ['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']
	// ));
	
	
	function loopData(data, callback) {
	  var loop = function loop(d) {
	    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
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

/***/ 199:
2,

/***/ 200:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Dialog = __webpack_require__(201);
	
	var _Dialog2 = _interopRequireDefault(_Dialog);
	
	var _getContainerRenderMixin = __webpack_require__(205);
	
	var _getContainerRenderMixin2 = _interopRequireDefault(_getContainerRenderMixin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var __assign = undefined && undefined.__assign || Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) {
	            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	    }
	    return t;
	};
	
	var DialogWrap = _react2["default"].createClass({
	    displayName: 'DialogWrap',
	
	    mixins: [(0, _getContainerRenderMixin2["default"])({
	        isVisible: function isVisible(instance) {
	            return instance.props.visible;
	        },
	
	        autoDestroy: false,
	        getComponent: function getComponent(instance, extra) {
	            return _react2["default"].createElement(_Dialog2["default"], __assign({}, instance.props, extra, { key: "dialog" }));
	        }
	    })],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            visible: false
	        };
	    },
	    shouldComponentUpdate: function shouldComponentUpdate(_ref) {
	        var visible = _ref.visible;
	
	        return !!(this.props.visible || visible);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        if (this.props.visible) {
	            this.renderComponent({
	                afterClose: this.removeContainer,
	                onClose: function onClose() {},
	
	                visible: false
	            });
	        } else {
	            this.removeContainer();
	        }
	    },
	    getElement: function getElement(part) {
	        return this._component.getElement(part);
	    },
	    render: function render() {
	        return null;
	    }
	});
	exports["default"] = DialogWrap;
	module.exports = exports['default'];

/***/ },

/***/ 201:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(34);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _KeyCode = __webpack_require__(202);
	
	var _KeyCode2 = _interopRequireDefault(_KeyCode);
	
	var _rcAnimate = __webpack_require__(186);
	
	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);
	
	var _LazyRenderBox = __webpack_require__(203);
	
	var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);
	
	var _getScrollBarSize = __webpack_require__(204);
	
	var _getScrollBarSize2 = _interopRequireDefault(_getScrollBarSize);
	
	var _objectAssign = __webpack_require__(6);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var __assign = undefined && undefined.__assign || Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) {
	            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	    }
	    return t;
	};
	
	var uuid = 0;
	var openCount = 0;
	/* eslint react/no-is-mounted:0 */
	function noop() {}
	function getScroll(w, top) {
	    var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
	    var method = 'scroll' + (top ? 'Top' : 'Left');
	    if (typeof ret !== 'number') {
	        var d = w.document;
	        ret = d.documentElement[method];
	        if (typeof ret !== 'number') {
	            ret = d.body[method];
	        }
	    }
	    return ret;
	}
	function setTransformOrigin(node, value) {
	    var style = node.style;
	    ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
	        style[prefix + 'TransformOrigin'] = value;
	    });
	    style['transformOrigin'] = value;
	}
	function offset(el) {
	    var rect = el.getBoundingClientRect();
	    var pos = {
	        left: rect.left,
	        top: rect.top
	    };
	    var doc = el.ownerDocument;
	    var w = doc.defaultView || doc.parentWindow;
	    pos.left += getScroll(w);
	    pos.top += getScroll(w, true);
	    return pos;
	}
	var Dialog = _react2["default"].createClass({
	    displayName: 'Dialog',
	    getDefaultProps: function getDefaultProps() {
	        return {
	            afterClose: noop,
	            className: '',
	            mask: true,
	            visible: false,
	            keyboard: true,
	            closable: true,
	            maskClosable: true,
	            prefixCls: 'rc-dialog',
	            onClose: noop
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        this.titleId = 'rcDialogTitle' + uuid++;
	    },
	    componentDidMount: function componentDidMount() {
	        this.componentDidUpdate({});
	    },
	    componentDidUpdate: function componentDidUpdate(prevProps) {
	        var props = this.props;
	        var mousePosition = this.props.mousePosition;
	        if (props.visible) {
	            // first show
	            if (!prevProps.visible) {
	                this.openTime = Date.now();
	                this.lastOutSideFocusNode = document.activeElement;
	                this.addScrollingEffect();
	                this.refs.wrap.focus();
	                var dialogNode = _reactDom2["default"].findDOMNode(this.refs.dialog);
	                if (mousePosition) {
	                    var elOffset = offset(dialogNode);
	                    setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
	                } else {
	                    setTransformOrigin(dialogNode, '');
	                }
	            }
	        } else if (prevProps.visible) {
	            if (props.mask && this.lastOutSideFocusNode) {
	                try {
	                    this.lastOutSideFocusNode.focus();
	                } catch (e) {
	                    this.lastOutSideFocusNode = null;
	                }
	                this.lastOutSideFocusNode = null;
	            }
	        }
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        if (this.props.visible) {
	            this.removeScrollingEffect();
	        }
	    },
	    onAnimateLeave: function onAnimateLeave() {
	        // need demo?
	        // https://github.com/react-component/dialog/pull/28
	        if (this.refs.wrap) {
	            this.refs.wrap.style.display = 'none';
	        }
	        this.removeScrollingEffect();
	        this.props.afterClose();
	    },
	    onMaskClick: function onMaskClick(e) {
	        // android trigger click on open (fastclick??)
	        if (Date.now() - this.openTime < 300) {
	            return;
	        }
	        if (e.target === e.currentTarget) {
	            this.close(e);
	        }
	    },
	    onKeyDown: function onKeyDown(e) {
	        var props = this.props;
	        if (props.keyboard && e.keyCode === _KeyCode2["default"].ESC) {
	            this.close(e);
	        }
	        // keep focus inside dialog
	        if (props.visible) {
	            if (e.keyCode === _KeyCode2["default"].TAB) {
	                var activeElement = document.activeElement;
	                var dialogRoot = this.refs.wrap;
	                var sentinel = this.refs.sentinel;
	                if (e.shiftKey) {
	                    if (activeElement === dialogRoot) {
	                        sentinel.focus();
	                    }
	                } else if (activeElement === this.refs.sentinel) {
	                    dialogRoot.focus();
	                }
	            }
	        }
	    },
	    getDialogElement: function getDialogElement() {
	        var props = this.props;
	        var closable = props.closable;
	        var prefixCls = props.prefixCls;
	        var dest = {};
	        if (props.width !== undefined) {
	            dest.width = props.width;
	        }
	        if (props.height !== undefined) {
	            dest.height = props.height;
	        }
	        var footer = void 0;
	        if (props.footer) {
	            footer = _react2["default"].createElement("div", { className: prefixCls + '-footer', ref: "footer" }, props.footer);
	        }
	        var header = void 0;
	        if (props.title) {
	            header = _react2["default"].createElement("div", { className: prefixCls + '-header', ref: "header" }, _react2["default"].createElement("div", { className: prefixCls + '-title', id: this.titleId }, props.title));
	        }
	        var closer = void 0;
	        if (closable) {
	            closer = _react2["default"].createElement("button", { onClick: this.close, "aria-label": "Close", className: prefixCls + '-close' }, _react2["default"].createElement("span", { className: prefixCls + '-close-x' }));
	        }
	        var style = (0, _objectAssign2["default"])({}, props.style, dest);
	        var transitionName = this.getTransitionName();
	        var dialogElement = _react2["default"].createElement(_LazyRenderBox2["default"], { key: "dialog-element", role: "document", ref: "dialog", style: style, className: prefixCls + ' ' + (props.className || ''), visible: props.visible }, _react2["default"].createElement("div", { className: prefixCls + '-content' }, closer, header, _react2["default"].createElement("div", __assign({ className: prefixCls + '-body', style: props.bodyStyle, ref: "body" }, props.bodyProps), props.children), footer), _react2["default"].createElement("div", { tabIndex: 0, ref: "sentinel", style: { width: 0, height: 0, overflow: 'hidden' } }, "sentinel"));
	        return _react2["default"].createElement(_rcAnimate2["default"], { key: "dialog", showProp: "visible", onLeave: this.onAnimateLeave, transitionName: transitionName, component: "", transitionAppear: true }, dialogElement);
	    },
	    getZIndexStyle: function getZIndexStyle() {
	        var style = {};
	        var props = this.props;
	        if (props.zIndex !== undefined) {
	            style.zIndex = props.zIndex;
	        }
	        return style;
	    },
	    getWrapStyle: function getWrapStyle() {
	        return (0, _objectAssign2["default"])({}, this.getZIndexStyle(), this.props.wrapStyle);
	    },
	    getMaskStyle: function getMaskStyle() {
	        return (0, _objectAssign2["default"])({}, this.getZIndexStyle(), this.props.maskStyle);
	    },
	    getMaskElement: function getMaskElement() {
	        var props = this.props;
	        var maskElement = void 0;
	        if (props.mask) {
	            var maskTransition = this.getMaskTransitionName();
	            maskElement = _react2["default"].createElement(_LazyRenderBox2["default"], __assign({ style: this.getMaskStyle(), key: "mask", className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible }, props.maskProps));
	            if (maskTransition) {
	                maskElement = _react2["default"].createElement(_rcAnimate2["default"], { key: "mask", showProp: "visible", transitionAppear: true, component: "", transitionName: maskTransition }, maskElement);
	            }
	        }
	        return maskElement;
	    },
	    getMaskTransitionName: function getMaskTransitionName() {
	        var props = this.props;
	        var transitionName = props.maskTransitionName;
	        var animation = props.maskAnimation;
	        if (!transitionName && animation) {
	            transitionName = props.prefixCls + '-' + animation;
	        }
	        return transitionName;
	    },
	    getTransitionName: function getTransitionName() {
	        var props = this.props;
	        var transitionName = props.transitionName;
	        var animation = props.animation;
	        if (!transitionName && animation) {
	            transitionName = props.prefixCls + '-' + animation;
	        }
	        return transitionName;
	    },
	    getElement: function getElement(part) {
	        return this.refs[part];
	    },
	    setScrollbar: function setScrollbar() {
	        if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
	            document.body.style.paddingRight = this.scrollbarWidth + 'px';
	        }
	    },
	    addScrollingEffect: function addScrollingEffect() {
	        openCount++;
	        if (openCount !== 1) {
	            return;
	        }
	        this.checkScrollbar();
	        this.setScrollbar();
	        document.body.style.overflow = 'hidden';
	        // this.adjustDialog();
	    },
	    removeScrollingEffect: function removeScrollingEffect() {
	        openCount--;
	        if (openCount !== 0) {
	            return;
	        }
	        document.body.style.overflow = '';
	        this.resetScrollbar();
	        // this.resetAdjustments();
	    },
	    close: function close(e) {
	        this.props.onClose(e);
	    },
	    checkScrollbar: function checkScrollbar() {
	        var fullWindowWidth = window.innerWidth;
	        if (!fullWindowWidth) {
	            var documentElementRect = document.documentElement.getBoundingClientRect();
	            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
	        }
	        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
	        if (this.bodyIsOverflowing) {
	            this.scrollbarWidth = (0, _getScrollBarSize2["default"])();
	        }
	    },
	    resetScrollbar: function resetScrollbar() {
	        document.body.style.paddingRight = '';
	    },
	    adjustDialog: function adjustDialog() {
	        if (this.refs.wrap && this.scrollbarWidth !== undefined) {
	            var modalIsOverflowing = this.refs.wrap.scrollHeight > document.documentElement.clientHeight;
	            this.refs.wrap.style.paddingLeft = (!this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
	            this.refs.wrap.style.paddingRight = (this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
	        }
	    },
	    resetAdjustments: function resetAdjustments() {
	        if (this.refs.wrap) {
	            this.refs.wrap.style.paddingLeft = this.refs.wrap.style.paddingLeft = '';
	        }
	    },
	    render: function render() {
	        var props = this.props;
	        var prefixCls = props.prefixCls,
	            maskClosable = props.maskClosable;
	
	        var style = this.getWrapStyle();
	        // clear hide display
	        // and only set display after async anim, not here for hide
	        if (props.visible) {
	            style.display = null;
	        }
	        return _react2["default"].createElement("div", null, this.getMaskElement(), _react2["default"].createElement("div", __assign({ tabIndex: -1, onKeyDown: this.onKeyDown, className: prefixCls + '-wrap ' + (props.wrapClassName || ''), ref: "wrap", onClick: maskClosable ? this.onMaskClick : undefined, role: "dialog", "aria-labelledby": props.title ? this.titleId : null, style: style }, props.wrapProps), this.getDialogElement()));
	    }
	});
	exports["default"] = Dialog;
	module.exports = exports['default'];

/***/ },

/***/ 202:
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ignore
	 * some key-codes definition and utils from closure-library
	 * @author yiminghe@gmail.com
	 */
	
	var KeyCode = {
	  /**
	   * MAC_ENTER
	   */
	  MAC_ENTER: 3,
	  /**
	   * BACKSPACE
	   */
	  BACKSPACE: 8,
	  /**
	   * TAB
	   */
	  TAB: 9,
	  /**
	   * NUMLOCK on FF/Safari Mac
	   */
	  NUM_CENTER: 12, // NUMLOCK on FF/Safari Mac
	  /**
	   * ENTER
	   */
	  ENTER: 13,
	  /**
	   * SHIFT
	   */
	  SHIFT: 16,
	  /**
	   * CTRL
	   */
	  CTRL: 17,
	  /**
	   * ALT
	   */
	  ALT: 18,
	  /**
	   * PAUSE
	   */
	  PAUSE: 19,
	  /**
	   * CAPS_LOCK
	   */
	  CAPS_LOCK: 20,
	  /**
	   * ESC
	   */
	  ESC: 27,
	  /**
	   * SPACE
	   */
	  SPACE: 32,
	  /**
	   * PAGE_UP
	   */
	  PAGE_UP: 33, // also NUM_NORTH_EAST
	  /**
	   * PAGE_DOWN
	   */
	  PAGE_DOWN: 34, // also NUM_SOUTH_EAST
	  /**
	   * END
	   */
	  END: 35, // also NUM_SOUTH_WEST
	  /**
	   * HOME
	   */
	  HOME: 36, // also NUM_NORTH_WEST
	  /**
	   * LEFT
	   */
	  LEFT: 37, // also NUM_WEST
	  /**
	   * UP
	   */
	  UP: 38, // also NUM_NORTH
	  /**
	   * RIGHT
	   */
	  RIGHT: 39, // also NUM_EAST
	  /**
	   * DOWN
	   */
	  DOWN: 40, // also NUM_SOUTH
	  /**
	   * PRINT_SCREEN
	   */
	  PRINT_SCREEN: 44,
	  /**
	   * INSERT
	   */
	  INSERT: 45, // also NUM_INSERT
	  /**
	   * DELETE
	   */
	  DELETE: 46, // also NUM_DELETE
	  /**
	   * ZERO
	   */
	  ZERO: 48,
	  /**
	   * ONE
	   */
	  ONE: 49,
	  /**
	   * TWO
	   */
	  TWO: 50,
	  /**
	   * THREE
	   */
	  THREE: 51,
	  /**
	   * FOUR
	   */
	  FOUR: 52,
	  /**
	   * FIVE
	   */
	  FIVE: 53,
	  /**
	   * SIX
	   */
	  SIX: 54,
	  /**
	   * SEVEN
	   */
	  SEVEN: 55,
	  /**
	   * EIGHT
	   */
	  EIGHT: 56,
	  /**
	   * NINE
	   */
	  NINE: 57,
	  /**
	   * QUESTION_MARK
	   */
	  QUESTION_MARK: 63, // needs localization
	  /**
	   * A
	   */
	  A: 65,
	  /**
	   * B
	   */
	  B: 66,
	  /**
	   * C
	   */
	  C: 67,
	  /**
	   * D
	   */
	  D: 68,
	  /**
	   * E
	   */
	  E: 69,
	  /**
	   * F
	   */
	  F: 70,
	  /**
	   * G
	   */
	  G: 71,
	  /**
	   * H
	   */
	  H: 72,
	  /**
	   * I
	   */
	  I: 73,
	  /**
	   * J
	   */
	  J: 74,
	  /**
	   * K
	   */
	  K: 75,
	  /**
	   * L
	   */
	  L: 76,
	  /**
	   * M
	   */
	  M: 77,
	  /**
	   * N
	   */
	  N: 78,
	  /**
	   * O
	   */
	  O: 79,
	  /**
	   * P
	   */
	  P: 80,
	  /**
	   * Q
	   */
	  Q: 81,
	  /**
	   * R
	   */
	  R: 82,
	  /**
	   * S
	   */
	  S: 83,
	  /**
	   * T
	   */
	  T: 84,
	  /**
	   * U
	   */
	  U: 85,
	  /**
	   * V
	   */
	  V: 86,
	  /**
	   * W
	   */
	  W: 87,
	  /**
	   * X
	   */
	  X: 88,
	  /**
	   * Y
	   */
	  Y: 89,
	  /**
	   * Z
	   */
	  Z: 90,
	  /**
	   * META
	   */
	  META: 91, // WIN_KEY_LEFT
	  /**
	   * WIN_KEY_RIGHT
	   */
	  WIN_KEY_RIGHT: 92,
	  /**
	   * CONTEXT_MENU
	   */
	  CONTEXT_MENU: 93,
	  /**
	   * NUM_ZERO
	   */
	  NUM_ZERO: 96,
	  /**
	   * NUM_ONE
	   */
	  NUM_ONE: 97,
	  /**
	   * NUM_TWO
	   */
	  NUM_TWO: 98,
	  /**
	   * NUM_THREE
	   */
	  NUM_THREE: 99,
	  /**
	   * NUM_FOUR
	   */
	  NUM_FOUR: 100,
	  /**
	   * NUM_FIVE
	   */
	  NUM_FIVE: 101,
	  /**
	   * NUM_SIX
	   */
	  NUM_SIX: 102,
	  /**
	   * NUM_SEVEN
	   */
	  NUM_SEVEN: 103,
	  /**
	   * NUM_EIGHT
	   */
	  NUM_EIGHT: 104,
	  /**
	   * NUM_NINE
	   */
	  NUM_NINE: 105,
	  /**
	   * NUM_MULTIPLY
	   */
	  NUM_MULTIPLY: 106,
	  /**
	   * NUM_PLUS
	   */
	  NUM_PLUS: 107,
	  /**
	   * NUM_MINUS
	   */
	  NUM_MINUS: 109,
	  /**
	   * NUM_PERIOD
	   */
	  NUM_PERIOD: 110,
	  /**
	   * NUM_DIVISION
	   */
	  NUM_DIVISION: 111,
	  /**
	   * F1
	   */
	  F1: 112,
	  /**
	   * F2
	   */
	  F2: 113,
	  /**
	   * F3
	   */
	  F3: 114,
	  /**
	   * F4
	   */
	  F4: 115,
	  /**
	   * F5
	   */
	  F5: 116,
	  /**
	   * F6
	   */
	  F6: 117,
	  /**
	   * F7
	   */
	  F7: 118,
	  /**
	   * F8
	   */
	  F8: 119,
	  /**
	   * F9
	   */
	  F9: 120,
	  /**
	   * F10
	   */
	  F10: 121,
	  /**
	   * F11
	   */
	  F11: 122,
	  /**
	   * F12
	   */
	  F12: 123,
	  /**
	   * NUMLOCK
	   */
	  NUMLOCK: 144,
	  /**
	   * SEMICOLON
	   */
	  SEMICOLON: 186, // needs localization
	  /**
	   * DASH
	   */
	  DASH: 189, // needs localization
	  /**
	   * EQUALS
	   */
	  EQUALS: 187, // needs localization
	  /**
	   * COMMA
	   */
	  COMMA: 188, // needs localization
	  /**
	   * PERIOD
	   */
	  PERIOD: 190, // needs localization
	  /**
	   * SLASH
	   */
	  SLASH: 191, // needs localization
	  /**
	   * APOSTROPHE
	   */
	  APOSTROPHE: 192, // needs localization
	  /**
	   * SINGLE_QUOTE
	   */
	  SINGLE_QUOTE: 222, // needs localization
	  /**
	   * OPEN_SQUARE_BRACKET
	   */
	  OPEN_SQUARE_BRACKET: 219, // needs localization
	  /**
	   * BACKSLASH
	   */
	  BACKSLASH: 220, // needs localization
	  /**
	   * CLOSE_SQUARE_BRACKET
	   */
	  CLOSE_SQUARE_BRACKET: 221, // needs localization
	  /**
	   * WIN_KEY
	   */
	  WIN_KEY: 224,
	  /**
	   * MAC_FF_META
	   */
	  MAC_FF_META: 224, // Firefox (Gecko) fires this for the meta key instead of 91
	  /**
	   * WIN_IME
	   */
	  WIN_IME: 229
	};
	
	/*
	 whether text and modified key is entered at the same time.
	 */
	KeyCode.isTextModifyingKeyEvent = function isTextModifyingKeyEvent(e) {
	  var keyCode = e.keyCode;
	  if (e.altKey && !e.ctrlKey || e.metaKey ||
	  // Function keys don't generate text
	  keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
	    return false;
	  }
	
	  // The following keys are quite harmless, even in combination with
	  // CTRL, ALT or SHIFT.
	  switch (keyCode) {
	    case KeyCode.ALT:
	    case KeyCode.CAPS_LOCK:
	    case KeyCode.CONTEXT_MENU:
	    case KeyCode.CTRL:
	    case KeyCode.DOWN:
	    case KeyCode.END:
	    case KeyCode.ESC:
	    case KeyCode.HOME:
	    case KeyCode.INSERT:
	    case KeyCode.LEFT:
	    case KeyCode.MAC_FF_META:
	    case KeyCode.META:
	    case KeyCode.NUMLOCK:
	    case KeyCode.NUM_CENTER:
	    case KeyCode.PAGE_DOWN:
	    case KeyCode.PAGE_UP:
	    case KeyCode.PAUSE:
	    case KeyCode.PRINT_SCREEN:
	    case KeyCode.RIGHT:
	    case KeyCode.SHIFT:
	    case KeyCode.UP:
	    case KeyCode.WIN_KEY:
	    case KeyCode.WIN_KEY_RIGHT:
	      return false;
	    default:
	      return true;
	  }
	};
	
	/*
	 whether character is entered.
	 */
	KeyCode.isCharacterKey = function isCharacterKey(keyCode) {
	  if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.NUM_ZERO && keyCode <= KeyCode.NUM_MULTIPLY) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) {
	    return true;
	  }
	
	  // Safari sends zero key code for non-latin characters.
	  if (window.navigation.userAgent.indexOf('WebKit') !== -1 && keyCode === 0) {
	    return true;
	  }
	
	  switch (keyCode) {
	    case KeyCode.SPACE:
	    case KeyCode.QUESTION_MARK:
	    case KeyCode.NUM_PLUS:
	    case KeyCode.NUM_MINUS:
	    case KeyCode.NUM_PERIOD:
	    case KeyCode.NUM_DIVISION:
	    case KeyCode.SEMICOLON:
	    case KeyCode.DASH:
	    case KeyCode.EQUALS:
	    case KeyCode.COMMA:
	    case KeyCode.PERIOD:
	    case KeyCode.SLASH:
	    case KeyCode.APOSTROPHE:
	    case KeyCode.SINGLE_QUOTE:
	    case KeyCode.OPEN_SQUARE_BRACKET:
	    case KeyCode.BACKSLASH:
	    case KeyCode.CLOSE_SQUARE_BRACKET:
	      return true;
	    default:
	      return false;
	  }
	};
	
	module.exports = KeyCode;

/***/ },

/***/ 203:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _objectAssign = __webpack_require__(6);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var __assign = undefined && undefined.__assign || Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) {
	            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	    }
	    return t;
	};
	
	var LazyRenderBox = _react2["default"].createClass({
	    displayName: 'LazyRenderBox',
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	        return !!nextProps.hiddenClassName || !!nextProps.visible;
	    },
	    render: function render() {
	        var className = this.props.className;
	        if (!!this.props.hiddenClassName && !this.props.visible) {
	            className += ' ' + this.props.hiddenClassName;
	        }
	        var props = (0, _objectAssign2["default"])({}, this.props);
	        delete props.hiddenClassName;
	        delete props.visible;
	        props.className = className;
	        return _react2["default"].createElement("div", __assign({}, props));
	    }
	});
	exports["default"] = LazyRenderBox;
	module.exports = exports['default'];

/***/ },

/***/ 204:
/***/ function(module, exports) {

	'use strict';
	
	var cached = void 0;
	
	function getScrollBarSize(fresh) {
	  if (fresh || cached === undefined) {
	    var inner = document.createElement('div');
	    inner.style.width = '100%';
	    inner.style.height = '200px';
	
	    var outer = document.createElement('div');
	    var outerStyle = outer.style;
	
	    outerStyle.position = 'absolute';
	    outerStyle.top = 0;
	    outerStyle.left = 0;
	    outerStyle.pointerEvents = 'none';
	    outerStyle.visibility = 'hidden';
	    outerStyle.width = '200px';
	    outerStyle.height = '150px';
	    outerStyle.overflow = 'hidden';
	
	    outer.appendChild(inner);
	
	    document.body.appendChild(outer);
	
	    var widthContained = inner.offsetWidth;
	    outer.style.overflow = 'scroll';
	    var widthScroll = inner.offsetWidth;
	
	    if (widthContained === widthScroll) {
	      widthScroll = outer.clientWidth;
	    }
	
	    document.body.removeChild(outer);
	
	    cached = widthContained - widthScroll;
	  }
	  return cached;
	}
	
	module.exports = getScrollBarSize;

/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports["default"] = getContainerRenderMixin;
	
	var _reactDom = __webpack_require__(34);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function defaultGetContainer() {
	  var container = document.createElement('div');
	  document.body.appendChild(container);
	  return container;
	}
	
	function getContainerRenderMixin(config) {
	  var _config$autoMount = config.autoMount;
	  var autoMount = _config$autoMount === undefined ? true : _config$autoMount;
	  var _config$autoDestroy = config.autoDestroy;
	  var autoDestroy = _config$autoDestroy === undefined ? true : _config$autoDestroy;
	  var isVisible = config.isVisible;
	  var getComponent = config.getComponent;
	  var _config$getContainer = config.getContainer;
	  var getContainer = _config$getContainer === undefined ? defaultGetContainer : _config$getContainer;
	
	
	  var mixin = void 0;
	
	  function _renderComponent(instance, componentArg, ready) {
	    if (!isVisible || instance._component || isVisible(instance)) {
	      if (!instance._container) {
	        instance._container = getContainer(instance);
	      }
	      _reactDom2["default"].unstable_renderSubtreeIntoContainer(instance, getComponent(instance, componentArg), instance._container, function callback() {
	        instance._component = this;
	        if (ready) {
	          ready.call(this);
	        }
	      });
	    }
	  }
	
	  if (autoMount) {
	    mixin = _extends({}, mixin, {
	      componentDidMount: function componentDidMount() {
	        _renderComponent(this);
	      },
	      componentDidUpdate: function componentDidUpdate() {
	        _renderComponent(this);
	      }
	    });
	  }
	
	  if (!autoMount || !autoDestroy) {
	    mixin = _extends({}, mixin, {
	      renderComponent: function renderComponent(componentArg, ready) {
	        _renderComponent(this, componentArg, ready);
	      }
	    });
	  }
	
	  function _removeContainer(instance) {
	    if (instance._container) {
	      var container = instance._container;
	      _reactDom2["default"].unmountComponentAtNode(container);
	      container.parentNode.removeChild(container);
	      instance._container = null;
	    }
	  }
	
	  if (autoDestroy) {
	    mixin = _extends({}, mixin, {
	      componentWillUnmount: function componentWillUnmount() {
	        _removeContainer(this);
	      }
	    });
	  } else {
	    mixin = _extends({}, mixin, {
	      removeContainer: function removeContainer() {
	        _removeContainer(this);
	      }
	    });
	  }
	
	  return mixin;
	}
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=basic-controlled.js.map