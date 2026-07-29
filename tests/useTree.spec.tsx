import { renderHook } from '@testing-library/react';
import type { BasicDataNode } from '../src';
import { useTree } from '../src';

describe('useTree', () => {
  it('returns the entity path from root to target', () => {
    const treeData = [
      {
        key: 'root',
        children: [
          {
            key: 'folder',
            children: [{ key: 'target' }],
          },
        ],
      },
    ];
    const { result } = renderHook(() => useTree(treeData, {}));

    expect(Object.keys(result.current)).toEqual(['getPath']);
    expect(result.current.getPath('target').map(entity => entity.key)).toEqual([
      'root',
      'folder',
      'target',
    ]);
    expect(result.current.getPath('missing')).toEqual([]);
  });

  it('supports custom field names', () => {
    interface CustomNode extends BasicDataNode {
      id: string;
      nodes?: CustomNode[];
    }

    const treeData: CustomNode[] = [
      {
        id: 'root',
        nodes: [
          {
            id: 'target',
          },
        ],
      },
    ];
    const fieldNames = {
      key: 'id',
      children: 'nodes',
    };
    const { result } = renderHook(() =>
      useTree(treeData, {
        fieldNames,
      }),
    );

    expect(result.current.getPath('target').map(entity => entity.node.id)).toEqual([
      'root',
      'target',
    ]);
  });

  it('keeps getPath stable when inputs change', () => {
    const treeData = [{ key: 'root' }];
    const { result, rerender } = renderHook(({ data }) => useTree(data, {}), {
      initialProps: { data: treeData },
    });
    const getPath = result.current.getPath;

    rerender({ data: [{ key: 'next' }] });

    expect(result.current.getPath).toBe(getPath);
    expect(getPath('root')).toEqual([]);
    expect(getPath('next').map(entity => entity.key)).toEqual(['next']);
  });
});
