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

  it('throw error when DataType not extends BasicDataNode', () => {
    // tsconfig default strict: false, null can assign to BasicDataNode, but will throw at runtime
    const badData: BasicDataNode = null;

    expect(() => {
      render(
        <Tree<BasicDataNode>
          treeData={[badData]}
          onSelect={(selectedKeys, info) => {
            console.log('info', info);
          }}
        />,
      );
    }).toThrowError();
  });
});
