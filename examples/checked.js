'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

class TreeDemo extends React.Component {
  constructor(props) {
    super(props);
    ['handleClick', 'handleCheck', 'handleSelect'].forEach((m)=> {
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
  handleCheck(info) {
    console.log('check: ', info);
    this.setState({
      checkedKeys: ['p21'],
      selectedKeys: ['p1', 'p21']
    })
  }
  handleSelect(info) {
    console.log('selected: ', info);
    this.setState({
      checkedKeys: ['p21'],
      selectedKeys: ['p21']
    })
  }
  render() {
    return <div>
      <div>
        <h2>checked</h2>
        <Tree defaultExpandAll={true} checkable={true}
              onCheck={this.handleCheck} checkedKeys={this.state.checkedKeys}
              onSelect={this.handleSelect} selectedKeys={this.state.selectedKeys} multiple>
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
