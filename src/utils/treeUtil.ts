import { TreeNode, FlattenTreeNode } from '../interface';

/**
 * Flat nest tree data into flatten list. This is used for virtual list render.
 */
export function flattenTreeData(treeNodeList: TreeNode[] = []): FlattenTreeNode[] {
  const flattenList: FlattenTreeNode[] = [];

  function dig(list: TreeNode[], parent: FlattenTreeNode = null): FlattenTreeNode[] {
    return list.map(treeNode => {
      // Add FlattenTreeNode into list
      const flattenNode: FlattenTreeNode = {
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
