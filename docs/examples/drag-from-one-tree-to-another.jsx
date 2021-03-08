/* eslint-disable no-console, react/no-access-state-in-setstate */
import React, { useState } from 'react';
import './draggable.less';
import '../../assets/index.less';
import Tree from 'rc-tree';

const generateData = (x = 3, y = 2, z = 1, gData = [], label = 'label') => {
  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ title: `${key}-${label}`, key: `${key}-${label}` });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });

    return null;
  }
  _loop(z);
  return gData;
};

const loop = (data, key, callback) => {
  data.forEach((item, index, arr) => {
    if (item.key === key) {
      callback(item, index, arr);
      return;
    }
    if (item.children) {
      loop(item.children, key, callback);
    }
  });
};

const DemoTree = ({ label, globalDragNode, dragNodeOrigin, onDragStart, gData, setData, onDragCompleted, dragging }) => {
  const [expandedKeys, setExpandedKeys] = useState([`0-0-${label}`, `0-0-0-${label}`, `0-0-0-0-${label}`]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const isFromAnotherTree = dragNodeOrigin !== label;

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = isFromAnotherTree ? globalDragNode.key : info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = [...gData];

    // Find dragObject
    let dragObj;
    if (isFromAnotherTree) {
      dragObj = globalDragNode;
    } else {
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
    }

    if (dropPosition === 0) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap (insert before or insert after)
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setData(data);
    info.cleanDragState();
    if(isFromAnotherTree){
       onDragCompleted()
    }
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  return (
    <div style={{ display: 'inline-block' }} className="draggable-container">
      <Tree
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        draggable
        onDragStart={onDragStart}
        onDrop={onDrop}
        treeData={gData}
        dragging={isFromAnotherTree && dragging}
      />
    </div>
  );
};

let sourceCleanDragState = ()=>{};
const Demo = () => {
  const [globalDragNode, setGlobalDragNode] = useState(null);
  const [dragNodeOrigin, setDragNodeOrigin] = useState(null)
  const [leftData, setLeftData] = useState(generateData(3, 2, 1, [], 'left'));
  const [rightData, setRightData] = useState(generateData(3, 2, 1, [], 'right'));
  const [dragging, setDragging] = useState(false);
  const onDragStart = (event, node, cleanDragState, origin) => {
    console.log('Drag started');
    setDragging(true)
    setGlobalDragNode(node);
    setDragNodeOrigin(origin);
    sourceCleanDragState = cleanDragState;
  };

  const onDragCompleted = origin => {
    console.log('Drag completed, remove node from source tree');
    setDragging(false)

    if(!dragNodeOrigin || dragNodeOrigin === origin) {
      return;
    } else if(dragNodeOrigin === "left") {
      const data = [...leftData]
       loop(data, globalDragNode.key, (item, index, arr) => {
        arr.splice(index, 1);
      });
      sourceCleanDragState()
      setLeftData(data)
      setGlobalDragNode(null)
      setDragNodeOrigin(null)

    } else if(dragNodeOrigin === "right") {
      const data = [...rightData]
       loop(data, globalDragNode.key, (item, index, arr) => {
        arr.splice(index, 1);
      }); 
      sourceCleanDragState()
      setRightData(data)
      setGlobalDragNode(null)
      setDragNodeOrigin(null)
    }

  }
  return (
    <div className="draggable-demo">
      <h2>draggable</h2>
      <p>drag a node from one tree to another</p>
      <DemoTree
        label="left"
        onDragCompleted={() => onDragCompleted("left")}
        setData={setLeftData}
        gData={leftData}
        onDragStart={({event, node, cleanDragState }) => onDragStart(event, node,cleanDragState, "left")}
        globalDragNode={globalDragNode}
        dragNodeOrigin={dragNodeOrigin}
        dragging={dragging}
      />
      <DemoTree
        label="right"
        onDragCompleted={() => onDragCompleted("right")}
        setData={setRightData}
        gData={rightData}
        onDragStart={({event, node, cleanDragState }) => onDragStart(event, node, cleanDragState, "right")}
        globalDragNode={globalDragNode}
        dragNodeOrigin={dragNodeOrigin}
        dragging={dragging}
      />
    </div>
  );
};

export default Demo;
