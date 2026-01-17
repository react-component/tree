/* eslint-disable no-undef, react/no-multi-comp */
import { fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import React from 'react';
import Tree, { FieldDataNode } from '../src';
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

      const { container, getByRole } = render(
        <Tree
          {...props}
          onExpand={onExpand}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onActiveChange={onActiveChange}
          defaultExpandedKeys={['parent', 'child 1', 'child 2']}
          treeData={[{ key: 'parent', children: [{ key: 'child 1' }, { key: 'child 2' }] }]}
        />,
      );

      function keyDown(keyCode: number) {
        fireEvent.keyDown(getByRole('tree'), {
          keyCode,
        });
      }

      function getTreeNode(index: number) {
        const treeNodes = container
          .querySelector('.rc-tree-list-holder')
          .querySelectorAll('.rc-tree-treenode');

        return treeNodes[(index + treeNodes.length) % treeNodes.length];
      }

      // Focus
      fireEvent.focus(getByRole('tree'));
      expect(onFocus).toHaveBeenCalled();

      // Arrow up: last one
      keyDown(KeyCode.UP);
      expect(getTreeNode(-1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow down: first one
      keyDown(KeyCode.DOWN);
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow up: last one again
      keyDown(KeyCode.UP);
      expect(getTreeNode(-1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow left: parent
      keyDown(KeyCode.LEFT);
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow left: collapse
      keyDown(KeyCode.LEFT);
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: expand
      onExpand.mockReset();
      keyDown(KeyCode.RIGHT);
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2', 'parent'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: first child
      onExpand.mockReset();
      keyDown(KeyCode.RIGHT);
      expect(getTreeNode(1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 1');

      // SPACE: confirm
      keyDown(KeyCode.SPACE);
      spaceCallback();
      checkKeyDownTrigger();

      // ENTER: confirm again
      keyDown(KeyCode.ENTER);
      enterCallback();
      checkKeyDownTrigger();

      // Blur
      fireEvent.blur(getByRole('tree'));
      expect(onBlur).toHaveBeenCalled();

      // null activeKey
      fireEvent.mouseMove(getTreeNode(0));
      checkActiveTrigger(null);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.mouseMove(getTreeNode(0));
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
      const { container, getByRole } = render(<Tree defaultExpandAll treeData={[]} />);

      fireEvent.focus(getByRole('tree'));

      // Arrow should not work
      fireEvent.keyDown(getByRole('tree'), {
        keyCode: KeyCode.UP,
      });
      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();
    });

    it('remove active if mouse hover', () => {
      const { container, getByRole } = render(
        <Tree defaultExpandAll treeData={[{ key: 'parent' }]} />,
      );

      fireEvent.focus(getByRole('tree'));

      fireEvent.keyDown(getByRole('tree'), {
        keyCode: KeyCode.UP,
      });
      expect(container.querySelector('.rc-tree-treenode-active')).toBeTruthy();

      // Mouse move
      fireEvent.mouseMove(container.querySelectorAll('.rc-tree-treenode')[1]);
      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();
    });

    it('fieldNames should also work', () => {
      const onActiveChange = jest.fn();
      const onSelect = jest.fn();

      const { container, getByRole } = render(
        <Tree<FieldDataNode<{ value: string }>>
          defaultExpandAll
          treeData={[{ value: 'first' }, { value: 'second' }]}
          fieldNames={{ key: 'value' }}
          onActiveChange={onActiveChange}
          onSelect={onSelect}
        />,
      );

      fireEvent.focus(getByRole('tree'));

      fireEvent.keyDown(getByRole('tree'), {
        keyCode: KeyCode.DOWN,
      });
      expect(onActiveChange).toHaveBeenCalledWith('first');

      fireEvent.keyDown(getByRole('tree'), {
        keyCode: KeyCode.DOWN,
      });
      expect(onActiveChange).toHaveBeenCalledWith('second');

      fireEvent.keyDown(getByRole('tree'), {
        keyCode: KeyCode.ENTER,
      });
      expect(onSelect).toHaveBeenCalledWith(['second'], expect.anything());
    });
  });

  it('disabled should prevent keyboard', () => {
    const onActiveChange = jest.fn();
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const onCheck = jest.fn();

    const { container, getByRole } = render(
      <Tree
        disabled
        checkable
        defaultExpandAll
        treeData={[
          {
            key: 'parent',
            children: [{ key: 'child 1' }, { key: 'child 2' }],
          },
        ]}
        onActiveChange={onActiveChange}
        onExpand={onExpand}
        onSelect={onSelect}
        onCheck={onCheck}
      />,
    );

    const tree = getByRole('tree');
    expect(tree).not.toHaveAttribute('tabindex');

    fireEvent.keyDown(tree, { key: 'ArrowDown' });
    expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();
    expect(tree).not.toHaveAttribute('aria-activedescendant');
    expect(onActiveChange).not.toHaveBeenCalled();

    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(onExpand).not.toHaveBeenCalled();

    fireEvent.keyDown(tree, { key: 'Enter' });
    expect(onCheck).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  describe('activeKey in control', () => {
    it('basic', () => {
      const { container, rerender } = render(
        <Tree
          treeData={[
            {
              title: 'Parent',
              key: 'parent',
            },
          ]}
        />,
      );

      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();

      rerender(
        <Tree
          treeData={[
            {
              title: 'Parent',
              key: 'parent',
            },
          ]}
          activeKey="parent"
        />,
      );
      expect(container.querySelector('.rc-tree-treenode-active')).toBeTruthy();
    });

    it('with fieldNames', () => {
      const { container, rerender } = render(
        <Tree<FieldDataNode<{ title: string; value: string }>>
          fieldNames={{ key: 'value' }}
          treeData={[
            {
              title: 'Parent',
              value: 'parent',
            },
          ]}
        />,
      );

      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();

      rerender(
        <Tree<FieldDataNode<{ title: string; value: string }>>
          fieldNames={{ key: 'value' }}
          treeData={[
            {
              title: 'Parent',
              value: 'parent',
            },
          ]}
          activeKey="parent"
        />,
      );
      expect(container.querySelector('.rc-tree-treenode-active')).toBeTruthy();
    });
  });
});
