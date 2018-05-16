/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from '..';

describe('Tree Internal', () => {
  it('internalOnStateUpdate', () => {
    const handleStateUpdate = jest.fn();

    const wrapper = mount(
      <Tree
        checkable
        checkedKeys={[]}
        internalOnStateUpdate={handleStateUpdate}
      >
        <TreeNode title="0-0" key="0-0">
          <TreeNode title="0-0-0" key="0-0-0" />
          <TreeNode title="0-0-1" key="0-0-1" />
          <TreeNode title="0-0-2" key="0-0-2" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper.render())).toMatchSnapshot();
    expect(handleStateUpdate).toBeCalledWith({ checkedKeys: [], halfCheckedKeys: [] });

    handleStateUpdate.mockReset();

    wrapper.setProps({ checkedKeys: ['0-0'] });
    expect(handleStateUpdate).toBeCalledWith({
      checkedKeys: ['0-0', '0-0-0', '0-0-1', '0-0-2'],
      halfCheckedKeys: [],
    });
  });
});
