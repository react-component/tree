import Tree, { useTree } from '@rc-component/tree';
import React from 'react';
import '../../assets/index.less';

const ROOT_KEY = 'root';
const TARGET_KEY = 'root-nested';

const treeData = [
  {
    key: ROOT_KEY,
    title: 'Root',
    children: Array.from({ length: 20 }, (_, index) =>
      index === 12
        ? {
            key: TARGET_KEY,
            title: 'Nested Node',
            children: [
              {
                key: `${TARGET_KEY}-0`,
                title: 'Nested Node 0',
                children: [{ key: `${TARGET_KEY}-0-0`, title: 'Nested Node 0-0' }],
              },
              { key: `${TARGET_KEY}-1`, title: 'Nested Node 1' },
            ],
          }
        : {
            key: `${ROOT_KEY}-${index}`,
            title: `Node ${index}`,
          },
    ),
  },
];

function TreeGroup({ resetAll }) {
  const controlledRef = React.useRef(null);
  const uncontrolledRef = React.useRef(null);
  const pendingScrollRef = React.useRef(false);
  const [virtual, setVirtual] = React.useState(true);
  const [expandedKeys, setExpandedKeys] = React.useState([ROOT_KEY]);
  const { getPath } = useTree(treeData, {});

  React.useEffect(() => {
    if (pendingScrollRef.current) {
      pendingScrollRef.current = false;
      controlledRef.current?.scrollTo({ key: TARGET_KEY, align: 'top' });
    }
  }, [expandedKeys]);

  const scrollTo = () => {
    pendingScrollRef.current = true;
    setExpandedKeys(currentKeys => {
      const pathKeys = getPath(TARGET_KEY).map(entity => entity.key);
      return [...new Set([...currentKeys, ...pathKeys])];
    });

    uncontrolledRef.current?.scrollTo({
      key: TARGET_KEY,
      align: 'top',
      autoExpand: true,
    });
  };

  const treeProps = {
    height: 200,
    itemHeight: 24,
    treeData,
    virtual,
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={virtual}
            onChange={event => setVirtual(event.target.checked)}
          />{' '}
          Virtual
        </label>
        <button type="button" onClick={resetAll}>
          resetAll
        </button>
        <button type="button" onClick={scrollTo}>
          scrollTo
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>Controlled</h3>
          <Tree
            {...treeProps}
            ref={controlledRef}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>Uncontrolled</h3>
          <Tree {...treeProps} ref={uncontrolledRef} defaultExpandedKeys={[ROOT_KEY]} />
        </div>
      </div>
    </>
  );
}

export default function Demo() {
  const [id, setId] = React.useState(0);

  return (
    <div key={id}>
      <TreeGroup resetAll={() => setId(current => current + 1)} />
    </div>
  );
}
