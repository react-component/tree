/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */
import * as React from 'react';
import { IconType, Key, DataEntity, EventNode } from './interface';

type NodeMouseEventHandler = (e: React.MouseEvent<HTMLDivElement>, node: EventNode) => void;

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

  loadData: (treeNode: EventNode) => Promise<void>;
  filterTreeNode: (treeNode: EventNode) => boolean;

  onNodeClick: NodeMouseEventHandler;
  onNodeDoubleClick: NodeMouseEventHandler;
  onNodeExpand: NodeMouseEventHandler;
  onNodeSelect: NodeMouseEventHandler;
  onNodeCheck: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventNode, checked: boolean) => void;
  onNodeLoad: (treeNode: EventNode) => void;
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

export const TreeContext: React.Context<TreeContextProps | null> = React.createContext(null);
