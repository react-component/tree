/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree, { TreeNode } from '..';

/**
 * For refactor purpose. All the props should be passed by test
 */

// Promisify timeout to let jest catch works
function timeoutPromise(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

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
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      // un-select leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith([], {
        event: 'select',
        selected: false,
        node: targetNode.instance(),
        selectedNodes: [],
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      // Select leaf and then parent
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      parentNode.find('.rc-tree-node-content-wrapper').first().simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0'], {
        event: 'select',
        selected: true,
        node: parentNode.instance(),
        selectedNodes: [withSelectable.find(Tree).props().children],
        nativeEvent: expect.objectContaining({}),
      });
    });
  });

  // multiple - this prop works with selectable
  it('multiple', () => {
    const handleOnSelect = jest.fn();

    const multipleBase = (
      <Tree
        onSelect={handleOnSelect}
        defaultExpandAll
        multiple
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(render(multipleBase))).toMatchSnapshot();

    const wrapper = mount(multipleBase);
    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Leaf select
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
      event: 'select',
      selected: true,
      node: targetNode.instance(),
      selectedNodes: [parentNode.props().children],
      nativeEvent: expect.objectContaining({}),
    });
    handleOnSelect.mockReset();

    // Parent select
    parentNode.find('.rc-tree-node-content-wrapper').first().simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
      event: 'select',
      selected: true,
      node: parentNode.instance(),
      selectedNodes: [wrapper.find(Tree).props().children, parentNode.props().children],
      nativeEvent: expect.objectContaining({}),
    }));
    handleOnSelect.mockReset();

    // Leaf un-select
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0'], {
      event: 'select',
      selected: false,
      node: targetNode.instance(),
      selectedNodes: [wrapper.find(Tree).props().children],
      nativeEvent: expect.objectContaining({}),
    });
  });

  // checkable
  describe('checkable', () => {
    it('default', () => {
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
        nativeEvent: expect.objectContaining({}),
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
        checkedNodes: [withCheckable.find(Tree).props().children, parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      }));
      expect(handleOnSelect).not.toBeCalled();
    });

    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const withCheckableBase = (
        <Tree
          onSelect={handleOnSelect}
          onCheck={handleOnCheck}
          defaultExpandedKeys={['0-0']}
          selectable={false}
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
      expect(handleOnCheck).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
        event: 'check',
        checked: true,
        node: targetNode.instance(),
        checkedNodes: [withCheckable.find(Tree).props().children, parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      }));
      expect(handleOnSelect).not.toBeCalled();
    });
  });

  // checkStrictly
  it('checkStrictly', () => {
    const handleOnCheck = jest.fn();

    const withCheckStrictlyBase = (
      <Tree
        onCheck={handleOnCheck}
        defaultExpandedKeys={['0-0']}
        checkable
        checkStrictly
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(render(withCheckStrictlyBase))).toMatchSnapshot();

    const withCheckStrictly = mount(withCheckStrictlyBase);
    const parentNode = withCheckStrictly.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Click Leaf
    targetNode.find('.rc-tree-checkbox').simulate('click');
    expect(handleOnCheck).toBeCalledWith({
      checked: ['0-0-0'],
      halfChecked: [],
    }, expect.objectContaining({
      event: 'check',
      checked: true,
      node: targetNode.instance(),
      checkedNodes: [parentNode.props().children],
      nativeEvent: expect.objectContaining({}),
    }));
  });

  // draggable - is already full test in Tree.spec.js
  // autoExpandParent - is already full test in Tree.spec.js

  // defaultExpandAll
  it('defaultExpandAll', () => {
    const wrapper = render(
      <Tree defaultExpandAll>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  // defaultCheckedKeys - is already full test in Tree.spec.js
  // defaultSelectedKeys - is already full test in Tree.spec.js

  it('loadData', () => {
    let called = 0;

    const handleLoadData = jest.fn();

    class Demo extends React.Component {
      state = {
        loaded: false,
      };

      loadData = (...args) => {
        called += 1;
        handleLoadData(...args);

        this.setState({ loaded: true });

        return Promise.resolve();
      };

      render() {
        return (
          <Tree loadData={this.loadData}>
            <TreeNode key="0-0">
              {this.state.loaded ? <TreeNode key="0-0-0" /> : null}
            </TreeNode>
          </Tree>
        );
      }
    }

    const wrapper = mount(<Demo />);

    expect(handleLoadData).not.toBeCalled();

    const switcher = wrapper.find('.rc-tree-switcher');
    const node = wrapper.find(TreeNode).instance();
    switcher.simulate('click');

    return timeoutPromise().then(() => {
      expect(handleLoadData).toBeCalledWith(node);
      expect(called).toBe(1);
      expect(renderToJson(wrapper.render())).toMatchSnapshot();
    });
  });

  it('icon', () => {
    // Node icon has much higher priority
    const wrapper = render(
      <Tree defaultExpandAll icon={<span>ROOT ICON</span>}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" icon={<span>CUSTOMIZE ICON</span>} />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('onClick', () => {
    const onClick = jest.fn();

    const wrapper = mount(
      <Tree onClick={onClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Select leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

    expect(onClick).toBeCalledWith(
      expect.objectContaining({}),
      targetNode.instance(),
    );
  });

  it('onDoubleClick', () => {
    const onClick = jest.fn();
    const onDoubleClick = jest.fn();

    const wrapper = mount(
      <Tree onClick={onClick} onDoubleClick={onDoubleClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Select leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('doubleclick');

    expect(onClick).not.toBeCalled();
    expect(onDoubleClick).toBeCalledWith(
      expect.objectContaining({}),
      targetNode.instance(),
    );
  });

  describe('loadedKeys & onLoad', () => {
    it('has loadedKeys', () => {
      const loadData = jest.fn(() => Promise.resolve());
      const onLoad = jest.fn();

      const wrapper = mount(
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad}>
          <TreeNode key="0-0" />
        </Tree>
      );

      wrapper.find('.rc-tree-switcher').simulate('click');
      expect(loadData).not.toBeCalled();
      expect(onLoad).not.toBeCalled();
    });

    it('reset loadedKeys', () => {
      class FakePromise {
        constructor(val) {
          this.val = val;
        }
        then = (func) => {
          const ret = func(this.val);
          return new FakePromise(ret);
        }
      }

      let wrapper;

      const loadData = jest.fn(() => new FakePromise());
      const onLoad = jest.fn(() => {
        wrapper.setProps({ loadedKeys: ['0-0'] });
      });

      wrapper = mount(
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad}>
          <TreeNode key="0-0" />
        </Tree>
      );
      wrapper.setProps({ loadedKeys: [] });
      wrapper.find('.rc-tree-switcher').simulate('click');
      expect(loadData).toBeCalledWith(wrapper.find(TreeNode).instance());
      expect(onLoad).toBeCalledWith(['0-0'], {
        event: 'load',
        node: wrapper.find(TreeNode).instance(),
      });
    });
  });
});
