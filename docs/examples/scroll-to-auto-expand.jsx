import React, { useEffect, useRef, useState } from 'react';
import '../../assets/index.less';
import Tree from '@rc-component/tree';

const targetKey = 'documents/reports/2026/annual';
const treeData = [
  {
    key: 'documents',
    title: 'Documents',
    children: [
      {
        key: 'documents/reports',
        title: 'Reports',
        children: [
          {
            key: 'documents/reports/2026',
            title: '2026',
            children: [
              { key: 'documents/reports/2026/january', title: 'January' },
              { key: 'documents/reports/2026/february', title: 'February' },
              { key: 'documents/reports/2026/march', title: 'March' },
              { key: 'documents/reports/2026/april', title: 'April' },
              { key: 'documents/reports/2026/may', title: 'May' },
              { key: 'documents/reports/2026/june', title: 'June' },
              { key: 'documents/reports/2026/july', title: 'July' },
              { key: 'documents/reports/2026/august', title: 'August' },
              { key: 'documents/reports/2026/september', title: 'September' },
              { key: 'documents/reports/2026/october', title: 'October' },
              { key: 'documents/reports/2026/november', title: 'November' },
              { key: targetKey, title: 'Annual report' },
            ],
          },
        ],
      },
    ],
  },
];

export default function Demo() {
  const treeRef = useRef(null);
  const pendingScrollKeyRef = useRef();
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    const key = pendingScrollKeyRef.current;

    if (key !== undefined) {
      pendingScrollKeyRef.current = undefined;
      treeRef.current?.scrollTo({
        key,
        align: 'top',
        autoExpand: true,
      });
    }
  }, [expandedKeys]);

  const scrollToAnnualReport = () => {
    pendingScrollKeyRef.current = targetKey;
    setExpandedKeys(treeRef.current.getExpandedKeys(targetKey));
  };

  return (
    <>
      <button type="button" onClick={scrollToAnnualReport}>
        Scroll to annual report
      </button>
      <Tree
        ref={treeRef}
        height={160}
        itemHeight={28}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        treeData={treeData}
      />
    </>
  );
}
