import { Key } from '../interface';

export function findExpandedKeys(prev: Key[] = [], next: Key[] = []) {
  const prevLen = prev.length;
  const nextLen = next.length;

  if (Math.abs(prevLen - nextLen) !== 1) {
    return null;
  }

  function find(shorter: Key[], longer: Key[]) {
    const cache: Map<Key, boolean> = new Map();
    shorter.forEach(key => {
      cache.set(key, true);
    });

    return longer.find(key => !cache.has(key));
  }

  if (prevLen < nextLen) {
    return {
      add: true,
      key: find(prev, next),
    };
  }

  return {
    add: false,
    key: find(next, prev),
  };
}
