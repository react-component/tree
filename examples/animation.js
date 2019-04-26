/* eslint no-console:0, react/no-danger: 0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';

const STYLE = `
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}

.node-motion-enter,
.node-motion-leave-active {
  height: 0;
}
`;

const onEnterActive = (node) => {
  return { height: node.scrollHeight };
};

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onEnterActive,
  onLeaveStart: ( node ) => ({ height: node.offsetHeight }),
};

const demo = (
  <div>
    <h2>expanded</h2>
    <style dangerouslySetInnerHTML={{ __html: STYLE }}/>
    <Tree
      defaultExpandAll={false}
      defaultExpandedKeys={['p1']}
      motion={motion}
    >
      <TreeNode title="parent 1" key="p1">
        <TreeNode key="p10" title="leaf"/>
        <TreeNode title="parent 1-1" key="p11">
          <TreeNode title="parent 2-1" key="p21">
            <TreeNode title="leaf"/>
            <TreeNode title="leaf"/>
          </TreeNode>
          <TreeNode key="p22" title="leaf"/>
        </TreeNode>
      </TreeNode>
    </Tree>
  </div>
);

ReactDOM.render(demo, document.getElementById('__react-content'));
