/* eslint no-console:0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import { gData } from './util';
import './draggable.less';

class Demo extends React.Component {
  state = {
    gData,
    autoExpandParent: true,
    expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key'],
  };
  onDragStart = (info) => {
    console.log('start', info);
  }
  onDragEnter = (info) => {
    console.log('enter', info);
    this.setState({
      expandedKeys: info.expandedKeys,
    });
  }
  onDrop = (info) => {
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      gData: data,
    });
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children && item.children.length) {
          return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.title} />;
      });
    };
    return (<div className="draggable-demo">
      <h2>draggable</h2>
      <p>drag a node into another node</p>
      <div className="draggable-container">
        <Tree
          expandedKeys={this.state.expandedKeys}
          onExpand={this.onExpand} autoExpandParent={this.state.autoExpandParent}
          draggable
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
        >
          {loop(this.state.gData)}
        </Tree>
      </div>
    </div>);
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
