/**
 * only require other specs here
 */

require('../assets/index.css');

const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Tree = require('../');
const TreeNode = Tree.TreeNode;

describe('Tree', function des() {
  let div;
  beforeEach(function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(function() {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', function() {
    const instance = ReactDOM.render(
      <Tree className="forTest">
        <TreeNode title="1" />
      </Tree>, div
    );
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should select the item', function(done) {
    let instance;
    function handleSelect(arg) {
      if (arg) {
        // console.log(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle));
        setTimeout(function() {
          expect(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle).className
          .indexOf('-selected') !== -1).to.be(true);
          setTimeout(function() {
            done();
          }, 1000);
        }, 100);
      }
    }

    instance = ReactDOM.render(
      <Tree checkable onSelect={handleSelect}>
        <TreeNode title="parent 1">
          <TreeNode title="leaf" />
          <TreeNode title="leaf" />
        </TreeNode>
      </Tree>, div);
    Simulate.click(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle));
  });

  it('should can fire check event', function() {
    const instance = TestUtils.renderIntoDocument(
      <Tree checkable>
        <TreeNode title="parent 1">
          <TreeNode title="leaf" />
          <TreeNode title="parent 1-1">
            <TreeNode title="leaf" />
            <TreeNode title="leaf" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
    const ele = ReactDOM.findDOMNode(instance.refs.treeNode.refs.checkbox);
    Simulate.click(ele);
    // Simulate.click(instance.refs.one);
    expect(ele.className.indexOf('-checked') !== -1).to.be(true);
  });
});
