import type { Key, KeyEntities, SafeKey } from '../interface';

export default function getEntity<T = any>(keyEntities: KeyEntities<T>, key: Key) {
  return keyEntities[key as SafeKey];
}
