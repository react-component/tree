/* eslint-disable no-undef, react/no-multi-comp */
import { fireEvent, render } from '@testing-library/react';
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

      function keyDown(key: string) {
        fireEvent.keyDown(getByRole('tree'), {
          key,
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
      keyDown('ArrowUp');
      expect(getTreeNode(-1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow down: first one
      keyDown('ArrowDown');
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow up: last one again
      keyDown('ArrowUp');
      expect(getTreeNode(-1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 2');

      // Arrow left: parent
      keyDown('ArrowLeft');
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('parent');

      // Arrow left: collapse
      keyDown('ArrowLeft');
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: expand
      onExpand.mockReset();
      keyDown('ArrowRight');
      expect(getTreeNode(0)).toHaveClass('rc-tree-treenode-active');
      expect(onExpand).toHaveBeenCalledWith(['child 1', 'child 2', 'parent'], expect.anything());
      checkKeyDownTrigger();

      // Arrow right: first child
      onExpand.mockReset();
      keyDown('ArrowRight');
      expect(getTreeNode(1)).toHaveClass('rc-tree-treenode-active');
      checkKeyDownTrigger();
      checkActiveTrigger('child 1');

      // SPACE: confirm
      keyDown(' ');
      spaceCallback();
      checkKeyDownTrigger();

      // ENTER: confirm again
      keyDown('Enter');
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
          expect(onSelect).not.toHaveBeenCalled();
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
          expect(onCheck).not.toHaveBeenCalled();
        },
      );
    });

    it('Enter expands parent and Space selects without expanding', () => {
      const onExpand = jest.fn();
      const onSelect = jest.fn();

      const { getByRole } = render(
        <Tree
          onExpand={onExpand}
          onSelect={onSelect}
          treeData={[{ key: 'parent', children: [{ key: 'child' }] }, { key: 'single' }]}
        />,
      );

      const tree = getByRole('tree');
      fireEvent.focus(tree);

      fireEvent.keyDown(tree, { key: 'Enter' });
      expect(onExpand).toHaveBeenCalledWith(['parent'], expect.anything());
      expect(onSelect).not.toHaveBeenCalled();

      onExpand.mockReset();
      fireEvent.keyDown(tree, { key: ' ' });
      expect(onSelect).toHaveBeenCalledWith(['parent'], expect.anything());
      expect(onExpand).not.toHaveBeenCalled();
    });

    it('should expand when dynamically loading data', () => {
      const onExpand = jest.fn();
      const loadData = jest.fn(() => Promise.resolve());

      const { getByRole } = render(
        <Tree onExpand={onExpand} loadData={loadData} treeData={[{ key: 'parent' }]} />,
      );

      const tree = getByRole('tree');
      fireEvent.focus(tree);

      fireEvent.keyDown(tree, { key: 'ArrowRight' });
      expect(onExpand).toHaveBeenCalledWith(['parent'], expect.anything());
    });

    it('Enter checks when unchecked and does not uncheck when already checked', () => {
      const onCheck = jest.fn();

      const { getByRole } = render(
        <Tree checkable selectable={false} onCheck={onCheck} treeData={[{ key: 'leaf' }]} />,
      );

      const tree = getByRole('tree');
      fireEvent.focus(tree);

      fireEvent.keyDown(tree, { key: 'Enter' });
      expect(onCheck).toHaveBeenCalledWith(['leaf'], expect.anything());
      onCheck.mockReset();

      fireEvent.keyDown(tree, { key: 'Enter' });
      expect(onCheck).not.toHaveBeenCalled();
    });

    it('not crash if not exist', () => {
      const { container, getByRole } = render(<Tree defaultExpandAll treeData={[]} />);

      fireEvent.focus(getByRole('tree'));

      // Arrow should not work
      fireEvent.keyDown(getByRole('tree'), {
        key: 'ArrowUp',
      });
      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();
    });

    it('remove active if mouse hover', () => {
      const { container, getByRole } = render(
        <Tree defaultExpandAll treeData={[{ key: 'parent' }]} />,
      );

      fireEvent.focus(getByRole('tree'));

      fireEvent.keyDown(getByRole('tree'), {
        key: 'ArrowUp',
      });
      expect(container.querySelector('.rc-tree-treenode-active')).toBeTruthy();

      // Mouse move
      fireEvent.mouseMove(container.querySelectorAll('.rc-tree-treenode')[1]);
      expect(container.querySelector('.rc-tree-treenode-active')).toBeFalsy();
    });

    it('fieldNames should also work', () => {
      const onActiveChange = jest.fn();
      const onSelect = jest.fn();

      const { getByRole } = render(
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
        key: 'ArrowDown',
      });
      expect(onActiveChange).toHaveBeenCalledWith('second');

      fireEvent.keyDown(getByRole('tree'), {
        key: 'Enter',
      });
      expect(onSelect).toHaveBeenCalledWith(['second'], expect.anything());
    });
  });

  describe('focus default active', () => {
    it('should active first selected node when focused', () => {
      const { getByRole } = render(
        <Tree defaultSelectedKeys={['b']} treeData={[{ key: 'a' }, { key: 'b' }]} />,
      );

      const tree = getByRole('tree');
      expect(tree).not.toHaveAttribute('aria-activedescendant');

      fireEvent.focus(tree);
      const activeId = tree.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId)).toHaveAttribute('role', 'treeitem');
    });

    it('should active selected node when key is 0', () => {
      const { getByRole } = render(
        <Tree defaultSelectedKeys={[0]} treeData={[{ key: 0 }, { key: 1 }]} />,
      );

      const tree = getByRole('tree');
      expect(tree).not.toHaveAttribute('aria-activedescendant');

      fireEvent.focus(tree);
      const activeId = tree.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId)).toHaveAttribute('role', 'treeitem');
    });

    it('should active first node when focused without selection', () => {
      const { getByRole } = render(<Tree treeData={[{ key: 'a' }, { key: 'b' }]} />);

      const tree = getByRole('tree');
      expect(tree).not.toHaveAttribute('aria-activedescendant');

      fireEvent.focus(tree);
      const activeId = tree.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId)).toHaveAttribute('role', 'treeitem');
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

  it('Home/End key navigation', () => {
    const onActiveChange = jest.fn();

    const { getByRole } = render(
      <Tree
        onActiveChange={onActiveChange}
        defaultExpandedKeys={['parent']}
        treeData={[
          {
            key: 'parent',
            children: [{ key: 'child 1' }, { key: 'child 2' }, { key: 'child 3' }],
          },
        ]}
      />,
    );

    const tree = getByRole('tree');
    fireEvent.focus(tree);
    onActiveChange.mockReset();

    fireEvent.keyDown(tree, { key: 'End' });
    let activeId = tree.getAttribute('aria-activedescendant');
    expect(document.getElementById(activeId)).toHaveAttribute('role', 'treeitem');
    expect(onActiveChange).toHaveBeenCalledWith('child 3');

    onActiveChange.mockReset();
    fireEvent.keyDown(tree, { key: 'Home' });
    activeId = tree.getAttribute('aria-activedescendant');
    expect(document.getElementById(activeId)).toHaveAttribute('role', 'treeitem');
    expect(onActiveChange).toHaveBeenCalledWith('parent');
  });

  describe('disabled node aria attributes', () => {
    it('disabled node should not have aria-selected', () => {
      const { getByRole } = render(
        <Tree
          defaultSelectedKeys={['normal', 'disabled']}
          treeData={[
            { key: 'normal', title: 'Normal Node' },
            { key: 'disabled', title: 'Disabled Node', disabled: true },
          ]}
        />,
      );

      const normalNode = getByRole('treeitem', { name: 'Normal Node' });
      const disabledNode = getByRole('treeitem', { name: 'Disabled Node' });

      expect(normalNode).toHaveAttribute('aria-selected', 'true');
      expect(disabledNode).not.toHaveAttribute('aria-selected');
    });

    it('disabled node should not have aria-checked', () => {
      const { getByRole } = render(
        <Tree
          checkable
          selectable={false}
          defaultCheckedKeys={['normal', 'disabled']}
          treeData={[
            { key: 'normal', title: 'Normal Node' },
            { key: 'disabled', title: 'Disabled Node', disabled: true },
          ]}
        />,
      );

      const normalNode = getByRole('treeitem', { name: 'Normal Node' });
      const disabledNode = getByRole('treeitem', { name: 'Disabled Node' });

      expect(normalNode).toHaveAttribute('aria-checked', 'true');
      expect(disabledNode).not.toHaveAttribute('aria-checked');
    });
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
