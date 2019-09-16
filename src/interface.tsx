import * as React from 'react';
import { TreeNodeProps } from './TreeNode';

export interface DataNode {
  checkable?: boolean;
  children?: DataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  key: string | number;
  title?: React.ReactNode;
  selectable?: boolean;
  switcherIcon?: IconType;

  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  className?: string;
  style?: React.CSSProperties;
}

export interface EventDataNode extends Omit<DataNode, 'children'> {
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  pos: string;
  active: boolean;
}

export type IconType = React.ReactNode | ((props: TreeNodeProps) => React.ReactNode);

export type Key = string | number;

export type NodeElement = React.ReactElement<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement;
  type: {
    isTreeNode: boolean;
  };
};

export type NodeInstance = React.Component<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement;
};

export interface Entity {
  node: NodeElement;
  index: number;
  key: Key;
  pos: string;
  parent?: Entity;
  children?: Entity[];
}

export interface DataEntity extends Omit<Entity, 'node' | 'parent' | 'children'> {
  node: DataNode;
  parent?: DataEntity;
  children?: DataEntity[];
  level: number;
}

export interface FlattenNode {
  parent: FlattenNode | null;
  children: FlattenNode[];
  pos: string;
  data: DataNode;
  isStart: boolean[];
  isEnd: boolean[];
}
