# rc-tree
---

tree ui component for react

[![NPM version][npm-image]][npm-url]
[![SPM version](http://spmjs.io/badge/rc-tree)](http://spmjs.io/package/rc-tree)
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

http://localhost:8008/examples/

online example: http://react-component.github.io/tree/examples/


## install

[![rc-tree](https://nodei.co/npm/rc-tree.png)](https://npmjs.org/package/rc-tree)

## Usage

```js
var Rctree = require('rc-tree');
var React = require('react');
React.render(<Rctree />, container);
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
          <td>expanded</td>
          <td>bool</td>
          <td></td>
          <td>whether expand the tree node</td>
        </tr>
        <tr>
          <td>iconEle</td>
          <td>react node or null</td>
          <td></td>
          <td>custom icon</td>
        </tr>
        <tr>
          <td>showLine</td>
          <td>bool</td>
          <td>true</td>
          <td>whether show line</td>
        </tr>
        <tr>
          <td>checkable</td>
          <td>bool</td>
          <td></td>
          <td>whether support checked</td>
        </tr>
        <tr>
          <td>onSelect </td>
          <td>function</td>
          <td></td>
          <td></td>
        </tr>
    </tbody>
</table>


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
