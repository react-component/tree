import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import { DataNode, FlattenDataNode, NodeElement, DataEntity, Key } from '../interface';
import { getPosition } from '../util';

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

/**
 * Traverse all the data by `treeData`.
 * Please not use it out of the `rc-tree` since we may refactor this code.
 */
export function traverseDataNodes(
  dataNodes: DataNode[],
  callback: (data: {
    node: DataNode;
    index: number;
    pos: string | number;
    key: Key;
    parentPos: string | number;
  }) => void,
) {
  function processNode(
    node: DataNode,
    index?: number,
    parent?: { node: DataNode; pos: string | number },
  ) {
    const children = node ? node.children : dataNodes;
    const pos = node ? getPosition(parent.pos, index) : 0;

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null,
      };

      callback(data);
    }

    // Process children node
    if (children) {
      children.forEach((subNode, subIndex) => {
        processNode(subNode, subIndex, { node, pos });
      });
    }
  }

  processNode(null);
}

interface Wrapper {
  posEntities: Record<string, DataEntity>;
  keyEntities: Record<Key, DataEntity>;
}

/**
 * Convert `treeData` into entity records.
 */
export function convertDataToEntities(
  dataNodes: DataNode[],
  {
    initWrapper,
    processEntity,
    onProcessFinished,
  }: {
    initWrapper?: (wrapper: Wrapper) => Wrapper;
    processEntity?: (entity: DataEntity, wrapper: Wrapper) => void;
    onProcessFinished?: (wrapper: Wrapper) => void;
  } = {},
) {
  const posEntities = {};
  const keyEntities = {};
  let wrapper = {
    posEntities,
    keyEntities,
  };

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }

  traverseDataNodes(dataNodes, item => {
    const { node, index, pos, key, parentPos } = item;
    const entity: DataEntity = { node, index, key, pos };

    posEntities[pos] = entity;
    keyEntities[key] = entity;

    // Fill children
    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }

    if (processEntity) {
      processEntity(entity, wrapper);
    }
  });

  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }

  return wrapper;
}
