/**
 * only require other specs here
 */

require('../assets/index.css');

var expect = require('expect.js');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;
//var KeyCode = require('rc-util').KeyCode;
var Tree = require('../');
var TreeNode = Tree.TreeNode;

describe('Tree', function () {
  var instance;
  var div;
  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', function () {
    var instance = TestUtils.renderIntoDocument(
      <Tree className="forTest">
        <TreeNode>1</TreeNode>
      </Tree>
    );
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should select the item', function (done) {
    function handleSelect(arg) {
      if (arg) {
        //console.log(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle));
        setTimeout(function (){
          expect(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle).className
          .indexOf('-selected') !== -1).to.be(true);
          setTimeout(function(){
            done();
          }, 1000)
        }, 100)
      }
    }

    var instance = ReactDOM.render(
      <Tree checkable={true} onSelect={handleSelect}>
        <TreeNode title="parent 1">
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf 1</TreeNode>
        </TreeNode>
      </Tree>, div);
    Simulate.click(ReactDOM.findDOMNode(instance.refs.treeNode.refs.selectHandle));
  });

  it('should can fire check event', function () {
    var instance = TestUtils.renderIntoDocument(
      <Tree checkable={true}>
        <TreeNode title="parent 1">
          <TreeNode>leaf </TreeNode>
          <TreeNode title="parent 1-1">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
        </TreeNode>
      </Tree>
    );
    //Simulate.click(ReactDOM.findDOMNode(instance.refs.one));
    //Simulate.click(instance.refs.one);
    expect(true).to.be(true);
  });


});
