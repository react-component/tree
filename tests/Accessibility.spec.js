/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { mount } from 'enzyme';
import Tree from '../src';
import { InternalTreeNode } from '../src/TreeNode';
import { spyConsole } from './util';

describe('Tree Accessibility', () => {
  spyConsole();

  describe('key operation', () => {
    function typeTest(props, spaceCallback, enterCallback) {
      const onExpand = jest.fn();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onKeyDown = jest.fn();
      const onActiveChange = jest.fn();

      function checkKeyDownTrigger() {
        expect(onKeyDown).toHaveBeenCalled();
        onKeyDown.mockReset();
      }

      function checkActiveTrigger(key) {
        expect(onActiveChange).toHaveBeenCalledWith(key);
        onActiveChange.mockReset();
      }

      const wrapper = mount(
        <Tree
          {...props}
          onExpand={onExpand}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onActiveChange={onActiveChange}
          defaultExpandAll
          treeData={[{ key: 'parent', children: [{ key: 'child 1' }, { key: 'child 2' }] }]}
        />,
      );

      // Focus
      wrapper.find('input').simulate('focus');
      expect(onFocus).toHaveBeenCalled();

      // Arrow up: last one
      wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .last()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow down: first one
      wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .first()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow up: last one again
      wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .last()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow left: parent
      wrapper.find('input').simulate('keyDown', { which: KeyCode.LEFT });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .first()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow left: collapse
      wrapper.find('input').simulate('keyDown', { which: KeyCode.LEFT });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .first()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: expand
      onExpand.mockReset();
      wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .first()
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2', 'parent'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: first child
      onExpand.mockReset();
      wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
      expect(
        wrapper
          .find(InternalTreeNode)
          .find('.rc-tree-treenode')
          .at(1)
          .hasClass('rc-tree-treenode-active'),
      ).toBeTruthy();
      checkKeyDownTrigger();
      checkActiveTrigger('child 1');

      // SPACE: confirm
      wrapper.find('input').simulate('keyDown', { which: KeyCode.SPACE });
      spaceCallback();
      checkKeyDownTrigger();

      // ENTER: confirm again
      wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
      enterCallback();
      checkKeyDownTrigger();

      // Blur
      wrapper.find('input').simulate('blur');
      expect(onBlur).toHaveBeenCalled();

      // null activeKey
      wrapper
        .find('.rc-tree-treenode')
        .first()
        .simulate('mouseMove');
      checkActiveTrigger(null);

      for (let i = 0; i < 10; i += 1) {
        wrapper
          .find('.rc-tree-treenode')
          .first()
          .simulate('mouseMove');
        expect(onActiveChange).not.toHaveBeenCalled();
      }
    }

    it('onSelect', () => {
      const onSelect = jest.fn();
      typeTest(
        { onSelect },
        () => {
          expect(onSelect).toHaveBeenCalledWith(['child 1'], expect.anything());
          onSelect.mockReset();
        },
        () => {
          expect(onSelect).toHaveBeenCalledWith([], expect.anything());
        },
      );
    });

    it('onCheck', () => {
      const onCheck = jest.fn();
      typeTest(
        { onCheck, checkable: true, selectable: false },
        () => {
          expect(onCheck).toHaveBeenCalledWith(['child 1'], expect.anything());
          onCheck.mockReset();
        },
        () => {
          expect(onCheck).toHaveBeenCalledWith([], expect.anything());
        },
      );
    });

    it('not crash if not exist', () => {
      const wrapper = mount(<Tree defaultExpandAll treeData={[]} />);

      wrapper.find('input').simulate('focus');

      // Arrow should not work
      wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
      expect(wrapper.find(InternalTreeNode).find('.rc-tree-treenode-active').length).toBeFalsy();
    });

    it('remove active if mouse hover', () => {
      const wrapper = mount(<Tree defaultExpandAll treeData={[{ key: 'parent' }]} />);

      wrapper.find('input').simulate('focus');

      wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
      expect(wrapper.find(InternalTreeNode).find('.rc-tree-treenode-active').length).toBeTruthy();

      // Mouse move
      wrapper
        .find('.rc-tree-treenode')
        .at(1)
        .simulate('mouseMove');
      expect(wrapper.find(InternalTreeNode).find('.rc-tree-treenode-active').length).toBeFalsy();
    });
  });

  it('disabled should prevent keyboard', () => {
    const wrapper = mount(<Tree disabled />);
    expect(wrapper.find('input').props().disabled).toBeTruthy();
  });
});
