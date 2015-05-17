webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  guid: __webpack_require__(12),
	  classSet: __webpack_require__(13),
	  joinClasses: __webpack_require__(14),
	  KeyCode: __webpack_require__(15),
	  PureRenderMixin: __webpack_require__(16),
	  shallowEqual: __webpack_require__(11),
	  createChainedFunction: __webpack_require__(17),
	  Dom: {
	    addEventListener: __webpack_require__(18),
	    contains: __webpack_require__(19)
	  },
	  Children: {
	    toArray: __webpack_require__(20)
	  }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	var Tree = __webpack_require__(6);
	Tree.TreeNode = __webpack_require__(7);
	
	module.exports = Tree;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/hua/my/react/c/tree/node_modules/css-loader/index.js!/Users/hua/my/react/c/tree/assets/index.css", function() {
			var newContent = require("!!/Users/hua/my/react/c/tree/node_modules/css-loader/index.js!/Users/hua/my/react/c/tree/assets/index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	exports.push([module.id, ".rc-tree {\n  margin: 0;\n  padding: 5px;\n}\n.rc-tree li {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  line-height: 14px;\n  white-space: nowrap;\n  outline: 0;\n}\n.rc-tree li ul {\n  margin: 0;\n  padding: 0 0 0 18px;\n}\n.rc-tree li ul.line {\n  background: url(https://t.alipayobjects.com/images/T13BtfXl0mXXXXXXXX.gif) 0 0 repeat-y;\n}\n.rc-tree li a {\n  padding: 1px 3px 0 0;\n  margin: 0;\n  cursor: pointer;\n  height: 17px;\n  background-color: transparent;\n  text-decoration: none;\n  vertical-align: top;\n  display: inline-block;\n}\n.rc-tree li span {\n  line-height: 16px;\n  margin-right: 2px;\n}\n.rc-tree li span.button {\n  line-height: 0;\n  margin: 0;\n  width: 16px;\n  height: 16px;\n  display: inline-block;\n  vertical-align: middle;\n  border: 0 none;\n  cursor: pointer;\n  outline: none;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  background-attachment: scroll;\n  background-image: url(\"https://t.alipayobjects.com/images/T1.ANfXhXtXXXXXXXX.png\");\n}\n.rc-tree li span.button.roots_open {\n  background-position: -92px 0;\n}\n.rc-tree li span.button.roots_close {\n  background-position: -74px 0;\n}\n.rc-tree li span.button.center_open {\n  background-position: -92px -18px;\n}\n.rc-tree li span.button.center_close {\n  background-position: -74px -18px;\n}\n.rc-tree li span.button.bottom_open {\n  background-position: -92px -36px;\n}\n.rc-tree li span.button.bottom_close {\n  background-position: -74px -36px;\n}\n.rc-tree li span.button.center_docu {\n  background-position: -56px -18px;\n}\n.rc-tree li span.button.bottom_docu {\n  background-position: -56px -36px;\n}\n.rc-tree li span.button.chk {\n  width: 13px;\n  height: 13px;\n  margin: 0 3px 0 0;\n  cursor: auto;\n}\n.rc-tree li span.button.chk.checkbox_false_full {\n  background-position: 0 0;\n}\n.rc-tree li span.button.chk.checkbox_false_full_focus {\n  background-position: 0 -14px;\n}\n.rc-tree li span.button.chk.checkbox_false_part {\n  background-position: 0 -28px;\n}\n.rc-tree li span.button.chk.checkbox_false_part_focus {\n  background-position: 0 -42px;\n}\n.rc-tree li span.button.chk.checkbox_false_disable {\n  background-position: 0 -56px;\n}\n.rc-tree li span.button.chk.checkbox_true_full {\n  background-position: -14px 0;\n}\n.rc-tree li span.button.chk.checkbox_true_full_focus {\n  background-position: -14px -14px;\n}\n.rc-tree li span.button.chk.checkbox_true_part {\n  background-position: -14px -28px;\n}\n.rc-tree li span.button.chk.checkbox_true_part_focus {\n  background-position: -14px -42px;\n}\n.rc-tree li span.button.chk.checkbox_true_disable {\n  background-position: -14px -56px;\n}\n.rc-tree-selected {\n  background-color: #FFE6B0;\n  border: 1px #FFB951 solid;\n  opacity: 0.8;\n}\n.rc-tree-treenode-switcher {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n}\n.rc-tree-icon__open {\n  margin-right: 2px;\n  background-position: -110px -16px;\n  vertical-align: top;\n}\n.rc-tree-icon__close {\n  margin-right: 2px;\n  background-position: -110px 0;\n  vertical-align: top;\n}\n", ""]);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(2);
	var rcUtil = __webpack_require__(1);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	var createChainedFunction = rcUtil.createChainedFunction;
	//var KeyCode = rcUtil.KeyCode;
	
	var Tree = React.createClass({displayName: "Tree",
	  propTypes: {
	    focusable: React.PropTypes.bool,
	    expanded: React.PropTypes.bool,
	    showLine: React.PropTypes.bool,
	    checkable: React.PropTypes.bool,
	    onSelect: React.PropTypes.func
	  },
	  getDefaultProps:function() {
	    return {
	      prefixCls: 'rc-tree',
	      expanded: true,
	      showLine: true
	    };
	  },
	
	  statics: {
	    treeNodesState: {},
	    trees: []
	  },
	  
	  handleChecked: function (isChk, c, e) {
	    if (this.props.onChecked) {
	      this.props.onChecked(isChk, c, e);
	    }
	  },
	
	  handleSelect: function (isSel, c, e) {
	    if (this.props.onSelect) {
	      this.props.onSelect(isSel, c, e);
	    }
	  },
	
	  // all keyboard events callbacks run from here at first
	  // todo
	  handleKeyDown: function (e) {
	    e.preventDefault();
	  },
	
	  render: function () {
	    var props = this.props;
	    //var state = this.state;
	
	    var classes = {};
	    var prefixCls = props.prefixCls;
	    classes[prefixCls] = true;
	
	    var domProps = {
	      className: joinClasses(props.className, classSet(classes)),
	      style: props.expanded ? {display: 'block'} : {display: 'none'},
	      role: "tree-node",
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
	
	    //this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderTreeNode, this);
	    this.childrenLength = React.Children.count(props.children);
	    this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);
	
	    return (
	      React.createElement("ul", React.__spread({},  domProps), 
	        this.newChildren
	      )
	    );
	  },
	  renderTreeNode: function (child, index) {
	    var props = this.props;
	    var pos = (props._pos || 0) + '-' + index;
	    var cloneProps = {
	      _level: props._level || 0,
	      _pos: pos,
	      _isChildTree: props._isChildTree || false,
	      _index: index,
	      _len: this.childrenLength,
	      prefixCls: props.prefixCls,
	      showLine: props.showLine,
	      checkable: props.checkable,
	      _checked: props._checked,
	      onChecked: this.handleChecked,
	      //selected: props.selected,
	      onSelect: createChainedFunction(child.props.onSelect, this.handleSelect)
	    };
	
	    //if (index === 0) {
	    //  cloneProps._firstChild = true;
	    //} else if (index === arr.length - 1) {
	    //  cloneProps._lastChild = true;
	    //} else {
	    //  cloneProps._centerChild = true;
	    //}
	
	    return React.cloneElement(child, cloneProps);
	  }
	});
	
	module.exports = Tree;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(2);
	var rcUtil = __webpack_require__(1);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	//var createChainedFunction = rcUtil.createChainedFunction;
	//var KeyCode = rcUtil.KeyCode;
	
	var Tree = __webpack_require__(6);
	
	var TreeNode = React.createClass({displayName: "TreeNode",
	  propTypes: {
	    selected: React.PropTypes.bool,
	    iconEle: React.PropTypes.node,
	    onSelect: React.PropTypes.func
	  },
	  getDefaultProps:function() {
	    return {
	      title: '---',
	      expanded: true
	    };
	  },
	  getInitialState: function () {
	    return {
	      expanded: this.props.expanded,
	      selected: this.props.selected || false,
	      checkPart: false,
	      checked: this.props._checked || false
	    };
	  },
	
	  componentWillReceiveProps:function(nextProps) {
	    this.setState({
	      //selected: nextProps.selected,
	      checked: nextProps._checked
	    });
	  },
	
	  switchExpandedState: function (newState, onStateChangeComplete) {
	    this.setState({
	      expanded: newState
	    }, onStateChangeComplete);
	  },
	
	  // keyboard event support
	  handleKeyDown: function (e) {
	    e.preventDefault();
	  },
	
	  handleExpandedState: function () {
	    this.switchExpandedState(!this.state.expanded);
	  },
	
	  handleSelect: function () {
	    this.setState({
	      selected: !this.state.selected
	    });
	    if (this.props.onSelect) {
	      this.props.onSelect(!this.state.selected, this);
	    }
	  },
	
	  handleChecked: function () {
	    var checked = !this.state.checked;
	    var self = this;
	    //this.setState({
	    //  //selected: checked,
	    //  checked: checked
	    //});
	    setSt();
	    function setSt() {
	      self.setState({
	        //selected: checked,
	        checked: checked
	      });
	    }
	
	    Tree.trees.forEach(function (c) {
	      //console.log( c.getDOMNode() );
	      var _pos = this.props._pos;
	      var cPos = c.props._pos;
	      if (_pos.length > cPos.length && _pos.indexOf(cPos) === 0){
	        //console.log( c.props._checked, c.state.checked );
	        var childArr = rcUtil.Children.toArray(c.props.children);
	        //childArr.forEach(function (c) {
	        //  console.log(c.props.refs);
	        //  //console.log( c.props._checked, c.state.checked );
	        //});
	        var i = 0, len = childArr.length, checkedNumbers = checked ? 1 : 0;
	        for (; i < len; i++) {
	          var __pos = cPos + '-' + i;
	          if (Tree.treeNodesState[__pos] && !(__pos === _pos && !checked)) {
	            checkedNumbers++;
	          }
	        }
	        /**
	        if (checkedNumbers === 0) {
	          c.checkNone(setSt);
	        } else if (checkedNumbers === len) {
	          c.checkAll(setSt);
	        } else {
	          c.checkPart(setSt);
	        }
	         */
	      }
	    }, this);
	
	    if (this.props.onChecked) {
	      this.props.onChecked(checked, this);
	    }
	  },
	
	  componentDidUpdate: function () {
	    //console.log( this.state.checked );
	    if (this.newChildren) {
	      for (var i = 0; i < Tree.trees.length; i++) {
	        var obj = Tree.trees[i];
	        if (obj.props._pos === this.props._pos) {
	          Tree.trees.splice(i--, 1);
	        }
	      }
	      Tree.trees.push(this);
	    }
	    //add treeNodes checked state
	    Tree.treeNodesState[this.props._pos] = this.state.checked;
	  },
	
	  checkPart: function (onStateChangeComplete) {
	    this.setState({
	      //checked: false,
	      checkPart: true
	    }, onStateChangeComplete);
	  },
	
	  checkAll: function (onStateChangeComplete) {
	    this.setState({
	      checkPart: false,
	      checked: true
	    }, onStateChangeComplete);
	  },
	
	  checkNone: function (onStateChangeComplete) {
	    this.setState({
	      checkPart: false,
	      checked: false
	    }, onStateChangeComplete);
	  },
	
	  shouldComponentUpdate: function(nextProps, nextState) {
	    //return nextState.checkPart === this.state.checkPart;
	    if (this.refs.checkbox && nextState.checkPart) {
	      var cls = this.refs.checkbox.getDOMNode().className;
	      this.refs.checkbox.getDOMNode().className = cls + ' checkbox_true_part';
	      return false;
	    }
	    return true;
	    //return false;
	  },
	
	  render: function () {
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
	      checkbox = React.createElement("span", {ref: "checkbox", className: classSet(checkboxCls), onClick: this.handleChecked});
	    }
	
	    var iconEleCls = {};
	    iconEleCls.button = true;
	    iconEleCls[prefixCls + '-iconEle'] = true;
	    iconEleCls[prefixCls + '-icon__' + switchState] = true;
	
	    var userIconEle = null;
	    if (props.iconEle && React.isValidElement(props.iconEle)) {
	      userIconEle = props.iconEle;
	    }
	
	    var content = props.title;
	    var newChildren = this.renderChildren(props.children);
	    if (newChildren === props.children) {
	      content = newChildren;
	      newChildren = null;
	    }
	
	    return (
	      React.createElement("li", {className: joinClasses('level' + props._level, 'pos-' + props._pos)}, 
	        React.createElement("span", {className: joinClasses(props.className, classSet(switcherCls)), 
	              onClick: this.handleExpandedState}), 
	        checkbox, 
	        React.createElement("a", {title: content, 
	           className: state.selected ? prefixCls + '-selected' : '', 
	           onClick: this.handleSelect}, 
	          React.createElement("span", {className: classSet(iconEleCls)}, userIconEle), 
	          React.createElement("span", null, content)
	        ), 
	        newChildren
	      )
	    );
	  },
	  renderChildren:function(children) {
	    var newChildren = null;
	    if (children.type === TreeNode || Array.isArray(children) &&
	        children.every(function (item) {
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
	        className: classSet(cls),
	        expanded: this.state.expanded,
	        //selected: this.state.checked,
	        _checked: this.state.checked,
	        checkable: this.props.checkable, //只是为了传递根节点上的checkable设置,是否有更好做法?
	        onChecked: this.props.onChecked,
	        onSelect: this.props.onSelect
	      };
	      newChildren = this.newChildren = React.createElement(Tree, React.__spread({},  treeProps), children);
	    } else {
	      newChildren = children;
	    }
	
	    return newChildren;
	  },
	  componentDidMount: function () {
	    //console.log( this.newChildren );
	    //if (this.newChildren) {
	    //  Tree.trees.push(this);
	    //}
	  }
	});
	
	module.exports = TreeNode;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	// use jsx to render html, do not modify simple.html
	__webpack_require__(4);
	var React = __webpack_require__(2);
	var Tree = __webpack_require__(3);
	var TreeNode = Tree.TreeNode;
	
	function handleSelect(selected, c) {
	  console.log( selected, c.getDOMNode() );
	}
	
	var demo = (
	  React.createElement("div", null, 
	    React.createElement("h2", null, "简单tree"), 
	
	    React.createElement(Tree, {className: "myCls", onSelect: handleSelect, checkable: true}, 
	      React.createElement(TreeNode, {title: "parent 1", expanded: false, onSelect: handleSelect}, 
	        React.createElement(TreeNode, null, "leaf "), 
	        React.createElement(TreeNode, {title: "parent 1-1"}, 
	          React.createElement(TreeNode, {title: "parent 2-1"}, 
	            React.createElement(TreeNode, null, "leaf "), 
	            React.createElement(TreeNode, null, "leaf ")
	          ), 
	          React.createElement(TreeNode, null, "leaf "), 
	          React.createElement(TreeNode, null, "leaf ")
	        )
	      ), 
	      React.createElement(TreeNode, null, "leaf "), 
	      React.createElement(TreeNode, null, 
	        React.createElement(TreeNode, null, "leaf ")
	      )
	    )
	
	  )
	)
	
	React.render(demo, document.getElementById('__react-content'));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var seed = 0;
	module.exports = function () {
	  return Date.now() + '_' + (seed++);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

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
/* 16 */
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
	
	var shallowEqual = __webpack_require__(11);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	
	module.exports = function (children) {
	  var ret = [];
	  React.Children.forEach(children, function (c) {
	    ret.push(c);
	  });
	  return ret;
	};


/***/ }
]);
//# sourceMappingURL=simple.js.map