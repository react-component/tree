/* eslint-disable no-alert, no-console, react/no-find-dom-node */
import React from 'react';
import '../../assets/index.less';
import './basic.less';
import Tree from 'rc-tree';

const treeData = [
  {
    name: 'parent 1',
    test: '0-0',
    child: [
      {
        name: '张晨成',
        test: '0-0-0',
        disabled: true,
        child: [
          {
            name: 'leaf',
            test: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            name: 'leaf',
            test: '0-0-0-1',
          },
        ],
      },
      {
        name: 'parent 1-1',
        test: '0-0-1',
        child: [
          {
            test: '0-0-1-0',
            name: 'zcvc',
          },
        ],
      },
    ],
  },
];

const Demo = () => {
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  const fieldNames = {
    children: 'child',
    title: 'name',
    key: 'test',
  };

  return (
    <Tree
      checkable
      fieldNames={fieldNames}
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultSelectedKeys={['0-0-0', '0-0-1']}
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      onSelect={onSelect}
      onCheck={onCheck}
      treeData={treeData as any}
    />
  );
};

export default Demo;
