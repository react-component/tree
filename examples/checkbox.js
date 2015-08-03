'use strict';

import 'rc-tree/assets/index.css';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleSelect(selected, c) {
  console.log('selected: ', selected, c );
}
function handleChecked(checked, c) {
  console.log('checked: ', checked, c );
}

var demo = (
  <div>
    <h2>checkbox</h2>

    <Tree className="myCls" onSelect={handleSelect} onChecked={handleChecked}
          checkable={true} showLine={false} expandAll={false}>
      <TreeNode title="parent 1" expanded={true}>
        <TreeNode>leaf </TreeNode>
        <TreeNode title="parent 1-1" expanded={true} defaultExpanded={false}>
          <TreeNode title="parent 2-1">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
          <TreeNode>leaf </TreeNode>
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
