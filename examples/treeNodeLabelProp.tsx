/* eslint no-console:0 */
/* eslint no-alert:0 */
import React from 'react';
import Tree from '../src';
import '../assets/index.less';

const Demo = () => (
  <div>
    <h2>Customize icon with element</h2>
    <Tree
      treeNodeLabelProp="replacedTitle"
      defaultExpandAll
      treeData={
        [
          {
            title: 'parent',
            replacedTitle: 'real-parent',
            key: 1,
            children: [
              {
                title: 'children',
                replacedTitle: 'real-children',
                key: 2,
              },
            ],
          },
        ] as any
      }
    />
  </div>
);

export default Demo;
