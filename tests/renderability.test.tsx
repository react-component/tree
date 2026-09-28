import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tree from '../src';

describe('ReactNode renderability', () => {
  const treeData = [
    { key: 'a', title: 'A', switcherIcon: 0, children: [{ key: 'b', title: 'B' }] },
  ];

  it('renders zero drag and per-node switcher icons', () => {
    const { container } = render(
      <Tree treeData={treeData} draggable={{ icon: 0 }} switcherIcon="GLOBAL" />,
    );
    expect(container.querySelector('.rc-tree-draggable-icon').textContent).toBe('0');
    expect(container.querySelector('.rc-tree-switcher').textContent).toBe('0');
  });

  it('renders and toggles zero checkboxes with conduction', () => {
    const onCheck = jest.fn();
    const { container } = render(
      <Tree treeData={treeData} checkable={0} defaultExpandAll onCheck={onCheck} />,
    );
    const checkbox = container.querySelector('.rc-tree-checkbox');
    expect(checkbox.textContent).toBe('0');
    fireEvent.click(checkbox);
    expect(onCheck.mock.calls[0][0]).toEqual(['a', 'b']);
    expect(container.querySelectorAll('.rc-tree-checkbox-checked')).toHaveLength(2);
  });

  it('handles keyboard checks for a zero checkbox', () => {
    const onCheck = jest.fn();
    const { container } = render(
      <Tree treeData={treeData} checkable={0} activeKey="a" onCheck={onCheck} />,
    );
    fireEvent.keyDown(container.querySelector('[role="tree"]'), {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });
    expect(onCheck).toHaveBeenCalled();
  });

  it.each([false, null, undefined, ''])('keeps checkable %s disabled', checkable => {
    const { container } = render(<Tree treeData={treeData} checkable={checkable} />);
    expect(container.querySelector('.rc-tree-checkbox')).toBeNull();
  });
});
