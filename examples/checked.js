'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

const x = 12;
const y = 3;
let z = 2;
const data = [];

const generateData = (_level, _preKey, _tns) => {
  let preKey = _preKey || '0';
  let tns = _tns || data;

  let children = [];
  for (let i = 0; i < x; i++) {
    let key = `${preKey}-${i}`;
    tns.push({title: key, key: key});
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(--_level, key, tns[index].children);
  });
};
generateData(z);

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
      checkedKeys: ['0-0'],
      selectedKeys: ['p21', 'p11']
    })
  }
  handleCheck(info) {
    console.log('check: ', info);
    this.setState({
      checkedKeys: ['0-1'],
      selectedKeys: ['0-3', '0-4']
    })
  }
  handleSelect(info) {
    console.log('selected: ', info);
    this.setState({
      checkedKeys: ['0-2'],
      selectedKeys: ['0-2']
    })
  }
  render() {
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>
        } else {
          return <TreeNode key={item.key} title={item.key}></TreeNode>
        }
      })
    };
    return <div>
      <div>
        <h2>checked</h2>
        <Tree defaultExpandAll={false} checkable={true}
              onCheck={this.handleCheck} checkedKeys={this.state.checkedKeys}
              onSelect={this.handleSelect} selectedKeys={this.state.selectedKeys} multiple>
          {loop(data)}
        </Tree>
      </div>
      <button onClick={this.handleClick}>check again</button>
    </div>
  }
}

ReactDOM.render(<TreeDemo />, document.getElementById('__react-content'));
