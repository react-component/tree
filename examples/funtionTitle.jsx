/* eslint no-console:0, react/no-danger: 0 */
import '../assets/index.less';
import './animation.less';
import React from 'react';
import Tree from '../src';
import data from './longData.json';

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

const renderTitle = title => {
  console.log('run');
  return title;
};

function getTreeData() {
  return data.map(item => ({
    title: () => renderTitle(item.fieldName),
    key: item.fieldName,
  }));
}

const Demo = () => (
  <div>
    <h2>expanded</h2>
    <style dangerouslySetInnerHTML={{ __html: STYLE }} />

    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1 1 50%' }}>
        <h3>With Virtual</h3>
        <Tree
          defaultExpandAll={false}
          defaultExpandedKeys={defaultExpandedKeys}
          motion={motion}
          height={200}
          itemHeight={20}
          style={{ border: '1px solid #000' }}
          treeData={getTreeData()}
        />
      </div>
    </div>
  </div>
);

export default Demo;
