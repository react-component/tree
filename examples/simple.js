/** @jsx React.DOM */
// use jsx to render html, do not modify simple.html
require('rc-tree/assets/index.css');
var React = require('react');
var Tree = require('rc-tree');
var TreeNode = Tree.TreeNode;

var demo = (
  <div>
    <h2>简单tree</h2>

    <Tree className="myCls">
      <TreeNode title="parent 1" expanded={false} icon>
        <Tree>
          <TreeNode>leaf </TreeNode>
          <TreeNode title="parent 1-1">
            <Tree>
              <TreeNode>leaf </TreeNode>
            </Tree>
          </TreeNode>
          <TreeNode>leaf </TreeNode>
        </Tree>
      </TreeNode>
      <TreeNode>leaf </TreeNode>
      <TreeNode title="parent 2">
        <Tree>
          <TreeNode>leaf </TreeNode>
        </Tree>
      </TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
