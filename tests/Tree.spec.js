/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Tree from '..';

const { TreeNode } = Tree;

const OPEN_CLASSNAME = '.rc-tree-switcher_open';
const CHECKED_CLASSNAME = '.rc-tree-checkbox-checked';
const SELECTED_CLASSNAME = '.rc-tree-node-selected';

describe('Tree', () => {
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
            <TreeNode title="leaf" key="random"/>
            <TreeNode title="leaf"/>
            {null /* Supports conditional rendering */}
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  describe('expanded', () => {
    it('expands all keys', () => {
      const wrapper = mount(
        <Tree defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
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
        </Tree>
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
        </Tree>
      );
      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(false);
      wrapper.setProps({ expandedKeys: ['0-0'] });
      setTimeout(() => {
        expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
      }, 10);
    });

    it('expands parent node when child node is expanded', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
      );

      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(true);
    });

    it('does not expand parent node when autoExpandParent is false', () => {
      const wrapper = mount(
        <Tree expandedKeys={['0-0-0']} autoExpandParent={false}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
      );
      const switcher = wrapper.find('.rc-tree-switcher').first();
      expect(switcher.is(OPEN_CLASSNAME)).toBe(false);
    });

    it('fires expand event', () => {
      const handleExpand = jest.fn();
      const wrapper = mount(
        <Tree onExpand={handleExpand}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      const switcher = wrapper.find('.rc-tree-switcher');
      const node = wrapper.find(TreeNode).instance();

      switcher.simulate('click');
      expect(handleExpand).toBeCalledWith(['0-0'], { expanded: true, node });

      switcher.simulate('click');
      expect(handleExpand).toBeCalledWith([], { expanded: false, node });
    });
  });

  describe('check', () => {
    it('checks default checked keys', () => {
      const wrapper = mount(
        <Tree checkable defaultCheckedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').forEach((checkbox) => {
        expect(checkbox.is(CHECKED_CLASSNAME)).toBe(true);
      });
    });

    it('ignore disabled children when calculate parent\'s checked status', () => {
      const wrapper = mount(
        <Tree checkable defaultCheckedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" disableCheckbox />
            <TreeNode title="leaf 1" key="0-0-1" />
          </TreeNode>
        </Tree>
      );
      const firstCheckboxClassNames = wrapper.find('.rc-tree-checkbox').instance().classList;
      expect([].slice.call(firstCheckboxClassNames).includes(CHECKED_CLASSNAME.slice(1)))
        .toBe(false);
    });

    it('controlled by checkedKeys', () => {
      const wrapper = mount(
        <Tree checkable checkedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      const checkbox = wrapper.find('.rc-tree-checkbox');
      expect(checkbox.is(CHECKED_CLASSNAME)).toBe(false);
      wrapper.setProps({ checkedKeys: ['0-0'] });
      setTimeout(() => {
        expect(checkbox.is(CHECKED_CLASSNAME)).toBe(true);
      }, 10);
    });

    it('trurns parent node to checked when all children are checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.find('.rc-tree-checkbox').at(2).simulate('click');
      expect(
        wrapper.find('.rc-tree-checkbox').first().is(CHECKED_CLASSNAME)
      ).toBe(true);
    });

    it('turns parent node to half checked when child is checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      expect(
        wrapper.find('.rc-tree-checkbox').first().is('.rc-tree-checkbox-indeterminate')
      ).toBe(true);
    });

    it('turns parent node to checked if it is half checked', () => {
      const wrapper = mount(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      wrapper.find('.rc-tree-checkbox').first().simulate('click');
      wrapper.find('.rc-tree-checkbox').forEach(checkbox => {
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
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      const treeNode1 = wrapper.find(TreeNode).first();
      const treeNode2 = wrapper.find(TreeNode).last();
      const treeElm1 = wrapper.find(Tree).props().children;
      const treeElm2 = treeNode1.props().children;

      wrapper.find('.rc-tree-checkbox').first().simulate('click');
      expect(handleCheck).toBeCalledWith(['0-0', '0-0-0'], {
        checked: true,
        checkedNodes: [treeElm1, treeElm2],
        checkedNodesPositions: [
          { node: treeElm1, pos: '0-0' },
          { node: treeElm2, pos: '0-0-0' },
        ],
        event: 'check',
        halfCheckedKeys: [],
        node: treeNode1.instance(),
      });

      wrapper.find('.rc-tree-checkbox').last().simulate('click');
      expect(handleCheck).toBeCalledWith([], {
        checked: false,
        checkedNodes: [],
        checkedNodesPositions: [],
        event: 'check',
        halfCheckedKeys: [],
        node: treeNode2.instance(),
      });
    });

    // https://github.com/react-component/tree/issues/117
    it('check works correctly after dragging children under another node', () => {
      const wrapper = mount(
        <Tree defaultExpandAll checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.setProps({ children: (
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 2" key="0-0-1">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </TreeNode>
      ) });
      expect(() => wrapper.find('.rc-tree-checkbox').at(2).simulate('click')).not.toThrow();
    });
    // https://github.com/react-component/tree/issues/90
    it('check works correctly after adding children dynamically', () => {
      const wrapper = mount(
        <Tree defaultExpandAll checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-checkbox').at(1).simulate('click');
      wrapper.setProps({ children: (
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      ) });
      expect(() => wrapper.find('.rc-tree-checkbox').at(2).simulate('click')).not.toThrow();
    });

    // https://github.com/ant-design/ant-design/issues/7353
    it('check children after changing from children[disableCheckbox] from true to false', () => {
      let checkedKeys = null;
      const mockHandleCheck = (keys) => checkedKeys = keys;
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
        </Tree>
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

    describe('strictly', () => {
      it('checks strictly', () => {
        const wrapper = mount(
          <Tree checkable checkStrictly>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="leaf 1" key="0-0-0" />
            </TreeNode>
          </Tree>
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
          }

          handleCheck = (checkedKeys) => {
            this.setState({ checkedKeys });
          }

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
          wrapper.setState({ checkedKeys: { checked: ['0-0', '0-0-0'], halfChecked: [] } });
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
        </Tree>
      );
      const node = wrapper.find(TreeNode).first().find('.rc-tree-checkbox').first();
      node.simulate('click');
      setTimeout(() => {
        expect(node.hasClass('rc-tree-checkbox-checked')).toBe(true);
        expect(node.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
        expect(wrapper.state().checkedKeys).toEqual(['0-0-1', '0-0-2', '0-0']);
        node.simulate('click');
        setTimeout(() => {
          expect(node.hasClass('rc-tree-checkbox-checked')).toBe(false);
          expect(node.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
          expect(wrapper.state().checkedKeys).toEqual([]);
        }, 10);
      }, 10);
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
        </Tree>
      );
      const node = wrapper.find(TreeNode).first().find('.rc-tree-checkbox').first();
      node.simulate('click');
      setTimeout(() => {
        expect(node.hasClass('rc-tree-checkbox-checked')).toBe(true);
        expect(node.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
        expect(wrapper.state().checkedKeys).toEqual(['0-0-1', '0-0-2', '0-0']);
        node.simulate('click');
        setTimeout(() => {
          expect(node.hasClass('rc-tree-checkbox-checked')).toBe(false);
          expect(node.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
          expect(wrapper.state().checkedKeys).toEqual([]);
        }, 10);
      }, 10);
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
        </Tree>
      );
      const parent = wrapper.find(TreeNode).at(1).find('.rc-tree-checkbox').first();
      const node = wrapper.find(TreeNode).at(2).find('.rc-tree-checkbox').first();
      node.simulate('click');
      setTimeout(() => {
        expect(node.hasClass('rc-tree-checkbox-checked')).toBe(true);
        expect(parent.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
        expect(parent.hasClass('rc-tree-checkbox-checked')).toBe(true);
        node.simulate('click');
        setTimeout(() => {
          expect(node.hasClass('rc-tree-checkbox-checked')).toBe(false);
          expect(parent.hasClass('rc-tree-checkbox-indeterminate')).toBe(false);
          expect(parent.hasClass('rc-tree-checkbox-checked')).toBe(false);
        }, 10);
      }, 10);
    });
  });

  describe('select', () => {
    it('selects default selected keys', () => {
      const wrapper = mount(
        <Tree selectable defaultSelectedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      expect(
        wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)
      ).toBe(true);
    });

    it('controlled by selectedKeys', () => {
      const wrapper = mount(
        <Tree selectable selectedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      expect(
        wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)
      ).toBe(false);
      wrapper.setProps({ selectedKeys: ['0-0'] });
      expect(
        wrapper.find('.rc-tree-node-content-wrapper').is(SELECTED_CLASSNAME)
      ).toBe(true);
    });

    it('fires select event', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(
        <Tree selectable onSelect={handleSelect}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      const nodeContent = wrapper.find('.rc-tree-node-content-wrapper');
      const node = wrapper.find(TreeNode).first().instance();
      const nodeElm = wrapper.find(Tree).props().children;

      nodeContent.simulate('click');
      expect(handleSelect).toBeCalledWith(['0-0'], {
        event: 'select',
        node,
        selected: true,
        selectedNodes: [nodeElm],
      });

      nodeContent.simulate('click');
      expect(handleSelect).toBeCalledWith([], {
        event: 'select',
        node,
        selected: false,
        selectedNodes: [],
      });
    });
  });


  describe('checkable but not selectable', () => {
    it('fires check event when click on TreeNode', () => {
      const handleCheck = jest.fn();
      const wrapper = mount(
        <Tree checkable selectable={ false } onCheck={handleCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      wrapper.find('.rc-tree-switcher').simulate('click');
      const treeNode1 = wrapper.find(TreeNode).first();
      const treeNode2 = wrapper.find(TreeNode).last();
      const treeElm1 = wrapper.find(Tree).props().children;
      const treeElm2 = treeNode1.props().children;

      wrapper.find('.rc-tree-node-content-wrapper').first().simulate('click');
      expect(handleCheck).toBeCalledWith(['0-0', '0-0-0'], {
        checked: true,
        checkedNodes: [treeElm1, treeElm2],
        checkedNodesPositions: [
          { node: treeElm1, pos: '0-0' },
          { node: treeElm2, pos: '0-0-0' },
        ],
        event: 'check',
        halfCheckedKeys: [],
        node: treeNode1.instance(),
      });

      wrapper.find('.rc-tree-node-content-wrapper').last().simulate('click');
      expect(handleCheck).toBeCalledWith([], {
        checked: false,
        checkedNodes: [],
        checkedNodesPositions: [],
        event: 'check',
        halfCheckedKeys: [],
        node: treeNode2.instance(),
      });
    });
  });


  it('fires rightClick event', () => {
    const handleRightClick = jest.fn();
    const wrapper = mount(
      <Tree onRightClick={handleRightClick}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>
    );
    wrapper.find('.rc-tree-node-content-wrapper').simulate('contextMenu');
    expect(handleRightClick.mock.calls[0][0].node).toBe(wrapper.find(TreeNode).instance());
  });

  it('fires rightClick should not change selected item', () => {
    const handleRightClick = jest.fn();
    const wrapper = mount(
      <Tree onRightClick={handleRightClick}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>
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
      </Tree>
    );
    wrapper.find('.rc-tree-node-content-wrapper').simulate('mouseEnter');
    expect(handleMouseEnter.mock.calls[0][0].node).toBe(wrapper.find(TreeNode).instance());
  });

  it('fires mouseLeave events', () => {
    const handleMouseLeave = jest.fn();
    const wrapper = mount(
      <Tree onMouseLeave={handleMouseLeave}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>
    );
    wrapper.find('.rc-tree-node-content-wrapper').simulate('mouseLeave');
    expect(handleMouseLeave.mock.calls[0][0].node).toBe(wrapper.find(TreeNode).instance());
  });

  it('filters nodes', () => {
    function filterTreeNode(treeNode) {
      return treeNode.props.title.indexOf('parent') > -1;
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
      </Tree>
    );

    expect(wrapper.find('li').is('.filter-node')).toBe(true);
  });

  it('loads nodes asynchronously', () => {
    const then = jest.fn(() => Promise.resolve());
    const loadData = jest.fn(() => ({ then }));
    const wrapper = mount(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>
    );
    wrapper.find('.rc-tree-switcher').simulate('click');
    expect(loadData).toBeCalledWith(wrapper.find(TreeNode).instance());
    expect(then).toBeCalled();
  });

  describe('drag and drop', () => {
    function createTree(props) {
      return (
        <Tree
          draggable
          defaultExpandAll
          {...props}
        >
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
      treeNode.simulate('dragStart');
      const event = onDragStart.mock.calls[0][0];
      expect(event.node).toBe(wrapper.find(TreeNode).at(1).instance());
    });

    it('fires dragEnter event', (done) => {
      const onDragEnter = jest.fn();
      const wrapper = mount(createTree({ onDragEnter }));
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
      wrapper.find('.dropTarget').at(0).simulate('dragEnter');
      expect(onDragEnter).not.toBeCalled();
      setTimeout(() => {
        const event = onDragEnter.mock.calls[0][0];
        expect(event.node).toBe(wrapper.find(TreeNode).at(2).instance());
        expect(event.expandedKeys).toEqual(['0-0', '0-0-0-1']);
        done();
      }, 500);
    });

    it('fires dragOver event', () => {
      const onDragOver = jest.fn();
      const wrapper = mount(createTree({ onDragOver }));
      wrapper.find('.dropTarget').at(0).simulate('dragOver');
      const event = onDragOver.mock.calls[0][0];
      expect(event.node).toBe(wrapper.find(TreeNode).at(2).instance());
    });

    it('fires dragLeave event', () => {
      const onDragLeave = jest.fn();
      const wrapper = mount(createTree({ onDragLeave }));
      wrapper.find('.dropTarget').at(0).simulate('dragLeave');
      const event = onDragLeave.mock.calls[0][0];
      expect(event.node).toBe(wrapper.find(TreeNode).at(2).instance());
    });

    it('fires drop event', () => {
      const onDrop = jest.fn();
      const wrapper = mount(createTree({ onDrop }));
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
      wrapper.find('.dropTarget').at(0).simulate('drop');
      const event = onDrop.mock.calls[0][0];
      expect(event.node).toBe(wrapper.find(TreeNode).at(2).instance());
      expect(event.dragNode).toBe(wrapper.find(TreeNode).at(1).instance());
      expect(event.dragNodesKeys).toEqual(['0-0-0-0']);
    });

    it('fires dropEnd event', () => {
      const onDragEnd = jest.fn();
      const wrapper = mount(createTree({ onDragEnd }));
      wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragEnd');
      const event = onDragEnd.mock.calls[0][0];
      expect(event.node).toBe(wrapper.find(TreeNode).at(1).instance());
    });
  });

  it('renders without errors', () => {
    expect(() => {
      mount(
        <Tree>
          {[0, 1].map(i => (
            <TreeNode title={i} key={i}>
              {[2, 3].map(j => <TreeNode title={j} key={j} />)}
              <TreeNode title="4" key="4" />
            </TreeNode>
          ))}
        </Tree>
      );
    }).not.toThrow();
  });

  it('renders opaque children correctly', () => {
    const wrapper = render(
      <Tree>
        <TreeNode title="0" key="0">
          {[1, 2].map(i =>
            <TreeNode title={i} key={i} />
          )}
          <TreeNode title="3" key="3" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
