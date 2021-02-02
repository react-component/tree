/* eslint no-console:0, react/no-danger: 0 */
import '../../assets/index.less';
import './animation.less';
import React from 'react';
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

const defaultExpandedKeys = ['0', '0-2', '0-9-2'];

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: () => ({ height: 0 }),
  onAppearActive: node => ({ height: node.scrollHeight }),
  onLeaveStart: node => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

function getTreeData() {
  // big-data: generateData(1000, 3, 2)
  return [
    {
      key: '0',
      title: 'node 0',
      children: [
        { key: '0-0', title: 'node 0-0' },
        { key: '0-1', title: 'node 0-1' },
        {
          key: '0-2',
          title: 'node 0-2',
          children: [
            { key: '0-2-0', title: 'node 0-2-0' },
            { key: '0-2-1', title: 'node 0-2-1' },
            { key: '0-2-2', title: 'node 0-2-2' },
          ],
        },
        { key: '0-3', title: 'node 0-3' },
        { key: '0-4', title: 'node 0-4' },
        { key: '0-5', title: 'node 0-5' },
        { key: '0-6', title: 'node 0-6' },
        { key: '0-7', title: 'node 0-7' },
        { key: '0-8', title: 'node 0-8' },
        {
          key: '0-9',
          title: 'node 0-9',
          children: [
            { key: '0-9-0', title: 'node 0-9-0' },
            {
              key: '0-9-1',
              title: 'node 0-9-1',
              children: [
                { key: '0-9-1-0', title: 'node 0-9-1-0' },
                { key: '0-9-1-1', title: 'node 0-9-1-1' },
                { key: '0-9-1-2', title: 'node 0-9-1-2' },
                { key: '0-9-1-3', title: 'node 0-9-1-3' },
                { key: '0-9-1-4', title: 'node 0-9-1-4' },
              ],
            },
            {
              key: '0-9-2',
              title: 'node 0-9-2',
              children: [
                { key: '0-9-2-0', title: 'node 0-9-2-0' },
                { key: '0-9-2-1', title: 'node 0-9-2-1' },
              ],
            },
          ],
        },
      ],
    },
    {
      key: '1',
      title: 'node 1',
      // children: new Array(1000)
      //   .fill(null)
      //   .map((_, index) => ({ title: `auto ${index}`, key: `auto-${index}` })),
      children: [
        {
          key: '1-0',
          title: 'node 1-0',
          children: [
            { key: '1-0-0', title: 'node 1-0-0' },
            {
              key: '1-0-1',
              title: 'node 1-0-1',
              children: [
                { key: '1-0-1-0', title: 'node 1-0-1-0' },
                { key: '1-0-1-1', title: 'node 1-0-1-1' },
              ],
            },
            { key: '1-0-2', title: 'node 1-0-2' },
          ],
        },
      ],
    },
  ];
}

const Demo = () => {
  const treeRef = React.useRef();

  setTimeout(() => {
    treeRef.current.scrollTo({ key: '0-9-2' });
  }, 100);

  return (
    <div className="animation">
      <h2>expanded</h2>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 50%' }}>
          <h3>With Virtual</h3>
          <Tree
            ref={treeRef}
            // defaultExpandAll={false}
            defaultExpandAll
            defaultExpandedKeys={defaultExpandedKeys}
            motion={motion}
            height={200}
            itemHeight={20}
            style={{ border: '1px solid #000' }}
            treeData={getTreeData()}
          />
        </div>
        <div style={{ flex: '1 1 50%' }}>
          <h3>Without Virtual</h3>
          <Tree
            defaultExpandAll={false}
            defaultExpandedKeys={defaultExpandedKeys}
            motion={motion}
            style={{ border: '1px solid #000' }}
            treeData={getTreeData()}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
