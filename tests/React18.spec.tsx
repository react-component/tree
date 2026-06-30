import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Tree from '../src';

describe('React 18', () => {
  // This does not real work since waring is in 18.3.0 but current still is next version.
  it('no warning', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <React.StrictMode>
        <Tree
          defaultExpandAll
          treeData={[
            {
              title: 'Parent',
              key: 'parent',
            },
          ]}
        />
      </React.StrictMode>,
    );

    expect(errSpy).not.toHaveBeenCalled();
  });

  it('expand work', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <React.StrictMode>
        <Tree
          defaultExpandAll
          onExpand={onExpand}
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
        />
      </React.StrictMode>,
    );

    // All opened
    expect(onExpand).not.toHaveBeenCalled();
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(2);

    // Collapse one
    fireEvent.click(container.querySelector('.rc-tree-switcher_open'));
    expect(onExpand).toHaveBeenCalled();
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(1);
  });

  it('checkable work', () => {
    const onCheck = jest.fn();
    const { container } = render(
      <React.StrictMode>
        <Tree
          defaultExpandAll
          onCheck={onCheck}
          checkable
          treeData={[
            {
              title: 'Parent',
              key: 'parent',
            },
          ]}
        />
      </React.StrictMode>,
    );

    expect(onCheck).not.toHaveBeenCalled();
    expect(container.querySelector('.rc-tree-checkbox-checked')).toBeFalsy();

    fireEvent.click(container.querySelector('.rc-tree-checkbox'));
    expect(onCheck).toHaveBeenCalled();
    expect(container.querySelector('.rc-tree-checkbox-checked')).toBeTruthy();
  });
});
