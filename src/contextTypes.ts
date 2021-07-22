/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */
import * as React from 'react';
import {
  IconType,
  Key,
  DataEntity,
  EventDataNode,
  NodeInstance,
  DataNode,
  Direction,
} from './interface';

export type NodeMouseEventParams<T = HTMLSpanElement> = {
  event: React.MouseEvent<T>;
  node: EventDataNode;
};
export type NodeDragEventParams<T = HTMLDivElement> = {
  event: React.DragEvent<T>;
  node: EventDataNode;
};

export type NodeMouseEventHandler<T = HTMLSpanElement> = (
  e: React.MouseEvent<T>,
  node: EventDataNode,
) => void;
export type NodeDragEventHandler<T = HTMLDivElement> = (
  e: React.DragEvent<T>,
  node: NodeInstance,
  outsideTree?: boolean,
) => void;

export interface TreeContextProps {
  prefixCls: string;
  selectable: boolean;
  showIcon: boolean;
  icon: IconType;
  switcherIcon: IconType;
  draggable: ((node: DataNode) => boolean) | boolean;
  checkable: boolean | React.ReactNode;
  checkStrictly: boolean;
  disabled: boolean;
  keyEntities: Record<Key, DataEntity>;
  // for details see comment in Tree.state (Tree.tsx)
  dropLevelOffset?: number;
  dropContainerKey: Key | null;
  dropTargetKey: Key | null;
  dropPosition: -1 | 0 | 1 | null;
  indent: number | null;
  dropIndicatorRender: (props: {
    dropPosition: -1 | 0 | 1;
    dropLevelOffset: number;
    indent;
    prefixCls;
    direction: Direction;
  }) => React.ReactNode;
  dragOverNodeKey: Key | null;
  direction: Direction;

  loadData: (treeNode: EventDataNode) => Promise<void>;
  filterTreeNode: (treeNode: EventDataNode) => boolean;
  titleRender?: (node: DataNode) => React.ReactNode;

  onNodeClick: NodeMouseEventHandler;
  onNodeDoubleClick: NodeMouseEventHandler;
  onNodeExpand: NodeMouseEventHandler;
  onNodeSelect: NodeMouseEventHandler;
  onNodeCheck: (
    e: React.MouseEvent<HTMLSpanElement>,
    treeNode: EventDataNode,
    checked: boolean,
  ) => void;
  onNodeLoad: (treeNode: EventDataNode) => void;
  onNodeMouseEnter: NodeMouseEventHandler;
  onNodeMouseLeave: NodeMouseEventHandler;
  onNodeContextMenu: NodeMouseEventHandler;
  onNodeDragStart: NodeDragEventHandler;
  onNodeDragEnter: NodeDragEventHandler;
  onNodeDragOver: NodeDragEventHandler;
  onNodeDragLeave: NodeDragEventHandler;
  onNodeDragEnd: NodeDragEventHandler;
  onNodeDrop: NodeDragEventHandler;
}

export const TreeContext: React.Context<TreeContextProps | null> = React.createContext(null);
