import React from 'react';
import Tree from '../Tree'
import mockData from './mockData';

import './default.css';

export default {
  title: 'Tree',
  component: Tree,
};

export const Default = () => <Tree treeData={mockData} />;
