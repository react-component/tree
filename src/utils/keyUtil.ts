import type { BasicDataNode, Key, KeyEntities, SafeKey } from '../interface';

const getEntity = <T extends BasicDataNode = any>(keyEntities: KeyEntities<T>, key: Key) => {
  return keyEntities[key as SafeKey];
};

export default getEntity;
