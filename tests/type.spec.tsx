/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { render } from '@testing-library/react';
import Tree, { BasicDataNode } from '../src';

describe('Tree.TypeScript', () => {
  it('fieldNames', () => {
    interface DataType extends BasicDataNode {
      label: string;
      value: string;
      list?: DataType[];
    }

    render(
      <Tree<DataType>
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            list: [],
          },
        ]}
        onSelect={(selectedKeys, info) => {
          console.log('info', info.node.isLeaf);
        }}
      />,
    );
  });
});
