'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleCheck(info) {
  console.log('check: ', info);
}

var demo = (
  <div>
    <h2>checked</h2>
    <Tree defaultExpandAll={true} checkable={true}
          onCheck={handleCheck} defaultCheckedKeys={['p1', 'p22']}>
      <TreeNode title="parent 1" key="p1">
        <TreeNode key="p10" title="leaf"/>
        <TreeNode title="parent 1-1" key="p11">
          <TreeNode title="parent 2-1" key="p21">
            <TreeNode>test</TreeNode>
            <TreeNode title={<span>sss</span>}/>
          </TreeNode>
          <TreeNode key="p22" title="leaf"/>
        </TreeNode>
      </TreeNode>
      <TreeNode key="p12" title="leaf"/>
    </Tree>
  </div>
);

React.render(demo, document.getElementById('__react-content'));
