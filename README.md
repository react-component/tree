# rc-tree
---

tree ui component for react

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![Sauce Test Status](https://saucelabs.com/buildstatus/rc-tree)](https://saucelabs.com/u/rc-tree)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rc-tree.svg)](https://saucelabs.com/u/rc-tree)

[npm-image]: http://img.shields.io/npm/v/rc-tree.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-tree
[travis-image]: https://img.shields.io/travis/react-component/tree.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/tree
[coveralls-image]: https://img.shields.io/coveralls/react-component/tree.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/tree?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/tree.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/tree
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-tree.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-tree

## Screenshots

<img src="https://t.alipayobjects.com/images/T15BpfXn8nXXXXXXXX.png" width="288"/>


## Feature

* support ie8,ie8+,chrome,firefox,safari


## Example

http://localhost:8018/examples/

online example: http://react-component.github.io/tree/examples/


## install

[![rc-tree](https://nodei.co/npm/rc-tree.png)](https://npmjs.org/package/rc-tree)

## Usage

```js
var React = require('react');
var Tree = require('rc-tree');
var TreeNode = Tree.TreeNode;
React.render(
  <Tree>
    <TreeNode>leaf </TreeNode>
    <TreeNode>leaf </TreeNode>
  <Tree/>, container);
```

## API

### Tree props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className | additional css class of root dom node | String | '' |
|prefixCls | prefix class | String | '' |
|showLine | whether show line | bool | true |
|showIcon | whether show icon | bool | true |
|checkable | whether support checked | bool | false |
|expandAll | expand all treeNodes | bool | false |
|onChecked | click the treeNode's checkbox to checked(auto switch checked state)  | function | - |
|selectedKeys | selected treeNodes | String[] | [] |
|defaultSelectedKeys | default selected treeNodes | String[] | [] |
|onSelect | click the treeNode to fire(auto switch selected state)  | function | - |

### TreeNode props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
|className | additional class to treeNode | String | '' |
|disabled | whether disabled the treeNode | bool | false |
|title | tree/subTree's title | String | '---' |
|defaultChecked | set checked state(require tree props checkable) | bool | false |
|checked | set checked state(require tree props checkable) | bool | false |
|checkbox | can use custom checkbox element(require tree props checkable) | element | - |
|defaultExpanded | whether default expand the treeNode | bool | false |
|expanded | whether expand the treeNode, it's controlled | bool | false |
|key | it's used with tree props's selectedKeys or  defaultSelectedKeys | String | treeNode's pos |


### Keyboard
- KeyDown/KeyUp


## Development

```
npm install
npm start
```

## Test Case

http://localhost:8003/tests/runner.html?coverage

## Coverage

http://localhost:8003/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8003/tests/runner.html?coverage

## License

rc-tree is released under the MIT license.
