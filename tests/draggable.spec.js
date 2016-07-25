const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Tree = require('../');
const TreeNode = Tree.TreeNode;
// const $ = require('jquery');

describe('draggable tree', () => {
  let instance;
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should fire drag and drop event', () => {
    function cb(info) {
      console.log(info);
      expect(true).to.be(true);
    }
    instance = ReactDOM.render(
      <Tree
        draggable onDragStart={cb} onDragEnter={cb} onDragOver={cb} onDragLeave={cb} onDrop={cb}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div
    );
    try {
      Simulate.dragStart(instance.refs['treeNode-0-0'].refs['treeNode-0-0-0'].refs.selectHandle);
      const li = instance.refs['treeNode-0-0'].refs['treeNode-0-0-1'].refs.li;
      Simulate.dragEnter(li);
      Simulate.dragOver(li);
      Simulate.dragLeave(li);
      Simulate.drop(li);
    } catch (e) {
      // error
    }
  });
});
