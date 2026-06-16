import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Tree from '../src';
import { flattenTreeData } from '../src/utils/treeUtil';

jest.mock('../src/utils/treeUtil', () => {
  const origin = jest.requireActual('../src/utils/treeUtil');
  return {
    ...origin,
    flattenTreeData: jest.fn(origin.flattenTreeData),
  };
});

const treeData = [
  {
    key: '0-0',
    title: 'parent',
    children: [{ key: '0-0-0', title: 'child' }],
  },
];

describe('expandedKeys', () => {
  const flattenMock = flattenTreeData as unknown as jest.Mock;

  beforeEach(() => {
    flattenMock.mockClear();
  });

  it('should not recompute flattenTreeData when expandedKeys is controlled', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Tree treeData={treeData} expandedKeys={[]} onExpand={onExpand} />,
    );

    flattenMock.mockClear();

    fireEvent.click(container.querySelector('.rc-tree-switcher'));

    expect(onExpand).toHaveBeenCalledWith(['0-0'], expect.objectContaining({ expanded: true }));
    expect(flattenMock).not.toHaveBeenCalled();
  });

  it('should recompute flattenTreeData in uncontrolled mode', () => {
    const { container } = render(<Tree treeData={treeData} />);

    flattenMock.mockClear();

    fireEvent.click(container.querySelector('.rc-tree-switcher'));

    expect(flattenMock).toHaveBeenCalled();
  });
});
