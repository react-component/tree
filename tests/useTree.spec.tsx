import { renderHook } from '@testing-library/react';
import type { BasicDataNode } from '../src';
import { useTree } from '../src';

interface CustomNode extends BasicDataNode {
  id: string;
  nodes?: CustomNode[];
}

describe('useTree', () => {
  it('returns the entity path from root to target', () => {
    const treeData = [{ key: 'root', children: [{ key: 'target' }] }];
    const { result } = renderHook(() => useTree(treeData, {}));

    expect(result.current.getPath('target').map(entity => entity.key)).toEqual(['root', 'target']);
    expect(result.current.getPath('missing')).toEqual([]);
  });

  it('supports custom field names', () => {
    const treeData: CustomNode[] = [{ id: 'root', nodes: [{ id: 'target' }] }];
    const { result } = renderHook(() =>
      useTree(treeData, {
        fieldNames: { key: 'id', children: 'nodes' },
      }),
    );

    expect(result.current.getPath('target').map(entity => entity.node.id)).toEqual([
      'root',
      'target',
    ]);
  });

  it('keeps getPath stable when inputs change', () => {
    const { result, rerender } = renderHook(({ data }) => useTree(data, {}), {
      initialProps: { data: [{ key: 'first' }] },
    });
    const getPath = result.current.getPath;

    rerender({ data: [{ key: 'second' }] });

    expect(result.current.getPath).toBe(getPath);
    expect(getPath('second').map(entity => entity.key)).toEqual(['second']);
  });
});
