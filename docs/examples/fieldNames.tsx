/* eslint-disable no-alert, no-console, react/no-find-dom-node */
import React from 'react';
import '../../assets/index.less';
import './basic.less';
import Tree from 'rc-tree';

export default () => {
  return (
    <Tree
      // treeData={
      //   [
      //     {
      //       fieldLabel: 'Root',
      //       fieldKey: 'root',
      //       fieldChildren: [
      //         {
      //           fieldLabel: 'Bamboo',
      //           fieldKey: 'bamboo',
      //         },
      //         {
      //           fieldLabel: 'Light',
      //           fieldKey: 'light',
      //         },
      //       ],
      //     },
      //   ] as any
      // }

      // fieldNames={{
      //   title: 'fieldLabel',
      //   key: 'fieldKey',
      //   children: 'fieldChildren',
      // }}
      defaultExpandAll
    >
      <Tree.TreeNode title="Bamboo" key="light" />
    </Tree>
  );
};
