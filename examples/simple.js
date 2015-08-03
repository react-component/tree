webpackJsonp([0,1],[
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
	  console.log(selected, c);
	}
	
	var demo = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'tree'
	  ),
	  _react2['default'].createElement(
	    _rcTree2['default'],
	    { className: 'myCls', onSelect: handleSelect, checkable: true },
	    _react2['default'].createElement(
	      _rcTree.TreeNode,
	      { title: 'parent 1', expanded: false },
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        null,
	        'leaf '
	      ),
	      _react2['default'].createElement(
	        _rcTree.TreeNode,
	        { title: 'parent 1-1' },
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(5);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Tree = __webpack_require__(6);
	
	var _Tree2 = _interopRequireDefault(_Tree);
	
	var _TreeNode = __webpack_require__(19);
	
	var _TreeNode2 = _interopRequireDefault(_TreeNode);
	
	_Tree2['default'].TreeNode = _TreeNode2['default'];
	
	exports['default'] = _Tree2['default'];
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(7);
	
	var Tree = (function (_React$Component) {
	  _inherits(Tree, _React$Component);
	
	  function Tree(props) {
	    var _this = this;
	
	    _classCallCheck(this, Tree);
	
	    _get(Object.getPrototypeOf(Tree.prototype), 'constructor', this).call(this, props);
	    ['handleKeyDown', 'handleChecked', 'handleSelect'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	  }
	
	  _createClass(Tree, [{
	    key: 'handleChecked',
	    value: function handleChecked(isChk, c, e) {
	      if (this.props.onChecked) {
	        this.props.onChecked(isChk, c, e);
	      }
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect(isSel, c, e) {
	      if (this.props.onSelect) {
	        this.props.onSelect(isSel, c, e);
	      }
	    }
	
	    // all keyboard events callbacks run from here at first
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      console.log(_rcUtil.KeyCode);
	      e.preventDefault();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var props = this.props;
	
	      var domProps = {
	        className: (0, _rcUtil.classSet)(props.className, props.prefixCls),
	        style: props.expanded ? { display: 'block' } : { display: 'none' },
	        role: 'tree-node',
	        'aria-activedescendant': '',
	        'aria-labelledby': '',
	        'aria-expanded': props.expanded ? 'true' : 'false',
	        'aria-selected': props.selected ? 'true' : 'false',
	        'aria-level': ''
	      };
	      if (props.id) {
	        domProps.id = props.id;
	      }
	      if (props.focusable) {
	        domProps.tabIndex = '0';
	        domProps.onKeyDown = this.handleKeyDown;
	      }
	      this.childrenLength = _react2['default'].Children.count(props.children);
	      this.newChildren = _react2['default'].Children.map(props.children, this.renderTreeNode, this);
	
	      return _react2['default'].createElement(
	        'ul',
	        _extends({}, domProps, { ref: 'tree' }),
	        this.newChildren
	      );
	    }
	  }, {
	    key: 'renderTreeNode',
	    value: function renderTreeNode(child, index) {
	      var props = this.props;
	      var pos = (props._pos || 0) + '-' + index;
	      var cloneProps = {
	        ref: 'treeNode',
	        _level: props._level || 0,
	        _pos: pos,
	        _isChildTree: props._isChildTree || false,
	        _index: index,
	        _len: this.childrenLength,
	        prefixCls: props.prefixCls,
	        showLine: props.showLine,
	        checkable: props.checkable,
	        _checked: props._checked,
	        _checkPart: props._checkPart,
	        onChecked: this.handleChecked,
	        onSelect: this.handleSelect
	      };
	      return _react2['default'].cloneElement(child, cloneProps);
	    }
	  }], [{
	    key: 'statics',
	    value: function statics() {
	      return {
	        treeNodesState: {},
	        trees: []
	      };
	    }
	  }]);
	
	  return Tree;
	})(_react2['default'].Component);
	
	Tree.propTypes = {
	  focusable: _react2['default'].PropTypes.bool,
	  expanded: _react2['default'].PropTypes.bool,
	  showLine: _react2['default'].PropTypes.bool,
	  checkable: _react2['default'].PropTypes.bool,
	  onSelect: _react2['default'].PropTypes.func
	};
	
	Tree.defaultProps = {
	  prefixCls: 'rc-tree',
	  expanded: true,
	  showLine: true
	};
	
	exports['default'] = Tree;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  guid: __webpack_require__(8),
	  classSet: __webpack_require__(9),
	  joinClasses: __webpack_require__(10),
	  KeyCode: __webpack_require__(11),
	  PureRenderMixin: __webpack_require__(12),
	  shallowEqual: __webpack_require__(13),
	  createChainedFunction: __webpack_require__(14),
	  Dom: {
	    addEventListener: __webpack_require__(15),
	    contains: __webpack_require__(16)
	  },
	  Children: {
	    toArray: __webpack_require__(17),
	    mapSelf: __webpack_require__(18)
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	var seed = 0;
	module.exports = function () {
	  return Date.now() + '_' + (seed++);
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/cx.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */
	
	/**
	 * This function is used to mark string literals representing CSS class names
	 * so that they can be transformed statically. This allows for modularization
	 * and minification of CSS class names.
	 *
	 * In static_upstream, this function is actually implemented, but it should
	 * eventually be replaced with something more descriptive, and the transform
	 * that is used in the main stack should be ported for use elsewhere.
	 *
	 * @param string|object className to modularize, or an object of key/values.
	 *                      In the object case, the values are conditions that
	 *                      determine if the className keys should be included.
	 * @param [string ...]  Variable list of classNames in the string case.
	 * @return string       Renderable space-separated CSS className.
	 */
	function cx(classNames) {
	  if (typeof classNames === 'object') {
	    return Object.keys(classNames).filter(function(className) {
	      return classNames[className];
	    }).join(' ');
	  } else {
	    return Array.prototype.join.call(arguments, ' ');
	  }
	}
	
	module.exports = cx;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/utils/joinClasses.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */
	
	"use strict";
	
	/**
	 * Combines multiple className strings into one.
	 * http://jsperf.com/joinclasses-args-vs-array
	 *
	 * @param {...?string} classes
	 * @return {string}
	 */
	
	function joinClasses(className /*, ... */ ) {
	  if (!className) {
	    className = '';
	  }
	  var nextClass;
	  var argLength = arguments.length;
	  if (argLength > 1) {
	    for (var ii = 1; ii < argLength; ii++) {
	      nextClass = arguments[ii];
	      if (nextClass) {
	        className = (className ? className + ' ' : '') + nextClass;
	      }
	    }
	  }
	  return className;
	}
	
	module.exports = joinClasses;


/***/ },
/* 11 */
/***/ function(module, exports) {

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
	KeyCode.isTextModifyingKeyEvent = function (e) {
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
	KeyCode.isCharacterKey = function (keyCode) {
	  if (keyCode >= KeyCode.ZERO &&
	    keyCode <= KeyCode.NINE) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.NUM_ZERO &&
	    keyCode <= KeyCode.NUM_MULTIPLY) {
	    return true;
	  }
	
	  if (keyCode >= KeyCode.A &&
	    keyCode <= KeyCode.Z) {
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule ReactComponentWithPureRenderMixin
	*/
	
	"use strict";
	
	var shallowEqual = __webpack_require__(13);
	
	/**
	 * If your React component's render function is "pure", e.g. it will render the
	 * same result given the same props and state, provide this Mixin for a
	 * considerable performance boost.
	 *
	 * Most React components have pure render functions.
	 *
	 * Example:
	 *
	 *   var ReactComponentWithPureRenderMixin =
	 *     require('ReactComponentWithPureRenderMixin');
	 *   React.createClass({
	 *     mixins: [ReactComponentWithPureRenderMixin],
	 *
	 *     render: function() {
	 *       return <div className={this.props.className}>foo</div>;
	 *     }
	 *   });
	 *
	 * Note: This only checks shallow equality for props and state. If these contain
	 * complex data structures this mixin may have false-negatives for deeper
	 * differences. Only mixin to components which have simple props and state, or
	 * use `forceUpdate()` when you know deep data structures have changed.
	 */
	var ReactComponentWithPureRenderMixin = {
	  shouldComponentUpdate: function(nextProps, nextState) {
	    return !shallowEqual(this.props, nextProps) ||
	           !shallowEqual(this.state, nextState);
	  }
	};
	
	module.exports = ReactComponentWithPureRenderMixin;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shallowEqual
	 */
	
	"use strict";
	
	/**
	 * Performs equality by iterating through keys on an object and returning
	 * false when any key has values which are not strictly equal between
	 * objA and objB. Returns true when the values of all keys are strictly equal.
	 *
	 * @return {boolean}
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	  var key;
	  // Test for A's keys different from B.
	  for (key in objA) {
	    if (objA.hasOwnProperty(key) &&
	        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
	      return false;
	    }
	  }
	  // Test for B's keys missing from A.
	  for (key in objB) {
	    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = shallowEqual;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @returns {function|null}
	 */
	function createChainedFunction() {
	  var args = arguments;
	
	  return function chainedFunction() {
	    for (var i = 0; i < args.length; i++) {
	      if (args[i] && args[i].apply) {
	        args[i].apply(this, arguments);
	      }
	    }
	  };
	}
	
	module.exports = createChainedFunction;


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function (target, eventType, callback) {
	  if (target.addEventListener) {
	    target.addEventListener(eventType, callback, false);
	    return {
	      remove: function () {
	        target.removeEventListener(eventType, callback, false);
	      }
	    };
	  } else if (target.attachEvent) {
	    target.attachEvent('on' + eventType, callback);
	    return {
	      remove: function () {
	        target.detachEvent('on' + eventType, callback);
	      }
	    };
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function (root, node) {
	  while (node) {
	    if (node === root) {
	      return true;
	    }
	    node = node.parentNode;
	  }
	
	  return false;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3);
	
	module.exports = function (children) {
	  var ret = [];
	  React.Children.forEach(children, function (c) {
	    ret.push(c);
	  });
	  return ret;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3);
	
	function mirror(o) {
	  return o;
	}
	
	module.exports = function (children) {
	  // return ReactFragment
	  return React.Children.map(children, mirror);
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(7);
	
	var _rcUtil2 = _interopRequireDefault(_rcUtil);
	
	var _Tree = __webpack_require__(6);
	
	var _Tree2 = _interopRequireDefault(_Tree);
	
	_Tree2['default'].statics = _Tree2['default'].statics();
	
	var TreeNode = (function (_React$Component) {
	  _inherits(TreeNode, _React$Component);
	
	  function TreeNode(props) {
	    var _this = this;
	
	    _classCallCheck(this, TreeNode);
	
	    _get(Object.getPrototypeOf(TreeNode.prototype), 'constructor', this).call(this, props);
	    this.state = {
	      expanded: props.expanded,
	      selected: props.selected || false,
	      checkPart: props._checkPart || false,
	      checked: props._checked || false
	    };
	    ['handleExpandedState', 'handleSelect', 'handleChecked'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	  }
	
	  _createClass(TreeNode, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.setState({
	        //selected: nextProps.selected,
	        checkPart: nextProps._checkPart,
	        checked: nextProps._checked
	      });
	    }
	  }, {
	    key: 'switchExpandedState',
	    value: function switchExpandedState(newState, onStateChangeComplete) {
	      this.setState({
	        expanded: newState
	      }, onStateChangeComplete);
	    }
	
	    // keyboard event support
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      e.preventDefault();
	    }
	  }, {
	    key: 'handleExpandedState',
	    value: function handleExpandedState() {
	      this.switchExpandedState(!this.state.expanded);
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect() {
	      this.setState({
	        selected: !this.state.selected
	      });
	      if (this.props.onSelect) {
	        this.props.onSelect(!this.state.selected, this);
	      }
	    }
	  }, {
	    key: 'handleChecked',
	    value: function handleChecked() {
	      var _pos = this.props._pos;
	      var checked = !this.state.checked;
	
	      if (this.state.checkPart) {
	        // return;
	        checked = false;
	      }
	
	      var nSt = {
	        checkPart: false,
	        checked: checked
	      };
	
	      this.setState(nSt);
	
	      var sortedTree = _Tree2['default'].statics.trees.sort(function (a, b) {
	        return b.props._pos.length - a.props._pos.length;
	      });
	
	      sortedTree.forEach(function (c) {
	        var cPos = c.props._pos;
	        if (_pos.indexOf(cPos) === 0 && _pos !== cPos) {
	          var childArr = _rcUtil2['default'].Children.toArray(c.props.children),
	              len = childArr.length;
	
	          var checkedNumbers = 0;
	
	          //先计算已经选中的节点数
	          for (var i = 0; i < len; i++) {
	            var checkSt = _Tree2['default'].statics.treeNodesState[cPos + '-' + i];
	            if (checkSt.checked) {
	              checkedNumbers++;
	            } else if (checkSt.checkPart) {
	              checkedNumbers += 0.5;
	            }
	          }
	
	          //点击节点的 直接父级
	          if (_pos.length - cPos.length <= 2) {
	            //如果原来是半选
	            if (_Tree2['default'].statics.treeNodesState[_pos].checkPart) {
	              // checked ? checkedNumbers += 0.5 : checkedNumbers -= 0.5;
	              if (checked) {
	                checkedNumbers += 0.5;
	              } else {
	                checkedNumbers -= 0.5;
	              }
	            } else if (checked) {
	              checkedNumbers++;
	            } else {
	              checkedNumbers--;
	            }
	          }
	
	          var newSt;
	          if (checkedNumbers <= 0) {
	            //都不选
	            newSt = {
	              checkPart: false,
	              checked: false
	            };
	          } else if (checkedNumbers === len) {
	            //全选
	            newSt = {
	              checkPart: false,
	              checked: true
	            };
	          } else {
	            //部分选择
	            newSt = {
	              checkPart: true,
	              checked: false
	            };
	          }
	          c.setState(newSt);
	          _Tree2['default'].statics.treeNodesState[cPos] = newSt;
	        }
	      });
	
	      _Tree2['default'].statics.treeNodesState[_pos] = nSt;
	
	      if (this.props.onChecked) {
	        this.props.onChecked(checked, this);
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      if (this.newChildren) {
	        for (var i = 0; i < _Tree2['default'].statics.trees.length; i++) {
	          var obj = _Tree2['default'].statics.trees[i];
	          if (obj.props._pos === this.props._pos) {
	            _Tree2['default'].statics.trees.splice(i--, 1);
	          }
	        }
	        _Tree2['default'].statics.trees.push(this);
	      }
	      //add treeNodes checked state
	      _Tree2['default'].statics.treeNodesState[this.props._pos] = {
	        checked: this.state.checked,
	        checkPart: this.state.checkPart
	      };
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var checkbox = this.refs.checkbox;
	      if (checkbox) {
	        var cls = checkbox.getDOMNode().className;
	        var checkSt = _Tree2['default'].statics.treeNodesState[this.props._pos] || {};
	        checkSt.checkPart = nextState.checkPart;
	        checkSt.checked = nextState.checked;
	        if (nextState.checkPart) {
	          checkbox.getDOMNode().className = cls.indexOf('checkbox_true_part') > -1 ? cls : cls + ' checkbox_true_part';
	          return false;
	        } else {
	          checkbox.getDOMNode().className = cls.replace(/checkbox_true_part/g, '');
	        }
	      }
	      return true;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var props = this.props;
	      var state = this.state;
	
	      var prefixCls = props.prefixCls;
	      var switchState = state.expanded ? 'open' : 'close';
	
	      var switcherCls = {};
	      switcherCls.button = true;
	      switcherCls[prefixCls + '-treenode-switcher'] = true;
	      switcherCls[prefixCls + '-switcher__' + switchState] = true;
	      if (props._isChildTree && props._index === 0) {
	        if (props._len !== 1) {
	          switcherCls['center_' + switchState] = true;
	        } else {
	          switcherCls['bottom_' + switchState] = true;
	        }
	      } else if (props._index === 0) {
	        switcherCls['roots_' + switchState] = true;
	      } else if (props._index === props._len - 1) {
	        switcherCls['bottom_' + switchState] = true;
	      } else {
	        switcherCls['center_' + switchState] = true;
	      }
	
	      var checkbox = null;
	      var checkboxCls = {};
	      if (props.checkable) {
	        checkboxCls.button = true;
	        checkboxCls.chk = true;
	        /* jshint ignore:start */
	        if (state.checkPart) {
	          checkboxCls.checkbox_true_part = true;
	        } else if (state.checked) {
	          checkboxCls.checkbox_true_full = true;
	        } else {
	          checkboxCls.checkbox_false_full = true;
	        }
	        /* jshint ignore:end */
	        checkbox = _react2['default'].createElement('span', { ref: 'checkbox', className: (0, _rcUtil.classSet)(checkboxCls), onClick: this.handleChecked });
	      }
	
	      var iconEleCls = {};
	      iconEleCls.button = true;
	      iconEleCls[prefixCls + '-iconEle'] = true;
	      iconEleCls[prefixCls + '-icon__' + switchState] = true;
	
	      var userIconEle = null;
	      if (props.iconEle && _react2['default'].isValidElement(props.iconEle)) {
	        userIconEle = props.iconEle;
	      }
	
	      var content = props.title;
	      var newChildren = this.renderChildren(props.children);
	      if (newChildren === props.children) {
	        content = newChildren;
	        newChildren = null;
	      }
	
	      return _react2['default'].createElement(
	        'li',
	        { className: (0, _rcUtil.joinClasses)('level' + props._level, 'pos-' + props._pos) },
	        _react2['default'].createElement('span', { className: (0, _rcUtil.joinClasses)(props.className, (0, _rcUtil.classSet)(switcherCls)),
	          onClick: this.handleExpandedState }),
	        checkbox,
	        _react2['default'].createElement(
	          'a',
	          { ref: 'selectHandle', title: content,
	            className: state.selected ? prefixCls + '-selected' : '',
	            onClick: this.handleSelect },
	          _react2['default'].createElement(
	            'span',
	            { className: (0, _rcUtil.classSet)(iconEleCls) },
	            userIconEle
	          ),
	          _react2['default'].createElement(
	            'span',
	            null,
	            content
	          )
	        ),
	        newChildren
	      );
	    }
	  }, {
	    key: 'renderChildren',
	    value: function renderChildren(children) {
	      var newChildren = null;
	      if (children.type === TreeNode || Array.isArray(children) && children.every(function (item) {
	        return item.type === TreeNode;
	      })) {
	
	        var cls = {};
	        cls[this.props.prefixCls + '-child-tree'] = true;
	        if (this.props.showLine && this.props._index !== this.props._len - 1) {
	          cls.line = true;
	        }
	
	        var treeProps = {
	          _level: this.props._level + 1,
	          _pos: this.props._pos,
	          _isChildTree: true,
	          className: (0, _rcUtil.classSet)(cls),
	          expanded: this.state.expanded,
	          //selected: this.state.checked,
	          _checked: this.state.checked,
	          _checkPart: this.state.checkPart,
	          checkable: this.props.checkable, //只是为了传递根节点上的checkable设置,是否有更好做法?
	          onChecked: this.props.onChecked,
	          onSelect: this.props.onSelect
	        };
	        newChildren = this.newChildren = _react2['default'].createElement(
	          _Tree2['default'],
	          treeProps,
	          children
	        );
	      } else {
	        newChildren = children;
	      }
	
	      return newChildren;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      //console.log( this.newChildren );
	      //if (this.newChildren) {
	      //  Tree.statics.trees.push(this);
	      //}
	    }
	  }]);
	
	  return TreeNode;
	})(_react2['default'].Component);
	
	TreeNode.propTypes = {
	  selected: _react2['default'].PropTypes.bool,
	  iconEle: _react2['default'].PropTypes.node,
	  onSelect: _react2['default'].PropTypes.func
	};
	TreeNode.defaultProps = {
	  title: '---',
	  expanded: true
	};
	
	exports['default'] = TreeNode;
	module.exports = exports['default'];

/***/ }
]);
//# sourceMappingURL=simple.js.map