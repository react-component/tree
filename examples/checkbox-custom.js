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
      <TreeNode title="parent 1" checkbox={<input type="checkbox" defaultChecked={true} />}>
        <TreeNode>child1 </TreeNode>
        <TreeNode title="parent 1-1" checkbox={<input type="checkbox" defaultChecked={false} />}>
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode>leaf </TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
