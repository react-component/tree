/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		3:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"checked","1":"expanded","2":"simple"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/hua/my/react/c/tree/node_modules/rc-tools/node_modules/css-loader/index.js?sourceMap!/Users/hua/my/react/c/tree/node_modules/rc-tools/node_modules/less-loader/index.js?sourceMap!/Users/hua/my/react/c/tree/assets/index.less", function() {
			var newContent = require("!!/Users/hua/my/react/c/tree/node_modules/rc-tools/node_modules/css-loader/index.js?sourceMap!/Users/hua/my/react/c/tree/node_modules/rc-tools/node_modules/less-loader/index.js?sourceMap!/Users/hua/my/react/c/tree/assets/index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, ".rc-tree {\n  margin: 0;\n  padding: 5px;\n}\n.rc-tree li {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  white-space: nowrap;\n  outline: 0;\n}\n.rc-tree li ul {\n  margin: 0;\n  padding: 0 0 0 18px;\n}\n.rc-tree li ul.rc-tree-line {\n  background: url(\"https://t.alipayobjects.com/images/T13BtfXl0mXXXXXXXX.gif\") 0 0 repeat-y;\n}\n.rc-tree li a {\n  display: inline-block;\n  padding: 1px 3px 0 0;\n  margin: 0;\n  cursor: pointer;\n  height: 17px;\n  text-decoration: none;\n  vertical-align: top;\n}\n.rc-tree li span.rc-tree-switcher-noop,\n.rc-tree li span.rc-tree-switcher,\n.rc-tree li span.rc-tree-checkbox,\n.rc-tree li span.rc-tree-iconEle {\n  line-height: 16px;\n  margin-right: 2px;\n  width: 16px;\n  height: 16px;\n  display: inline-block;\n  vertical-align: middle;\n  border: 0 none;\n  cursor: pointer;\n  outline: none;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  background-attachment: scroll;\n  background-image: url(\"https://t.alipayobjects.com/images/T1.ANfXhXtXXXXXXXX.png\");\n}\n.rc-tree li span.rc-tree-switcher-noop {\n  background-image: none;\n}\n.rc-tree li span.rc-tree-switcher-disabled {\n  background: #fff;\n  position: relative;\n}\n.rc-tree li span.rc-tree-switcher-disabled:after {\n  content: '-';\n  position: absolute;\n  top: 8px;\n  left: 6px;\n  color: gray;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-roots_open {\n  background-position: -92px 0;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-roots_close {\n  background-position: -74px 0;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-center_open {\n  background-position: -92px -18px;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-center_close {\n  background-position: -74px -18px;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-bottom_open {\n  background-position: -92px -36px;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-bottom_close {\n  background-position: -74px -36px;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-noline_open {\n  background-position: -92px -72px;\n}\n.rc-tree li span.rc-tree-switcher.rc-tree-noline_close {\n  background-position: -74px -72px;\n}\n.rc-tree li span.rc-tree-checkbox {\n  width: 13px;\n  height: 13px;\n  margin: 0 3px;\n  background-position: 0 0;\n}\n.rc-tree li span.rc-tree-checkbox.rc-tree-checkbox-checked {\n  background-position: -14px 0;\n}\n.rc-tree li span.rc-tree-checkbox.rc-tree-checkbox-indeterminate {\n  background-position: -14px -28px;\n}\n.rc-tree li span.rc-tree-checkbox-disabled {\n  background-position: 0 -28px !important;\n}\n.rc-tree-child-tree {\n  display: none;\n}\n.rc-tree-child-tree-open {\n  display: block;\n}\n.rc-tree-treenode-disabled > span,\n.rc-tree-treenode-disabled > a {\n  color: gray;\n}\n.rc-tree-node-selected {\n  background-color: #ffe6b0;\n  border: 1px #ffb951 solid;\n  opacity: 0.8;\n}\n.rc-tree-icon__open {\n  margin-right: 2px;\n  background-position: -110px -16px;\n  vertical-align: top;\n}\n.rc-tree-icon__close {\n  margin-right: 2px;\n  background-position: -110px 0;\n  vertical-align: top;\n}\n", "", {"version":3,"sources":["index.less"],"names":[],"mappings":"AACA,CAAC;EACC,SAAA;EACA,YAAA;;AAFF,CAAC,OAGC;EACE,UAAA;EACA,SAAA;EACA,gBAAA;EACA,mBAAA;EACA,UAAA;;AARJ,CAAC,OAGC,GAME;EACE,SAAA;EACA,mBAAA;;AACA,CAZL,OAGC,GAME,GAGG,CAAC,OAAgB;EAChB,gBAAgB,yEAAhB;;AAbR,CAAC,OAGC,GAaE;EACE,qBAAA;EACA,oBAAA;EACA,SAAA;EACA,eAAA;EACA,YAAA;EACA,qBAAA;EACA,mBAAA;;AAGA,CA1BL,OAGC,GAsBE,KACG,CAAC,OAAgB;AAClB,CA3BL,OAGC,GAsBE,KAEG,CAAC,OAAgB;AAClB,CA5BL,OAGC,GAsBE,KAGG,CAAC,OAAgB;AAClB,CA7BL,OAGC,GAsBE,KAIG,CAAC,OAAgB;EAChB,iBAAA;EACA,iBAAA;EACA,WAAA;EACA,YAAA;EACA,qBAAA;EACA,sBAAA;EACA,cAAA;EACA,eAAA;EACA,aAAA;EACA,6BAAA;EACA,4BAAA;EACA,6BAAA;EACA,sBAAsB,4DAAtB;;AAEF,CA5CL,OAGC,GAsBE,KAmBG,CAAC,OAAgB;EAChB,sBAAA;;AAGA,CAhDP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SACf;EACC,gBAAA;EACA,kBAAA;;AACA,CAnDT,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SACf,SAGE;EACC,SAAS,GAAT;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,WAAA;;AAGJ,CA3DP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAYf,CAAC,OAAgB;EAChB,4BAAA;;AAEF,CA9DP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAef,CAAC,OAAgB;EAChB,4BAAA;;AAEF,CAjEP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAkBf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CApEP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAqBf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CAvEP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAwBf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CA1EP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SA2Bf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CA7EP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SA8Bf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CAhFP,OAGC,GAsBE,KAsBG,CAAC,OAAgB,SAiCf,CAAC,OAAgB;EAChB,gCAAA;;AAGJ,CApFL,OAGC,GAsBE,KA2DG,CAAC,OAAgB;EAChB,WAAA;EACA,YAAA;EACA,aAAA;EACA,wBAAA;;AACA,CAzFP,OAGC,GAsBE,KA2DG,CAAC,OAAgB,SAKf,CAAC,OAAgB;EAChB,4BAAA;;AAEF,CA5FP,OAGC,GAsBE,KA2DG,CAAC,OAAgB,SAQf,CAAC,OAAgB;EAChB,gCAAA;;AAEF,CA/FP,OAGC,GAsBE,KA2DG,CAAC,OAAgB,SAWf;EACC,4BAAA;;AAKR,CArGD,OAqGE;EACC,aAAA;;AACA,CAvGH,OAqGE,WAEE;EACC,cAAA;;AAGJ,CA3GD,OA2GE,kBACC;AADF,CA3GD,OA2GE,kBAEC;EACE,WAAA;;AAGJ,CAjHD,OAiHE;EACC,yBAAA;EACA,yBAAA;EACA,YAAA;;AAEF,CAtHD,OAsHE;EACC,iBAAA;EACA,iCAAA;EACA,mBAAA;;AAEF,CA3HD,OA2HE;EACC,iBAAA;EACA,6BAAA;EACA,mBAAA","sourcesContent":["@treePrefixCls: rc-tree;\n.@{treePrefixCls} {\n  margin: 0;\n  padding: 5px;\n  li {\n    padding: 0;\n    margin: 0;\n    list-style: none;\n    white-space: nowrap;\n    outline: 0;\n    ul {\n      margin: 0;\n      padding: 0 0 0 18px;\n      &.@{treePrefixCls}-line {\n        background: url(\"https://t.alipayobjects.com/images/T13BtfXl0mXXXXXXXX.gif\") 0 0 repeat-y;\n      }\n    }\n    a {\n      display: inline-block;\n      padding: 1px 3px 0 0;\n      margin: 0;\n      cursor: pointer;\n      height: 17px;\n      text-decoration: none;\n      vertical-align: top;\n    }\n    span {\n      &.@{treePrefixCls}-switcher-noop,\n      &.@{treePrefixCls}-switcher,\n      &.@{treePrefixCls}-checkbox,\n      &.@{treePrefixCls}-iconEle {\n        line-height: 16px;\n        margin-right: 2px;\n        width: 16px;\n        height: 16px;\n        display: inline-block;\n        vertical-align: middle;\n        border: 0 none;\n        cursor: pointer;\n        outline: none;\n        background-color: transparent;\n        background-repeat: no-repeat;\n        background-attachment: scroll;\n        background-image: url(\"https://t.alipayobjects.com/images/T1.ANfXhXtXXXXXXXX.png\");\n      }\n      &.@{treePrefixCls}-switcher-noop {\n        background-image: none;\n      }\n      &.@{treePrefixCls}-switcher {\n        &-disabled {\n          background: #fff;\n          position: relative;\n          &:after {\n            content: '-';\n            position: absolute;\n            top: 8px;\n            left: 6px;\n            color: gray;\n          }\n        }\n        &.@{treePrefixCls}-roots_open {\n          background-position: -92px 0;\n        }\n        &.@{treePrefixCls}-roots_close {\n          background-position: -74px 0;\n        }\n        &.@{treePrefixCls}-center_open {\n          background-position: -92px -18px;\n        }\n        &.@{treePrefixCls}-center_close {\n          background-position: -74px -18px;\n        }\n        &.@{treePrefixCls}-bottom_open {\n          background-position: -92px -36px;\n        }\n        &.@{treePrefixCls}-bottom_close {\n          background-position: -74px -36px;\n        }\n        &.@{treePrefixCls}-noline_open {\n          background-position: -92px -72px;\n        }\n        &.@{treePrefixCls}-noline_close {\n          background-position: -74px -72px;\n        }\n      }\n      &.@{treePrefixCls}-checkbox {\n        width: 13px;\n        height: 13px;\n        margin: 0 3px;\n        background-position: 0 0;\n        &.@{treePrefixCls}-checkbox-checked {\n          background-position: -14px 0;\n        }\n        &.@{treePrefixCls}-checkbox-indeterminate {\n          background-position: -14px -28px;\n        }\n        &-disabled {\n          background-position: 0 -28px!important;\n        }\n      }\n    }\n  }\n  &-child-tree {\n    display: none;\n    &-open {\n      display: block;\n    }\n  }\n  &-treenode-disabled {\n    >span,\n    >a {\n      color: gray;\n    }\n  }\n  &-node-selected {\n    background-color: #ffe6b0;\n    border: 1px #ffb951 solid;\n    opacity: 0.8;\n  }\n  &-icon__open {\n    margin-right: 2px;\n    background-position: -110px -16px;\n    vertical-align: top;\n  }\n  &-icon__close {\n    margin-right: 2px;\n    background-position: -110px 0;\n    vertical-align: top;\n  }\n}\n"]}]);

/***/ },
/* 4 */
/***/ function(module, exports) {

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
/* 5 */
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
/* 6 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(8);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Tree = __webpack_require__(9);
	
	var _Tree2 = _interopRequireDefault(_Tree);
	
	var _TreeNode = __webpack_require__(22);
	
	var _TreeNode2 = _interopRequireDefault(_TreeNode);
	
	_Tree2['default'].TreeNode = _TreeNode2['default'];
	
	exports['default'] = _Tree2['default'];
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(10);
	
	// sorted array ['0-0','0-1', '0-0-1', '0-1-1'] => ['0-0', '0-1']
	var filterMin = function filterMin(arr) {
	  var a = [];
	  arr.forEach(function (item) {
	    var b = a.filter(function (i) {
	      return item.indexOf(i) === 0;
	    });
	    if (!b.length) {
	      a.push(item);
	    }
	  });
	  return a;
	};
	
	var Tree = (function (_React$Component) {
	  _inherits(Tree, _React$Component);
	
	  function Tree(props) {
	    var _this = this;
	
	    _classCallCheck(this, Tree);
	
	    _get(Object.getPrototypeOf(Tree.prototype), 'constructor', this).call(this, props);
	    ['handleKeyDown', 'handleCheck'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	    var expandedKeys = props.defaultExpandedKeys;
	    var checkedKeys = props.defaultCheckedKeys;
	    this.defaultExpandAll = props.defaultExpandAll;
	    var selectedKeys = props.multiple ? [].concat(_toConsumableArray(props.defaultSelectedKeys)) : [props.defaultSelectedKeys[0]];
	    this.state = {
	      expandedKeys: expandedKeys,
	      checkedKeys: checkedKeys,
	      selectedKeys: selectedKeys
	    };
	  }
	
	  _createClass(Tree, [{
	    key: 'getCheckKeys',
	    value: function getCheckKeys() {
	      var _this2 = this;
	
	      var checkPartKeys = [];
	      var checkedKeys = [];
	      Object.keys(this.treeNodesChkStates).forEach(function (item) {
	        var itemObj = _this2.treeNodesChkStates[item];
	        if (itemObj.checked) {
	          checkedKeys.push(itemObj.key);
	        } else if (itemObj.checkPart) {
	          checkPartKeys.push(itemObj.key);
	        }
	      });
	      return {
	        checkPartKeys: checkPartKeys, checkedKeys: checkedKeys
	      };
	    }
	  }, {
	    key: 'getOpenTransitionName',
	    value: function getOpenTransitionName() {
	      var props = this.props;
	      var transitionName = props.openTransitionName;
	      var animationName = props.openAnimation;
	      if (!transitionName && typeof animationName === 'string') {
	        transitionName = props.prefixCls + '-open-' + animationName;
	      }
	      return transitionName;
	    }
	  }, {
	    key: 'renderTreeNode',
	    value: function renderTreeNode(child, index) {
	      var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	
	      var key = child.key || level + '-' + index;
	      var state = this.state;
	      var props = this.props;
	      var cloneProps = {
	        ref: 'treeNode',
	        root: this,
	        eventKey: key,
	        pos: level + '-' + index,
	        prefixCls: props.prefixCls,
	        showLine: props.showLine,
	        showIcon: props.showIcon,
	        checkable: props.checkable,
	        expanded: this.defaultExpandAll || state.expandedKeys.indexOf(key) !== -1,
	        selected: state.selectedKeys.indexOf(key) !== -1,
	        checked: this.checkedKeys.indexOf(key) !== -1,
	        checkPart: this.checkPartKeys.indexOf(key) !== -1,
	        openTransitionName: this.getOpenTransitionName(),
	        openAnimation: props.openAnimation
	      };
	      return _react2['default'].cloneElement(child, cloneProps);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;
	
	      var props = this.props;
	      var domProps = {
	        className: (0, _rcUtil.classSet)(props.className, props.prefixCls),
	        role: 'tree-node'
	      };
	      if (props.focusable) {
	        domProps.tabIndex = '0';
	        domProps.onKeyDown = this.handleKeyDown;
	      }
	      var checkedKeys = this.state.checkedKeys;
	      var checkedPos = [];
	      this.treeNodesChkStates = {};
	      this.loopAllChildren(props.children, function (item, index, pos) {
	        var key = item.key || pos;
	        var checked = false;
	        if (checkedKeys.indexOf(key) !== -1) {
	          checked = true;
	          checkedPos.push(pos);
	        }
	        _this3.treeNodesChkStates[pos] = {
	          key: key,
	          checked: checked,
	          checkPart: false
	        };
	      });
	      this.handleCheckState(this.treeNodesChkStates, filterMin(checkedPos.sort()));
	      var checkKeys = this.getCheckKeys();
	      this.checkPartKeys = checkKeys.checkPartKeys;
	      this.checkedKeys = checkKeys.checkedKeys;
	      this.newChildren = _react2['default'].Children.map(props.children, this.renderTreeNode, this);
	      return _react2['default'].createElement(
	        'ul',
	        _extends({}, domProps, { ref: 'tree' }),
	        this.newChildren
	      );
	    }
	  }, {
	    key: 'loopAllChildren',
	    value: function loopAllChildren(childs, callback) {
	      var loop = function loop(children, level) {
	        _react2['default'].Children.forEach(children, function (item, index) {
	          var pos = level + '-' + index;
	          var newChildren = item.props.children;
	          if (Array.isArray(newChildren)) {
	            loop(newChildren, pos);
	          }
	          callback(item, index, pos);
	        });
	      };
	      loop(childs, 0);
	    }
	  }, {
	    key: 'handleCheckState',
	    value: function handleCheckState(obj, checkedArr, unCheckEvent) {
	      var evt = false;
	      if (typeof unCheckEvent === 'boolean') {
	        evt = true;
	      }
	      checkedArr.forEach(function (_pos) {
	        Object.keys(obj).forEach(function (i) {
	          if (i.length > _pos.length && i.indexOf(_pos) === 0) {
	            obj[i].checkPart = false;
	            if (evt) {
	              if (unCheckEvent) {
	                obj[i].checked = false;
	              } else {
	                obj[i].checked = true;
	              }
	            } else {
	              obj[i].checked = true;
	            }
	          }
	        });
	        var loop = function loop(__pos) {
	          var _posLen = __pos.length;
	          if (_posLen <= 3) {
	            return;
	          }
	          var sibling = 0;
	          var siblingChecked = 0;
	          var parentPos = __pos.substring(0, _posLen - 2);
	          Object.keys(obj).forEach(function (i) {
	            if (i.length === _posLen && i.substring(0, _posLen - 2) === parentPos) {
	              sibling++;
	              if (obj[i].checked) {
	                siblingChecked++;
	              } else if (obj[i].checkPart) {
	                siblingChecked += 0.5;
	              }
	            }
	          });
	          var parent = obj[parentPos];
	          // sibling 不会等于0
	          // 全不选 - 全选 - 半选
	          if (siblingChecked === 0) {
	            parent.checked = false;
	            parent.checkPart = false;
	          } else if (siblingChecked === sibling) {
	            parent.checked = true;
	            parent.checkPart = false;
	          } else {
	            parent.checkPart = true;
	            parent.checked = false;
	          }
	          loop(parentPos);
	        };
	        loop(_pos);
	      });
	    }
	  }, {
	    key: 'handleCheck',
	    value: function handleCheck(treeNode) {
	      var _this4 = this;
	
	      var tnProps = treeNode.props;
	      var checked = !tnProps.checked;
	      if (tnProps.checkPart) {
	        checked = true;
	      }
	      var pos = undefined;
	      Object.keys(this.treeNodesChkStates).forEach(function (item) {
	        var itemObj = _this4.treeNodesChkStates[item];
	        if (itemObj.key === (treeNode.key || tnProps.eventKey)) {
	          pos = item;
	          itemObj.checked = checked;
	          itemObj.checkPart = false;
	        }
	      });
	      this.handleCheckState(this.treeNodesChkStates, [pos], !checked);
	      var checkKeys = this.getCheckKeys();
	      this.checkPartKeys = checkKeys.checkPartKeys;
	      this.setState({
	        checkedKeys: checkKeys.checkedKeys
	      });
	      if (this.props.onCheck) {
	        this.props.onCheck({
	          event: 'check',
	          checked: checked,
	          node: treeNode,
	          checkedKeys: checkKeys.checkedKeys
	        });
	      }
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect(treeNode) {
	      var props = this.props;
	      var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
	      var eventKey = treeNode.props.eventKey;
	      var index = selectedKeys.indexOf(eventKey);
	      var selected = undefined;
	      if (index !== -1) {
	        selected = false;
	        selectedKeys.splice(index, 1);
	      } else {
	        selected = true;
	        if (!props.multiple) {
	          selectedKeys.length = 0;
	        }
	        selectedKeys.push(eventKey);
	      }
	      this.setState({
	        selectedKeys: selectedKeys
	      });
	      if (props.onSelect) {
	        props.onSelect({
	          event: 'select',
	          selected: selected,
	          node: treeNode,
	          selectedKeys: selectedKeys
	        });
	      }
	    }
	  }, {
	    key: 'handleExpand',
	    value: function handleExpand(treeNode) {
	      var thisProps = this.props;
	      var tnProps = treeNode.props;
	      var expandedKeys = this.state.expandedKeys.concat([]);
	      var expanded = !tnProps.expanded;
	      if (this.defaultExpandAll) {
	        this.loopAllChildren(thisProps.children, function (item, index, pos) {
	          var key = item.key || pos;
	          if (expandedKeys.indexOf(key) === -1) {
	            expandedKeys.push(key);
	          }
	        });
	        this.defaultExpandAll = false;
	      }
	      var index = expandedKeys.indexOf(tnProps.eventKey);
	      if (expanded) {
	        if (index === -1) {
	          expandedKeys.push(tnProps.eventKey);
	        }
	      } else {
	        expandedKeys.splice(index, 1);
	      }
	      this.setState({
	        expandedKeys: expandedKeys
	      });
	    }
	
	    // all keyboard events callbacks run from here at first
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      e.preventDefault();
	    }
	  }]);
	
	  return Tree;
	})(_react2['default'].Component);
	
	Tree.propTypes = {
	  prefixCls: _react2['default'].PropTypes.string,
	  checkable: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
	  showLine: _react2['default'].PropTypes.bool,
	  showIcon: _react2['default'].PropTypes.bool,
	  defaultExpandAll: _react2['default'].PropTypes.bool,
	  defaultExpandedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  defaultCheckedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  defaultSelectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  onCheck: _react2['default'].PropTypes.func,
	  onSelect: _react2['default'].PropTypes.func,
	  openTransitionName: _react2['default'].PropTypes.string,
	  openAnimation: _react2['default'].PropTypes.oneOfType(_react2['default'].PropTypes.string, _react2['default'].PropTypes.object)
	};
	
	Tree.defaultProps = {
	  prefixCls: 'rc-tree',
	  multiple: false,
	  checkable: false,
	  showLine: false,
	  showIcon: true,
	  defaultExpandAll: false,
	  defaultExpandedKeys: [],
	  defaultCheckedKeys: [],
	  defaultSelectedKeys: []
	};
	
	exports['default'] = Tree;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  guid: __webpack_require__(11),
	  classSet: __webpack_require__(12),
	  joinClasses: __webpack_require__(13),
	  KeyCode: __webpack_require__(14),
	  PureRenderMixin: __webpack_require__(15),
	  shallowEqual: __webpack_require__(16),
	  createChainedFunction: __webpack_require__(17),
	  Dom: {
	    addEventListener: __webpack_require__(18),
	    contains: __webpack_require__(19)
	  },
	  Children: {
	    toArray: __webpack_require__(20),
	    mapSelf: __webpack_require__(21)
	  }
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	var seed = 0;
	module.exports = function () {
	  return Date.now() + '_' + (seed++);
	};


/***/ },
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
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
	
	var shallowEqual = __webpack_require__(16);
	
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(6);
	
	module.exports = function (children) {
	  var ret = [];
	  React.Children.forEach(children, function (c) {
	    ret.push(c);
	  });
	  return ret;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(6);
	
	function mirror(o) {
	  return o;
	}
	
	module.exports = function (children) {
	  // return ReactFragment
	  return React.Children.map(children, mirror);
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcUtil = __webpack_require__(10);
	
	var _rcAnimate = __webpack_require__(23);
	
	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);
	
	var defaultTitle = '---';
	
	var TreeNode = (function (_React$Component) {
	  _inherits(TreeNode, _React$Component);
	
	  function TreeNode(props) {
	    var _this = this;
	
	    _classCallCheck(this, TreeNode);
	
	    _get(Object.getPrototypeOf(TreeNode.prototype), 'constructor', this).call(this, props);
	    ['handleExpand', 'handleCheck'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	  }
	
	  _createClass(TreeNode, [{
	    key: 'getPosition',
	    value: function getPosition(pos) {
	      var obj = {
	        last: false,
	        center: false
	      };
	      var siblings = Object.keys(this.props.root.treeNodesChkStates).filter(function (item) {
	        var len = pos.length;
	        return len === item.length && pos.substring(0, len - 2) === item.substring(0, len - 2);
	      });
	      var sLen = siblings.length;
	      var posIndex = Number(pos.substr(-1, 1));
	      if (sLen === 1 || posIndex === sLen - 1) {
	        obj.last = true;
	      } else {
	        obj.center = true;
	      }
	      return obj;
	    }
	  }, {
	    key: 'renderSwitcher',
	    value: function renderSwitcher(props, expandedState) {
	      var prefixCls = props.prefixCls;
	      var switcherCls = _defineProperty({}, prefixCls + '-switcher', true);
	      if (props.disabled) {
	        switcherCls[prefixCls + '-switcher-disabled'] = true;
	        return _react2['default'].createElement('span', { className: (0, _rcUtil.classSet)(switcherCls) });
	      }
	
	      var posObj = this.getPosition(props.pos);
	
	      if (!props.showLine) {
	        switcherCls[prefixCls + '-noline_' + expandedState] = true;
	      } else if (props.pos === '0-0') {
	        switcherCls[prefixCls + '-roots_' + expandedState] = true;
	      } else {
	        switcherCls[prefixCls + '-center_' + expandedState] = posObj.center;
	        switcherCls[prefixCls + '-bottom_' + expandedState] = posObj.last;
	      }
	      return _react2['default'].createElement('span', { className: (0, _rcUtil.classSet)(switcherCls), onClick: this.handleExpand });
	    }
	  }, {
	    key: 'renderCheckbox',
	    value: function renderCheckbox(props) {
	      var prefixCls = props.prefixCls;
	      var checkboxCls = _defineProperty({}, prefixCls + '-checkbox', true);
	      if (props.checkPart) {
	        checkboxCls[prefixCls + '-checkbox-indeterminate'] = true;
	      } else if (props.checked) {
	        checkboxCls[prefixCls + '-checkbox-checked'] = true;
	      }
	      var customEle = null;
	      if (typeof props.checkable !== 'boolean') {
	        customEle = props.checkable;
	      }
	      if (props.disabled) {
	        checkboxCls[prefixCls + '-checkbox-disabled'] = true;
	        return _react2['default'].createElement(
	          'span',
	          { ref: 'checkbox', className: (0, _rcUtil.classSet)(checkboxCls) },
	          customEle
	        );
	      }
	      return _react2['default'].createElement(
	        'span',
	        { ref: 'checkbox', className: (0, _rcUtil.classSet)(checkboxCls), onClick: this.handleCheck },
	        customEle
	      );
	    }
	  }, {
	    key: 'renderChildren',
	    value: function renderChildren(props) {
	      var children = props.children;
	      var newChildren = children;
	      if (!children) {
	        return children;
	      }
	      if (children.type === TreeNode || Array.isArray(children) && children.every(function (item) {
	        return item.type === TreeNode;
	      })) {
	        var _cls;
	
	        var cls = (_cls = {}, _defineProperty(_cls, props.prefixCls + '-child-tree', true), _defineProperty(_cls, props.prefixCls + '-child-tree-open', props.expanded), _cls);
	        if (props.showLine) {
	          cls[props.prefixCls + '-line'] = this.getPosition(props.pos).center;
	        }
	        var animProps = {};
	        if (props.openTransitionName) {
	          animProps.transitionName = props.openTransitionName;
	        } else if (typeof props.openAnimation === 'object') {
	          animProps.animation = props.openAnimation;
	        }
	        newChildren = this.newChildren = _react2['default'].createElement(
	          _rcAnimate2['default'],
	          _extends({}, animProps, {
	            showProp: 'expanded',
	            component: '',
	            animateMount: true }),
	          _react2['default'].createElement(
	            'ul',
	            { className: (0, _rcUtil.classSet)(cls), expanded: props.expanded },
	            _react2['default'].Children.map(children, function (item, index) {
	              return props.root.renderTreeNode(item, index, props.pos);
	            }, props.root)
	          )
	        );
	      }
	      return newChildren;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _iconEleCls,
	          _this2 = this;
	
	      var props = this.props;
	      var prefixCls = props.prefixCls;
	      var expandedState = props.expanded ? 'open' : 'close';
	
	      var iconEleCls = (_iconEleCls = {}, _defineProperty(_iconEleCls, prefixCls + '-iconEle', true), _defineProperty(_iconEleCls, prefixCls + '-icon__' + expandedState, true), _iconEleCls);
	
	      var canRenderSwitcher = true;
	      // let content = props.title;
	      var content = props.title;
	      var newChildren = this.renderChildren(props);
	      if (newChildren === props.children) {
	        // content = newChildren;
	        newChildren = null;
	        canRenderSwitcher = false;
	      }
	
	      var selectHandle = function selectHandle() {
	        var icon = props.showIcon ? _react2['default'].createElement('span', { className: (0, _rcUtil.classSet)(iconEleCls) }) : null;
	        var title = _react2['default'].createElement(
	          'span',
	          { className: prefixCls + '-title' },
	          content
	        );
	        var domProps = {};
	        if (!props.disabled) {
	          if (props.selected) {
	            domProps.className = prefixCls + '-node-selected';
	          }
	          domProps.onClick = function () {
	            _this2.handleSelect();
	            if (props.checkable) {
	              _this2.handleCheck();
	            }
	          };
	        }
	        return _react2['default'].createElement(
	          'a',
	          _extends({ ref: 'selectHandle', title: content }, domProps),
	          icon,
	          title
	        );
	      };
	
	      return _react2['default'].createElement(
	        'li',
	        { className: (0, _rcUtil.joinClasses)(props.className, props.disabled ? prefixCls + '-treenode-disabled' : '') },
	        canRenderSwitcher ? this.renderSwitcher(props, expandedState) : _react2['default'].createElement('span', { className: prefixCls + '-switcher-noop' }),
	        props.checkable ? this.renderCheckbox(props) : null,
	        selectHandle(),
	        newChildren
	      );
	    }
	  }, {
	    key: 'handleCheck',
	    value: function handleCheck() {
	      this.props.root.handleCheck(this);
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect() {
	      this.props.root.handleSelect(this);
	    }
	  }, {
	    key: 'handleExpand',
	    value: function handleExpand() {
	      this.props.root.handleExpand(this);
	    }
	
	    // keyboard event support
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      e.preventDefault();
	    }
	  }]);
	
	  return TreeNode;
	})(_react2['default'].Component);
	
	TreeNode.propTypes = {
	  prefixCls: _react2['default'].PropTypes.string,
	  expanded: _react2['default'].PropTypes.bool,
	  root: _react2['default'].PropTypes.object,
	  onSelect: _react2['default'].PropTypes.func
	};
	TreeNode.defaultProps = {
	  title: defaultTitle
	};
	
	exports['default'] = TreeNode;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// export this package's api
	'use strict';
	
	module.exports = __webpack_require__(24);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ChildrenUtils = __webpack_require__(25);
	
	var _ChildrenUtils2 = _interopRequireDefault(_ChildrenUtils);
	
	var _AnimateChild = __webpack_require__(26);
	
	var _AnimateChild2 = _interopRequireDefault(_AnimateChild);
	
	var defaultKey = 'rc_animate_' + Date.now();
	
	function getChildrenFromProps(props) {
	  var children = props.children;
	  if (_react2['default'].isValidElement(children)) {
	    if (!children.key) {
	      return _react2['default'].cloneElement(children, {
	        key: defaultKey
	      });
	    }
	  }
	  return children;
	}
	
	var Animate = _react2['default'].createClass({
	  displayName: 'Animate',
	
	  protoTypes: {
	    component: _react2['default'].PropTypes.any,
	    animation: _react2['default'].PropTypes.object,
	    transitionName: _react2['default'].PropTypes.string,
	    transitionEnter: _react2['default'].PropTypes.bool,
	    transitionLeave: _react2['default'].PropTypes.bool,
	    onEnd: _react2['default'].PropTypes.func,
	    showProp: _react2['default'].PropTypes.bool,
	    animateMount: _react2['default'].PropTypes.bool
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      animation: {},
	      component: 'span',
	      transitionEnter: true,
	      transitionLeave: true,
	      enter: true,
	      animateMount: false,
	      onEnd: function onEnd() {}
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    this.currentlyAnimatingKeys = {};
	    this.keysToEnter = [];
	    this.keysToLeave = [];
	    return {
	      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props))
	    };
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _this = this;
	
	    var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
	    var props = this.props;
	    var showProp = props.showProp;
	    var exclusive = props.exclusive;
	    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
	    // last props children if exclusive
	    // exclusive needs immediate response
	    var currentChildren = this.state.children;
	    var newChildren = _ChildrenUtils2['default'].mergeChildren(currentChildren, nextChildren);
	
	    if (showProp && !exclusive) {
	      newChildren = newChildren.map(function (c) {
	        if (!c.props[showProp] && (0, _ChildrenUtils.isShownInChildren)(currentChildren, c, showProp)) {
	          c = _react2['default'].cloneElement(c, _defineProperty({}, showProp, true));
	        }
	        return c;
	      });
	    }
	
	    this.setState({
	      children: newChildren
	    });
	
	    // exclusive needs immediate response
	    if (exclusive) {
	      Object.keys(currentlyAnimatingKeys).forEach(function (key) {
	        _this.stop(key);
	      });
	      currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
	    }
	
	    nextChildren.forEach(function (c) {
	      var key = c.key;
	      if (currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasPrev = (0, _ChildrenUtils.inChildren)(currentChildren, c);
	      if (showProp) {
	        if (hasPrev) {
	          var showInNow = (0, _ChildrenUtils.isShownInChildren)(currentChildren, c, showProp);
	          var showInNext = c.props[showProp];
	          if (!showInNow && showInNext) {
	            _this.keysToEnter.push(key);
	          }
	        }
	      } else if (!hasPrev) {
	        _this.keysToEnter.push(key);
	      }
	    });
	
	    currentChildren.forEach(function (c) {
	      var key = c.key;
	      if (currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasNext = (0, _ChildrenUtils.inChildren)(nextChildren, c);
	      if (showProp) {
	        if (hasNext) {
	          var showInNext = (0, _ChildrenUtils.isShownInChildren)(nextChildren, c, showProp);
	          var showInNow = c.props[showProp];
	          if (!showInNext && showInNow) {
	            _this.keysToLeave.push(key);
	          }
	        }
	      } else if (!hasNext) {
	        _this.keysToLeave.push(key);
	      }
	    });
	  },
	
	  performEnter: function performEnter(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillEnter(this._handleDoneEntering.bind(this, key));
	    }
	  },
	
	  _handleDoneEntering: function _handleDoneEntering(key) {
	    delete this.currentlyAnimatingKeys[key];
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props));
	    if (!this.isValidChildByKey(currentChildren, key)) {
	      // exclusive will not need this
	      this.performLeave(key);
	    } else {
	      this.props.onEnd(key, true);
	      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren)) {
	        this.setState({
	          children: currentChildren
	        });
	      }
	    }
	  },
	
	  performLeave: function performLeave(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillLeave(this._handleDoneLeaving.bind(this, key));
	    }
	  },
	
	  isValidChildByKey: function isValidChildByKey(currentChildren, key) {
	    var showProp = this.props.showProp;
	    if (showProp) {
	      return (0, _ChildrenUtils.isShownInChildrenByKey)(currentChildren, key, showProp);
	    } else {
	      return (0, _ChildrenUtils.inChildrenByKey)(currentChildren, key);
	    }
	  },
	
	  _handleDoneLeaving: function _handleDoneLeaving(key) {
	    delete this.currentlyAnimatingKeys[key];
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props));
	    // in case state change is too fast
	    if (this.isValidChildByKey(currentChildren, key)) {
	      this.performEnter(key);
	    } else {
	      this.props.onEnd(key, false);
	      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren)) {
	        this.setState({
	          children: currentChildren
	        });
	      }
	    }
	  },
	
	  stop: function stop(key) {
	    delete this.currentlyAnimatingKeys[key];
	    var component = this.refs[key];
	    if (component) {
	      component.stop();
	    }
	  },
	
	  componentDidMount: function componentDidMount() {
	    if (this.props.animateMount) {
	      this.state.children.map(function (c) {
	        return c.key;
	      }).forEach(this.performEnter);
	    }
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	    var keysToEnter = this.keysToEnter;
	    this.keysToEnter = [];
	    keysToEnter.forEach(this.performEnter);
	    var keysToLeave = this.keysToLeave;
	    this.keysToLeave = [];
	    keysToLeave.forEach(this.performLeave);
	  },
	
	  render: function render() {
	    var props = this.props;
	    var children = this.state.children.map(function (child) {
	      if (!child.key) {
	        throw new Error('must set key for <rc-animate> children');
	      }
	      return _react2['default'].createElement(
	        _AnimateChild2['default'],
	        {
	          key: child.key,
	          ref: child.key,
	          animation: props.animation,
	          transitionName: props.transitionName,
	          transitionEnter: props.transitionEnter,
	          transitionLeave: props.transitionLeave },
	        child
	      );
	    });
	    var Component = props.component;
	    if (Component) {
	      return _react2['default'].createElement(
	        Component,
	        this.props,
	        children
	      );
	    } else {
	      return children[0] || null;
	    }
	  }
	});
	
	exports['default'] = Animate;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	function inChildren(children, child) {
	  var found = 0;
	  children.forEach(function (c) {
	    if (found) {
	      return;
	    }
	    found = c.key === child.key;
	  });
	  return found;
	}
	
	exports['default'] = {
	  inChildren: inChildren,
	
	  toArrayChildren: function toArrayChildren(children) {
	    var ret = [];
	    _react2['default'].Children.forEach(children, function (c) {
	      ret.push(c);
	    });
	    return ret;
	  },
	
	  isShownInChildren: function isShownInChildren(children, child, showProp) {
	    var found = 0;
	    children.forEach(function (c) {
	      if (found) {
	        return;
	      }
	      found = c.key === child.key && c.props[showProp];
	    });
	    return found;
	  },
	
	  inChildrenByKey: function inChildrenByKey(children, key) {
	    var found = 0;
	    if (children) {
	      children.forEach(function (c) {
	        if (found) {
	          return;
	        }
	        found = c.key === key;
	      });
	    }
	    return found;
	  },
	
	  isShownInChildrenByKey: function isShownInChildrenByKey(children, key, showProp) {
	    var found = 0;
	    if (children) {
	      children.forEach(function (c) {
	        if (found) {
	          return;
	        }
	        found = c.key === key && c.props[showProp];
	      });
	    }
	    return found;
	  },
	
	  isSameChildren: function isSameChildren(c1, c2) {
	    var same = c1.length === c2.length;
	    if (same) {
	      c1.forEach(function (c, i) {
	        if (c !== c2[i]) {
	          same = false;
	        }
	      });
	    }
	    return same;
	  },
	
	  mergeChildren: function mergeChildren(prev, next) {
	    var ret = [];
	
	    // For each key of `next`, the list of keys to insert before that key in
	    // the combined list
	    var nextChildrenPending = {};
	    var pendingChildren = [];
	    prev.forEach(function (c) {
	      if (inChildren(next, c)) {
	        if (pendingChildren.length) {
	          nextChildrenPending[c.key] = pendingChildren;
	          pendingChildren = [];
	        }
	      } else {
	        pendingChildren.push(c);
	      }
	    });
	
	    next.forEach(function (c) {
	      if (nextChildrenPending.hasOwnProperty(c.key)) {
	        ret = ret.concat(nextChildrenPending[c.key]);
	      }
	      ret.push(c);
	    });
	
	    ret = ret.concat(pendingChildren);
	
	    return ret;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _cssAnimation = __webpack_require__(27);
	
	var _cssAnimation2 = _interopRequireDefault(_cssAnimation);
	
	var transitionMap = {
	  enter: 'transitionEnter',
	  leave: 'transitionLeave'
	};
	
	var AnimateChild = _react2['default'].createClass({
	  displayName: 'AnimateChild',
	
	  transition: function transition(animationType, finishCallback) {
	    var _this = this;
	
	    var node = _react2['default'].findDOMNode(this);
	    var props = this.props;
	    var transitionName = props.transitionName;
	    this.stop();
	    var end = function end() {
	      _this.stopper = null;
	      finishCallback();
	    };
	    if ((_cssAnimation.isCssAnimationSupported || !props.animation[animationType]) && transitionName && props[transitionMap[animationType]]) {
	      this.stopper = (0, _cssAnimation2['default'])(node, transitionName + '-' + animationType, end);
	    } else {
	      this.stopper = props.animation[animationType](node, end);
	    }
	  },
	
	  stop: function stop() {
	    if (this.stopper) {
	      this.stopper.stop();
	      this.stopper = null;
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    this.stop();
	  },
	
	  componentWillEnter: function componentWillEnter(done) {
	    var props = this.props;
	    if (props.transitionEnter && props.transitionName || props.animation.enter) {
	      this.transition('enter', done);
	    } else {
	      done();
	    }
	  },
	
	  componentWillLeave: function componentWillLeave(done) {
	    var props = this.props;
	    if (props.transitionLeave && props.transitionName || props.animation.leave) {
	      this.transition('leave', done);
	    } else {
	      done();
	    }
	  },
	
	  render: function render() {
	    return this.props.children;
	  }
	});
	
	exports['default'] = AnimateChild;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Event = __webpack_require__(28);
	var Css = __webpack_require__(29);
	var isCssAnimationSupported = Event.endEvents.length !== 0;
	
	function getDuration(node, name) {
	  var style = window.getComputedStyle(node);
	  var prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];
	  var ret = '';
	  for (var i = 0; i < prefixes.length; i++) {
	    ret = style.getPropertyValue(prefixes[i] + name);
	    if (ret) {
	      break;
	    }
	  }
	  return ret;
	}
	
	function fixBrowserByTimeout(node) {
	  if (isCssAnimationSupported) {
	    var transitionDuration = parseFloat(getDuration(node, 'transition-duration')) || 0;
	    var animationDuration = parseFloat(getDuration(node, 'animation-duration')) || 0;
	    var time = Math.max(transitionDuration, animationDuration);
	    // sometimes, browser bug
	    node.rcEndAnimTimeout = setTimeout(function () {
	      node.rcEndAnimTimeout = null;
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }, time * 1000 + 200);
	  }
	}
	
	function clearBrowserBugTimeout(node) {
	  if (node.rcEndAnimTimeout) {
	    clearTimeout(node.rcEndAnimTimeout);
	    node.rcEndAnimTimeout = null;
	  }
	}
	
	var cssAnimation = function cssAnimation(node, transitionName, callback) {
	  var className = transitionName;
	  var activeClassName = className + '-active';
	
	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }
	
	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }
	
	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }
	
	    clearBrowserBugTimeout(node);
	
	    Css.removeClass(node, className);
	    Css.removeClass(node, activeClassName);
	
	    Event.removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;
	
	    // Usually this optional callback is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (callback) {
	      callback();
	    }
	  };
	
	  Event.addEndEventListener(node, node.rcEndListener);
	
	  Css.addClass(node, className);
	
	  node.rcAnimTimeout = setTimeout(function () {
	    node.rcAnimTimeout = null;
	    Css.addClass(node, activeClassName);
	    fixBrowserByTimeout(node);
	  }, 0);
	
	  return {
	    stop: function stop() {
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }
	  };
	};
	
	cssAnimation.style = function (node, style, callback) {
	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }
	
	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }
	
	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }
	
	    clearBrowserBugTimeout(node);
	
	    Event.removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;
	
	    // Usually this optional callback is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (callback) {
	      callback();
	    }
	  };
	
	  Event.addEndEventListener(node, node.rcEndListener);
	
	  node.rcAnimTimeout = setTimeout(function () {
	    for (var s in style) {
	      if (style.hasOwnProperty(s)) {
	        node.style[s] = style[s];
	      }
	    }
	    node.rcAnimTimeout = null;
	    fixBrowserByTimeout(node);
	  }, 0);
	};
	
	cssAnimation.setTransition = function (node, p, value) {
	  var property = p;
	  var v = value;
	  if (value === undefined) {
	    v = property;
	    property = '';
	  }
	  property = property || '';
	  ['Webkit', 'Moz', 'O',
	  // ms is special .... !
	  'ms'].forEach(function (prefix) {
	    node.style[prefix + 'Transition' + property] = v;
	  });
	};
	
	cssAnimation.addClass = Css.addClass;
	cssAnimation.removeClass = Css.removeClass;
	cssAnimation.isCssAnimationSupported = isCssAnimationSupported;
	
	module.exports = cssAnimation;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	var EVENT_NAME_MAP = {
	  transitionend: {
	    transition: 'transitionend',
	    WebkitTransition: 'webkitTransitionEnd',
	    MozTransition: 'mozTransitionEnd',
	    OTransition: 'oTransitionEnd',
	    msTransition: 'MSTransitionEnd'
	  },
	
	  animationend: {
	    animation: 'animationend',
	    WebkitAnimation: 'webkitAnimationEnd',
	    MozAnimation: 'mozAnimationEnd',
	    OAnimation: 'oAnimationEnd',
	    msAnimation: 'MSAnimationEnd'
	  }
	};
	
	var endEvents = [];
	
	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;
	
	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }
	
	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }
	
	  for (var baseEventName in EVENT_NAME_MAP) {
	    if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
	      var baseEvents = EVENT_NAME_MAP[baseEventName];
	      for (var styleName in baseEvents) {
	        if (styleName in style) {
	          endEvents.push(baseEvents[styleName]);
	          break;
	        }
	      }
	    }
	  }
	}
	
	if (typeof window !== 'undefined') {
	  detectEvents();
	}
	
	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}
	
	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}
	
	var TransitionEvents = {
	  addEndEventListener: function addEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },
	
	  endEvents: endEvents,
	
	  removeEndEventListener: function removeEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};
	
	module.exports = TransitionEvents;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	var SPACE = ' ';
	var RE_CLASS = /[\n\t\r]/g;
	
	function norm(elemClass) {
	  return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
	}
	
	module.exports = {
	  addClass: function addClass(elem, className) {
	    elem.className += ' ' + className;
	  },
	
	  removeClass: function removeClass(elem, n) {
	    var elemClass = elem.className.trim();
	    var className = norm(elemClass);
	    var needle = n.trim();
	    needle = SPACE + needle + SPACE;
	    // 一个 cls 有可能多次出现：'link link2 link link3 link'
	    while (className.indexOf(needle) >= 0) {
	      className = className.replace(needle, SPACE);
	    }
	    elem.className = className.trim();
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=common.js.map