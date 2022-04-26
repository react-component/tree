import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Tree, { TreeNode } from '../src';
import MotionTreeNode from '../src/MotionTreeNode';
import { TreeContext } from '../src/contextTypes';
import { getMinimumRangeTransitionRange } from '../src/NodeList';

describe('Tree Motion', () => {
  it('basic', () => {
    const motion = {
      motionName: 'bamboo',
    };
    const wrapper = mount(
      <Tree motion={motion} height={10000}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    const switcher = wrapper.find('.rc-tree-switcher');
    switcher.simulate('click');

    expect(wrapper.find('CSSMotion').props()).toMatchObject(motion);
  });

  it('hide item', done => {
    const wrapper = mount(
      <Tree
        treeData={[{ key: '0-0', children: [{ key: '0-0-0' }] }]}
        expandedKeys={['0-0']}
        motion={{}}
      />,
    );
    wrapper.setProps({ expandedKeys: [] });

    setTimeout(() => {
      wrapper.update();
      // Confirm CSSMotion is prepare to hide
      expect(wrapper.find('CSSMotion').props().visible).toBeFalsy();
      done();
    }, 100);
  });

  it('getMinimumRangeTransitionRange', () => {
    const visibleList = getMinimumRangeTransitionRange(
      new Array(100).fill(null).map((_, index) => index),
      100,
      20,
    );

    expect(visibleList.length < 10).toBeTruthy();
  });

  it('not crash', () => {
    const wrapper = mount(
      <Tree
        treeData={[{ key: '0-0', children: [{ key: '0-0-0' }] }]}
        expandedKeys={['0-0']}
        motion={{}}
      />,
    );

    wrapper.setProps({ treeData: [] });
  });

  it('should not expanded when in motion', () => {
    const raf = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(fn => window.setTimeout(fn, 16));
    jest.useFakeTimers();

    const onExpand = jest.fn();
    const wrapper = mount(
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
      const switcher = wrapper.find('.rc-tree-switcher').first();
      switcher.simulate('click');
    }

    // First click should work
    doExpand();
    expect(onExpand).toHaveBeenCalled();
    onExpand.mockReset();

    // Not trigger when in motion
    doExpand();
    expect(onExpand).not.toHaveBeenCalled();

    raf.mockRestore();
    jest.useRealTimers();
  });

  describe('MotionTreeNode should always trigger motion end', () => {
    it('with motionNodes', () => {
      const onMotionStart = jest.fn();
      const onMotionEnd = jest.fn();
      const wrapper = mount(
        <TreeContext.Provider value={{ prefixCls: 'test' }}>
          <MotionTreeNode
            motionNodes={[]}
            onMotionStart={onMotionStart}
            onMotionEnd={onMotionEnd}
          />
        </TreeContext.Provider>,
      );

      expect(onMotionStart).toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();

      wrapper.unmount();
      expect(onMotionEnd).toHaveBeenCalled();
    });

    it('without motionNodes', () => {
      const onMotionStart = jest.fn();
      const onMotionEnd = jest.fn();
      const wrapper = mount(
        <TreeContext.Provider
          value={{
            prefixCls: 'test',
            keyEntities: {},
            dropIndicatorRender: () => null,
          }}
        >
          <MotionTreeNode onMotionStart={onMotionStart} onMotionEnd={onMotionEnd} isEnd={[false]} />
        </TreeContext.Provider>,
      );

      expect(onMotionStart).not.toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();

      wrapper.unmount();
      expect(onMotionStart).not.toHaveBeenCalled();
      expect(onMotionEnd).not.toHaveBeenCalled();
    });
  });

  it('motion should work well with fieldNames', () => {
    const Demo = () => (
      <Tree
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

    const wrapper = mount(<Demo />);
    expect(wrapper.find('[title="B"]').length).toBeTruthy();
    wrapper.find('.rc-tree-switcher').first().simulate('click');
    expect(wrapper.find('[title="B"]').length).toBe(0);
  });

  it('motion should not revert flatten list', () => {
    jest.useFakeTimers();

    const wrapper = mount(
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
      />,
    );

    wrapper.setProps({
      expandedKeys: ['parent'],
    });

    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }

    wrapper.setProps({
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
    });

    wrapper.find('.rc-tree-treenode-motion').simulate('animationEnd');

    expect(wrapper.find('span.rc-tree-title').at(0).text()).toEqual('parent2');
    expect(wrapper.find('span.rc-tree-title').at(1).text()).toEqual('child2');

    jest.useRealTimers();
  });
});
