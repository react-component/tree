/* eslint-disable no-console, react/no-access-state-in-setstate,
react/no-danger, no-param-reassign */
import React from 'react';
import { gData } from './utils/dataUtil';
import '../../assets/index.less';
import Tree from 'rc-tree';

const STYLE = `
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`;

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: node => {
    console.log('Start Motion:', node);
    return { height: 0 };
  },
  onAppearActive: node => ({ height: node.scrollHeight }),
  onLeaveStart: node => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

// const gData = [
//   { title: '0-0', key: '0-0' },
//   { title: '0-1', key: '0-1' },
//   { title: '0-2', key: '0-2', children: [{ title: '0-2-0', key: '0-2-0' }] },
// ];

class Demo extends React.Component {
  state = {
    gData,
    autoExpandParent: true,
    expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key'],
  };

  onDragEnter = ({ expandedKeys }) => {
    console.log('enter', expandedKeys);
    this.setState({
      expandedKeys,
    });
  };

  onDrop = info => {
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
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

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
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
    const { expandedKeys } = this.state;

    return (
      <div className="draggable-demo">
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />

        <h2>draggable</h2>
        <p>drag a node into another node</p>
        <Tree
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          autoExpandParent={this.state.autoExpandParent}
          draggable
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          treeData={this.state.gData}
          motion={motion}
        />
      </div>
    );
  }
}

export default Demo;
