import React from 'react';
import Tree from '../src';

const MyTree = props => {
  const { treeData, checkable, checkedKeys, onCheck } = props;
  return (
    <Tree
      data-testid="tree"
      className="my-tree"
      checkable={checkable}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
};

export default MyTree;
