import { ReactWrapper } from 'enzyme';
import { Component } from 'react';

export function nodeMatcher({ props = {}, ...rest }) {
  return expect.objectContaining({
    ...rest,
    props: expect.objectContaining(props),
  });
}

export function objectMatcher(item) {
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

  const originConsoleErr = console.error;

  beforeAll(() => {
    console.error = jest.fn().mockImplementation((...args) => {
      if (errorList.some(tmpl => args[0].includes(tmpl))) {
        return;
      }

      originConsoleErr(...args);
    });
  });

  afterAll(() => {
    console.error = originConsoleErr;
  });
}
