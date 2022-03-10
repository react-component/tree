/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import './title-expandable.less';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

class Demo extends React.Component {

  render() {
    return (
      <div className="selectable-demo">
        <h2>title expandable</h2>
        <p>normal</p>
        <div>
          <Tree defaultExpandedKeys={['0-0']}>
            <TreeNode title="parent 1" key="0-0" selectable={false} titleExpandable={true}>
              <TreeNode
                title="click title can trigger expand because titleExpandable is true"
                key="0-0-0"
                selectable={false}
                titleExpandable={true}
              >
                <TreeNode title="leaf-1" key="0-0-0-0" selectable={false} titleExpandable={true} />
              </TreeNode>

              <TreeNode
                title="click title cant trigger expand because titleExpandable is false"
                key="0-1-0"
                selectable={false}
                titleExpandable={false}
              >
                <TreeNode title="leaf-2" key="0-1-0-0" selectable={false} titleExpandable={true} />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
      </div>
    );
  }
}

export default Demo;
