/* eslint-disable no-undef, react/no-multi-comp, no-console,
react/no-unused-state, react/prop-types, no-return-assign */
import React from 'react';
import { mount } from 'enzyme';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Tree, { TreeNode } from '../src';
import { InternalTreeNode } from '../src/TreeNode';
import { spyConsole } from './util';
import { convertNodePropsToEventData } from '../src/utils/treeUtil';

const delay = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

describe('Tree Draggable', () => {
  spyConsole();

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
      return new Promise(resolve => {
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
    ['ltr', 'rtl'].forEach(dir => {
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
          <Tree draggable defaultExpandAll onDrop={onDrop} allowDrop={() => false} direction={dir}>
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
        expect(wrapper.instance().state.draggingNodeKey).toBeFalsy();
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
      it('allowDrop should pass dragNode and dropNode', () => {
        const onDrop = jest.fn();
        const allowDrop = jest.fn();
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
        expect(allowDrop.mock.calls[0][0].dragNode.key).toEqual('0-0');
        expect(allowDrop.mock.calls[0][0].dropNode.key).toEqual('0-1-0-0');
      });

      it('not allow dragging elements outside into tree', () => {
        const onDrop = jest.fn();
        const wrapper = mount(
          <div>
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-0">
                <TreeNode key="0-0-0" className="dropTarget" />
              </TreeNode>
            </Tree>
            <div className="dragTarget">Element outside</div>
          </div>,
        );
        wrapper.find('.dragTarget').simulate('dragStart');
        wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter');
        wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver');
        wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
        expect(onDrop).not.toHaveBeenCalled();
      });
    });
  });

  it('render handler', () => {
    const wrapper = mount(
      <Tree
        draggable={{
          icon: <span className="handler" />,
        }}
        defaultExpandAll
        treeData={[
          {
            title: 'Parent',
            key: 'parent',
            children: [
              {
                title: 'Child',
                key: 'child',
              },
            ],
          },
        ]}
      />,
    );

    expect(wrapper.find('.handler')).toHaveLength(2);
  });

  it('not break with fieldNames', () => {
    const onDrop = jest.fn();

    const wrapper = mount(
      <Tree
        draggable
        defaultExpandAll
        onDrop={onDrop}
        treeData={[
          {
            name: 'parent',
            childList: [
              {
                className: 'dragTarget',
                name: 'child 1',
              },
              {
                className: 'dropTarget',
                name: 'child 2',
              },
            ],
          },
        ]}
        fieldNames={{
          children: 'childList',
          title: 'name',
          key: 'name',
        }}
      />,
    );

    wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart');
    wrapper.find('.dropTarget').at(0).simulate('dragEnter', {
      clientY: -9999999,
    });
    wrapper.find('.dropTarget').at(0).simulate('dragOver');
    wrapper.find('.dropTarget').at(0).simulate('drop');

    expect(onDrop).toHaveBeenCalled();
  });

  it('render disabled style ICON', () => {
    const wrapper = mount(
      <Tree
        draggable={{
          icon: '↕️',
          nodeDraggable: node => Array.isArray(node.children),
        }}
        defaultExpandAll
        treeData={[
          {
            title: '0-0-label',
            key: '0-0-key',
            children: [
              {
                title: '0-0-0-label',
                key: '0-0-0-key',
                children: [
                  {
                    title: '0-0-0-0-label',
                    key: '0-0-0-0-key',
                  },
                  {
                    title: '0-0-0-1-label',
                    key: '0-0-0-1-key',
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    expect(wrapper.find('.rc-tree-treenode-draggable-disabled')).toHaveLength(2);
  });
});
