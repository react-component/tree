'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleChecked(checked, c) {
  console.log('checked: ', checked, c );
}

var demo = (
  <div>
    <h2>checkbox</h2>

    <Tree expandAll={true} checkable={true} onChecked={handleChecked}>
      <TreeNode title="parent 1">
        <TreeNode title="child1" defaultChecked={true}>
          <TreeNode>child11 </TreeNode>
          <TreeNode>child12 </TreeNode>
        </TreeNode>
        <TreeNode title="child2">
          <TreeNode title="child21">
            <TreeNode>child211 </TreeNode>
            <TreeNode>child212 </TreeNode>
          </TreeNode>
          <TreeNode checked={true}>child22 </TreeNode>
          <TreeNode checked={true}>child23 </TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode title="parent 2">
        <TreeNode checked={true}>child2 </TreeNode>
      </TreeNode>
    </Tree>
    {/*
    <Tree expandAll={true} checkable={true} onChecked={handleChecked} checked={false}>
      <TreeNode title="parent 1" checked={false}>
        <TreeNode>leaf </TreeNode>
        <TreeNode title="parent 1-1" checked={true}>
          <TreeNode title="parent 2-1">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode>
        <TreeNode>leaf </TreeNode>
      </TreeNode>
    </Tree>
    */}
  </div>
)

React.render(demo, document.getElementById('__react-content'));
