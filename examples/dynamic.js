'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

const asyncTree = [
  {name: "pNode 01", key: "0-0"},
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
      const treeData = [...this.state.treeData];
      const child = generateTreeNodes(treeNode);
      const curKey = treeNode.props.eventKey;
      const loop = (data) => {
        if (curKey.length >= 9) return;
        data.forEach((item) => {
          if (curKey.indexOf(item.key) === 0) {
            if (item.children) {
              loop(item.children)
            } else {
              item.children = child;
            }
          } else {
            return;
          }
        })
      };
      loop(treeData);
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
        <Tree onSelect={this.handleSelect} onDataLoaded={this.handleDataLoaded} showIcon={false} showLine={false}>
          {treeNodes}
        </Tree>
      </div>
    )
  }
})

ReactDOM.render(<TreeDemo />, document.getElementById('__react-content'));
