/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import Tree, { TreeNode, FieldDataNode } from '../src';
import { objectMatcher, spyConsole, spyError } from './util';

/**
 * For refactor purpose. All the props should be passed by test
 */

// Promisify timeout to let jest catch works
function timeoutPromise(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

describe('Tree Props', () => {
  spyConsole();

  // prefixCls
  it('prefixCls', () => {
    const withoutPrefix = render(<Tree />);
    expect(withoutPrefix.container.firstChild).toMatchSnapshot();

    const withPrefix = render(<Tree prefixCls="test-prefix" />);
    expect(withPrefix.container.firstChild).toMatchSnapshot();
  });

  // showLine
  it('showLine', () => {
    const wrapper = render(<Tree showLine />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  // showIcon
  it('showIcon', () => {
    const withIcon = render(
      <Tree>
        <TreeNode>
          <TreeNode>
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>,
    );
    expect(withIcon.container.firstChild).toMatchSnapshot();

    const withoutIcon = render(
      <Tree showIcon={false}>
        <TreeNode>
          <TreeNode>
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>,
    );
    expect(withoutIcon.container.firstChild).toMatchSnapshot();

    const withOpenIcon = render(
      <Tree defaultExpandedKeys={['0-0']}>
        <TreeNode>
          <TreeNode key="0-0">
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>,
    );
    expect(withOpenIcon.container.firstChild).toMatchSnapshot();
  });

  describe('selectable', () => {
    // selectable - false
    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const { container } = render(
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']} selectable={false}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

      expect(container.firstChild).toMatchSnapshot();

      fireEvent.click(container.querySelector('.rc-tree-node-content-wrapper'));

      expect(handleOnSelect).not.toHaveBeenCalled();
      expect(handleOnCheck).not.toHaveBeenCalled(); // Will test in checkable
    });

    // selectable - true
    it('with selectable', () => {
      const handleOnSelect = jest.fn();

      const { container } = render(
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

      expect(container.firstChild).toMatchSnapshot();

      const getNodes = () =>
        container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode');
      const getTargetNode = () => getNodes()[getNodes().length - 1];
      const getParentNode = () => getNodes()[0];

      // Select leaf
      fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));

      // traverseTreeNodes loops origin TreeNode and
      // onSelect trigger on `cloneElement` which is not the same instance
      expect(handleOnSelect).toHaveBeenCalledWith(
        ['0-0-0'],
        objectMatcher({
          event: 'select',
          selected: true,
          node: { key: '0-0-0' },
          selectedNodes: [{ key: '0-0-0' }],
          nativeEvent: {},
        }),
      );
      handleOnSelect.mockReset();

      // un-select leaf
      fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
      expect(handleOnSelect).toHaveBeenCalledWith(
        [],
        objectMatcher({
          event: 'select',
          selected: false,
          node: { key: '0-0-0' },
          selectedNodes: [],
          nativeEvent: {},
        }),
      );
      handleOnSelect.mockReset();

      // Select leaf and then parent
      fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
      expect(handleOnSelect).toHaveBeenCalledWith(
        ['0-0-0'],
        objectMatcher({
          event: 'select',
          selected: true,
          node: { key: '0-0-0' },
          selectedNodes: [{ key: '0-0-0' }],
          nativeEvent: {},
        }),
      );
      handleOnSelect.mockReset();

      fireEvent.click(getParentNode().querySelector('.rc-tree-node-content-wrapper'));
      expect(handleOnSelect).toHaveBeenCalledWith(
        ['0-0'],
        objectMatcher({
          event: 'select',
          selected: true,
          node: { key: '0-0' },
          selectedNodes: [{ key: '0-0' }],
          nativeEvent: {},
        }),
      );
    });
  });

  // multiple - this prop works with selectable
  it('multiple', () => {
    const handleOnSelect = jest.fn();

    const { container } = render(
      <Tree onSelect={handleOnSelect} defaultExpandAll multiple>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    expect(container.firstChild).toMatchSnapshot();

    const getNodes = () =>
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode');
    const getTargetNode = () => getNodes()[getNodes().length - 1];
    const getParentNode = () => getNodes()[0];

    // Leaf select
    fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
    expect(handleOnSelect).toHaveBeenCalledWith(
      ['0-0-0'],
      objectMatcher({
        event: 'select',
        selected: true,
        node: { key: '0-0-0' },
        selectedNodes: [{ key: '0-0-0' }],
        nativeEvent: {},
      }),
    );
    handleOnSelect.mockReset();

    // Parent select
    fireEvent.click(getParentNode().querySelector('.rc-tree-node-content-wrapper'));
    expect(handleOnSelect).toHaveBeenCalledWith(
      ['0-0-0', '0-0'],
      objectMatcher({
        event: 'select',
        selected: true,
        node: { key: '0-0' },
        selectedNodes: [{ key: '0-0-0' }, { key: '0-0' }],
        nativeEvent: {},
      }),
    );
    handleOnSelect.mockReset();

    // Leaf un-select
    fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
    expect(handleOnSelect).toHaveBeenCalledWith(
      ['0-0'],
      objectMatcher({
        event: 'select',
        selected: false,
        node: { key: '0-0-0' },
        selectedNodes: [{ key: '0-0' }],
        nativeEvent: {},
      }),
    );
  });

  // checkable
  describe('checkable', () => {
    it('default', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const { container } = render(
        <Tree
          onSelect={handleOnSelect}
          onCheck={handleOnCheck}
          defaultExpandedKeys={['0-0']}
          checkable
        >
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

      expect(container.firstChild).toMatchSnapshot();

      const getNodes = () =>
        container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode');
      const getTargetNode = () => getNodes()[getNodes().length - 1];

      // Click leaf
      fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
      expect(handleOnSelect).toHaveBeenCalledWith(
        ['0-0-0'],
        objectMatcher({
          event: 'select',
          selected: true,
          node: { key: '0-0-0' },
          selectedNodes: [{ key: '0-0-0' }],
          nativeEvent: {},
        }),
      );
      expect(handleOnCheck).not.toHaveBeenCalled();
      expect(handleOnSelect).toHaveBeenCalled();

      handleOnCheck.mockReset();
      handleOnSelect.mockReset();

      // Click checkbox
      fireEvent.click(getTargetNode().querySelector('.rc-tree-checkbox'));

      expect(handleOnCheck).toHaveBeenCalledWith(
        ['0-0-0', '0-0'],
        objectMatcher({
          event: 'check',
          checked: true,
          node: { key: '0-0-0' },
          checkedNodes: [{ key: '0-0-0' }, { key: '0-0' }],
          nativeEvent: {},
        }),
      );
      expect(handleOnSelect).not.toHaveBeenCalled();
    });

    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const { container } = render(
        <Tree
          onSelect={handleOnSelect}
          onCheck={handleOnCheck}
          defaultExpandedKeys={['0-0']}
          selectable={false}
          checkable
        >
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

      expect(container.firstChild).toMatchSnapshot();

      const getNodes = () =>
        container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode');
      const getTargetNode = () => getNodes()[getNodes().length - 1];

      // Click leaf
      fireEvent.click(getTargetNode().querySelector('.rc-tree-node-content-wrapper'));
      expect(handleOnCheck).toHaveBeenCalledWith(
        ['0-0-0', '0-0'],
        objectMatcher({
          event: 'check',
          checked: true,
          node: { key: '0-0-0' },
          checkedNodes: [{ key: '0-0-0' }, { key: '0-0' }],
          nativeEvent: {},
        }),
      );
      expect(handleOnSelect).not.toHaveBeenCalled();
    });

    it('node set checkable to `false`', () => {
      const { container } = render(
        <Tree checkable defaultExpandAll>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" checkable={false} />
          </TreeNode>
        </Tree>,
      );

      expect(container.querySelectorAll('.rc-tree-checkbox')).toHaveLength(1);
    });
  });

  // Don't crash
  describe('invalidate checkedKeys', () => {
    const errorSpy = spyError();

    const genWrapper = checkedKeys =>
      render(
        <Tree checkedKeys={checkedKeys} defaultExpandAll checkable>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

    it('null', () => {
      const { container } = genWrapper(null);
      expect(errorSpy()).not.toHaveBeenCalledWith(
        'Warning: `checkedKeys` is not an array or an object',
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('number', () => {
      const { container } = genWrapper(123);
      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: `checkedKeys` is not an array or an object',
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // checkStrictly
  it('checkStrictly', () => {
    const handleOnCheck = jest.fn();

    const { container } = render(
      <Tree onCheck={handleOnCheck} defaultExpandedKeys={['0-0']} checkable checkStrictly>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    expect(container.firstChild).toMatchSnapshot();

    const getNodes = () =>
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode');
    const getTargetNode = () => getNodes()[getNodes().length - 1];

    // Click Leaf
    fireEvent.click(getTargetNode().querySelector('.rc-tree-checkbox'));
    expect(handleOnCheck).toHaveBeenCalledWith(
      {
        checked: ['0-0-0'],
        halfChecked: [],
      },
      objectMatcher({
        event: 'check',
        checked: true,
        node: {
          key: '0-0-0',
        },
        checkedNodes: [{ key: '0-0-0' }],
        nativeEvent: {},
      }),
    );
  });

  // draggable - is already full test in Tree.spec.js
  // autoExpandParent - is already full test in Tree.spec.js

  // defaultExpandAll
  it('defaultExpandAll', () => {
    const { container } = render(
      <Tree defaultExpandAll>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  // defaultCheckedKeys - is already full test in Tree.spec.js
  // defaultSelectedKeys - is already full test in Tree.spec.js

  describe('loadData', () => {
    const errorSpy = spyError();

    it('basic', async () => {
      let called = 0;

      const handleLoadData = jest.fn();

      class Demo extends React.Component {
        state = {
          loaded: false,
        };

        loadData = (...args: any[]) => {
          called += 1;
          handleLoadData(...args);

          this.setState({ loaded: true });

          return Promise.resolve();
        };

        render() {
          // Hide icon will still show the icon for loading status
          return (
            <Tree loadData={this.loadData} showIcon={false}>
              <TreeNode key="0-0">{this.state.loaded ? <TreeNode key="0-0-0" /> : null}</TreeNode>
            </Tree>
          );
        }
      }

      const { container } = render(<Demo />);

      expect(handleLoadData).not.toHaveBeenCalled();

      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      await timeoutPromise(100);

      expect(handleLoadData).toHaveBeenCalledWith(
        expect.objectContaining({
          key: '0-0',
        }),
      );
      expect(called).toBe(1);
      expect(container.firstChild).toMatchSnapshot();
    });

    // https://github.com/ant-design/ant-design/issues/11689#issuecomment-411712770
    it('with expandedKeys', async () => {
      let called = 0;
      const keys = {};

      resetWarned();
      const loadData = ({ props: { eventKey } }) => {
        resetWarned();
        expect(errorSpy()).toHaveBeenCalledWith(
          'Warning: Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.',
        );
        keys[eventKey] = (keys[eventKey] || 0) + 1;

        return new Promise(() => {
          called += 1;
        });
      };

      const renderTree = (props?: any) => (
        <Tree loadData={loadData} expandedKeys={['0', '1', '2']} {...props}>
          <TreeNode key="0" />
          <TreeNode key="1" />
          <TreeNode key="2" />
        </Tree>
      );
      const { rerender } = render(renderTree());

      rerender(renderTree({ expandedKeys: ['0', '1', '2'] }));

      await timeoutPromise();

      expect(called).toBe(3);
      expect(keys[0]).toBe(1);
      expect(keys[1]).toBe(1);
      expect(keys[2]).toBe(1);
    });

    it('with defaultExpandedKeys', async () => {
      let called = 0;
      const keys = {};
      const loadData: any = ({ props: { eventKey } }) => {
        keys[eventKey] = (keys[eventKey] || 0) + 1;

        return new Promise(() => {
          called += 1;
        });
      };

      const { container } = render(
        <Tree loadData={loadData} defaultExpandedKeys={['0', '1', '2']}>
          <TreeNode key="0" />
          <TreeNode key="1" />
          <TreeNode key="2" />
        </Tree>,
      );

      // Do not trigger loadData
      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      await timeoutPromise();

      expect(called).toBe(3);
      expect(keys[0]).toBe(1);
      expect(keys[1]).toBe(1);
      expect(keys[2]).toBe(1);
    });

    // https://github.com/ant-design/ant-design/issues/12217
    it('node has false isLeaf & no loadData function', () => {
      const onExpand = jest.fn();
      const { container } = render(
        <Tree onExpand={onExpand}>
          <TreeNode key="0" isLeaf={false} />
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      expect(onExpand).toHaveBeenCalled();

      // If has dead loop. This test will not be end.
    });

    // https://github.com/ant-design/ant-design/issues/12464
    it('by controlled', done => {
      const treeData = [
        {
          title: 'demo1',
          key: 'demo1',
          value: 'demo1',
          children: [
            {
              title: 'demo2',
              key: 'demo2',
              value: 'demo3',
            },
          ],
        },
      ];

      let count = 0;

      class Test extends React.Component {
        state = {
          loadedKeys: [],
        };

        onLoad = loadedKeys => {
          this.setState({ loadedKeys });
        };

        loadData = () => {
          count += 1;
          return Promise.resolve();
        };

        render() {
          return (
            <Tree
              loadData={this.loadData}
              loadedKeys={this.state.loadedKeys}
              onLoad={this.onLoad}
              treeData={treeData}
            />
          );
        }
      }

      const { container } = render(<Test />);

      // Parent click
      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      setTimeout(() => {
        // Child click
        fireEvent.click(container.querySelectorAll('.rc-tree-switcher')[1]);

        setTimeout(() => {
          expect(count).toBe(2);
          done();
        }, 500);
      }, 500);
    });

    it('reject load', async () => {
      const { container } = render(
        <Tree
          loadData={() => Promise.reject()}
          expandedKeys={['parent']}
          treeData={[
            {
              title: 'parent',
              key: 'parent',
            },
          ]}
        />,
      );

      // Do delay
      for (let i = 0; i < 20; i += 1) {
        await act(async () => {
          await timeoutPromise();
        });
      }

      expect(container.querySelector('.rc-tree-icon_loading')).toBeFalsy();

      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: Retry for `loadData` many times but still failed. No more retry.',
      );
    });
  });

  it('icon', () => {
    // Node icon has much higher priority
    const { container } = render(
      <Tree defaultExpandAll icon={<span>ROOT ICON</span>}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" icon={<span>CUSTOMIZE ICON</span>} />
        </TreeNode>
      </Tree>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('onClick', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Tree onClick={onClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    // Select leaf
    fireEvent.click(container.querySelectorAll('.rc-tree-node-content-wrapper')[1]);

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({}),
      expect.objectContaining({
        key: '0-0-0',
      }),
    );
  });

  it('onDoubleClick', () => {
    const onClick = jest.fn();
    const onDoubleClick = jest.fn();

    const { container } = render(
      <Tree onClick={onClick} onDoubleClick={onDoubleClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    // Select leaf
    fireEvent.doubleClick(container.querySelectorAll('.rc-tree-node-content-wrapper')[1]);

    expect(onClick).not.toHaveBeenCalled();
    expect(onDoubleClick).toHaveBeenCalledWith(
      expect.objectContaining({}),
      expect.objectContaining({
        key: '0-0-0',
      }),
    );
  });

  it('onContextMenu', () => {
    const onClick = jest.fn();
    const onContextMenu = jest.fn();

    const { container } = render(
      <Tree onClick={onClick} onContextMenu={onContextMenu} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    // Select leaf
    fireEvent.contextMenu(container.querySelectorAll('.rc-tree-node-content-wrapper')[1]);

    expect(onClick).not.toHaveBeenCalled();
    expect(onContextMenu).toHaveBeenCalled();
  });

  describe('loadedKeys & onLoad', () => {
    it('has loadedKeys', () => {
      const loadData = jest.fn(() => Promise.resolve());
      const onLoad = jest.fn();

      const { container } = render(
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad}>
          <TreeNode key="0-0" />
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      expect(loadData).not.toHaveBeenCalled();
      expect(onLoad).not.toHaveBeenCalled();
    });

    it('reset loadedKeys', () => {
      class FakePromise {
        val: any;

        constructor(val?: any) {
          this.val = val;
        }

        then = func => {
          const ret = func(this.val);
          return new FakePromise(ret);
        };

        catch = () => {};
      }

      // eslint-disable-next-line prefer-const
      let cacheRerender: any;
      // eslint-disable-next-line prefer-const
      let renderTree: any;

      const onLoad = jest.fn(() => {
        cacheRerender(renderTree({ loadedKeys: ['0-0'] }));
      });

      const loadData: any = jest.fn(() => new FakePromise());
      renderTree = (props?: any) => (
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad} {...props}>
          <TreeNode key="0-0" />
        </Tree>
      );

      const { rerender, container } = render(renderTree());
      cacheRerender = rerender;

      rerender(renderTree({ loadedKeys: [] }));

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      expect(loadData).toHaveBeenCalledWith(
        expect.objectContaining({
          key: '0-0',
        }),
      );
      expect(onLoad).toHaveBeenCalledWith(['0-0'], {
        event: 'load',
        node: expect.objectContaining({
          key: '0-0',
        }),
      });
    });
  });

  it('treeData', () => {
    const treeData = [
      { key: 'K0', title: 'T0' },
      {
        key: 'K1',
        title: 'T1',
        children: [
          { key: 'K10', title: 'T10' },
          {
            key: 'K11',
            title: 'T11',
            children: [
              { key: 'K110', title: 'T110' },
              { key: 'K111', title: 'T111' },
            ],
          },
          { key: 'K12', title: 'T12' },
        ],
      },
    ];
    const { container, rerender } = render(<Tree treeData={treeData} defaultExpandAll />);
    expect(container.firstChild).toMatchSnapshot();

    rerender(<Tree treeData={[{ key: 'K0', title: 'T0' }]} defaultExpandAll />);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('disabled', () => {
    it('basic', () => {
      const { container } = render(
        <Tree defaultExpandAll disabled>
          <TreeNode key="0-0" />
        </Tree>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('treeNode should disabled when tree disabled', () => {
      const { container } = render(
        <Tree defaultExpandAll disabled>
          <TreeNode key="0-0" disabled={false} />
        </Tree>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('data and aria props', () => {
    it('renders data attributes', () => {
      const { container } = render(<Tree data-test="tree" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders aria attributes', () => {
      const { container } = render(<Tree aria-label="name" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('custom switcher icon', () => {
    function switcherIcon(text: React.ReactNode, testLeaf?: boolean) {
      const sfc = ({ isLeaf }) => {
        if (testLeaf) {
          return isLeaf ? <span>{text}</span> : null;
        }
        return isLeaf ? null : <span>{text}</span>;
      };

      return sfc;
    }

    it('switcher icon', () => {
      const { container } = render(
        <Tree defaultExpandAll switcherIcon={switcherIcon('switcherIcon')}>
          <TreeNode key="0-0" />
          <TreeNode key="0-1" switcherIcon={switcherIcon('switcherIconFromNode0-1')}>
            <TreeNode key="0-1-0" />
            <TreeNode key="0-1-1" />
          </TreeNode>
        </Tree>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('switcher leaf icon', () => {
      const { container } = render(
        <Tree defaultExpandAll switcherIcon={switcherIcon('switcherLeafIcon', true)}>
          <TreeNode key="0-0" />
          <TreeNode key="0-1" switcherIcon={switcherIcon('switcherLeafIconFromNode0-1', true)} />
          <TreeNode key="0-2">
            <TreeNode key="0-2-0" />
            <TreeNode
              key="0-2-1"
              switcherIcon={switcherIcon('switcherLeafIconFromNode0-2-1', true)}
            />
          </TreeNode>
          <TreeNode key="0-3" />
        </Tree>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should style work', () => {
    const style = { background: 'red' };
    const { container } = render(<Tree style={style} />);
    expect(container.querySelector('.rc-tree-list')).toHaveStyle(style);
  });

  it('titleRender', () => {
    const { container } = render(
      <Tree<FieldDataNode<{ value: string; title?: any }>>
        defaultExpandAll
        titleRender={({ value }) => <span className="bamboo-span">{value}</span>}
        treeData={[
          { title: ({ value }) => <span className="light-span">{value}</span>, value: 'light' },
          { value: 'bamboo' },
        ]}
      />,
    );

    expect(
      container.querySelectorAll('.rc-tree-title')[0].querySelector('.light-span').textContent,
    ).toEqual('light');
    expect(
      container.querySelectorAll('.rc-tree-title')[1].querySelector('.bamboo-span').textContent,
    ).toEqual('bamboo');
  });
});
