import * as React from 'react';

export type Path = (string | number)[];

export interface TreeNode {
  title?: React.ReactNode;
  key?: string | number;
  disabled?: boolean;
  selectable?: boolean;
  children?: TreeNode[];
}

export interface FlattenTreeNode extends Omit<TreeNode, 'children'> {
  parent: FlattenTreeNode | null;
  children: FlattenTreeNode[];
}
