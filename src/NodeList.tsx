/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import VirtualList from 'rc-virtual-list';
import { FlattenDataNode, Key, DataEntity } from './interface';
import MotionTreeNode from './MotionTreeNode';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';
import { getTreeNodeProps, getKey } from './utils/treeUtil';

export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;

export const MotionNode: DataEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: {
    key: MOTION_KEY,
  },
};

const MotionFlattenData: FlattenDataNode = {
  ...MotionNode.node,
  parent: null,
  children: [],
  pos: MotionNode.pos,
};

interface NodeListProps {
  prefixCls: string;
  className: string;
  style: React.CSSProperties;
  data: FlattenDataNode[];
  motion: any;

  expandedKeys: Key[];
  selectedKeys: Key[];
  checkedKeys: Key[];
  loadedKeys: Key[];
  loadingKeys: Key[];
  halfCheckedKeys: Key[];
  keyEntities: Record<Key, DataEntity>;
  dragOverNodeKey: Key;
  dropPosition: number;

  // Virtual list
  height: number;
  itemHeight: number;
}

/**
 * We only need get visible content items to play the animation.
 */
export function getMinimumRangeTransitionRange(
  list: FlattenDataNode[],
  height: number,
  itemHeight: number,
) {
  if (!height) {
    return list;
  }

  return list.slice(0, Math.ceil(height / itemHeight) + 1);
}

function itemKey(item: FlattenDataNode) {
  const { key, pos } = item;
  return getKey(key, pos);
}

const NodeList: React.FC<NodeListProps> = ({
  prefixCls,
  data,
  expandedKeys,
  selectedKeys,
  checkedKeys,
  loadedKeys,
  loadingKeys,
  halfCheckedKeys,
  keyEntities,
  dragOverNodeKey,
  dropPosition,
  motion,

  height,
  itemHeight,

  ...domProps
}) => {
  const [disableVirtual, setDisableVirtual] = React.useState(false);
  const [prevExpandedKeys, setPrevExpandedKeys] = React.useState(expandedKeys);
  const [prevData, setPrevData] = React.useState(data);
  const [transitionData, setTransitionData] = React.useState(data);
  const [transitionRange, setTransitionRange] = React.useState([]);
  const [motionType, setMotionType] = React.useState<'show' | 'hide' | null>(null);

  // Do animation if expanded keys changed
  React.useEffect(() => {
    setPrevExpandedKeys(expandedKeys);

    const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);

    if (diffExpanded.key !== null) {
      if (diffExpanded.add) {
        const keyIndex = prevData.findIndex(({ key }) => key === diffExpanded.key);

        setDisableVirtual(true);
        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(prevData, data, diffExpanded.key),
          height,
          itemHeight,
        );

        const newTransitionData: FlattenDataNode[] = prevData.slice();
        newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setMotionType('show');
      } else {
        const keyIndex = data.findIndex(({ key }) => key === diffExpanded.key);

        setDisableVirtual(true);
        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(data, prevData, diffExpanded.key),
          height,
          itemHeight,
        );

        const newTransitionData: FlattenDataNode[] = data.slice();
        newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setMotionType('hide');
      }
    }
  }, [expandedKeys]);

  function onMotionEnd() {
    setPrevData(data);
    setTransitionData(data);
    setTransitionRange([]);
    setMotionType(null);
    setDisableVirtual(false);
  }

  const mergedData = motion ? transitionData : data;

  const treeNodeRequiredProps = {
    expandedKeys,
    selectedKeys,
    loadedKeys,
    loadingKeys,
    checkedKeys,
    halfCheckedKeys,
    dragOverNodeKey,
    dropPosition,
    keyEntities,
  };

  return (
    <VirtualList
      {...domProps}
      disabled={disableVirtual}
      role="tree"
      data={mergedData}
      itemKey={itemKey}
      height={height}
      itemHeight={itemHeight}
      onSkipRender={onMotionEnd}
      prefixCls={`${prefixCls}-list`}
    >
      {(treeNode: FlattenDataNode) => {
        const { key, ...restProps } = treeNode;
        const mergedKey = getKey(key, restProps.pos);
        delete restProps.children;

        const treeNodeProps = getTreeNodeProps(mergedKey, treeNodeRequiredProps);

        return (
          <MotionTreeNode
            {...restProps}
            {...treeNodeProps}
            motion={motion}
            motionNodes={key === MOTION_KEY ? transitionRange : null}
            motionType={motionType}
            onMotionEnd={onMotionEnd}
            treeNodeRequiredProps={treeNodeRequiredProps}
          />
        );
      }}
    </VirtualList>
  );
};

export default NodeList;
