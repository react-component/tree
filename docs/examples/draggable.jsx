/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import { generateData } from './utils/dataUtil';
import './draggable.less';
import '../../assets/index.less';
import Tree from '../../src';

const treeData = [
  {
    name: '0-0',
    id: '0-0',
    children: [
      {
        name: '0-0-0',
        id: '0-0-0',
        children: [
          {
            name: '0-0-0-0',
            id: '0-0-0-0',
          },
          {
            name: '0-0-0-1',
            id: '0-0-0-1',
          },
          {
            name: '0-0-0-2',
            id: '0-0-0-2',
          },
        ],
      },
      {
        name: '0-0-1',
        id: '0-0-1',
        children: [
          {
            name: '0-0-1-0',
            id: '0-0-1-0',
          },
          {
            name: '0-0-1-1',
            id: '0-0-1-1',
          },
          {
            name: '0-0-1-2',
            id: '0-0-1-2',
          },
        ],
      },
      {
        name: '0-0-2',
        id: '0-0-2',
      },
    ],
  },
  {
    name: '0-1',
    id: '0-1',
    children: [
      {
        name: '0-1-0-0',
        id: '0-1-0-0',
      },
      {
        name: '0-1-0-1',
        id: '0-1-0-1',
      },
      {
        name: '0-1-0-2',
        id: '0-1-0-2',
      },
    ],
  },
  {
    name: '0-2',
    id: '0-2',
  },
];

const Demo = () => {
  return (
    <Tree
    defaultExpandAll
      treeData={treeData}
      draggable
      fieldNames={{
        title: 'name',
        key: 'id'
      }}
    />
  );
};


export default Demo;
