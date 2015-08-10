'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleSelect(selected, c, selectedKeys) {
  console.log('selected: ', selected, c, selectedKeys );
}

var demo = (
  <div>
    <h2>select</h2>

    <Tree expandAll={true} onSelect={handleSelect} defaultSelectedKeys={['p1', 'p22']}>
      <TreeNode title="parent 1" key="p1">
        <TreeNode key="p10">leaf </TreeNode>
        <TreeNode title="parent 1-1" key="p11" disabled>
          <TreeNode title="parent 2-1" key="p21">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
          <TreeNode key="p22">leaf</TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
      <TreeNode>leaf </TreeNode>
      <TreeNode>
        <TreeNode>leaf </TreeNode>
      </TreeNode>
    </Tree>

  </div>
)

React.render(demo, document.getElementById('__react-content'));
