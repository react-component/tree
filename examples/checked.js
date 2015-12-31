import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import { gData } from './util';

function isValid(iArray, nArray) {
  return iArray.every((ii, i) => {
    return ii === nArray[i];
  });
}
function getCheckedKeys(node, checkedKeys, allCheckedNodesKeys) {
  const nodeKey = node.props.eventKey;
  let newCks = [...checkedKeys];
  let nodePos;
  const unCheck = allCheckedNodesKeys.some(item => {
    if (item.key === nodeKey) {
      nodePos = item.pos;
      return true;
    }
  });
  if (unCheck) {
    const nArr = nodePos.split('-');
    newCks = [];
    allCheckedNodesKeys.forEach(item => {
      const iArr = item.pos.split('-');
      if (item.pos === nodePos ||
        nArr.length > iArr.length && isValid(iArr, nArr) ||
        nArr.length < iArr.length && isValid(nArr, iArr)) {
        return;
      }
      newCks.push(item.key);
    });
  } else {
    newCks.push(nodeKey);
  }
  return newCks;
}

const Demo = React.createClass({
  getInitialState() {
    return {
      checkedKeys: ['0-0-0'],
      selectedKeys: ['0-0'],
    };
  },
  onCheck(info) {
    console.log('check: ', info);
    this.setState({
      checkedKeys: getCheckedKeys(info.node, info.checkedKeys, info.allCheckedNodesKeys),
      selectedKeys: ['0-3', '0-4'],
    });
  },
  onSelect(info) {
    console.log('selected: ', info);
    const selectedKeys = [...this.state.selectedKeys];
    const index = selectedKeys.indexOf(info.node.props.eventKey);
    if (index > -1) {
      selectedKeys.splice(index, 1);
    } else {
      selectedKeys.push(info.node.props.eventKey);
    }
    this.setState({
      selectedKeys: selectedKeys,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    return (<div>
      <h2>checked</h2>
      <Tree defaultExpandAll checkable multiple
            onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}>
        {loop(gData)}
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
