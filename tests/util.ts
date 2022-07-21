import { ReactWrapper } from 'enzyme';
import { Component } from 'react';

export function objectMatcher(item: object) {
  const result = Array.isArray(item) ? [] : {};

  Object.keys(item).forEach(key => {
    const value = item[key];
    if (
      value &&
      typeof value === 'object' &&
      !(value instanceof ReactWrapper) &&
      !(value instanceof Component)
    ) {
      result[key] = objectMatcher(value);
    } else {
      result[key] = value;
    }
  });

  return expect.objectContaining(result);
}

export function spyConsole() {
  const errorList = [
    'Warning: Tree node must have a certain key:',
    'Warning: `children` of Tree is deprecated. Please use `treeData` instead.',
  ];

  // eslint-disable-next-line no-console
  const originConsoleErr = console.error;

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn().mockImplementation((...args) => {
      if (errorList.some(tmpl => args[0].includes(tmpl))) {
        return;
      }

      originConsoleErr(...args);
    });
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = originConsoleErr;
  });
}

export function spyError() {
  let errorSpy;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  return () => errorSpy;
}
