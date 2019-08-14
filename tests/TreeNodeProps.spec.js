/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from '../src';
import { spyConsole } from './util';

/**
 * For refactor purpose. All the props should be passed by test
 */

describe('TreeNode Props', () => {
  spyConsole();

  // prefixCls - is defined by Tree, TreeNode can not change it
  // expanded - is defined by Tree, TreeNode can not change it

  it('className', () => {
    const wrapper = render(
      <Tree defaultExpandAll>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" className="tree-node-cls">
            <TreeNode />
          </TreeNode>
          <TreeNode key="0-0-1" />
        </TreeNode>
        <TreeNode key="0-1" />
      </Tree>,
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  // disabled - is already full test in Tree.spec.js
  // disableCheckbox - is already full test in Tree.spec.js
  // title - is already full test in Tree.spec.js
  // key - is already full test in Tree.spec.js
  it('isLeaf', () => {
    const withoutLoadData = render(
      <Tree showIcon={false} defaultExpandAll>
        <TreeNode isLeaf>
          <TreeNode isLeaf />
        </TreeNode>
      </Tree>,
    );
    expect(renderToJson(withoutLoadData)).toMatchSnapshot();

    const withLoadData = render(
      <Tree defaultExpandAll>
        <TreeNode isLeaf>
          <TreeNode isLeaf />
        </TreeNode>
      </Tree>,
    );
    expect(renderToJson(withLoadData)).toMatchSnapshot();

    const forceNoLeaf = render(
      <Tree defaultExpandAll>
        <TreeNode>
          <TreeNode isLeaf={false} />
        </TreeNode>
      </Tree>,
    );
    expect(renderToJson(forceNoLeaf)).toMatchSnapshot();
  });

  it('title function', () => {
    const wrapper = render(
      <Tree defaultExpandAll>
        <TreeNode title={() => <a id="test-title">title</a>} />
      </Tree>,
    );
    expect(wrapper.find('#test-title').text()).toEqual('title');
  });

  describe('customize icon', () => {
    it('element', () => {
      const withoutLoadData = render(
        <Tree defaultExpandAll>
          <TreeNode icon={<span className="cust-icon" />} />
        </Tree>,
      );
      expect(renderToJson(withoutLoadData)).toMatchSnapshot();
    });

    it('component', () => {
      const Icon = () => <span className="cust-icon" />;

      const withoutLoadData = render(
        <Tree defaultExpandAll>
          <TreeNode icon={Icon} />
        </Tree>,
      );
      expect(renderToJson(withoutLoadData)).toMatchSnapshot();
    });

    it('hide icon', () => {
      const withoutLoadData = render(
        <Tree showIcon={false} defaultExpandAll>
          <TreeNode icon={<span className="cust-icon" />} />
        </Tree>,
      );
      expect(renderToJson(withoutLoadData)).toMatchSnapshot();
    });

    it('get props when loading', () => {
      const then = jest.fn(() => Promise.resolve());
      const loadData = jest.fn(() => ({ then }));
      const iconFn = jest.fn(() => null);
      const wrapper = mount(
        <Tree loadData={loadData}>
          <TreeNode icon={iconFn} title="parent 1" key="0-0" />
        </Tree>,
      );

      wrapper.find('.rc-tree-switcher').simulate('click');

      expect(iconFn.mock.calls[0][0].loading).toBe(false);
      expect(iconFn.mock.calls[iconFn.mock.calls.length - 1][0].loading).toBe(true);
    });
  });

  describe('data and aria props', () => {
    it('renders data attributes on li', () => {
      const wrapper = render(
        <Tree defaultExpandAll>
          <TreeNode key="0-0" data-test="0-0">
            <TreeNode key="0-0-0" className="tree-node-cls" data-test="0-0-0">
              <TreeNode data-test="0-0-0-0" />
            </TreeNode>
            <TreeNode key="0-0-1" data-test="0-0-1" />
          </TreeNode>
          <TreeNode key="0-1" data-test="0-1" />
        </Tree>,
      );
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders aria attributes on li', () => {
      const wrapper = render(
        <Tree defaultExpandAll>
          <TreeNode key="0-0" aria-label="0-0">
            <TreeNode key="0-0-0" className="tree-node-cls" aria-label="0-0-0">
              <TreeNode aria-label="0-0-0-0" />
            </TreeNode>
            <TreeNode key="0-0-1" aria-label="0-0-1" />
          </TreeNode>
          <TreeNode key="0-1" aria-label="0-1" />
        </Tree>,
      );
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('selectable', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();

    const wrapper = mount(
      <Tree selectable onClick={onClick} onSelect={onSelect}>
        <TreeNode selectable={false} />
      </Tree>,
    );

    wrapper.find('.rc-tree-node-content-wrapper').simulate('click');

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
