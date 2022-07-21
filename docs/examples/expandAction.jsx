/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

const Demo = () => (
  <div className="expandAction-demo">
    <h2>expandAction</h2>
    <p>normal</p>
    <Tree defaultExpandedKeys={['0-0']} expandAction="click" selectable={false}>
      <TreeNode title="parent 1" key="0-0">
        <TreeNode
          title="click title can trigger expand even selectable is false because expandAction is 'click'"
          key="0-0-0"
        >
          <TreeNode title="leaf-1" key="0-0-0-0" />
        </TreeNode>
      </TreeNode>
    </Tree>
  </div>
);

export default Demo;
