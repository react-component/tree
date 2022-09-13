/* eslint-disable no-undef, react/no-multi-comp, no-console,
react/no-unused-state, react/prop-types, no-return-assign */
import React from 'react';
import { render, fireEvent, act, createEvent } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Tree, { TreeNode, FieldDataNode } from '../src';
import { spyConsole } from './util';

const delay = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

describe('Tree Draggable', () => {
  spyConsole();

  function createTree(props?: any) {
    return (
      <Tree draggable defaultExpandAll {...props}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode className="dragTarget" title="leaf" key="0-0-0-0" />
          <TreeNode className="dropTarget" title="leaf" key="0-0-0-1" />
        </TreeNode>
      </Tree>
    );
  }

  function fireDragEvent(ele: HTMLElement, eventName: string, data: object = {}) {
    const event = createEvent[eventName](ele);
    Object.keys(data).forEach(key => {
      event[key] = data[key];
    });
    fireEvent(ele, event);
  }

  it('fires dragStart event', () => {
    const onDragStart = jest.fn();
    const { container } = render(createTree({ onDragStart }));
    const treeNode = container.querySelector('.dragTarget > .rc-tree-node-content-wrapper');
    fireEvent.dragStart(treeNode);
    const event = onDragStart.mock.calls[0][0];
    expect(event.node).toEqual(
      expect.objectContaining({
        key: '0-0-0-0',
      }),
    );
  });

  it('fires dragEnter event', async () => {
    const onDragEnter = jest.fn();
    const { container } = render(createTree({ onDragEnter }));

    fireEvent.dragStart(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));

    // Not trigger self
    fireEvent.dragEnter(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));

    await act(async () => {
      await delay(900);
    });
    expect(onDragEnter).not.toHaveBeenCalled();

    fireEvent.dragEnter(container.querySelector('.dropTarget'));
    expect(onDragEnter).toHaveBeenCalled();

    await act(async () => {
      await delay(900);
    });
    const event = onDragEnter.mock.calls[0][0];
    expect(event.node.key).toEqual('0-0-0-1');
    expect(event.expandedKeys).toEqual(['0-0', '0-0-0-1']);
    expect(onDragEnter).toHaveBeenCalledTimes(1);
  });

  it('fires dragOver event', () => {
    const onDragOver = jest.fn();
    const { container } = render(createTree({ onDragOver }));
    fireEvent.dragStart(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    fireEvent.dragOver(container.querySelector('.dropTarget'));
    const event = onDragOver.mock.calls[0][0];
    expect(event.node).toEqual(
      expect.objectContaining({
        key: '0-0-0-1',
      }),
    );
  });

  it('fires dragLeave event', () => {
    const onDragLeave = jest.fn();
    const { container } = render(createTree({ onDragLeave }));
    fireEvent.dragLeave(container.querySelector('.dropTarget'));
    const event = onDragLeave.mock.calls[0][0];
    expect(event.node).toEqual(
      expect.objectContaining({
        key: '0-0-0-1',
      }),
    );
  });

  it('fires drop event', () => {
    const onDrop = jest.fn();
    const { container } = render(createTree({ onDrop }));
    fireEvent.dragStart(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    fireEvent.dragEnter(container.querySelector('.dropTarget'));
    fireEvent.dragOver(container.querySelector('.dropTarget'));
    fireEvent.drop(container.querySelector('.dropTarget'));
    const event = onDrop.mock.calls[0][0];
    expect(event.node).toEqual(expect.objectContaining({ key: '0-0-0-1' }));
    expect(event.dragNode).toEqual(expect.objectContaining({ key: '0-0-0-0' }));
    expect(event.dragNodesKeys).toEqual(['0-0-0-0']);
  });

  it('fires dropEnd event', () => {
    const onDragEnd = jest.fn();
    const { container } = render(createTree({ onDragEnd }));
    fireEvent.dragEnd(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    const event = onDragEnd.mock.calls[0][0];
    expect(event.node).toEqual(
      expect.objectContaining({
        key: '0-0-0-0',
      }),
    );
  });

  it('do not throw error when drag into another non-drag-able tree', () => {
    const { container } = render(
      <>
        <div className="tree1">{createTree()}</div>
        <div className="tree2">{createTree({ draggable: false })}</div>
      </>,
    );

    const dragTree = container.querySelector('.tree1');
    const normalTree = container.querySelector('.tree2');

    fireEvent.dragStart(dragTree.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    fireEvent.dragEnter(normalTree.querySelector('.dropTarget'));
    fireEvent.dragOver(normalTree.querySelector('.dropTarget'));
    fireEvent.drop(normalTree.querySelector('.dropTarget'));
  });

  describe('full steps', () => {
    function dropTarget(targetSelector: string) {
      return new Promise<void>(resolve => {
        const { container } = render(
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

        fireEvent.dragStart(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));

        // 1. Move into target (first in the middle of the node)
        fireEvent.dragEnter(container.querySelector(targetSelector), { clientY: 10 });
        setTimeout(() => {
          fireEvent.dragOver(container.querySelector(targetSelector), { clientY: 999 });

          // 2. Move out of target
          fireEvent.dragLeave(container.querySelector(targetSelector));

          // 3. Move in again
          fireEvent.dragEnter(container.querySelector(targetSelector), { clientY: 0 });

          setTimeout(() => {
            fireEvent.dragOver(container.querySelector(targetSelector), { clientY: 999 });

            // 4. Drop
            fireEvent.drop(container.querySelector(targetSelector));
            fireEvent.dragEnd(container.querySelector('.dragTarget'));

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

    (['ltr', 'rtl'] as const).forEach(dir => {
      const base = dir === 'ltr' ? 1 : -1;

      it('not allow cross level dnd on expanded nodes', () => {
        const onDrop = jest.fn();
        const { container } = render(
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

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget1 > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget1 > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireEvent.drop(container.querySelector('.dropTarget1 > .rc-tree-node-content-wrapper'));

        // insert after 0-0, since 0-0-0 is not expanded
        expect(onDrop.mock.calls[0][0].node.key).toEqual('0-0');
        expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget2 > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget2 > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireEvent.drop(container.querySelector('.dropTarget2 > .rc-tree-node-content-wrapper'));

        // insert into 0-1-0, since it is expanded, do not allow cross level dnd
        expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0');
        expect(onDrop.mock.calls[1][0].dropPosition).toEqual(0);
      });

      it('allowDrop all nodes', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );

        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));

        expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1-0-0');
        // (in ltr) drag from right to left, should be insert after, so drop position is 1
        expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );

        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));

        expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[1][0].dropPosition).toEqual(1);

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );

        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );

        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[2][0].dropPosition).toEqual(0);

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[2][0].dropPosition).toEqual(0);
      });

      it('allowDrop no node', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTargetParent > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTargetParent > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireEvent.drop(
          container.querySelector('.dropTargetParent > .rc-tree-node-content-wrapper'),
        );
        // not allow any dropPosition except 0 on expanded node
        expect(onDrop).not.toHaveBeenCalled();

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop).not.toHaveBeenCalled();

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop).not.toHaveBeenCalled();

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop).not.toHaveBeenCalled();

        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop).not.toHaveBeenCalled();
      });

      it('drop to top half of first node', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 0,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: -1000,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1');
        expect(onDrop.mock.calls[0][0].dropPosition).toEqual(-1);
      });

      it('can drop on its direct parent', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTargetParent > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTargetParent > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireEvent.drop(
          container.querySelector('.dragTargetParent > .rc-tree-node-content-wrapper'),
        );
        expect(onDrop).toHaveBeenCalled();
      });

      it('cover window dragend & componentWillUnmount', () => {
        const { container, unmount } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        window.dispatchEvent(new Event('dragend'));
        unmount();
      });

      it('dragover first half of non-first child', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        // wrapper.find('.dragTarget > .rc-tree-node-content-wrapper').simulate('dragStart', {
        //   clientX: base * 500,
        //   clientY: 500,
        // });
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        // wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragEnter', {
        //   clientX: base * 500,
        //   clientY: 1,
        // });
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 500,
            clientY: 1,
          },
        );
        // wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('dragOver', {
        //   clientX: base * 500,
        //   clientY: 1,
        // });
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 500,
            clientY: 1,
          },
        );
        // wrapper.find('.dropTarget > .rc-tree-node-content-wrapper').simulate('drop');
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[0][0].node.key).toEqual('0-0-1');
        expect(onDrop.mock.calls[0][0].dropPosition).toEqual(2);
      });

      it('dragover self', () => {
        const onDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 500,
          },
        );
        fireEvent.drop(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
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
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[0][0].node.key).toEqual('0-1-0-0');
        // (in ltr) drag from right to left, should be insert after, so drop position is 1
        expect(onDrop.mock.calls[0][0].dropPosition).toEqual(1);
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 500,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[1][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[1][0].dropPosition).toEqual(1);
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 550,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[2][0].dropPosition).toEqual(1);
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 600,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop.mock.calls[2][0].node.key).toEqual('0-1-0-0');
        expect(onDrop.mock.calls[2][0].dropPosition).toEqual(1);
      });

      it('allowDrop should pass dragNode and dropNode', () => {
        const onDrop = jest.fn();
        const allowDrop = jest.fn();
        const { container } = render(
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
        fireDragEvent(
          container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'),
          'dragStart',
          {
            clientX: base * 500,
            clientY: 500,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragEnter',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireDragEvent(
          container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'),
          'dragOver',
          {
            clientX: base * 400,
            clientY: 600,
          },
        );
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(allowDrop.mock.calls[0][0].dragNode.key).toEqual('0-0');
        expect(allowDrop.mock.calls[0][0].dropNode.key).toEqual('0-1-0-0');
      });

      it('not allow dragging elements outside into tree', () => {
        const onDrop = jest.fn();
        const { container } = render(
          <div>
            <Tree draggable defaultExpandAll onDrop={onDrop} direction={dir}>
              <TreeNode key="0-0">
                <TreeNode key="0-0-0" className="dropTarget" />
              </TreeNode>
            </Tree>
            <div className="dragTarget">Element outside</div>
          </div>,
        );
        fireEvent.dragStart(container.querySelector('.dragTarget'));
        fireEvent.dragEnter(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        fireEvent.dragOver(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        fireEvent.drop(container.querySelector('.dropTarget > .rc-tree-node-content-wrapper'));
        expect(onDrop).not.toHaveBeenCalled();
      });
    });
  });

  it('render handler', () => {
    const { container } = render(
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

    expect(container.querySelectorAll('.handler')).toHaveLength(2);
  });

  it('not break with fieldNames', () => {
    const onDrop = jest.fn();

    const { container } = render(
      <Tree<FieldDataNode<{ name: string }, 'childList'>>
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

    fireEvent.dragStart(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    fireDragEvent(container.querySelector('.dropTarget'), 'dragEnter', {
      clientY: -9999999,
    });
    fireEvent.dragOver(container.querySelector('.dropTarget'));
    fireEvent.drop(container.querySelector('.dropTarget'));

    expect(onDrop).toHaveBeenCalled();
  });

  it('not break of other drop node', () => {
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    const { container } = render(
      <div>
        {createTree({ onDragStart, onDragEnd })}
        <div className="test" />
      </div>,
    );
    const treeNode = container.querySelector('.dragTarget > .rc-tree-node-content-wrapper');
    fireEvent.dragStart(treeNode);
    expect(onDragStart).toHaveBeenCalled();

    fireEvent.dragEnd(container.querySelector('.dragTarget > .rc-tree-node-content-wrapper'));
    expect(onDragEnd).toHaveBeenCalled();

    // Should not break
    fireEvent.dragEnd(container.querySelector('.test'));
  });

  it('disabled item should have draggable className', () => {
    const { container } = render(
      <Tree draggable defaultExpandAll>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf" key="0-0-0" disabled />
          <TreeNode title="leaf" key="0-0-1" />
        </TreeNode>
      </Tree>,
    );
    expect(container.querySelectorAll('.rc-tree-treenode-draggable').length).toBe(3);
  });
});
