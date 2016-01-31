
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({title: key + '-label', key: key + '-key'});
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
    return generateData(__level, key, tns[index].children);
  });
};
generateData(z);


function loopData(data, callback) {
  const loop = (d, level = 0) => {
    d.forEach((item, index) => {
      const pos = `${level}-${index}`;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function spl(str) {
  return str.split('-');
}
function splitLen(str) {
  return str.split('-').length;
}

function getFilterExpandedKeys(data, expandedKeys) {
  const expandedPosArr = [];
  loopData(data, (item, index, pos) => {
    if (expandedKeys.indexOf(item.key) > -1) {
      expandedPosArr.push(pos);
    }
  });
  const filterExpandedKeys = [];
  loopData(data, (item, index, pos) => {
    expandedPosArr.forEach(p => {
      if ((splitLen(pos) < splitLen(p)
        && p.indexOf(pos) === 0 || pos === p)
        && filterExpandedKeys.indexOf(item.key) === -1) {
        filterExpandedKeys.push(item.key);
      }
    });
  });
  return filterExpandedKeys;
}

function isSibling(pos, pos1) {
  pos.pop();
  pos1.pop();
  return pos.join(',') === pos1.join(',');
}

function getRadioSelectKeys(data, selectedKeys, key) {
  const res = [];
  const pkObjArr = [];
  const selPkObjArr = [];
  loopData(data, (item, index, pos) => {
    if (selectedKeys.indexOf(item.key) > -1) {
      pkObjArr.push([pos, item.key]);
    }
    if (key && key === item.key) {
      selPkObjArr.push(pos, item.key);
    }
  });
  const lenObj = {};
  const getPosKey = (pos, k) => {
    const posLen = splitLen(pos);
    if (!lenObj[posLen]) {
      lenObj[posLen] = [[pos, k]];
    } else {
      lenObj[posLen].forEach((pkArr, i) => {
        if (isSibling(spl(pkArr[0]), spl(pos))) {
          // 后来覆盖前者
          lenObj[posLen][i] = [pos, k];
        } else if (spl(pkArr[0]) !== spl(pos)) {
          lenObj[posLen].push([pos, k]);
        }
      });
    }
  };
  pkObjArr.forEach((pk) => {
    getPosKey(pk[0], pk[1]);
  });
  if (key) {
    getPosKey(selPkObjArr[0], selPkObjArr[1]);
  }

  Object.keys(lenObj).forEach((item) => {
    lenObj[item].forEach((i) => {
      if (res.indexOf(i[1]) === -1) {
        res.push(i[1]);
      }
    });
  });
  return res;
}


export { gData, getFilterExpandedKeys, getRadioSelectKeys };
