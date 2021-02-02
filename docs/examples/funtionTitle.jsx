/* eslint no-console:0, react/no-danger: 0 */
import '../../assets/index.less';
import './animation.less';
import React, { useState } from 'react';
import Tree from 'rc-tree';
import data from './longData.json';

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
  onAppearStart: () => ({ height: 0 }),
  onAppearActive: node => ({ height: node.scrollHeight }),
  onLeaveStart: node => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

const renderTitle = title =>
  // console.log('run');
  title;
const groupList = (list, targetVar) => {
  const obj = {};
  list.forEach(item => {
    if (!obj[item.fieldType]) {
      obj[item.fieldType] = [];
    }
    const disabled = item.is_key === 1 || item.ti === targetVar;

    obj[item.fieldType].push({
      ...item,
      disabled,
    });
  });
  // console.log(obj);
  return (
    Object.keys(obj)
      .map(key => ({
        title: key,
        key,
        children: obj[key],
      }))
      .filter(({ children }) => children.length) || []
  );
};

function getTreeData() {
  // return [
  //   { key: '00', children: [{ key: '000' }, { key: '001' }] },
  //   { key: '01', children: [{ key: '010' }, { key: '011' }] },
  // ];

  return groupList(
    data.map(item => ({
      title: () => renderTitle(item.fieldName),
      key: item.fieldName,
      checkable: true,
      ...item,
    })),
    'id',
    [],
  );
}

const Demo = () => {
  const [keys, setKeys] = useState(data.map(item => item.fieldName));
  // const [keys, setKeys] = useState(['00', '01']);

  return (
    <div className="animation">
      <h2>expanded</h2>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 50%' }}>
          <h3>With Virtual</h3>
          <Tree
            checkable
            defaultExpandAll={false}
            motion={motion}
            height={200}
            checkedKeys={keys}
            itemHeight={20}
            onCheck={checkedKeys => {
              console.log('onCheck:', checkedKeys);
              setKeys(checkedKeys);
            }}
            style={{ border: '1px solid #000' }}
            treeData={getTreeData()}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
