import { DataNode, FlattenDataNode } from '../interface';

/**
 * Flat nest tree data into flatten list. This is used for virtual list render.
 */
export function flattenTreeData(treeNodeList: DataNode[] = []): FlattenDataNode[] {
  const flattenList: FlattenDataNode[] = [];

  function dig(list: DataNode[], parent: FlattenDataNode = null): FlattenDataNode[] {
    return list.map(treeNode => {
      // Add FlattenDataNode into list
      const flattenNode: FlattenDataNode = {
        ...treeNode,
        parent,
        children: null,
      };

      flattenList.push(flattenNode);

      // Loop treeNode children
      flattenNode.children = dig(treeNode.children || [], flattenNode);

      return flattenNode;
    });
  }

  dig(treeNodeList);

  return flattenList;
}
