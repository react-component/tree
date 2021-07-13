/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import Tree from '../src';
import { InternalTreeNode } from '../src/TreeNode';
import { spyConsole } from './util';

describe('FieldNames', () => {
  spyConsole();

  it('customize fieldNames', () => {
    const wrapper = mount(
      <Tree
        treeData={
          [
            {
              myTitle: 'Title',
              myKey: 'title',
              myChildren: [
                { myTitle: 'Sub1', myKey: 'sub_1' },
                { myTitle: 'Sub2', myKey: 'sub_2' },
              ],
            },
          ] as any
        }
        defaultExpandAll
        fieldNames={{
          title: 'myTitle',
          key: 'myKey',
          children: 'myChildren',
        }}
      />,
    );

    // Title
    const titleList = wrapper
      .find('.rc-tree-list-holder div.rc-tree-treenode')
      .map(node => node.text());

    expect(titleList).toEqual(['Title', 'Sub1', 'Sub2']);

    // Key
    const keyList = wrapper.find(InternalTreeNode).map(node => node.props().eventKey);

    expect(keyList).toEqual(['title', 'sub_1', 'sub_2']);
  });
});
