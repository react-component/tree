'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';

const asyncTree = [
  {name: "pNode 01", key: "0-0", children: [{name: "leaf 011"}]},
  {name: "pNode 02", key: "0-1"},
  {name: "pNode 03", key: "0-2"}
];

const generateTreeNodes = (treeNode) => {
  const arr = [];
  const key = treeNode.props.eventKey;
  for (let i = 0; i < 3; i++) {
    arr.push({name: `leaf ${key}-${i}`, key: `${key}-${i}`});
  }
  return arr;
}

const TreeDemo = React.createClass({
  propTypes: {},
  timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this), duration);
    })
  },
  getInitialState() {
    return {
      treeData: []
    };
  },
  componentDidMount() {
    this.timeout(1000).then(() => {
      this.setState({
        treeData: asyncTree
      });
      return asyncTree;
    });
  },
  handleSelect(info) {
    console.log('selected', info);
  },
  handleDataLoaded(treeNode) {
    return this.timeout(1000).then(() => {
      const child = generateTreeNodes(treeNode);
      const treeData = [...this.state.treeData];
      treeData.forEach((item) => {
        if (item.key === treeNode.props.eventKey) {
          item.children = child;
        }
      });
      this.setState({treeData});
      return child;
    });
  },
  render() {
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
        } else {
          return <TreeNode title={item.name} key={item.key}></TreeNode>;
        }
      })
    };
    const parseTreeNode = (data) => {
      return loop(data);
    };
    let treeNodes = parseTreeNode(this.state.treeData);
    return (
      <div>
        <h2>dynamic render</h2>
        <Tree onSelect={this.handleSelect} onDataLoaded={this.handleDataLoaded} showLine={false}>
          {treeNodes}
        </Tree>
      </div>
    )
  }
})

React.render(<TreeDemo />, document.getElementById('__react-content'));
