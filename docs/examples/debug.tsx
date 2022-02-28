import '../../assets/index.less';
import './animation.less';
import React from 'react';
import Tree from '../..';

const STYLE = `
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`;

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: () => {
    console.log('appear start');
    return {
      height: 0,
    }
  },
  onAppearActive: node => {
    console.log('appear active');
    return {
      height: node.scrollHeight,
    }
  },
  onLeaveStart: node => {
    console.log('leave start');
    return {
      height: node.offsetHeight,
    }
  },
  onLeaveActive: () => {
    console.log('leave active');
    return {
      height: 0,
    }
  },
};

const treeData1 = [
  {
    createTime: 1645430729000,
    description: "联调角色描述",
    parentId: "0",
    permissionIds: "1,2,3",
    permissions: [],
    id: "1",
    name: "联调角色",
    status: true,
    sub: [
      {
        createTime: 1645430787000,
        description: "联调角色子角色描述",
        parentId: "1",
        permissionIds: "1,2,3",
        permissions: ["1", "2", "3"],
        id: "2",
        name: "联调角色子角色",
        status: true,
        sub: [],
        test: 0,
        updateTime: 1645430788000
      },
      {
        createTime: 1645432592000,
        description: "mock数据描述",
        parentId: "1",
        permissionIds: "1,2,3",
        permissions: ["1", "2", "3"],
        id: "945358338596675584",
        name: "mock数据",
        status: true,
        sub: [],
        test: 0,
        updateTime: 1645432592000
      }
    ],
    test: 0,
    updateTime: 1645430731000
  },
  {
    createTime: 1645512857000,
    description: "",
    parentId: "0",
    permissionIds: "",
    permissions: [],
    id: "945694995617034240",
    name: "哈哈哈",
    status: true,
    sub: [
      {
        createTime: 1645524112000,
        description: "",
        parentId: "945694995617034240",
        permissionIds: "",
        permissions: [],
        id: "945742202751422464",
        name: "哈哈哈下",
        status: true,
        sub: [],
        test: 0,
        updateTime: 1645524112000
      }
    ],
    test: 0,
    updateTime: 1645512857000
  }
];

const treeData2 = [
  {
    createTime: 1645430729000,
    description: "联调角色描述",
    parentId: "0",
    permissionIds: "1,2,3",
    permissions: [],
    key: "1",
    title: "联调角色",
    status: true,
    children: [
      {
        createTime: 1645430787000,
        description: "联调角色子角色描述",
        parentId: "1",
        permissionIds: "1,2,3",
        permissions: ["1", "2", "3"],
        key: "2",
        title: "联调角色子角色",
        status: true,
        children: [],
        test: 0,
        updateTime: 1645430788000
      },
      {
        createTime: 1645432592000,
        description: "mock数据描述",
        parentId: "1",
        permissionIds: "1,2,3",
        permissions: ["1", "2", "3"],
        key: "945358338596675584",
        title: "mock数据",
        status: true,
        children: [],
        test: 0,
        updateTime: 1645432592000
      }
    ],
    test: 0,
    updateTime: 1645430731000
  },
  {
    createTime: 1645512857000,
    description: "",
    parentId: "0",
    permissionIds: "",
    permissions: [],
    key: "945694995617034240",
    title: "哈哈哈",
    status: true,
    children: [
      {
        createTime: 1645524112000,
        description: "",
        parentId: "945694995617034240",
        permissionIds: "",
        permissions: [],
        key: "945742202751422464",
        title: "哈哈哈下",
        status: true,
        children: [],
        test: 0,
        updateTime: 1645524112000
      }
    ],
    test: 0,
    updateTime: 1645512857000
  }
];

const Demo1 = () => {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <Tree
        autoExpandParent
        defaultExpandAll
        fieldNames={{
          title: "name",
          key: "id",
          children: "sub"
        }}
        motion={motion}
        treeData={treeData1}
      />
      <br />
      <Tree
        autoExpandParent
        defaultExpandAll
        motion={motion}
        treeData={treeData2}
      />
      <br />
      <Tree
        defaultExpandAll
        fieldNames={{
          title: "name",
          key: "id",
          children: "sub"
        }}
        motion={{
          motionName: 'bamboo',
          motionAppear: false,
        }}
        treeData={[
          {
            id: "1",
            name: "A",
            sub: [
              {
                id: "2",
                name: "B",
                sub: [],
              }
            ],
          },
        ]}
      />
    </div>
  )
};

export default Demo1;