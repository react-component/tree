import type { KeyEntities, SafeKey } from '../interface';

export default function getEntity<T = any>(keyEntities: KeyEntities<T>, key: SafeKey) {
  return keyEntities[key];
}
