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

  // selectable
  it('selectable', () => {
    // With Selectable
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

    // Check leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

    // traverseTreeNodes loops origin TreeNode and
    // onSelect trigger on `cloneElement` which is not the same instance
    expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
      event: 'select',
      selected: true,
      node: targetNode.instance(),
      selectedNodes: [parentNode.props().children],
    });

    // Uncheck leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith([], {
      event: 'select',
      selected: false,
      node: targetNode.instance(),
      selectedNodes: [],
    });

    // Check leaf with parent
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
