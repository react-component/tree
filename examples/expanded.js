'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

var demo = (
  <div>
    <h2>expanded</h2>

    <Tree className="myCls">
      <TreeNode title="parent 1" expanded={true}>
        <TreeNode>leaf </TreeNode>
        <TreeNode title="parent 1-1" defaultExpanded={true}>
          <TreeNode>leaf </TreeNode>
          <TreeNode>
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode title="parent 1-2" defaultExpanded={false}>
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
