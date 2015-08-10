'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

var demo = (
  <div>
    <h2>simple</h2>

    <Tree className="myCls" expandAll={true} showIcon={false} showLine={false}>
      <TreeNode title="parent 1">
        <TreeNode>leaf </TreeNode>
        <TreeNode title="parent 1-1">
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
    </Tree>
  </div>
)

React.render(demo, document.getElementById('__react-content'));
