import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.less';
import './basic.less';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Tree checkable checkStrictly>
          <TreeNode title="foo" key="foo">
            <TreeNode title="xxx" key="xxx" />
            <TreeNode title="yyy" key="yyy" />
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
