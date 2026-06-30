/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tree from '../src';
import { spyConsole } from './util';

describe('FieldNames', () => {
  spyConsole();

  it('customize fieldNames', () => {
    const onSelect = jest.fn();
    const { container } = render(
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
        onSelect={onSelect}
        multiple
      />,
    );

    // Title
    const titleList = Array.from(
      container.querySelectorAll('.rc-tree-list-holder div.rc-tree-treenode'),
    ).map(node => node.textContent);

    expect(titleList).toEqual(['Title', 'Sub1', 'Sub2']);

    // Key
    container.querySelectorAll('.rc-tree-title').forEach(ele => {
      fireEvent.click(ele);
    });

    expect(onSelect).toHaveBeenCalledWith(['title', 'sub_1', 'sub_2'], expect.anything());
  });

  it('dynamic change fieldNames', () => {
    const renderTree = (props?: any) => (
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
        {...props}
      />
    );

    const { container, rerender } = render(renderTree());

    // Title
    expect(
      Array.from(container.querySelectorAll('.rc-tree-list-holder div.rc-tree-treenode')).map(
        node => node.textContent,
      ),
    ).toEqual(['Origin Title', 'Origin Sub 1', 'Origin Sub 2']);

    // Change it
    rerender(
      renderTree({
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
      }),
    );

    expect(
      Array.from(container.querySelectorAll('.rc-tree-list-holder div.rc-tree-treenode')).map(
        node => node.textContent,
      ),
    ).toEqual(['New Title', 'New Sub 1', 'New Sub 2', 'New Title 2']);
  });

  it('checkable should work', () => {
    const onCheck = jest.fn();

    const { container } = render(
      <Tree
        checkable
        onCheck={onCheck}
        fieldNames={{ key: 'val', children: 'child' }}
        treeData={
          [
            {
              val: 'parent',
              child: [
                {
                  val: 'child',
                },
              ],
            },
          ] as any
        }
      />,
    );

    fireEvent.click(container.querySelector('.rc-tree-checkbox'));
    expect(onCheck).toHaveBeenCalledWith(['parent', 'child'], expect.anything());
  });

  // Internal usage. Safe to remove
  it('fieldNames using _title', () => {
    const onSelect = jest.fn();

    const { container } = render(
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
          _title: ['notExist', 'myTitle'],
          key: 'myKey',
          children: 'myChildren',
        }}
        onSelect={onSelect}
        multiple
      />,
    );

    // Title
    const titleList = Array.from(
      container.querySelectorAll('.rc-tree-list-holder div.rc-tree-treenode'),
    ).map(node => node.textContent);

    expect(titleList).toEqual(['Title', 'Sub1', 'Sub2']);

    // Key
    container.querySelectorAll('.rc-tree-title').forEach(ele => {
      fireEvent.click(ele);
    });

    expect(onSelect).toHaveBeenCalledWith(['title', 'sub_1', 'sub_2'], expect.anything());
  });
});
