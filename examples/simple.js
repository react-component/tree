'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleSelect(info) {
  console.log('selected', info);
}

var demo = (
  <div>
    <h2>simple</h2>
    <Tree className="myCls" onSelect={handleSelect} defaultSelectedKeys={['0-1', '0-1-1']} multiple={true}
      defaultExpandAll={true} showIcon={false} showLine={true}>
      <TreeNode title="parent 1" key="0-1">
        <TreeNode title="parent 1-0" key="0-1-1">
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
        <TreeNode title="parent 1-1">
          <TreeNode>leaf </TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </TreeNode>
    </Tree>
  </div>
)

React.render(demo, document.getElementById('__react-content'));
