const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Tree = require('../');
const TreeNode = Tree.TreeNode;

describe('checkable tree', function des() {
  let div;
  beforeEach(function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(function() {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should can fire check event', function() {
    const instance = TestUtils.renderIntoDocument(
      <Tree checkable>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>
    );
    const ele = ReactDOM.findDOMNode(instance.refs['treeNode-0-0'].refs.checkbox);
    Simulate.click(ele);
    expect(ele.className.indexOf('-checked') !== -1).to.be(true);
  });
});
