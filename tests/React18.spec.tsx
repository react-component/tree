import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tree from '../src';

describe('React 18', () => {
  it('not block in StrictMode', () => {
    const onExpand = jest.fn();
    const { container } = render(
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
      />,
    );

    // All opened
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(2);

    // Collapse one
    fireEvent.click(container.querySelector('.rc-tree-switcher_open'));
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(1);
  });
});
