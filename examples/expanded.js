'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

var demo = (
  <div>
    <h2>expanded</h2>
    <Tree defaultExpandedKeys={['p1', 'p11']}>
      <TreeNode title="parent 1" key="p1">
        <TreeNode key="p10">leaf </TreeNode>
        <TreeNode title="parent 1-1" key="p11">
          <TreeNode title="parent 2-1" key="p21">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
          <TreeNode key="p22">leaf</TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode key="p12">leaf</TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
