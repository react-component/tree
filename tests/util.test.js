import { arraysEqual } from '../src/util';

test('[0, 1] equals [0, 1]', () => {
  const array1 = [0, 1];
  const array2 = [0, 1];
  expect(arraysEqual(array1, array2)).toBe(true);
});

test('[0, 1] does not equal [1, 0]', () => {
  const array1 = [0, 1];
  const array2 = [0, 1];
  expect(arraysEqual(array2, array1)).toBe(true);
});
