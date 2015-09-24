'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

function handleCheck(info) {
  console.log('check: ', info);
}

class TreeDemo extends React.Component {
  constructor(props) {
    super(props);
    ['handleClick'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
    this.state = {
      checkedKeys: [],
      selectedKeys: []
    }
  }
  handleClick() {
    this.setState({
      checkedKeys: ['p11'],
      selectedKeys: ['p21', 'p11']
    })
  }
  render() {
    return <div>
      <div>
        <h2>checked</h2>
        <Tree defaultExpandAll={true} checkable={true}
              onCheck={handleCheck} defaultCheckedKeys={['p1', 'p22']} checkedKeys={this.state.checkedKeys}
              defaultSelectedKeys={['p11']} selectedKeys={this.state.selectedKeys} multiple>
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
      <button onClick={this.handleClick}>check sth</button>
    </div>
  }
}

React.render(<TreeDemo />, document.getElementById('__react-content'));
