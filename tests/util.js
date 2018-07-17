/* eslint-disable import/prefer-default-export */
import React from 'react';
import toArray from 'rc-util/lib/Children/toArray';

export function convertTreeToData(treeNodes) {
  return toArray(treeNodes).map((node) => {
    if (!React.isValidElement(node) || !node.type || !node.type.isTreeNode) {
      return null;
    }

    const { key, props: { children, ...rest } } = node;
    const convertedChildren = convertTreeToData(children);

    const entity = {
      ...rest,
      key,
    };

    if (convertedChildren.length) {
      entity.children = convertedChildren;
    }

    return entity;
  }).filter(data => data);
}

export function nodeMatcher({ props = {}, ...rest }) {
  return expect.objectContaining({
    ...rest,
    props: expect.objectContaining(props),
  });
};
