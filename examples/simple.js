/** @jsx React.DOM */
// use jsx to render html, do not modify simple.html
require('rc-tree/assets/index.css');
var React = require('react');
var Tree = require('rc-tree');
var TreeNode = Tree.TreeNode;

function handleSelect(selected, c) {
  console.log( selected, c );
}

var demo = (
  <div>
    <h2>简单tree</h2>

    <Tree className="myCls" onSelect={handleSelect} checkable={true}>
      <TreeNode title="parent 1" expanded={false} onSelect={handleSelect}>
        <TreeNode>leaf </TreeNode>
        <TreeNode title="parent 1-1">
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode>
        <TreeNode>leaf </TreeNode>
      </TreeNode>
      <TreeNode>leaf </TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
