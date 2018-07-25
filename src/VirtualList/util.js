export const TYPE_ADD = 'ADD';
export const TYPE_KEEP = 'KEEP';
export const TYPE_REMOVE = 'REMOVE';

export function getStyle(element) {
  if (!element) return null;

  if (typeof window !== 'undefined' && 'getComputedStyle' in window) {
    return window.getComputedStyle(element);
  }
  return null;
}

export function getHeight(element) {
  const style = getStyle(element) || {};
  const match = (style.height || '').match(/^(\d*(\.\d+)?)px/);
  return match ? Number(match[1]) : null;
}

export function isDataSourceEqual(list1 = [], list2 = [], rowKey) {
  if (list1.length !== list2.length) return false;

  if (rowKey) {
    return list1.every((item, index) => item[rowKey] === list2[index][rowKey]);
  }

  return list1.every((item, index) => item === list2[index]);
}

/**
 * list1: [1, 2, 3, 4, 5, 9]
 * list2: [1, 5, 6, 7, 8, 9]
 * result: [
 *    { type: TYPE_KEEP, list: [1] },
 *    { type: TYPE_REMOVE, list: [2, 3, 4] },
 *    { type: TYPE_KEEP, list: [5] },
 *    { type: TYPE_ADD, list: [6, 7, 8] },
 *    { type: TYPE_KEEP, list: [9] },
 * ]
 */
export function diffList(list1 = [], list2 = [], rowKey) {
  const itemList = [];

  let cache = null;
  function push(type, list) {
    if (!cache || cache.type !== type) {
      // Put prev type into the itemList
      if (cache) {
        itemList.push(cache);
      }

      cache = { type, list };
    } else {
      cache.list.push(...list); // Not create new array
    }
  }

  // Diff logic
  let startLoc = 0;
  list2.forEach((item2) => {
    const key2 = item2[rowKey];
    const key1 = list1[startLoc] ? list1[startLoc][rowKey] : NaN; // NaN not equal anything

    if (key2 === key1) {
      // Keep the item
      push(TYPE_KEEP, [item2]);
      startLoc += 1;
    } else {
      const item1Index = list1.findIndex((item1, index1) => {
        // Ignore the item1 before i
        if (index1 <= startLoc) return false;

        return item1[rowKey] === key2;
      });

      if (item1Index === -1) {
        // item2 is new hire
        push(TYPE_ADD, [item2]);
      } else {
        // item2 is keep, we need remove the items before item2
        push(TYPE_REMOVE, list1.slice(startLoc, item1Index));
        push(TYPE_KEEP, [item2]);
        startLoc = item1Index + 1;
      }
    }
  });

  if (startLoc !== list1.length) {
    // Some items at the end need process
    push(TYPE_REMOVE, list1.slice(startLoc));
  }

  // Finish push
  push(null, []);

  return itemList;
}
