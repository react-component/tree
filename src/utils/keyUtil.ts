import type { KeyEntities, Key } from '../interface';

export default function getEntity<T = any>(keyEntities: KeyEntities<T>, key: Key) {
  return keyEntities.get(key);
}
