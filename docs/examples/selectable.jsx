/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import './selectable.less';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

class Demo extends React.Component {

  render() {
    return (
      <div className="selectable-demo">
        <h2>selectable</h2>
        <p>normal</p>
        <div>
          <Tree defaultExpandAll showLine>
            <TreeNode title="root node" key="0-0">
              <TreeNode title="parent 1 default value(true)" key="0-0-0">
                <TreeNode
                  title="use parent 1 value if dont set selectable obviously"
                  key="0-0-0-0"
                />
                <TreeNode selectable={true} title="set selectable is true" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 2 selectable is false" selectable={false} key="0-0-1">
                <TreeNode
                  selectable={false}
                  title="use parent 2 value if dont set selectable obviously"
                  key="0-0-1-0"
                />
                <TreeNode
                  selectable={true}
                  title="if set selectable obviously, it does't affect by parent"
                  key="0-0-1-1"
                />
              </TreeNode>
              <TreeNode title="parent 3 disabled" key="0-0-2" disabled>
                <TreeNode
                  selectable={false}
                  title="parent is disable ,and selectable is false"
                  key="0-0-2-0"
                />
                <TreeNode
                  selectable={true}
                  title="parent is disable ,and selectable is true"
                  key="0-0-2-1"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
        <p>customized tree node style if unselectable</p>
        <div className="selectable-container">
          <Tree prefixCls="rc-tree" defaultExpandAll showLine>
            <TreeNode title="root node" key="0-0">
              <TreeNode title="parent 1 default value(true)" key="0-0-0">
                <TreeNode
                  title="use parent 1 value if dont set selectable obviously"
                  key="0-0-0-0"
                />
                <TreeNode selectable={true} title="set selectable is true" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 2 selectable is false" selectable={false} key="0-0-1">
                <TreeNode
                  selectable={false}
                  title="use parent 2 value if dont set selectable obviously"
                  key="0-0-1-0"
                />
                <TreeNode
                  selectable={true}
                  title="if set selectable obviously, it does't affect by parent"
                  key="0-0-1-1"
                />
              </TreeNode>
              <TreeNode title="parent 3 disabled" key="0-0-2" disabled>
                <TreeNode
                  selectable={false}
                  title="parent is disable ,and selectable is false"
                  key="0-0-2-0"
                />
                <TreeNode
                  selectable={true}
                  title="parent is disable ,and selectable is true"
                  key="0-0-2-1"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
      </div>
    );
  }
}

export default Demo;
