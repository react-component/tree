/* eslint-disable no-console, react/no-access-state-in-setstate */
import '../../assets/index.less';
import React from 'react';
import Tree from 'rc-tree';

function generateTreeNodes(treeNode) {
  const arr = [];
  const key = treeNode.props.eventKey;
  for (let i = 0; i < 3; i += 1) {
    arr.push({ title: `leaf ${key}-${i}`, key: `${key}-${i}` });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach(item => {
      if (
        item.key.length > curKey.length
          ? item.key.indexOf(curKey) !== 0
          : curKey.indexOf(item.key) !== 0
      ) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        // eslint-disable-next-line no-param-reassign
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
  const loop = data => {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach(item => {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          // eslint-disable-next-line no-param-reassign
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

class Demo extends React.Component {
  state = {
    treeData: [],
    checkedKeys: [],
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        treeData: [
          { title: 'pNode 01', key: '0-0' },
          { title: 'pNode 02', key: '0-1' },
          { title: 'pNode 03', key: '0-2', isLeaf: true },
        ],
        checkedKeys: ['0-0'],
      });
    }, 100);
  }

  onSelect = info => {
    console.log('selected', info);
  };

  onCheck = checkedKeys => {
    console.log(checkedKeys);
    this.setState({
      checkedKeys,
    });
  };

  onLoadData = treeNode => {
    console.log('load data...');
    return new Promise(resolve => {
      setTimeout(() => {
        const treeData = [...this.state.treeData];
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        this.setState({ treeData });
        resolve();
      }, 500);
    });
  };

  render() {
    const { treeData } = this.state;

    return (
      <div>
        <h2>dynamic render</h2>
        <Tree
          onSelect={this.onSelect}
          checkable
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          loadData={this.onLoadData}
          treeData={treeData}
        />
      </div>
    );
  }
}

export default Demo;
