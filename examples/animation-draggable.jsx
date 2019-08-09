/* eslint-disable no-console, react/no-access-state-in-setstate, react/no-danger */
import React from 'react';
// import { gData } from './utils/dataUtil';
import '../assets/index.less';
import Tree from '../src';

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

const gData = [
  { title: '0-0', key: '0-0' },
  { title: '0-1', key: '0-1' },
  { title: '0-2', key: '0-2', children: [{ title: '0-2-0', key: '0-2-0' }] },
];

class Demo extends React.Component {
  state = {
    gData,
    autoExpandParent: true,
    // expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key'],
    expandedKeys: [],
  };

  onDragEnter = ({ expandedKeys }) => {
    console.log('enter', expandedKeys);
    this.setState({
      expandedKeys,
    });
  };

  onDrop = ({ node, dragNode, dropPosition: oriDropPosition, dropToGap }) => {
    const { expandedKeys } = this.state;

    console.log('drop:', { node, dragNode, oriDropPosition, dropToGap });
    const dropKey = node.props.eventKey;
    const dragKey = dragNode.props.eventKey;
    const dropPos = node.props.pos.split('-');
    const dropPosition = oriDropPosition - Number(dropPos[dropPos.length - 1]);

    // const dragDataNode = {};

    // function dig(data) {
    //   const newData = [...data];
    //   let matchDrag = false;

    //   for (let i = 0; i < newData.length; i += 1) {
    //     const item = newData[i];
    //     const cloneItem = {
    //       ...item,
    //       children: [...(item.children || [])],
    //     };
    //     newData[i] = cloneItem;

    //     if (item.key === dragKey) {
    //       // Is drag node
    //       if (!matchDrag) {
    //         matchDrag = true;
    //         newData.splice(i, 1);
    //         Object.assign(dragDataNode, cloneItem);
    //         i -= 1;
    //       }
    //     } else if (item.key === dropKey) {
    //       // Is drop node
    //       if (!dropToGap) {
    //         // Insert into children
    //         cloneItem.children.push(dragDataNode);
    //       } else if (dropPosition === -1) {
    //         // Drop to the top
    //         newData.splice(i, 0, dragDataNode);
    //         i += 1;
    //       } else {
    //         // Drop to the bottom
    //         newData.splice(i + 1, 0, dragDataNode);
    //         i += 1;
    //       }
    //       // } else {
    //       //   // Normal node should loop in
    //       //   cloneItem.children = dig(cloneItem.children);
    //     }

    //     cloneItem.children = dig(cloneItem.children);
    //   }

    //   return newData;
    // }

    const { gData } = this.state;

    function dig(list, callback) {
      (list || []).forEach(item => {
        callback(item);
        dig(item.children);
      });
    }

    // Find drag node
    let dragItem;
    dig(gData, item => {
      if (item.key === dragKey) {
        dragNode = item;
      }
    });

    // Find drop node
    let dropItem;
    dig(gData, item => {
      if (dropToGap) {
        // Match children exist
      } else if (item.key === dropKey) {
        dropItem = item;
      }
    });

    const newData = dig(this.state.gData);
    console.log('~~~>', newData);
    console.log('EXT:', expandedKeys, dropKey);

    this.setState({
      gData: newData,
      expandedKeys: Array.from(new Set([...expandedKeys, dropKey])),
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
