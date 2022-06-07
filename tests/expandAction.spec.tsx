/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tree, { TreeNode } from '../src';
import { spyConsole } from './util';

describe('ExpandAction', () => {
  spyConsole();

  it('title expandable when selectable is false and expandAction is "click"', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();
    const onExpand = jest.fn();

    const { container } = render(
      <Tree
        onClick={onClick}
        onSelect={onSelect}
        onExpand={onExpand}
        defaultExpandedKeys={['0-0']}
        selectable={false}
        expandAction="click"
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf-1" key="0-0-0-0" />
          </TreeNode>

          <TreeNode title="leaf 2" key="0-1-0">
            <TreeNode title="leaf-2" key="0-1-0-0" />
          </TreeNode>
        </TreeNode>
      </Tree>,
    );

    // test trigger expand when click title
    fireEvent.click(container.querySelector('[title="leaf 1"]'));

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).toHaveBeenCalledWith(['0-0', '0-0-0'], {
      expanded: true,
      node: expect.anything(),
      nativeEvent: expect.anything(),
    });

    onClick.mockReset();
    onSelect.mockReset();
    onExpand.mockReset();

    // test trigger un-expand when click title again
    fireEvent.click(container.querySelector('[title="leaf 1"]'));

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).toHaveBeenCalledWith(['0-0'], {
      expanded: false,
      node: expect.anything(),
      nativeEvent: expect.anything(),
    });
  });

  it('title expandable when selectable is false and expandAction is "doubleClick"', () => {
    const onDoubleClick = jest.fn();
    const onSelect = jest.fn();
    const onExpand = jest.fn();

    const { container } = render(
      <Tree
        onDoubleClick={onDoubleClick}
        onSelect={onSelect}
        onExpand={onExpand}
        defaultExpandedKeys={['0-0']}
        selectable={false}
        expandAction="doubleClick"
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf-1" key="0-0-0-0" />
          </TreeNode>

          <TreeNode title="leaf 2" key="0-1-0">
            <TreeNode title="leaf-2" key="0-1-0-0" />
          </TreeNode>
        </TreeNode>
      </Tree>,
    );

    // test trigger expand when double click title
    fireEvent.doubleClick(container.querySelector('[title="leaf 1"]'));

    expect(onDoubleClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).toHaveBeenCalledWith(['0-0', '0-0-0'], {
      expanded: true,
      node: expect.anything(),
      nativeEvent: expect.anything(),
    });

    onDoubleClick.mockReset();
    onSelect.mockReset();
    onExpand.mockReset();

    // test trigger un-expand when double click title again
    fireEvent.doubleClick(container.querySelector('[title="leaf 1"]'));

    expect(onDoubleClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).toHaveBeenCalledWith(['0-0'], {
      expanded: false,
      node: expect.anything(),
      nativeEvent: expect.anything(),
    });
  });

  it('title un-expandable when selectable is false and expandAction is false', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();
    const onExpand = jest.fn();

    const { container } = render(
      <Tree
        onClick={onClick}
        onSelect={onSelect}
        onExpand={onExpand}
        defaultExpandedKeys={['0-0']}
        selectable={false}
        expandAction={false}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf-1" key="0-0-0-0" />
          </TreeNode>

          <TreeNode title="leaf 2" key="0-1-0">
            <TreeNode title="leaf-2" key="0-1-0-0" />
          </TreeNode>
        </TreeNode>
      </Tree>,
    );

    // test won't trigger expand when click title if expandAction is false
    fireEvent.click(container.querySelector('[title="leaf 2"]'));

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).not.toHaveBeenCalled();
  });

  it('not trigger expand when ctrl pressed', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();
    const onExpand = jest.fn();

    const { container } = render(
      <Tree
        onClick={onClick}
        onSelect={onSelect}
        onExpand={onExpand}
        selectable
        expandAction={'click'}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf-1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    fireEvent.click(container.querySelector('[title="parent 1"]'), {
      ctrlKey: true,
    });

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalled();
    expect(onExpand).not.toHaveBeenCalled();
  });
});
