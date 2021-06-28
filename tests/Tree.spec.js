/* eslint-disable no-undef, react/no-multi-comp, no-console,
react/no-unused-state, react/prop-types, no-return-assign, import/no-named-as-default-member */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { resetWarned } from 'rc-util/lib/warning';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import VirtualList from 'rc-virtual-list';
import Tree, { TreeNode } from '../src';
import { InternalTreeNode } from '../src/TreeNode';
import { objectMatcher, spyConsole, spyError } from './util';
import { convertNodePropsToEventData } from '../src/utils/treeUtil';

const OPEN_CLASSNAME = '.rc-tree-switcher_open';
const CHECKED_CLASSNAME = '.rc-tree-checkbox-checked';
const SELECTED_CLASSNAME = '.rc-tree-node-selected';

const delay = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

describe('Tree Basic', () => {
  spyConsole();

  it('TreeNode is in Tree', () => {
    expect(TreeNode).toBe(Tree.TreeNode);
  });

  it('renders correctly', () => {
    const wrapper = render(
      <Tree
        className="forTest"
        selectable
        checkable
        defaultExpandAll
        showIcon
        showLine
        multiple
        focusable
      >
        <TreeNode title="parent 1" key="0-0" className="spe">
          <TreeNode title="leaf 1" key="0-0-0" disabled>
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
            {null /* Supports conditional rendering */}
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>,
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('switcherIcon = null, no render rc-tree-switcher null', () => {
    const wrapper = mount(
      <Tree className="forTest" defaultExpandAll switcherIcon={() => false}>
        <TreeNode title="parent 1" key="0-0" className="spe">
          <TreeNode title="leaf 1" key="0-0-0" disabled>
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>,
    );
    wrapper.update();
    expect(wrapper.find('.rc-tree-switcher').exists()).toBeFalsy();
  });

  describe('expanded', () => {
    it('expands all keys', () => {
      const wrapper = mount(
        <Tree defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('expands default expanded keys', () => {
      const wrapper = mount(
        <Tree defaultExpandedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('controlled by expanded keys', () => {
      const wrapper = mount(
        <Tree expandedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const getSwitcher = () => wrapper.find('.rc-tree-switcher').first();
      expect(getSwitcher().is(OPEN_CLASSNAME)).toBe(false);
      wrapper.setProps({ expandedKeys: ['0-0'] });
      expect(getSwitcher().is(OPEN_CLASSNAME)).toBe(true);
    });

    it('expands parent node when child node is expanded', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );

      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('use treeData to expand the parent node when the parent node key type is numeric', () => {
      const Demo = () => (
        <Tree
          defaultExpandParent
          defaultExpandedKeys={[22]}
          treeData={[{ key: 11, title: 11, children: [{ key: 22, title: 22 }] }]}
        />
      );

      const wrapper = mount(<Demo />);

      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('does not expand parent node when autoExpandParent is false', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0']} defaultExpandParent={false}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );
      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(false);
    });

    it('update to expand parent node with autoExpandParent', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0']} defaultExpandParent={false}>
          <TreeNode title="parent 1" checkable={false} key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );
      let parentSwitcher = wrapper.find('.rc-tree-switcher').first();
      expect(parentSwitcher.is(OPEN_CLASSNAME)).toBe(false);

      wrapper.setProps({ autoExpandParent: true });

      parentSwitcher = wrapper.find('.rc-tree-switcher').first();
      const childSwitcher = wrapper.find('.rc-tree-switcher').at(1);
      expect(parentSwitcher.is(OPEN_CLASSNAME)).toBe(true);
      expect(childSwitcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('skip only if disabled with autoExpandParent', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0-0']} defaultExpandParent>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" disabled key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );

      expect(wrapper.state().expandedKeys.sort()).toEqual(['0-0-0', '0-0-0-0']);
    });

    it('fires expand event', () => {
      const handleExpand = jest.fn();
      const wrapper = mount(
        <Tree onExpand={handleExpand}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const switcher = wrapper.find('.rc-tree-switcher');

      let node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      switcher.simulate('click');
      expect(handleExpand).toHaveBeenCalledWith(['0-0'], {
        expanded: true,
        node,
        nativeEvent: expect.anything(),
      });

      node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      switcher.simulate('click');
      expect(handleExpand).toHaveBeenCalledWith([], {
        expanded: false,
        node,
        nativeEvent: expect.anything(),
      });
    });
  });

  describe('check', () => {
    it('basic render', () => {
      const wrapper = render(
        <Tree checkable defaultExpandAll>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" disabled />
            <TreeNode key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('checks default checked keys', () => {
      const wrapper = mount(
        <Tree checkable defaultCheckedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').forEach((checkbox) => {
        expect(checkbox.is(CHECKED_CLASSNAME)).toBe(true);
      });
    });

    it("ignore disabled children when calculate parent's checked status", () => {
      const wrapper = mount(
        <Tree checkable defaultCheckedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" disableCheckbox />
            <TreeNode title="leaf 1" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      const firstCheckboxClassNames = wrapper.find('.rc-tree-checkbox').instance().classList;
      expect([].slice.call(firstCheckboxClassNames).includes(CHECKED_CLASSNAME.slice(1))).toBe(
        false,
      );
    });

    it('controlled by checkedKeys', () => {
      const wrapper = mount(
        <Tree checkable checkedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const getCheckbox = () => wrapper.find('.rc-tree-checkbox');
      expect(getCheckbox().is(CHECKED_CLASSNAME)).toBe(false);
      wrapper.setProps({ checkedKeys: ['0-0'] });
      expect(getCheckbox().is(CHECKED_CLASSNAME)).toBe(true);
    });

    it('trurns parent node to checked when all children are checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.find('.rc-tree-checkbox').at(2).simulate('click');
      expect(wrapper.find('.rc-tree-checkbox').first().is(CHECKED_CLASSNAME)).toBe(true);
    });

    it('turns parent node to half checked when child is checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      expect(wrapper.find('.rc-tree-checkbox').first().is('.rc-tree-checkbox-indeterminate')).toBe(
        true,
      );
    });

    it('turns parent node to checked if it is half checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      wrapper.find('.rc-tree-checkbox').first().simulate('click');
      wrapper.find('.rc-tree-checkbox').forEach((checkbox) => {
        expect(checkbox.is(CHECKED_CLASSNAME)).toBe(true);
      });
    });

    it('fires check event', () => {
      const handleCheck = jest.fn();
      const wrapper = mount(
        <Tree checkable onCheck={handleCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');

      const nodeData00 = { title: 'parent 1', key: '0-0' };
      const nodeData000 = { title: 'leaf 1', key: '0-0-0' };

      let node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      wrapper.find('.rc-tree-checkbox').first().simulate('click');
      expect(handleCheck).toHaveBeenCalledWith(
        ['0-0', '0-0-0'],
        objectMatcher({
          checked: true,
          checkedNodes: [nodeData00, nodeData000],
          checkedNodesPositions: [
            { node: nodeData00, pos: '0-0' },
            { node: nodeData000, pos: '0-0-0' },
          ],
          event: 'check',
          halfCheckedKeys: [],
          node,
          nativeEvent: {},
        }),
      );

      node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).last().props());
      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      expect(handleCheck).toHaveBeenCalledWith(
        [],
        objectMatcher({
          checked: false,
          checkedNodes: [],
          checkedNodesPositions: [],
          event: 'check',
          halfCheckedKeys: [],
          node,
          nativeEvent: {},
        }),
      );
    });

    // https://github.com/react-component/tree/issues/117
    it('check works correctly after dragging children under another node', () => {
      const wrapper = mount(
        <Tree defaultExpandAll checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.setProps({
        children: (
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 2" key="0-0-1">
              <TreeNode title="leaf 1" key="0-0-0" />
            </TreeNode>
          </TreeNode>
        ),
      });
      expect(() => wrapper.find('.rc-tree-checkbox').at(2).simulate('click')).not.toThrow();
    });
    // https://github.com/react-component/tree/issues/90
    it('check works correctly after adding children dynamically', () => {
      const wrapper = mount(
        <Tree defaultExpandAll checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.setProps({
        children: (
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        ),
      });
      expect(() => wrapper.find('.rc-tree-checkbox').at(2).simulate('click')).not.toThrow();
    });

    // https://github.com/ant-design/ant-design/issues/7353
    it('check children after changing from children[disableCheckbox] from true to false', () => {
      let checkedKeys = null;
      const mockHandleCheck = (keys) => (checkedKeys = keys);
      function Test({ disableCheckbox }) {
        return (
          <Tree checkable onCheck={mockHandleCheck}>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="leaf 1" key="0-0-1" disableCheckbox={disableCheckbox} />
              <TreeNode title="leaf 2" key="0-0-2" disableCheckbox={disableCheckbox} />
              <TreeNode title="leaf 3" key="0-0-3" disableCheckbox={disableCheckbox} />
            </TreeNode>
          </Tree>
        );
      }
      const wrapper = mount(<Test disableCheckbox />);
      wrapper.find('.rc-tree-checkbox').first().simulate('click');
      expect(checkedKeys).toEqual(['0-0']);
      wrapper.setProps({ disableCheckbox: false });
      wrapper.find('.rc-tree-checkbox').first().simulate('click').simulate('click');
      expect(checkedKeys).toEqual(['0-0', '0-0-1', '0-0-2', '0-0-3']);
    });

    it('check dynamic children when their parent is checked', () => {
      function mockLoadData() {}
      const wrapper = mount(
        <Tree checkable defaultCheckedKeys={['0-0']} loadData={mockLoadData}>
          <TreeNode title="parent 1" key="0-0" />
        </Tree>,
      );
      wrapper.setProps({
        children: (
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        ),
      });
      expect(wrapper.state('checkedKeys')).toEqual(['0-0', '0-0-0', '0-0-1']);
    });

    // https://github.com/ant-design/ant-design/issues/10132
    it('check update when Tree trigger componentWillReceiveProps', () => {
      class Test extends React.Component {
        state = {};

        onCheck = () => {
          this.setState({ whatever: 1 });
        };

        render() {
          return (
            <Tree checkable>
              <TreeNode title="parent 1" key="0-0" />
            </Tree>
          );
        }
      }
      const wrapper = mount(<Test />);
      wrapper.find('.rc-tree-checkbox').first().simulate('click');

      expect(renderToJson(wrapper.render())).toMatchSnapshot();
    });

    describe('check after data ready', () => {
      const errorSpy = spyError();

      it('works', () => {
        const checkedKeys = ['0-0-0'];
        const wrapper = mount(<Tree checkable checkedKeys={checkedKeys} />);
        expect(errorSpy()).toHaveBeenCalledWith("Warning: Tree missing follow keys: '0-0-0'");

        wrapper.setProps({
          expandedKeys: ['0-0'],
          children: (
            <TreeNode key="0-0" title="Light">
              <TreeNode key="0-0-0" title="Bamboo" />
            </TreeNode>
          ),
        });

        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    it('should ignore !checkable node', () => {
      const onCheck = jest.fn();
      const wrapper = mount(
        <Tree checkable defaultExpandAll onCheck={onCheck}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" checkable={false} />
            <TreeNode key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      wrapper.find('.rc-tree-checkbox').last().simulate('click');

      expect(onCheck.mock.calls[0][0].sort()).toEqual(['0-0', '0-0-1']);
    });

    describe('strictly', () => {
      it('checks strictly', () => {
        const wrapper = mount(
          <Tree checkable checkStrictly>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="leaf 1" key="0-0-0" />
            </TreeNode>
          </Tree>,
        );
        wrapper.find('.rc-tree-switcher').simulate('click');
        wrapper.find('.rc-tree-checkbox').first().simulate('click');
        expect(wrapper.find('.rc-tree-checkbox').first().is(CHECKED_CLASSNAME)).toBe(true);
        expect(wrapper.find('.rc-tree-checkbox').last().is(CHECKED_CLASSNAME)).toBe(false);
      });

      describe('controlled mode', () => {
        class App extends React.Component {
          state = {
            checkedKeys: {
              checked: [],
              halfChecked: [],
            },
          };

          handleCheck = (checkedKeys) => {
            this.setState({ checkedKeys });
          };

          render() {
            return (
              <Tree
                checkable
                checkStrictly
                checkedKeys={this.state.checkedKeys}
                onCheck={this.handleCheck}
              >
                <TreeNode title="parent 1" key="0-0">
                  <TreeNode title="leaf 1" key="0-0-0" />
                </TreeNode>
              </Tree>
            );
          }
        }

        it('do not check children', () => {
          const wrapper = mount(<App />);
          wrapper.find('.rc-tree-switcher').simulate('click');
          wrapper.find('.rc-tree-checkbox').first().simulate('click');
          expect(wrapper.find('.rc-tree-checkbox').first().is(CHECKED_CLASSNAME)).toBe(true);
          expect(wrapper.find('.rc-tree-checkbox').last().is(CHECKED_CLASSNAME)).toBe(false);
        });

        it('do not uncheck parent', () => {
          const wrapper = mount(<App />);
          wrapper.setState({
            checkedKeys: { checked: ['0-0', '0-0-0'], halfChecked: [] },
          });
          wrapper.find('.rc-tree-switcher').simulate('click');
          wrapper.find('.rc-tree-checkbox').last().simulate('click');
          expect(wrapper.find('.rc-tree-checkbox').first().is(CHECKED_CLASSNAME)).toBe(true);
          expect(wrapper.find('.rc-tree-checkbox').last().is(CHECKED_CLASSNAME)).toBe(false);
        });
      });
    });

    // https://github.com/ant-design/ant-design/issues/6891
    it('should ignore disableCheckbox children items when check parent', () => {
      const wrapper = mount(
        <Tree checkable defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0" disableCheckbox>
              <TreeNode title="node" key="0-0-0-0" disableCheckbox />
              <TreeNode title="node" key="0-0-0-1" disableCheckbox />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );

      const firstNode = () => wrapper.find('.rc-tree-checkbox').first();
      firstNode().simulate('click');

      expect(firstNode().hasClass('rc-tree-checkbox-checked')).toBe(true);
      expect(firstNode().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(wrapper.state().checkedKeys.slice().sort()).toEqual(['0-0-1', '0-0-2', '0-0'].sort());

      firstNode().simulate('click');
      expect(firstNode().hasClass('rc-tree-checkbox-checked')).toBe(false);
      expect(firstNode().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(wrapper.state().checkedKeys).toEqual([]);
    });

    it('should ignore disabled children items when check parent', () => {
      const wrapper = mount(
        <Tree checkable defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0" disabled>
              <TreeNode title="node" key="0-0-0-0" disabled />
              <TreeNode title="node" key="0-0-0-1" disabled />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );

      const firstNode = () => wrapper.find(TreeNode).first().find('.rc-tree-checkbox').first();

      firstNode().simulate('click');
      expect(firstNode().hasClass('rc-tree-checkbox-checked')).toBe(true);
      expect(firstNode().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(wrapper.state().checkedKeys.slice().sort()).toEqual(['0-0-1', '0-0-2', '0-0'].sort());

      firstNode().simulate('click');
      expect(firstNode().hasClass('rc-tree-checkbox-checked')).toBe(false);
      expect(firstNode().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(wrapper.state().checkedKeys).toEqual([]);
    });

    // https://github.com/react-component/tree/pull/106#issuecomment-316779889
    it('should render parent check state correctly', () => {
      const wrapper = mount(
        <Tree checkable defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0">
              <TreeNode title="node" key="0-0-0-0" />
              <TreeNode title="node" key="0-0-0-1" disableCheckbox />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );
      const getParent = () => wrapper.find(TreeNode).at(1).find('.rc-tree-checkbox').first();
      const getNode = () => wrapper.find(TreeNode).at(2).find('.rc-tree-checkbox').first();

      getNode().simulate('click');
      expect(getNode().hasClass('rc-tree-checkbox-checked')).toBe(true);
      expect(getParent().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(getParent().hasClass('rc-tree-checkbox-checked')).toBe(true);
      getNode().simulate('click');
      expect(getNode().hasClass('rc-tree-checkbox-checked')).toBe(false);
      expect(getParent().hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
      expect(getParent().hasClass('rc-tree-checkbox-checked')).toBe(false);
    });
  });

  describe('select', () => {
    it('selects default selected keys', () => {
      const wrapper = mount(
        <Tree selectable defaultSelectedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      expect(wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)).toBe(true);
    });

    it('controlled by selectedKeys', () => {
      const wrapper = mount(
        <Tree selectable selectedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      expect(wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)).toBe(false);
      wrapper.setProps({ selectedKeys: ['0-0'] });
      expect(wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)).toBe(true);
    });

    it('fires select event', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(
        <Tree selectable onSelect={handleSelect}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const nodeContent = wrapper.find('.rc-tree-node-content-wrapper');

      let node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      nodeContent.simulate('click');
      expect(handleSelect).toHaveBeenCalledWith(
        ['0-0'],
        objectMatcher({
          event: 'select',
          node,
          selected: true,
          selectedNodes: [{ title: 'parent 1', key: '0-0' }],
          nativeEvent: {},
        }),
      );

      node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      nodeContent.simulate('click');
      expect(handleSelect).toHaveBeenCalledWith(
        [],
        objectMatcher({
          event: 'select',
          node,
          selected: false,
          selectedNodes: [],
          nativeEvent: {},
        }),
      );
    });
  });

  describe('checkable but not selectable', () => {
    it('fires check event when click on TreeNode', () => {
      const handleCheck = jest.fn();
      const wrapper = mount(
        <Tree checkable selectable={false} onCheck={handleCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      wrapper.find('.rc-tree-switcher').simulate('click');

      const dataNode1 = { title: 'parent 1', key: '0-0' };
      const dataNode2 = { title: 'leaf 1', key: '0-0-0' };

      let node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).first().props());
      wrapper.find('.rc-tree-node-content-wrapper').first().simulate('click');
      expect(handleCheck).toHaveBeenCalledWith(
        ['0-0', '0-0-0'],
        objectMatcher({
          checked: true,
          checkedNodes: [dataNode1, dataNode2],
          checkedNodesPositions: [
            { node: dataNode1, pos: '0-0' },
            { node: dataNode2, pos: '0-0-0' },
          ],
          event: 'check',
          halfCheckedKeys: [],
          node,
          nativeEvent: {},
        }),
      );

      node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).last().props());
      wrapper.find('.rc-tree-node-content-wrapper').last().simulate('click');
      expect(handleCheck).toHaveBeenCalledWith(
        [],
        objectMatcher({
          checked: false,
          checkedNodes: [],
          checkedNodesPositions: [],
          event: 'check',
          halfCheckedKeys: [],
          node,
          nativeEvent: {},
        }),
      );
    });
  });

  it('fires rightClick event', () => {
    const handleRightClick = jest.fn();
    const wrapper = mount(
      <Tree onRightClick={handleRightClick}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).props());
    wrapper.find('.rc-tree-node-content-wrapper').simulate('contextMenu');
    expect(handleRightClick.mock.calls[0][0].node).toEqual(node);
  });

  it('fires rightClick should not change selected item', () => {
    const handleRightClick = jest.fn();
    const wrapper = mount(
      <Tree onRightClick={handleRightClick}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    wrapper.find('.rc-tree-node-content-wrapper').simulate('contextMenu');
    expect(wrapper.state().selectedKeys.length).toBe(0);
  });

  it('fires mouseEnter events', () => {
    const handleMouseEnter = jest.fn();
    const wrapper = mount(
      <Tree onMouseEnter={handleMouseEnter}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).props());
    wrapper.find('.rc-tree-node-content-wrapper').simulate('mouseEnter');
    expect(handleMouseEnter.mock.calls[0][0].node).toEqual(node);
  });

  it('fires mouseLeave events', () => {
    const handleMouseLeave = jest.fn();
    const wrapper = mount(
      <Tree onMouseLeave={handleMouseLeave}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).props());
    wrapper.find('.rc-tree-node-content-wrapper').simulate('mouseLeave');
    expect(handleMouseLeave.mock.calls[0][0].node).toEqual(node);
  });

  it('filters nodes', () => {
    function filterTreeNode(treeNode) {
      return treeNode.title.indexOf('parent') > -1;
    }
    const wrapper = mount(
      <Tree filterTreeNode={filterTreeNode}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="meck" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>,
    );

    expect(wrapper.find(InternalTreeNode).find('div').is('.filter-node')).toBe(true);
  });

  it('loads nodes asynchronously', () => {
    const then = jest.fn(() => Promise.resolve());
    const loadData = jest.fn(() => ({ then }));
    const wrapper = mount(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );
    const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).props());
    wrapper.find('.rc-tree-switcher').simulate('click');
    expect(loadData).toHaveBeenCalledWith(node);
    expect(then).toHaveBeenCalled();
  });

  describe('drag and drop', () => {
    function createTree(props) {
      return (
        <Tree draggable defaultExpandAll {...props}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode className="dragTarget" title="leaf" key="0-0-0-0" />
            <TreeNode className="dropTarget" title="leaf" key="0-0-0-1" />
          </TreeNode>
        </Tree>
      );
    }

    it('fires dragStart event', () => {
      const onDragStart = jest.fn();
      const wrapper = mount(createTree({ onDragStart }));
      const treeNode = wrapper.find('.dragTarget > .rc-tree-node-content-wrapper');
      const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(1).props());
      treeNode.simulate('dragStart');
      const event = onDragStart.mock.calls[0][0];
      expect(event.node).toEqual(node);
    });

    it('fires dragEnter event', async () => {
      const onDragEnter = jest.fn();
      const wrapper = mount(createTree({ onDragEnter }));

      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');

      // Not trigger self
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragEnter');
      await delay(900);
      expect(onDragEnter).not.toHaveBeenCalled();

      wrapper.find('.dropTarget').at(0).simulate('dragEnter');
      expect(onDragEnter).toHaveBeenCalled();

      await delay(900);
      wrapper.update();
      const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(2).props());
      const event = onDragEnter.mock.calls[0][0];
      expect(event.node.key).toEqual(node.key);
      expect(event.expandedKeys).toEqual(['0-0', '0-0-0-1']);
      expect(onDragEnter).toHaveBeenCalledTimes(1);
    });

    it('fires dragOver event', () => {
      const onDragOver = jest.fn();
      const wrapper = mount(createTree({ onDragOver }));
      const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(2).props());
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
      wrapper.find('.dropTarget').at(0).simulate('dragOver');
      const event = onDragOver.mock.calls[0][0];
      expect(event.node).toEqual(node);
    });

    it('fires dragLeave event', () => {
      const onDragLeave = jest.fn();
      const wrapper = mount(createTree({ onDragLeave }));
      const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(2).props());
      wrapper.find('.dropTarget').at(0).simulate('dragLeave');
      const event = onDragLeave.mock.calls[0][0];
      expect(event.node).toEqual(node);
    });

    it('fires drop event', () => {
      const onDrop = jest.fn();
      const wrapper = mount(createTree({ onDrop }));
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
      wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter');
      wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver');
      const dropNode = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(2).props());
      const dragNode = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(1).props());
      wrapper.find('.dropTarget').at(0).simulate('drop');
      const event = onDrop.mock.calls[0][0];
      expect(event.node).toEqual(dropNode);
      expect(event.dragNode).toEqual(dragNode);
      expect(event.dragNodesKeys).toEqual(['0-0-0-0']);
    });

    it('fires dropEnd event', () => {
      const onDragEnd = jest.fn();
      const wrapper = mount(createTree({ onDragEnd }));
      const node = convertNodePropsToEventData(wrapper.find(InternalTreeNode).at(1).props());
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragEnd');
      const event = onDragEnd.mock.calls[0][0];
      expect(event.node).toEqual(node);
    });

    it('do not throw error when drag into another non-drag-able tree', () => {
      const wrapper = mount(
        <div>
          {createTree()}
          {createTree({ draggable: false })}
        </div>,
      );

      const dragTree = wrapper.find(Tree).at(0);
      const normalTree = wrapper.find(Tree).at(1);

      dragTree.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
      normalTree.find('.dropTarget').at(0).simulate('dragEnter');
      normalTree.find('.dropTarget').at(0).simulate('dragOver');
      normalTree.find('.dropTarget').at(0).simulate('drop');
    });

    describe('full steps', () => {
      function dropTarget(targetSelector) {
        return new Promise((resolve) => {
          const wrapper = mount(
            <Tree draggable={() => true} defaultExpandAll onExpand={() => {}}>
              <TreeNode key="0-0" className="dragTarget">
                <TreeNode key="0-0-0" className="dragTargetChild" />
              </TreeNode>
              <TreeNode key="0-1">
                <TreeNode key="0-1-0" />
              </TreeNode>
              <TreeNode key="0-2" className="dropTarget">
                <TreeNode key="0-2-0" />
              </TreeNode>
            </Tree>,
          );

          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');

          // 1. Move into target (first in the middle of the node)
          wrapper.find(targetSelector).simulate('dragEnter', { clientY: 10 });
          setTimeout(() => {
            wrapper.find(targetSelector).simulate('dragOver', { clientY: 999 });

            // 2. Move out of target
            wrapper.find(targetSelector).simulate('dragLeave');

            // 3. Move in again
            wrapper.find(targetSelector).simulate('dragEnter', { clientY: 0 });
            setTimeout(() => {
              wrapper.find(targetSelector).simulate('dragOver', { clientY: 999 });
              // 4. Drop
              wrapper.find(targetSelector).simulate('drop');
              wrapper.find('div.dragTarget').simulate('dragEnd');

              resolve();
            }, 1000);
          }, 10);
        });
      }
      let domSpy;
      beforeEach(() => {
        domSpy = spyElementPrototypes(HTMLElement, {
          offsetWidth: {
            get() {
              return 24;
            },
          },
          getBoundingClientRect: jest.fn(() => ({
            width: 100,
            height: 20,
            top: 0,
            left: 0,
            bottom: 20,
            right: 100,
          })),
        });
        // Object.defineProperties(window.HTMLElement.prototype, {
        //   // mock indent as 24
        //   // no need for clearing it, since jest make each file a independent env
        //   offsetWidth: {
        //     get() {
        //       return 24;
        //     },
        //   },
        // });
      });

      afterEach(() => {
        domSpy.mockRestore();
      });

      it('self', () => dropTarget('div.dragTarget'));

      it('target', () => dropTarget('div.dropTarget'));
    });

    describe('new drop logic', () => {
      let domSpy;
      beforeEach(() => {
        domSpy = spyElementPrototypes(HTMLElement, {
          getBoundingClientRect: () => ({
            width: 100,
            height: 20,
            top: 0,
            left: 0,
            bottom: 20,
            right: 100,
          }),
          offsetWidth: {
            get() {
              return 24;
            },
          },
        });
      });
      afterEach(() => {
        domSpy.mockRestore();
      });
      ['ltr', 'rtl'].forEach((dir) => {
        const base = dir === 'ltr' ? 1 : -1;
        it('not allow cross level dnd on expanded nodes', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable onDrop={onDrop} direction={dir} expandedKeys={['0-0', '0-1', '0-1-0']}>
              <TreeNode key="0-0">
                <TreeNode key="0-0-0" className="dropTarget1">
                  <TreeNode key="0-0-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-1">
                <TreeNode key="0-1-0" className="dropTarget2">
                  <TreeNode key="0-1-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-2" className="dragTarget" />
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget1 > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget1 > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget1 > .rc-tree-node-content-wrapper').simulate('drop');
          // insert after 0-0, since 0-0-0 is not expanded
          expect(onDrop.mock.calls[0][0].node.key).toEqual('0-0');
          expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget2 > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget2 > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget2 > .rc-tree-node-content-wrapper').simulate('drop');
          // insert into 0-1-0, since it is expanded, do not allow cross level dnd
          expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0');
          expect(onDrop.mock.calls[1][0].dropPosition).toEqual(0);
        });
        it('allowDrop all nodes', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-1">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" className="dropTarget" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-2" />
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1-0-0');
          // (in ltr) drag from right to left, should be insert after, so drop position is 1
          expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[1][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[2][0].dropPosition).toEqual(0);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[2][0].dropPosition).toEqual(0);
        });
        it('allowDrop no node', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree
              draggable
              defaultExpandAll
              onDrop={onDrop}
              allowDrop={() => false}
              direction={dir}
            >
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-1">
                <TreeNode key="0-1-0" className="dropTargetParent">
                  <TreeNode key="0-1-0-0" className="dropTarget" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-2" />
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTargetParent > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTargetParent > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTargetParent > .rc-tree-node-content-wrapper').simulate('drop');
          // not allow any dropPosition except 0 on expanded node
          expect(onDrop).not.toHaveBeenCalled();
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).not.toHaveBeenCalled();
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).not.toHaveBeenCalled();
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).not.toHaveBeenCalled();
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).not.toHaveBeenCalled();
        });
        it('drop to top half of first node', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-1" className="dropTarget">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 0,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: -1000,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1');
          expect(onDrop.mock.calls[0][0].dropPosition).toEqual(-1);
        });
        it('can drop on its direct parent', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-1" className="dropTarget">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dragTargetParent > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dragTargetParent > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dragTargetParent > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).toHaveBeenCalled();
        });
        it('cover window dragend & componentWillUnmount', () => {
          const wrapper = mount(
            <Tree draggable defaultExpandAll direction={dir}>
              <TreeNode key="0-1" className="dropTarget">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          window.dispatchEvent(new Event('dragend'));
          expect(wrapper.instance().state.dragging).toEqual(false);
          wrapper.unmount();
        });
        it('dragover first half of non-first child', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
                <TreeNode key="0-0-1" />
                <TreeNode key="0-0-2" className="dropTarget" />
              </TreeNode>
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 500,
            clientY: 1,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 500,
            clientY: 1,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[0][0].node.key).toEqual('0-0-1');
          expect(onDrop.mock.calls[0][0].dropPosition).toEqual(2);
        });
        it('dragover self', () => {
          const onDrop = jest.fn();
          const wrapper = mount(
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-1" className="dropTarget">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-0" className="dragTargetParent">
                <TreeNode key="0-0-0" className="dragTarget">
                  <TreeNode key="0-0-0-0" className="dragTargetChild" />
                </TreeNode>
              </TreeNode>
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 500,
          });
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 500,
          });
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 500,
          });
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 500,
          });
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop).not.toHaveBeenCalled();
        });
        it('not allowDrop on node which has children', () => {
          const onDrop = jest.fn();
          const allowDrop = ({ dropNode, dropPosition }) => {
            if (!dropNode.children) {
              if (dropPosition === 0) return false;
            }
            return true;
          };
          const wrapper = mount(
            <Tree draggable defaultExpandAll allowDrop={allowDrop} onDrop={onDrop} direction={dir}>
              <TreeNode key="0-0" className="dragTarget">
                <TreeNode key="0-0-0" className="dragTargetChild" />
              </TreeNode>
              <TreeNode key="0-1">
                <TreeNode key="0-1-0">
                  <TreeNode key="0-1-0-0" className="dropTarget" />
                </TreeNode>
              </TreeNode>
              <TreeNode key="0-2" />
            </Tree>,
          );
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 400,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1-0-0');
          // (in ltr) drag from right to left, should be insert after, so drop position is 1
          expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 500,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[1][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 550,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[2][0].dropPosition).toEqual(1);
          wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
            clientX: base * 500,
            clientY: 500,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
            clientX: base * 600,
            clientY: 600,
          });
          wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
          expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
          expect(onDrop.mock.calls[2][0].dropPosition).toEqual(1);
        });
      });
    });
  });

  it('renders without errors', () => {
    expect(() => {
      mount(
        <Tree>
          {[0, 1].map((i) => (
            <TreeNode title={i} key={i}>
              {[2, 3].map((j) => (
                <TreeNode title={j} key={`${i}_${j}`} />
              ))}
              <TreeNode title="4" key={`${i}_4`} />
            </TreeNode>
          ))}
        </Tree>,
      );
    }).not.toThrow();
  });

  it('renders opaque children correctly', () => {
    const wrapper = render(
      <Tree>
        <TreeNode title="0" key="0">
          {[1, 2].map((i) => (
            <TreeNode title={i} key={i} />
          ))}
          <TreeNode title="3" key="3" />
        </TreeNode>
      </Tree>,
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  describe('ignore illegal node as Tree children', () => {
    const errorSpy = spyError();

    it('Direct TreeNode', () => {
      const wrapper = mount(
        <Tree defaultExpandAll>
          <TreeNode key="00" title="00" />
          <span>Hide Me</span>
          <TreeNode key="02" title="02" />
        </Tree>,
      );
      expect(wrapper.render()).toMatchSnapshot();
      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: Tree/TreeNode can only accept TreeNode as children.',
      );
    });

    it('Sub TreeNode', () => {
      resetWarned();
      const wrapper = mount(
        <Tree defaultExpandAll>
          <TreeNode key="00" title="00" />
          <TreeNode key="01" title="01">
            <TreeNode key="010" title="010" />
            <span>I AM INVISIBLE</span>
            <TreeNode key="012" title="012" />
          </TreeNode>
        </Tree>,
      );
      expect(wrapper.render()).toMatchSnapshot();
      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: Tree/TreeNode can only accept TreeNode as children.',
      );
    });
  });

  it('Number key', () => {
    const onCheck = jest.fn();

    const Demo = () => {
      const [checkedKeys, setCheckedKeys] = React.useState([]);

      return (
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={(keys) => {
            setCheckedKeys(keys);
            onCheck(keys);
          }}
          treeData={[{ key: 11, title: 11, children: [{ key: 22, title: 22 }] }]}
        />
      );
    };

    const wrapper = mount(<Demo />);
    wrapper.update();

    wrapper.find('.rc-tree-checkbox').first().simulate('click');
    expect(onCheck).toHaveBeenCalledWith([11, 22]);

    onCheck.mockReset();
    wrapper.find('.rc-tree-checkbox').last().simulate('click');
    expect(onCheck).toHaveBeenCalledWith([]);
  });

  describe('scrollTo should work', () => {
    let domSpy;
    let called = false;

    beforeAll(() => {
      domSpy = spyElementPrototypes(HTMLDivElement, {
        scrollTop: {
          get: () => 233,
          set: () => {
            called = true;
          },
        },
        clientHeight: {
          get: () => 100,
        },
      });
    });

    afterAll(() => {
      domSpy.mockRestore();
    });

    it('work', () => {
      jest.useFakeTimers();
      const wrapper = mount(<Tree />);

      wrapper.instance().scrollTo({ key: 'light', align: 'top' });
      jest.runAllTimers();

      expect(called).toBeTruthy();
      jest.useRealTimers();
    });
  });

  it('not crash if expandedKeys is null', () => {
    mount(
      <Tree expandedKeys={null}>
        <TreeNode key="test" title="alive" />
      </Tree>,
    );
  });

  it('not crash if expandedKeys change to undefined', () => {
    const wrapper = mount(
      <Tree expandedKeys={['light']}>
        <TreeNode key="light" title="light">
          <TreeNode key="bamboo" title="bamboo" />
        </TreeNode>
      </Tree>,
    );
    const { data } = wrapper.find(VirtualList).props();
    expect(data).toHaveLength(2);

    wrapper.setProps({ expandedKeys: undefined });

    // Click should not crash
    wrapper.find('.rc-tree-switcher').first().simulate('click');
  });

  it('controlled should block expanded', () => {
    const wrapper = mount(
      <Tree
        expandedKeys={['1']}
        treeData={[{ key: '1', title: 1, children: [{ key: '2', title: 2 }] }]}
      />,
    );

    wrapper.find('.rc-tree-switcher').first().simulate('click');
    expect(wrapper.find('List').props().data).toHaveLength(2);
  });

  it('support virtual', () => {
    const data = [];
    for (let i = 0; i < 99; i += 1) {
      data.push({
        key: i,
        title: i,
      });
    }

    const wrapper = mount(<Tree itemHeight={10} height={100} treeData={data} virtual={false} />);

    expect(wrapper.find('List').props().virtual).toBe(false);
  });

  // https://github.com/ant-design/ant-design/issues/28349
  it('should not trigger expend when loading data', () => {
    const then = jest.fn(() => Promise.resolve());
    const loadData = jest.fn(() => ({ then }));
    const onExpand = jest.fn();
    const wrapper = mount(
      <Tree loadData={loadData} onExpand={onExpand}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );

    // trigger click to expand node
    wrapper.find('.rc-tree-switcher').simulate('click');
    expect(wrapper.find('.rc-tree-switcher').first().is(OPEN_CLASSNAME)).toBe(true);
    expect(onExpand).toBeCalled();

    // click again
    onExpand.mockReset();
    wrapper.find('.rc-tree-switcher').simulate('click');
    expect(wrapper.find('.rc-tree-switcher').first().is(OPEN_CLASSNAME)).toBe(true);
    expect(onExpand).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/31141
  it('should restore tree node loading and expand status when loadData fail', async () => {
    const loadData = () => new Promise((_, reject) => setTimeout(reject));
    const wrapper = mount(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );
    // trigger click to expand node
    wrapper.find('.rc-tree-switcher').simulate('click');
    expect(
      wrapper.find('.rc-tree-switcher').getDOMNode().className.includes('rc-tree-switcher_open'),
    ).toBe(true);
    await delay();
    expect(
      wrapper.find('.rc-tree-switcher').getDOMNode().className.includes('rc-tree-switcher_close'),
    ).toBe(true);
  });
});
