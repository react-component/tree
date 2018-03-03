/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from '..';

/**
 * For refactor purpose. All the props should be passed by test
 */

describe('Tree Props', () => {
  // prefixCls
  it('prefixCls', () => {
    const withoutPrefix = render(
      <Tree />
    );
    expect(renderToJson(withoutPrefix)).toMatchSnapshot();

    const withPrefix = render(
      <Tree prefixCls="test-prefix" />
    );
    expect(renderToJson(withPrefix)).toMatchSnapshot();
  });

  // showLine
  it('showLine', () => {
    const wrapper = render(
      <Tree showLine />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  // showIcon
  it('showIcon', () => {
    const withIcon = render(
      <Tree>
        <TreeNode>
          <TreeNode>
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>
    );
    expect(renderToJson(withIcon)).toMatchSnapshot();

    const withoutIcon = render(
      <Tree showIcon={false}>
        <TreeNode>
          <TreeNode>
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>
    );
    expect(renderToJson(withoutIcon)).toMatchSnapshot();

    const withOpenIcon = render(
      <Tree defaultExpandedKeys={['0-0']}>
        <TreeNode>
          <TreeNode key="0-0">
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>
    );
    expect(renderToJson(withOpenIcon)).toMatchSnapshot();
  });

  describe('selectable', () => {
    // selectable - false
    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const withoutSelectableBase = (
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']} selectable={false}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0"/>
          </TreeNode>
        </Tree>
      );

      expect(renderToJson(render(withoutSelectableBase))).toMatchSnapshot();

      const withoutSelectable = mount(withoutSelectableBase);
      const parentNode = withoutSelectable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

      expect(handleOnSelect).not.toBeCalled();
      expect(handleOnCheck).not.toBeCalled(); // Will test in checkable
    });

    // selectable - true
    it('with selectable', () => {
      const handleOnSelect = jest.fn();

      const withSelectableBase = (
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      expect(renderToJson(render(withSelectableBase))).toMatchSnapshot();

      const withSelectable = mount(withSelectableBase);
      const parentNode = withSelectable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      // Select leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

      // traverseTreeNodes loops origin TreeNode and
      // onSelect trigger on `cloneElement` which is not the same instance
      // TODO: use context instead of `cloneElement` to reduce
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
      });

      // Unselect leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith([], {
        event: 'select',
        selected: false,
        node: targetNode.instance(),
        selectedNodes: [],
      });

      // Select leaf and then parent
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
      });

      parentNode.find('.rc-tree-node-content-wrapper').first().simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0'], {
        event: 'select',
        selected: true,
        node: parentNode.instance(),
        selectedNodes: [withSelectable.find(Tree).props().children],
      });
    });
  });

  // multiple
  it('multiple', () => {
    // TODO: Placeholder
  });

  // checkable
  it('checkable', () => {
    const handleOnSelect = jest.fn();
    const handleOnCheck = jest.fn();

    const withCheckableBase = (
      <Tree
        onSelect={handleOnSelect}
        onCheck={handleOnCheck}
        defaultExpandedKeys={['0-0']}
        checkable
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(render(withCheckableBase))).toMatchSnapshot();

    const withCheckable = mount(withCheckableBase);
    const parentNode = withCheckable.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Click leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
      event: 'select',
      selected: true,
      node: targetNode.instance(),
      selectedNodes: [parentNode.props().children],
    });
    expect(handleOnCheck).not.toBeCalled();
    expect(handleOnSelect).toBeCalled();

    handleOnCheck.mockReset();
    handleOnSelect.mockReset();

    // Click checkbox
    targetNode.find('.rc-tree-checkbox').simulate('click');

    expect(handleOnCheck).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
      event: 'check',
      checked: true,
      node: targetNode.instance(),
      checkedNodes: [parentNode.props().children, withCheckable.find(Tree).props().children],
    }));
    expect(handleOnSelect).not.toBeCalled();
  });
});
