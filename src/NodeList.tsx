/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import VirtualList from 'rc-virtual-list';
import { FlattenDataNode, DataNode, Key, Entity } from './interface';
import MotionTreeNode from './MotionTreeNode';
import { findExpandedKeys } from './utils/diffUtil';

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

  ...domProps
}) => {
  const [disableVirtual, setDisableVirtual] = React.useState();
  const [prevExpandedKeys, setPrevExpandedKeys] = React.useState(expandedKeys);
  const [prevData, setPrevData] = React.useState(data);

  // Do animation if expanded keys changed
  React.useEffect(() => {
    setPrevExpandedKeys(expandedKeys);

    const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);
    if (diffExpanded) {
      console.log('666', diffExpanded);
      if (diffExpanded.add) {
        setDisableVirtual(false);
      }
    }
  }, [expandedKeys]);

  const mergedData = motion ? prevData : data;

  return (
    <VirtualList
      {...domProps}
      disabled={disableVirtual}
      role="tree"
      data={mergedData}
      itemKey="key"
      height={150}
      itemHeight={20}
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

        return <MotionTreeNode {...restProps} {...treeNodeProps} visible />;
      }}
    </VirtualList>
  );
};

export default NodeList;
