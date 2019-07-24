import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import { DataNode, FlattenDataNode, NodeElement } from '../interface';

/**
 * Convert `children` of Tree into `treeData` structure.
 */
export function convertTreeToData(rootNodes: React.ReactNode): DataNode[] {
  function dig(node: React.ReactNode): DataNode[] {
    const treeNodes: NodeElement[] = toArray(node);
    return treeNodes
      .map(treeNode => {
        // Filter invalidate node
        if (!React.isValidElement(treeNode)) {
          return null;
        }

        const { key } = treeNode;
        const { children, ...rest } = treeNode.props;

        const dataNode: DataNode = {
          key,
          ...rest,
        };

        const parsedChildren = dig(children);
        if (parsedChildren.length) {
          dataNode.children = parsedChildren;
        }

        return dataNode;
      })
      .filter((dataNode: DataNode) => dataNode);
  }

  return dig(rootNodes);
}

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
