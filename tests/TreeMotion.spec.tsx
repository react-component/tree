import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Tree, { TreeNode, FieldDataNode } from '../src';
import MotionTreeNode from '../src/MotionTreeNode';
import { TreeContext } from '../src/contextTypes';
import { getMinimumRangeTransitionRange } from '../src/NodeList';

jest.mock('rc-motion/lib/util/motion', () => {
  const origin = jest.requireActual('rc-motion/lib/util/motion');

  return {
    ...origin,
    supportTransition: () => true,
  };
});

describe('Tree Motion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('basic', () => {
    const motion = {
      motionName: 'bamboo',
    };
    const { container } = render(
      <Tree motion={motion} height={10000}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    fireEvent.click(container.querySelector('.rc-tree-switcher'));

    expect(container.querySelector('.bamboo-appear')).toBeTruthy();
  });

  it('hide item', () => {
    const renderTree = (props?: any) => (
      <Tree
        treeData={[{ key: '0-0', children: [{ key: '0-0-0' }] }]}
        expandedKeys={['0-0']}
        motion={{}}
        {...props}
      />
    );

    const { container, rerender } = render(renderTree());

    rerender(renderTree({ expandedKeys: [] }));

    expect(container.querySelector('.bamboo-appear')).toBeFalsy();
  });

  it('getMinimumRangeTransitionRange', () => {
    const visibleList = getMinimumRangeTransitionRange(
      new Array(100).fill(null).map((_, index) => index) as any,
      true,
      100,
      20,
    );

    expect(visibleList.length < 10).toBeTruthy();
  });

  it('not crash', () => {
    const renderTree = (props?: any) => (
      <Tree
        treeData={[{ key: '0-0', children: [{ key: '0-0-0' }] }]}
        expandedKeys={['0-0']}
        motion={{}}
        {...props}
      />
    );
    const { rerender } = render(renderTree());

    rerender(renderTree({ treeData: [] }));
  });

  it('should not expanded when in motion', () => {
    // const raf = jest
    //   .spyOn(window, 'requestAnimationFrame')
    //   .mockImplementation(fn => window.setTimeout(fn, 16));

    const onExpand = jest.fn();
    const { container } = render(
      <Tree
        onExpand={onExpand}
        motion={{
          motionName: 'bamboo',
          motionDeadline: 1000,
          motionAppear: true,
        }}
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    function doExpand() {
      fireEvent.click(container.querySelector('.rc-tree-switcher'));
    }

    // First click should work
    doExpand();
    expect(onExpand).toHaveBeenCalled();
    onExpand.mockReset();

    // Not trigger when in motion
    doExpand();
    expect(onExpand).not.toHaveBeenCalled();
  });

  describe('MotionTreeNode should always trigger motion end', () => {
    it('with motionNodes', () => {
      const onMotionStart = jest.fn();
      const onMotionEnd = jest.fn();
      const { unmount } = render(
        <TreeContext.Provider value={{ prefixCls: 'test' } as any}>
          <MotionTreeNode
            motionNodes={[]}
            onMotionStart={onMotionStart}
            onMotionEnd={onMotionEnd}
            {...({} as any)} // Ignore TS warning
          />
        </TreeContext.Provider>,
      );

      expect(onMotionStart).toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();

      unmount();
      expect(onMotionEnd).toHaveBeenCalled();
    });

    it('without motionNodes', () => {
      const onMotionStart = jest.fn();
      const onMotionEnd = jest.fn();
      const { unmount } = render(
        <TreeContext.Provider
          value={
            {
              prefixCls: 'test',
              keyEntities: {},
              dropIndicatorRender: () => null,
            } as any
          }
        >
          <MotionTreeNode
            onMotionStart={onMotionStart}
            onMotionEnd={onMotionEnd}
            isEnd={[false]}
            {...({} as any)} // Ignore TS warning
          />
        </TreeContext.Provider>,
      );

      expect(onMotionStart).not.toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();

      unmount();
      expect(onMotionStart).not.toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();
    });
  });

  it('motion should work well with fieldNames', () => {
    const Demo = () => (
      <Tree<FieldDataNode<{ id: string; name: string }, 'sub'>>
        defaultExpandAll
        fieldNames={{
          title: 'name',
          key: 'id',
          children: 'sub',
        }}
        motion={{
          motionName: 'bamboo',
        }}
        treeData={[
          {
            id: '1',
            name: 'A',
            sub: [
              {
                id: '2',
                name: 'B',
                sub: [],
              },
            ],
          },
        ]}
      />
    );

    const { container } = render(<Demo />);
    expect(container.querySelector('[title="B"]')).toBeTruthy();
    // wrapper.find('.rc-tree-switcher').first().simulate('click');
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.bamboo-leave-active'));
    expect(container.querySelector('[title="B"]')).toBeFalsy();
  });

  it('motion should not revert flatten list', () => {
    const renderTree = (props?: any) => (
      <Tree
        motion={{
          motionName: 'little',
        }}
        height={100}
        itemHeight={10}
        treeData={[
          {
            key: 'parent',
            title: 'parent',
            children: [
              {
                key: 'child',
                title: 'child',
              },
            ],
          },
        ]}
        {...props}
      />
    );

    const { container, rerender } = render(renderTree());

    rerender(
      renderTree({
        expandedKeys: ['parent'],
      }),
    );

    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }

    rerender(
      renderTree({
        treeData: [
          {
            key: 'parent',
            title: 'parent2',
            children: [
              {
                key: 'child',
                title: 'child2',
              },
            ],
          },
        ],
      }),
    );

    expect(container.querySelectorAll('span.rc-tree-title')[0].textContent).toEqual('parent2');
    expect(container.querySelectorAll('span.rc-tree-title')[1].textContent).toEqual('child2');
  });
});
