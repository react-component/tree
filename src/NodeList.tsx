/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import VirtualList from 'rc-virtual-list';
import { FlattenDataNode, Key, Entity, DataEntity } from './interface';
import MotionTreeNode from './MotionTreeNode';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';

export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;

export const MotionNode: DataEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: 0,
  node: {
    key: MOTION_KEY,
  },
};

const MotionFlattenData: FlattenDataNode = {
  ...MotionNode.node,
  parent: null,
  children: [],
};

interface NodeListProps {
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
  keyEntities: Record<Key, Entity>;
  dragOverNodeKey: Key;
  dropPosition: number;

  // Virtual list
  height: number;
  itemHeight: number;
}

const NodeList: React.FC<NodeListProps> = ({
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

    // TODO: Slice only visible count!
    if (diffExpanded.key !== null) {
      if (diffExpanded.add) {
        const keyIndex = prevData.findIndex(({ key }) => key === diffExpanded.key);

        setDisableVirtual(true);
        const rangeNodes = getExpandRange(prevData, data, diffExpanded.key);

        const newTransitionData: FlattenDataNode[] = prevData.slice();
        newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setMotionType('show');
      } else {
        const keyIndex = data.findIndex(({ key }) => key === diffExpanded.key);

        setDisableVirtual(true);
        const rangeNodes = getExpandRange(data, prevData, diffExpanded.key);

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

  console.log('DSSS:', disableVirtual, mergedData, transitionRange);

  return (
    <VirtualList
      {...domProps}
      disabled={disableVirtual}
      role="tree"
      data={mergedData}
      itemKey="key"
      height={height}
      itemHeight={itemHeight}
    >
      {(treeNode: FlattenDataNode) => {
        const { key, ...restProps } = treeNode;
        delete restProps.children;

        const treeNodeProps = {
          eventKey: key,
          expanded: expandedKeys.indexOf(key) !== -1,
          selected: selectedKeys.indexOf(key) !== -1,
          loaded: loadedKeys.indexOf(key) !== -1,
          loading: loadingKeys.indexOf(key) !== -1,
          checked: checkedKeys.indexOf(key) !== -1,
          halfChecked: halfCheckedKeys.indexOf(key) !== -1,
          pos: String(keyEntities[key].pos),

          // [Legacy] Drag props
          dragOver: dragOverNodeKey === key && dropPosition === 0,
          dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
          dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
        };

        return (
          <MotionTreeNode
            {...restProps}
            {...treeNodeProps}
            motion={motion}
            motionNodes={key === MOTION_KEY ? transitionRange : null}
            motionType={motionType}
            onMotionEnd={onMotionEnd}
          />
        );
      }}
    </VirtualList>
  );
};

export default NodeList;