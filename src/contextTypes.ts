/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */
import * as React from 'react';
import createReactContext, { Context } from '@ant-design/create-react-context';
import { IconType, NodeElement, Key, DataEntity } from './interface';
import { InternalTreeNodeProps } from './TreeNode';

type NodeMouseEventHandler = (e: MouseEvent, node: React.Component<InternalTreeNodeProps>) => void;

export interface TreeContextProps {
  prefixCls: string;
  selectable: boolean;
  showIcon: boolean;
  icon: IconType;
  switcherIcon: IconType;
  draggable: boolean;
  checkable: boolean | React.ReactNode;
  checkStrictly: boolean;
  disabled: boolean;
  keyEntities: Record<Key, DataEntity>;
  indentSize: number;

  loadData: (treeNode: NodeElement) => Promise<void>;
  filterTreeNode: (treeNode: NodeElement) => boolean;

  onNodeClick: NodeMouseEventHandler;
  onNodeDoubleClick: NodeMouseEventHandler;
  onNodeExpand: NodeMouseEventHandler;
  onNodeSelect: NodeMouseEventHandler;
  onNodeCheck: (e: MouseEvent, treeNode: NodeElement, checked: boolean) => void;
  onNodeLoad: (treeNode: NodeElement) => void;
  onNodeMouseEnter: NodeMouseEventHandler;
  onNodeMouseLeave: NodeMouseEventHandler;
  onNodeContextMenu: NodeMouseEventHandler;
  onNodeDragStart: NodeMouseEventHandler;
  onNodeDragEnter: NodeMouseEventHandler;
  onNodeDragOver: NodeMouseEventHandler;
  onNodeDragLeave: NodeMouseEventHandler;
  onNodeDragEnd: NodeMouseEventHandler;
  onNodeDrop: NodeMouseEventHandler;
}

export const TreeContext: Context<TreeContextProps | null> = createReactContext(null);
