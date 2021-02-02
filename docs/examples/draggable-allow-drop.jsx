/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import { gData } from './utils/dataUtil';
import './draggable.less';
import '../../assets/index.less';
import Tree from 'rc-tree';

function allowDrop({ dropNode, dropPosition }) {
  if (!dropNode.children) {
    if (dropPosition === 0) return false;
  }
  return true;
}

class Demo extends React.Component {
  state = {
    gData,
    autoExpandParent: true,
    expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key'],
  };

  onDragStart = info => {
    console.log('start', info);
  };

  onDragEnter = () => {
    console.log('enter');
  };

  onDrop = info => {
    console.log('drop', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

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

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dropPosition === 0) {
      // Drop on the content
      loop(data, dropKey, item => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap (insert before or insert after)
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
    }

    this.setState({
      gData: data,
    });
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    return (
      <div className="draggable-demo">
        <h2>draggable with allow drop</h2>
        <p>node can not be dropped inside a leaf node</p>
        <div className="draggable-container">
          <Tree
            allowDrop={allowDrop}
            expandedKeys={this.state.expandedKeys}
            onExpand={this.onExpand}
            autoExpandParent={this.state.autoExpandParent}
            draggable
            onDragStart={this.onDragStart}
            onDrop={this.onDrop}
            treeData={this.state.gData}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
