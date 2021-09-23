/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import { gData } from './utils/dataUtil';
import './selectable.less';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

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
      <div className="selectable-demo">
        <h2>selectable</h2>
        <p>normal</p>
        <div>
          <Tree defaultExpandAll showLine>
            <TreeNode title="root node" key="0-0">
              <TreeNode title="parent 1 default value(true)" key="0-0-0">
                <TreeNode
                  title="use parent 1 value if dont set selectable obviously"
                  key="0-0-0-0"
                />
                <TreeNode selectable={true} title="set selectable is true" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 2 selectable is false" selectable={false} key="0-0-1">
                <TreeNode
                  selectable={false}
                  title="use parent 2 value if dont set selectable obviously"
                  key="0-0-1-0"
                />
                <TreeNode
                  selectable={true}
                  title="if set selectable obviously, it does't affect by parent"
                  key="0-0-1-1"
                />
              </TreeNode>
              <TreeNode title="parent 3 disabled" key="0-0-2" disabled>
                <TreeNode
                  selectable={false}
                  title="parent is disable ,and selectable is false"
                  key="0-0-2-0"
                />
                <TreeNode
                  selectable={true}
                  title="parent is disable ,and selectable is true"
                  key="0-0-2-1"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
        <p>customized tree node style if unselectable</p>
        <div className="selectable-container">
          <Tree prefixCls="rc-tree" defaultExpandAll showLine>
            <TreeNode title="root node" key="0-0">
              <TreeNode title="parent 1 default value(true)" key="0-0-0">
                <TreeNode
                  title="use parent 1 value if dont set selectable obviously"
                  key="0-0-0-0"
                />
                <TreeNode selectable={true} title="set selectable is true" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 2 selectable is false" selectable={false} key="0-0-1">
                <TreeNode
                  selectable={false}
                  title="use parent 2 value if dont set selectable obviously"
                  key="0-0-1-0"
                />
                <TreeNode
                  selectable={true}
                  title="if set selectable obviously, it does't affect by parent"
                  key="0-0-1-1"
                />
              </TreeNode>
              <TreeNode title="parent 3 disabled" key="0-0-2" disabled>
                <TreeNode
                  selectable={false}
                  title="parent is disable ,and selectable is false"
                  key="0-0-2-0"
                />
                <TreeNode
                  selectable={true}
                  title="parent is disable ,and selectable is true"
                  key="0-0-2-1"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
      </div>
    );
  }
}

export default Demo;
