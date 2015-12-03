import 'rc-tree/assets/index.less';
import 'rc-tree/assets/draggable-demo.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

const x = 4;
const y = 3;
const z = 2;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({title: key, key: key});
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const __level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(__level, key, tns[index].children);
  });
};
generateData(z);

class TreeDemo extends React.Component {
  constructor(props) {
    super(props);
    ['handleDrop', 'handleCheck', 'handleSelect'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
    this.state = {
      gData: gData,
      checkedKeys: [],
      selectedKeys: [],
    };
  }
  componentDidMount() {

  }
  handleDrop(info) {
    // console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到尾部，可以是随意位置
      item.children.push(dragObj);
    });
    this.setState({
      gData: data,
    });
  }
  handleCheck(info) {
    // console.log('check: ', info);
    this.setState({
      checkedKeys: [info.node.props.eventKey],
    });
  }
  handleSelect(info) {
    // console.log('selected: ', info);
    this.setState({
      selectedKeys: [info.node.props.eventKey],
    });
  }
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    return (<div className="draggable-demo">
      <h2>draggable </h2>
      <p>drag a node into another node</p>
      <div className="draggable-container">
        <Tree defaultExpandedKeys={['0-0', '0-0-0']} draggable onTreeDrop={this.handleDrop}
              checkable={false} onCheck={this.handleCheck} checkedKeys={this.state.checkedKeys}
              onSelect={this.handleSelect} selectedKeys={this.state.selectedKeys}>
          {loop(this.state.gData)}
        </Tree>
      </div>
    </div>);
  }
}

ReactDOM.render(<TreeDemo />, document.getElementById('__react-content'));
