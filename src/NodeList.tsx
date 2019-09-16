/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import VirtualList from 'rc-virtual-list';
import KeyCode from 'rc-util/lib/KeyCode';
import { FlattenNode, Key, DataEntity, DataNode } from './interface';
import MotionTreeNode from './MotionTreeNode';
import { TreeContext, TreeContextProps } from './contextTypes';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';
import { getTreeNodeProps, getKey } from './utils/treeUtil';

export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;

const MotionNode: DataNode = {
  key: MOTION_KEY,
};

export const MotionEntity: DataEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: MotionNode,
};

const MotionFlattenData: FlattenNode = {
  parent: null,
  children: [],
  pos: MotionEntity.pos,
  data: MotionNode,
  /** Hold empty list here since we do not use it */
  isStart: [],
  isEnd: [],
};

interface NodeListProps {
  prefixCls: string;
  className: string;
  style: React.CSSProperties;
  data: FlattenNode[];
  motion: any;
  focusable?: boolean;
  tabIndex: number;

  expandedKeys: Key[];
  selectedKeys: Key[];
  checkedKeys: Key[];
  loadedKeys: Key[];
  loadingKeys: Key[];
  halfCheckedKeys: Key[];
  keyEntities: Record<Key, DataEntity>;

  dragging: boolean;
  dragOverNodeKey: Key;
  dropPosition: number;

  // Virtual list
  height: number;
  itemHeight: number;

  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

/**
 * We only need get visible content items to play the animation.
 */
export function getMinimumRangeTransitionRange(
  list: FlattenNode[],
  height: number,
  itemHeight: number,
) {
  if (!height) {
    return list;
  }

  return list.slice(0, Math.ceil(height / itemHeight) + 1);
}

function itemKey(item: FlattenNode) {
  const {
    data: { key },
    pos,
  } = item;
  return String(getKey(key, pos));
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

  dragging,
  dragOverNodeKey,
  dropPosition,
  motion,

  height,
  itemHeight,

  focusable,
  tabIndex,

  onKeyDown,

  ...domProps
}) => {
  // ============================== Motion ==============================
  const [disableVirtual, setDisableVirtual] = React.useState(false);
  const [prevExpandedKeys, setPrevExpandedKeys] = React.useState(expandedKeys);
  const [prevData, setPrevData] = React.useState(data);
  const [transitionData, setTransitionData] = React.useState(data);
  const [transitionRange, setTransitionRange] = React.useState([]);
  const [motionType, setMotionType] = React.useState<'show' | 'hide' | null>(null);

  function onMotionEnd() {
    setPrevData(data);
    setTransitionData(data);
    setTransitionRange([]);
    setMotionType(null);
    setDisableVirtual(false);
  }

  // Do animation if expanded keys changed
  React.useEffect(() => {
    setPrevExpandedKeys(expandedKeys);

    const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);

    if (diffExpanded.key !== null) {
      if (diffExpanded.add) {
        const keyIndex = prevData.findIndex(({ data: { key } }) => key === diffExpanded.key);

        if (motion) setDisableVirtual(true);
        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(prevData, data, diffExpanded.key),
          height,
          itemHeight,
        );

        const newTransitionData: FlattenNode[] = prevData.slice();
        newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setMotionType('show');
      } else {
        const keyIndex = data.findIndex(({ data: { key } }) => key === diffExpanded.key);

        if (motion) setDisableVirtual(true);
        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(data, prevData, diffExpanded.key),
          height,
          itemHeight,
        );

        const newTransitionData: FlattenNode[] = data.slice();
        newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setMotionType('hide');
      }
    } else if (prevData !== data) {
      // If whole data changed, we just refresh the list
      setPrevData(data);
      setTransitionData(data);
    }
  }, [expandedKeys, data]);

  // We should clean up motion if is changed by dragging
  React.useEffect(() => {
    if (!dragging) {
      onMotionEnd();
    }
  }, [dragging]);

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

  // =========================== Accessibility ==========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);

  const changeActive = (offset: number) => {
    let index = data.findIndex(({ data: { key } }) => key === activeKey);

    // Align with index
    if (index === -1 && offset < 0) {
      index = data.length;
    }

    index = (index + offset + data.length) % data.length;

    const item = data[index];
    if (item) {
      setActiveKey(item.data.key);
    } else {
      setActiveKey(null);
    }
  };

  // ============================= Keyboard =============================
  const { onNodeExpand } = React.useContext(TreeContext);

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    // Change active is no need to check if current node not exist
    switch (event.which) {
      case KeyCode.UP: {
        changeActive(-1);
        break;
      }
      case KeyCode.DOWN: {
        changeActive(1);
        break;
      }
    }

    // Expand operation
    const item = data.find(({ data: { key } }) => key === activeKey);
    const node = item ? item.data : null;

    switch (event.which) {
      case KeyCode.ENTER:
      case KeyCode.SPACE: {
        console.log('select it!!!');
        break;
      }
      case KeyCode.LEFT: {
        onNodeExpand({ ctrlKey: false, shiftKey: false } as MouseEvent, node);
        break;
      }
      case KeyCode.RIGHT: {
        console.log('open or next it!!!');
        break;
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  console.log('~~>', activeKey);

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
      onKeyDown={onInternalKeyDown}
      tabIndex={focusable !== false ? tabIndex : null}
    >
      {(treeNode: FlattenNode) => {
        const {
          pos,
          data: { key, ...restProps },
          isStart,
          isEnd,
        } = treeNode;
        const mergedKey = getKey(key, pos);
        delete restProps.children;

        const treeNodeProps = getTreeNodeProps(mergedKey, treeNodeRequiredProps);

        return (
          <MotionTreeNode
            {...restProps}
            {...treeNodeProps}
            active={key === activeKey}
            pos={pos}
            data={treeNode.data}
            isStart={isStart}
            isEnd={isEnd}
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
