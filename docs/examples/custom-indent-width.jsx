/* eslint-disable no-alert, no-console, react/no-find-dom-node */
import React from 'react';
import '../../assets/index.less';
import './basic.less';
import Tree from 'rc-tree';

const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      { key: '0-0-0', title: 'parent 1-1', children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }] },
      {
        key: '0-0-1',
        title: 'parent 1-2',
        children: [
          { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
          { key: '0-0-1-1', title: 'parent 1-2-1' },
          { key: '0-0-1-2', title: 'parent 1-2-2' },
          { key: '0-0-1-3', title: 'parent 1-2-3' },
          { key: '0-0-1-4', title: 'parent 1-2-4' },
          { key: '0-0-1-5', title: 'parent 1-2-5' },
          { key: '0-0-1-6', title: 'parent 1-2-6' },
          { key: '0-0-1-7', title: 'parent 1-2-7' },
          { key: '0-0-1-8', title: 'parent 1-2-8' },
          { key: '0-0-1-9', title: 'parent 1-2-9' },
          { key: 1128, title: 1128 },
        ],
      },
    ],
  },
];

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.treeRef = React.createRef();
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  setTreeRef = tree => {
    this.tree = tree;
  };

  render() {
    return (
      <div style={{ margin: '0 20px' }}>
        <h2>default width</h2>
        <Tree
          ref={this.treeRef}
          className="myCls"
          defaultExpandAll
          treeData={treeData}
          onSelect={this.onSelect}
        />

        <h2>indent width 8</h2>
        <Tree
          ref={this.treeRef}
          className="myCls"
          defaultExpandAll
          treeData={treeData}
          onSelect={this.onSelect}
          indentWidth={8}
        />
        <h2>indent width 20</h2>
        <Tree
          ref={this.treeRef}
          className="myCls"
          defaultExpandAll
          treeData={treeData}
          onSelect={this.onSelect}
          indentWidth={20}
        />

        <h2>indent width 40</h2>
        <Tree
          ref={this.treeRef}
          className="myCls"
          defaultExpandAll
          treeData={treeData}
          onSelect={this.onSelect}
          indentWidth={40}
        />
      </div>
    );
  }
}

export default Demo;
