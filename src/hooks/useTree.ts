import { useEvent } from '@rc-component/util';
import * as React from 'react';
import type {
  BasicDataNode,
  DataEntity,
  DataNode,
  FieldNames,
  Key,
  KeyEntities,
} from '../interface';
import getEntity from '../utils/keyUtil';
import { convertDataToEntities } from '../utils/treeUtil';

export interface UseTreeConfig {
  fieldNames?: FieldNames;
}

export interface TreeInstance<TreeDataType extends DataNode | BasicDataNode = DataNode> {
  getPath: (key: Key) => DataEntity<TreeDataType>[];
}

export default function useTree<TreeDataType extends DataNode | BasicDataNode = DataNode>(
  treeData: TreeDataType[],
  config: UseTreeConfig,
): TreeInstance<TreeDataType> {
  const { fieldNames } = config;

  const keyEntities = React.useMemo(() => {
    const { keyEntities } = convertDataToEntities(treeData as unknown as DataNode[], {
      fieldNames,
    });
    return keyEntities as KeyEntities<TreeDataType>;
  }, [treeData, fieldNames]);

  const getPath = useEvent((key: Key) => {
    const path: DataEntity<TreeDataType>[] = [];
    let entity = getEntity(keyEntities, key);

    while (entity) {
      path.unshift(entity);
      entity = entity.parent;
    }

    return path;
  });

  return { getPath };
}
