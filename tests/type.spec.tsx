/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import Tree, { BasicDataNode } from '../src';

describe('Tree.TypeScript', () => {
  it('fieldNames', () => {
    interface DataType extends BasicDataNode {
      label: string;
      value: string;
      list?: DataType[];
    }

    const wrapper = mount(
      <Tree<DataType>
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            list: [],
          },
        ]}
      />,
    );

    expect(wrapper).toBeTruthy();
  });
});
