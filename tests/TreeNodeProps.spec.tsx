/* eslint-disable no-undef */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    const { container } = render(
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
    expect(container.firstChild).toMatchSnapshot();
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
    expect(withoutLoadData.container.firstChild).toMatchSnapshot();

    const withLoadData = render(
      <Tree defaultExpandAll>
        <TreeNode isLeaf>
          <TreeNode isLeaf />
        </TreeNode>
      </Tree>,
    );
    expect(withLoadData.container.firstChild).toMatchSnapshot();

    const forceNoLeaf = render(
      <Tree defaultExpandAll>
        <TreeNode>
          <TreeNode isLeaf={false} />
        </TreeNode>
      </Tree>,
    );
    expect(forceNoLeaf.container.firstChild).toMatchSnapshot();
  });

  it('title function', () => {
    const { container } = render(
      <Tree defaultExpandAll>
        <TreeNode title={() => <a id="test-title">title</a>} />
      </Tree>,
    );
    expect(container.querySelector('#test-title').textContent).toEqual('title');
  });

  describe('customize icon', () => {
    it('element', () => {
      const withoutLoadData = render(
        <Tree defaultExpandAll>
          <TreeNode icon={<span className="cust-icon" />} />
        </Tree>,
      );
      expect(withoutLoadData.container.firstChild).toMatchSnapshot();
    });

    it('component', () => {
      const Icon = () => <span className="cust-icon" />;

      const withoutLoadData = render(
        <Tree defaultExpandAll>
          <TreeNode icon={Icon} />
        </Tree>,
      );
      expect(withoutLoadData.container.firstChild).toMatchSnapshot();
    });

    it('hide icon', () => {
      const withoutLoadData = render(
        <Tree showIcon={false} defaultExpandAll>
          <TreeNode icon={<span className="cust-icon" />} />
        </Tree>,
      );
      expect(withoutLoadData.container.firstChild).toMatchSnapshot();
    });

    it('get props when loading', () => {
      const then = jest.fn(() => Promise.resolve());
      const loadData: any = jest.fn(() => ({ then }));
      const iconFn: any = jest.fn(() => null);
      const { container } = render(
        <Tree loadData={loadData}>
          <TreeNode icon={iconFn} title="parent 1" key="0-0" />
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      expect(iconFn.mock.calls[0][0].loading).toBe(false);
      expect(iconFn.mock.calls[iconFn.mock.calls.length - 1][0].loading).toBeTruthy();
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
      expect(wrapper.container.firstChild).toMatchSnapshot();
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
      expect(wrapper.container.firstChild).toMatchSnapshot();
    });
  });

  it('selectable', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();

    const { container } = render(
      <Tree selectable onClick={onClick} onSelect={onSelect}>
        <TreeNode selectable={false} />
      </Tree>,
    );

    fireEvent.click(container.querySelector('.rc-tree-node-content-wrapper'));

    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('unselectable', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();

    class Demo extends React.Component {
      state = {
        treeSelectable: false,
        treeNodeSelectable: false,
      };

      render() {
        return (
          <div>
            <Tree selectable={this.state.treeSelectable} onClick={onClick} onSelect={onSelect}>
              <TreeNode />
              <TreeNode selectable={this.state.treeNodeSelectable} />
            </Tree>
            <button
              className="test-button"
              onClick={() => {
                this.setState({
                  treeSelectable: true,
                  treeNodeSelectable: false,
                });
              }}
            />
          </div>
        );
      }
    }

    const { container } = render(<Demo />);
    // tree selectable is false ,then children should be selectable = false if not set selectable alone.
    expect(container.querySelectorAll('[aria-selected=false]')).toHaveLength(1);

    fireEvent.click(container.querySelector('.rc-tree-node-content-wrapper'));
    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();

    // only set tree node use state.
    fireEvent.click(container.querySelector('.test-button'));
    onClick.mockRestore();
    onSelect.mockRestore();
    expect(container.querySelectorAll('[aria-selected=false]')).toHaveLength(1);
    fireEvent.click(container.querySelectorAll('.rc-tree-node-content-wrapper')[1]);
    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
