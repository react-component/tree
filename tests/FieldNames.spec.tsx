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

  it('dynamic change fieldNames', () => {
    const wrapper = mount(
      <Tree
        defaultExpandAll
        treeData={[
          {
            title: 'Origin Title',
            key: 'parent',
            children: [
              {
                title: 'Origin Sub 1',
                key: 'sub_1',
              },
              {
                title: 'Origin Sub 2',
                key: 'sub_2',
              },
            ],
          },
        ]}
      />,
    );

    // Title
    expect(
      wrapper.find('.rc-tree-list-holder div.rc-tree-treenode').map(node => node.text()),
    ).toEqual(['Origin Title', 'Origin Sub 1', 'Origin Sub 2']);

    // Change it
    wrapper.setProps({
      treeData: [
        {
          myTitle: 'New Title',
          myKey: 'parent',
          myChildren: [
            {
              myTitle: 'New Sub 1',
              myKey: 'sub_1',
            },
            {
              myTitle: 'New Sub 2',
              myKey: 'sub_2',
            },
          ],
        },
        {
          myTitle: 'New Title 2',
          myKey: 'parent2',
          myChildren: [
            {
              myTitle: 'New Sub 3',
              myKey: 'sub_3',
            },
          ],
        },
      ],
      fieldNames: {
        title: 'myTitle',
        key: 'myKey',
        children: 'myChildren',
      },
    });

    expect(
      wrapper.find('.rc-tree-list-holder div.rc-tree-treenode').map(node => node.text()),
    ).toEqual(['New Title', 'New Sub 1', 'New Sub 2', 'New Title 2']);
  });
});
