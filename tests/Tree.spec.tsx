/* eslint-disable no-undef, react/no-multi-comp, no-console,
react/no-unused-state, react/prop-types, no-return-assign */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Tree, { TreeNode } from '../src';
import { objectMatcher, spyConsole, spyError } from './util';

const OPEN_CLASSNAME = 'rc-tree-switcher_open';
const CHECKED_CLASSNAME = 'rc-tree-checkbox-checked';
const SELECTED_CLASSNAME = 'rc-tree-node-selected';

const delay = (timeout = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

describe('Tree Basic', () => {
  spyConsole();

  it('TreeNode is in Tree', () => {
    expect(TreeNode).toBe(Tree.TreeNode);
  });

  it('renders correctly', () => {
    const { asFragment } = render(
      <Tree
        className="forTest"
        selectable
        checkable
        defaultExpandAll
        showIcon
        showLine
        multiple
        focusable
      >
        <TreeNode title="parent 1" key="0-0" className="spe">
          <TreeNode title="leaf 1" key="0-0-0" disabled>
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
            {null /* Supports conditional rendering */}
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('switcherIcon = null, no render rc-tree-switcher null', () => {
    const { container } = render(
      <Tree className="forTest" defaultExpandAll switcherIcon={() => false}>
        <TreeNode title="parent 1" key="0-0" className="spe">
          <TreeNode title="leaf 1" key="0-0-0" disabled>
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>,
    );
    expect(container.querySelector('.rc-tree-switcher')).toBeFalsy();
  });

  describe('expanded', () => {
    it('expands all keys', () => {
      const { container } = render(
        <Tree defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    });

    it('expands default expanded keys', () => {
      const { container } = render(
        <Tree defaultExpandedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    });

    it('controlled by expanded keys', () => {
      const renderTree = (props?: any) => (
        <Tree expandedKeys={[]} {...props}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      const { container, rerender } = render(renderTree());
      expect(container.querySelector(`.${OPEN_CLASSNAME}`)).toBeFalsy();
      rerender(renderTree({ expandedKeys: ['0-0'] }));
      expect(container.querySelector(`.${OPEN_CLASSNAME}`)).toBeTruthy();
    });

    it('expands parent node when child node is expanded', () => {
      const { container } = render(
        <Tree expandedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );

      expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    });

    it('use treeData to expand the parent node when the parent node key type is numeric', () => {
      const Demo = () => (
        <Tree
          defaultExpandParent
          defaultExpandedKeys={[22]}
          treeData={[{ key: 11, title: 11, children: [{ key: 22, title: 22 }] }]}
        />
      );

      const { container } = render(<Demo />);

      expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    });

    it('does not expand parent node when autoExpandParent is false', () => {
      const { container } = render(
        <Tree expandedKeys={['0-0-0']} defaultExpandParent={false}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );
      expect(container.querySelector(`.${OPEN_CLASSNAME}`)).toBeFalsy();
    });

    it('update to expand parent node with autoExpandParent', () => {
      const renderTree = (props?: any) => (
        <Tree expandedKeys={['0-0-0']} defaultExpandParent={false} {...props}>
          <TreeNode title="parent 1" checkable={false} key="0-0">
            <TreeNode title="leaf 1" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
      );
      const { container, rerender } = render(renderTree());
      expect(container.querySelector(`.${OPEN_CLASSNAME}`)).toBeFalsy();

      rerender(renderTree({ autoExpandParent: true }));

      // All opened
      expect(container.querySelectorAll('.rc-tree-switcher')[0]).toHaveClass(OPEN_CLASSNAME);
      expect(container.querySelectorAll('.rc-tree-switcher')[1]).toHaveClass(OPEN_CLASSNAME);
    });

    it('skip only if disabled with autoExpandParent', () => {
      const { container } = render(
        <Tree expandedKeys={['0-0-0-0']} defaultExpandParent>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" disabled key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
            </TreeNode>
          </TreeNode>
        </Tree>,
      );

      expect(
        container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
      ).toHaveLength(1);
    });

    it('fires expand event', () => {
      const handleExpand = jest.fn();
      const { container } = render(
        <Tree onExpand={handleExpand}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      expect(handleExpand).toHaveBeenCalledWith(['0-0'], {
        expanded: true,
        node: expect.objectContaining({
          key: '0-0',
          title: 'parent 1',
        }),
        nativeEvent: expect.anything(),
      });

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      expect(handleExpand).toHaveBeenCalledWith([], {
        expanded: false,
        node: expect.objectContaining({
          key: '0-0',
          title: 'parent 1',
        }),
        nativeEvent: expect.anything(),
      });
    });
  });

  describe('check', () => {
    it('basic render', () => {
      const { asFragment } = render(
        <Tree checkable defaultExpandAll>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" disabled />
            <TreeNode key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      expect(asFragment().firstChild).toMatchSnapshot();
    });

    it('checks default checked keys', () => {
      const { container } = render(
        <Tree checkable defaultCheckedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      expect(container.querySelectorAll('.rc-tree-checkbox')).toHaveLength(2);
      container.querySelectorAll('.rc-tree-checkbox').forEach(checkbox => {
        expect(checkbox).toHaveClass(CHECKED_CLASSNAME);
      });
    });

    it("ignore disabled children when calculate parent's checked status", () => {
      const { container } = render(
        <Tree checkable defaultCheckedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" disableCheckbox />
            <TreeNode title="leaf 1" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      expect(container.querySelector(`.${CHECKED_CLASSNAME}`)).toBeFalsy();
    });

    it('controlled by checkedKeys', () => {
      const renderTree = (props?: any) => (
        <Tree checkable checkedKeys={[]} {...props}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );
      const { container, rerender } = render(renderTree());
      expect(container.querySelector(`.${CHECKED_CLASSNAME}`)).toBeFalsy();

      rerender(renderTree({ checkedKeys: ['0-0'] }));
      expect(container.querySelector(`.${CHECKED_CLASSNAME}`)).toBeTruthy();
    });

    it('turn parent node to checked when all children are checked', () => {
      const { container } = render(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[2]);
      expect(container.querySelectorAll('.rc-tree-checkbox')[0]).toHaveClass(CHECKED_CLASSNAME);
    });

    it('turns parent node to half checked when child is checked', () => {
      const { container } = render(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[2]);
      expect(container.querySelectorAll('.rc-tree-checkbox')[0]).toHaveClass(
        'rc-tree-checkbox-indeterminate',
      );
    });

    it('turns parent node to checked if it is half checked', () => {
      const { container } = render(
        <Tree checkable>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>
        </Tree>,
      );
      fireEvent.click(container.querySelector('.rc-tree-switcher'));
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[2]);
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
      container.querySelectorAll('.rc-tree-checkbox').forEach(ele => {
        expect(ele).toHaveClass(CHECKED_CLASSNAME);
      });
    });

    it('fires check event', () => {
      const handleCheck = jest.fn();
      const { container } = render(
        <Tree checkable onCheck={handleCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      const nodeData00 = { title: 'parent 1', key: '0-0' };
      const nodeData000 = { title: 'leaf 1', key: '0-0-0' };

      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
      expect(handleCheck).toHaveBeenCalledWith(
        ['0-0', '0-0-0'],
        objectMatcher({
          checked: true,
          checkedNodes: [nodeData00, nodeData000],
          checkedNodesPositions: [
            { node: nodeData00, pos: '0-0' },
            { node: nodeData000, pos: '0-0-0' },
          ],
          event: 'check',
          halfCheckedKeys: [],
          node: {
            title: 'parent 1',
            key: '0-0',
          },
          nativeEvent: {},
        }),
      );

      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);
      expect(handleCheck).toHaveBeenCalledWith(
        [],
        objectMatcher({
          checked: false,
          checkedNodes: [],
          checkedNodesPositions: [],
          event: 'check',
          halfCheckedKeys: [],
          node: {
            title: 'leaf 1',
            key: '0-0-0',
          },
          nativeEvent: {},
        }),
      );
    });

    // https://github.com/react-component/tree/issues/117
    it('check works correctly after dragging children under another node', () => {
      const renderTree = (children: React.ReactNode) => (
        <Tree defaultExpandAll checkable>
          {children}
        </Tree>
      );
      const { container, rerender } = render(
        renderTree(
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>,
        ),
      );
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);

      rerender(
        renderTree(
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 2" key="0-0-1">
              <TreeNode title="leaf 1" key="0-0-0" />
            </TreeNode>
          </TreeNode>,
        ),
      );

      expect(() => {
        fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[2]);
      }).not.toThrow();
    });

    // https://github.com/react-component/tree/issues/90
    it('check works correctly after adding children dynamically', () => {
      const renderTree = (children: React.ReactNode) => (
        <Tree defaultExpandAll checkable>
          {children}
        </Tree>
      );
      const { container, rerender } = render(
        renderTree(
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>,
        ),
      );

      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);
      rerender(
        renderTree(
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>,
        ),
      );
      expect(() => {
        fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[2]);
      }).not.toThrow();
    });

    // https://github.com/ant-design/ant-design/issues/7353
    it('check children after changing from children[disableCheckbox] from true to false', () => {
      let checkedKeys = null;
      const mockHandleCheck = (keys: React.Key[]) => (checkedKeys = keys);
      function Test({ disableCheckbox }) {
        return (
          <Tree checkable onCheck={mockHandleCheck}>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="leaf 1" key="0-0-1" disableCheckbox={disableCheckbox} />
              <TreeNode title="leaf 2" key="0-0-2" disableCheckbox={disableCheckbox} />
              <TreeNode title="leaf 3" key="0-0-3" disableCheckbox={disableCheckbox} />
            </TreeNode>
          </Tree>
        );
      }
      const { container, rerender } = render(<Test disableCheckbox />);
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
      expect(checkedKeys).toEqual(['0-0']);

      rerender(<Test disableCheckbox={false} />);
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
      expect(checkedKeys).toEqual(['0-0', '0-0-1', '0-0-2', '0-0-3']);
    });

    it('check dynamic children when their parent is checked', () => {
      const mockLoadData: any = () => new Promise(() => {});
      const renderTree = (children?: React.ReactNode) => (
        <Tree checkable defaultCheckedKeys={['0-0']} loadData={mockLoadData} expandedKeys={['0-0']}>
          {children}
        </Tree>
      );

      const { container, rerender } = render(renderTree(<TreeNode title="parent 1" key="0-0" />));
      rerender(
        renderTree(
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
            <TreeNode title="leaf 2" key="0-0-1" />
          </TreeNode>,
        ),
      );

      expect(container.querySelectorAll(`.${CHECKED_CLASSNAME}`)).toHaveLength(3);
    });

    // https://github.com/ant-design/ant-design/issues/10132
    it('check update when Tree trigger componentWillReceiveProps', () => {
      class Test extends React.Component {
        state = {};

        onCheck = () => {
          this.setState({ whatever: 1 });
        };

        render() {
          return (
            <Tree checkable>
              <TreeNode title="parent 1" key="0-0" />
            </Tree>
          );
        }
      }
      const { container } = render(<Test />);
      fireEvent.click(container.querySelector('.rc-tree-checkbox'));

      expect(container.firstChild).toMatchSnapshot();
    });

    describe('check after data ready', () => {
      const errorSpy = spyError();

      it('works', () => {
        const checkedKeys = ['0-0-0'];
        const { container, rerender } = render(<Tree checkable checkedKeys={checkedKeys} />);
        expect(errorSpy()).toHaveBeenCalledWith("Warning: Tree missing follow keys: '0-0-0'");

        rerender(
          <Tree checkable checkedKeys={checkedKeys} expandedKeys={['0-0']}>
            <TreeNode key="0-0" title="Light">
              <TreeNode key="0-0-0" title="Bamboo" />
            </TreeNode>
          </Tree>,
        );

        expect(container.firstChild).toMatchSnapshot();
      });
    });

    it('should ignore !checkable node', () => {
      const onCheck = jest.fn();
      const { container } = render(
        <Tree checkable defaultExpandAll onCheck={onCheck}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" checkable={false} />
            <TreeNode key="0-0-1" />
          </TreeNode>
        </Tree>,
      );

      fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);

      expect(onCheck.mock.calls[0][0].sort()).toEqual(['0-0', '0-0-1']);
    });

    describe('strictly', () => {
      it('checks strictly', () => {
        const { container } = render(
          <Tree checkable checkStrictly>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="leaf 1" key="0-0-0" />
            </TreeNode>
          </Tree>,
        );
        fireEvent.click(container.querySelector('.rc-tree-switcher'));
        fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
        expect(container.querySelectorAll('.rc-tree-checkbox')[0]).toHaveClass(CHECKED_CLASSNAME);
        expect(container.querySelectorAll('.rc-tree-checkbox')[1]).not.toHaveClass(
          CHECKED_CLASSNAME,
        );
      });

      describe('controlled mode', () => {
        class App extends React.Component {
          state = {
            checkedKeys: {
              checked: [],
              halfChecked: [],
            },
          };

          handleCheck = checkedKeys => {
            this.setState({ checkedKeys });
          };

          render() {
            return (
              <>
                <Tree
                  checkable
                  checkStrictly
                  checkedKeys={this.state.checkedKeys}
                  onCheck={this.handleCheck}
                >
                  <TreeNode title="parent 1" key="0-0">
                    <TreeNode title="leaf 1" key="0-0-0" />
                  </TreeNode>
                </Tree>
                <button
                  onClick={() => {
                    this.setState({ checkedKeys: { checked: ['0-0', '0-0-0'], halfChecked: [] } });
                  }}
                />
              </>
            );
          }
        }

        it('do not check children', () => {
          const { container } = render(<App />);
          fireEvent.click(container.querySelector('.rc-tree-switcher'));
          fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[0]);
          expect(container.querySelectorAll('.rc-tree-checkbox')[0]).toHaveClass(CHECKED_CLASSNAME);
          expect(container.querySelectorAll('.rc-tree-checkbox')[1]).not.toHaveClass(
            CHECKED_CLASSNAME,
          );
        });

        it('do not uncheck parent', () => {
          const { container } = render(<App />);
          fireEvent.click(container.querySelector('button'));
          fireEvent.click(container.querySelector('.rc-tree-switcher'));
          fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);
          expect(container.querySelectorAll('.rc-tree-checkbox')[0]).toHaveClass(CHECKED_CLASSNAME);
          expect(container.querySelectorAll('.rc-tree-checkbox')[1]).not.toHaveClass(
            CHECKED_CLASSNAME,
          );
        });
      });
    });

    // https://github.com/ant-design/ant-design/issues/6891
    it('should ignore disableCheckbox children items when check parent', () => {
      const onCheck = jest.fn();
      const { container } = render(
        <Tree checkable defaultExpandAll onCheck={onCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0" disableCheckbox>
              <TreeNode title="node" key="0-0-0-0" disableCheckbox />
              <TreeNode title="node" key="0-0-0-1" disableCheckbox />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );

      const firstNode = container.querySelectorAll('.rc-tree-checkbox')[0];
      fireEvent.click(firstNode);

      expect(firstNode).toHaveClass('rc-tree-checkbox-checked');
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(onCheck).toHaveBeenCalledWith(['0-0', '0-0-1', '0-0-2'], expect.anything());

      fireEvent.click(firstNode);
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-checked');
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(onCheck).toHaveBeenCalledWith([], expect.anything());
    });

    it('should ignore disabled children items when check parent', () => {
      const onCheck = jest.fn();
      const { container } = render(
        <Tree checkable defaultExpandAll onCheck={onCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0" disabled>
              <TreeNode title="node" key="0-0-0-0" disabled />
              <TreeNode title="node" key="0-0-0-1" disabled />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );

      const firstNode = container.querySelector('.rc-tree-checkbox');

      fireEvent.click(firstNode);
      expect(firstNode).toHaveClass('rc-tree-checkbox-checked');
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(onCheck).toHaveBeenCalledWith(['0-0', '0-0-1', '0-0-2'], expect.anything());

      fireEvent.click(firstNode);
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-checked');
      expect(firstNode).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(onCheck).toHaveBeenCalledWith([], expect.anything());
    });

    // https://github.com/react-component/tree/pull/106#issuecomment-316779889
    it('should render parent check state correctly', () => {
      const { container } = render(
        <Tree checkable defaultExpandAll>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="node" key="0-0-0">
              <TreeNode title="node" key="0-0-0-0" />
              <TreeNode title="node" key="0-0-0-1" disableCheckbox />
            </TreeNode>
            <TreeNode title="node" key="0-0-1" />
            <TreeNode title="node" key="0-0-2" />
          </TreeNode>
        </Tree>,
      );
      const parent = container.querySelectorAll('.rc-tree-checkbox')[1];
      const node = container.querySelectorAll('.rc-tree-checkbox')[2];

      fireEvent.click(node);
      expect(node).toHaveClass('rc-tree-checkbox-checked');
      expect(parent).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(parent).toHaveClass('rc-tree-checkbox-checked');

      fireEvent.click(node);
      expect(node).not.toHaveClass('rc-tree-checkbox-checked');
      expect(parent).not.toHaveClass('rc-tree-checkbox-indeterminate');
      expect(parent).not.toHaveClass('rc-tree-checkbox-checked');
    });
  });

  describe('select', () => {
    it('selects default selected keys', () => {
      const { container } = render(
        <Tree selectable defaultSelectedKeys={['0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      expect(container.querySelector('.rc-tree-node-content-wrapper')).toHaveClass(
        SELECTED_CLASSNAME,
      );
    });

    it('controlled by selectedKeys', () => {
      const renderTree = (props?: any) => (
        <Tree selectable selectedKeys={[]} {...props}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      const { container, rerender } = render(renderTree());
      expect(container.querySelector('.rc-tree-node-content-wrapper')).not.toHaveClass(
        SELECTED_CLASSNAME,
      );

      rerender(renderTree({ selectedKeys: ['0-0'] }));
      expect(container.querySelector('.rc-tree-node-content-wrapper')).toHaveClass(
        SELECTED_CLASSNAME,
      );
    });

    it('fires select event', () => {
      const handleSelect = jest.fn();
      const { container } = render(
        <Tree selectable onSelect={handleSelect}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      const nodeContent = container.querySelector('.rc-tree-node-content-wrapper');

      fireEvent.click(nodeContent);
      expect(handleSelect).toHaveBeenCalledWith(
        ['0-0'],
        objectMatcher({
          event: 'select',
          node: {
            title: 'parent 1',
            key: '0-0',
          },
          selected: true,
          selectedNodes: [{ title: 'parent 1', key: '0-0' }],
          nativeEvent: {},
        }),
      );

      fireEvent.click(nodeContent);
      expect(handleSelect).toHaveBeenCalledWith(
        [],
        objectMatcher({
          event: 'select',
          node: {
            title: 'parent 1',
            key: '0-0',
          },
          selected: false,
          selectedNodes: [],
          nativeEvent: {},
        }),
      );
    });
  });

  describe('checkable but not selectable', () => {
    it('fires check event when click on TreeNode', () => {
      const handleCheck = jest.fn();
      const { container } = render(
        <Tree checkable selectable={false} onCheck={handleCheck}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf 1" key="0-0-0" />
          </TreeNode>
        </Tree>,
      );
      fireEvent.click(container.querySelector('.rc-tree-switcher'));

      const dataNode1 = { title: 'parent 1', key: '0-0' };
      const dataNode2 = { title: 'leaf 1', key: '0-0-0' };

      fireEvent.click(container.querySelector('.rc-tree-node-content-wrapper'));
      expect(handleCheck).toHaveBeenCalledWith(
        ['0-0', '0-0-0'],
        objectMatcher({
          checked: true,
          checkedNodes: [dataNode1, dataNode2],
          checkedNodesPositions: [
            { node: dataNode1, pos: '0-0' },
            { node: dataNode2, pos: '0-0-0' },
          ],
          event: 'check',
          halfCheckedKeys: [],
          node: { title: 'parent 1', key: '0-0' },
          nativeEvent: {},
        }),
      );

      fireEvent.click(container.querySelectorAll('.rc-tree-node-content-wrapper')[1]);
      expect(handleCheck).toHaveBeenCalledWith(
        [],
        objectMatcher({
          checked: false,
          checkedNodes: [],
          checkedNodesPositions: [],
          event: 'check',
          halfCheckedKeys: [],
          node: {
            title: 'leaf 1',
            key: '0-0-0',
          },
          nativeEvent: {},
        }),
      );
    });
  });

  it('fires rightClick event', () => {
    const handleRightClick = jest.fn();
    const { container } = render(
      <Tree onRightClick={handleRightClick}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    fireEvent.contextMenu(container.querySelector('.rc-tree-node-content-wrapper'));
    expect(handleRightClick.mock.calls[0][0].node).toEqual(
      expect.objectContaining({
        title: 'parent 1',
        key: '0-0',
      }),
    );
  });

  it('fires rightClick should not change selected item', () => {
    const onRightClick = jest.fn();
    const onSelect = jest.fn();
    const { container } = render(
      <Tree onRightClick={onRightClick} selectedKeys={['0-0-0']} onSelect={onSelect}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    fireEvent.contextMenu(container.querySelector('.rc-tree-node-content-wrapper'));
    expect(onRightClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(container.querySelector('.rc-tree-node-selected')).toBeFalsy();
  });

  it('fires mouseEnter events', () => {
    const handleMouseEnter = jest.fn();
    const { container } = render(
      <Tree onMouseEnter={handleMouseEnter}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );
    fireEvent.mouseEnter(container.querySelector('.rc-tree-node-content-wrapper'));
    expect(handleMouseEnter.mock.calls[0][0].node).toEqual(
      expect.objectContaining({
        key: '0-0',
      }),
    );
  });

  it('fires mouseLeave events', () => {
    const handleMouseLeave = jest.fn();
    const { container } = render(
      <Tree onMouseLeave={handleMouseLeave}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0" />
        </TreeNode>
      </Tree>,
    );

    fireEvent.mouseLeave(container.querySelector('.rc-tree-node-content-wrapper'));
    expect(handleMouseLeave.mock.calls[0][0].node).toEqual(
      expect.objectContaining({
        key: '0-0',
      }),
    );
  });

  it('filters nodes', () => {
    function filterTreeNode(treeNode) {
      return treeNode.title.indexOf('parent') > -1;
    }
    const { container } = render(
      <Tree filterTreeNode={filterTreeNode}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="meck" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>,
    );

    expect(container.querySelector('.filter-node')).toBeTruthy();
  });

  it('loads nodes asynchronously', () => {
    const then = jest.fn(() => Promise.resolve());
    const loadData: any = jest.fn(() => ({ then }));
    const { container } = render(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    expect(loadData).toHaveBeenCalledWith(
      expect.objectContaining({
        key: '0-0',
      }),
    );
    expect(then).toHaveBeenCalled();
  });

  it('renders without errors', () => {
    expect(() => {
      render(
        <Tree>
          {[0, 1].map(i => (
            <TreeNode title={i} key={i}>
              {[2, 3].map(j => (
                <TreeNode title={j} key={`${i}_${j}`} />
              ))}
              <TreeNode title="4" key={`${i}_4`} />
            </TreeNode>
          ))}
        </Tree>,
      );
    }).not.toThrow();
  });

  it('renders opaque children correctly', () => {
    const { asFragment } = render(
      <Tree>
        <TreeNode title="0" key="0">
          {[1, 2].map(i => (
            <TreeNode title={i} key={i} />
          ))}
          <TreeNode title="3" key="3" />
        </TreeNode>
      </Tree>,
    );

    expect(asFragment().firstChild).toMatchSnapshot();
  });

  describe('ignore illegal node as Tree children', () => {
    const errorSpy = spyError();

    it('Direct TreeNode', () => {
      const { asFragment } = render(
        <Tree defaultExpandAll>
          <TreeNode key="00" title="00" />
          <span>Hide Me</span>
          <TreeNode key="02" title="02" />
        </Tree>,
      );
      expect(asFragment().firstChild).toMatchSnapshot();
      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: Tree/TreeNode can only accept TreeNode as children.',
      );
    });

    it('Sub TreeNode', () => {
      resetWarned();
      const { asFragment } = render(
        <Tree defaultExpandAll>
          <TreeNode key="00" title="00" />
          <TreeNode key="01" title="01">
            <TreeNode key="010" title="010" />
            <span>I AM INVISIBLE</span>
            <TreeNode key="012" title="012" />
          </TreeNode>
        </Tree>,
      );
      expect(asFragment().firstChild).toMatchSnapshot();
      expect(errorSpy()).toHaveBeenCalledWith(
        'Warning: Tree/TreeNode can only accept TreeNode as children.',
      );
    });
  });

  it('Number key', () => {
    const onCheck = jest.fn();

    const Demo = () => {
      const [checkedKeys, setCheckedKeys] = React.useState<any>([]);

      return (
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={keys => {
            setCheckedKeys(keys);
            onCheck(keys);
          }}
          treeData={[{ key: 11, title: 11, children: [{ key: 22, title: 22 }] }]}
        />
      );
    };

    const { container } = render(<Demo />);

    fireEvent.click(container.querySelector('.rc-tree-checkbox'));
    expect(onCheck).toHaveBeenCalledWith([11, 22]);

    onCheck.mockReset();
    fireEvent.click(container.querySelectorAll('.rc-tree-checkbox')[1]);
    expect(onCheck).toHaveBeenCalledWith([]);
  });

  describe('scrollTo should work', () => {
    let domSpy: ReturnType<typeof spyElementPrototypes>;
    let called = false;

    beforeAll(() => {
      domSpy = spyElementPrototypes(HTMLDivElement, {
        scrollTop: {
          get: () => 233,
          set: () => {
            called = true;
          },
        },
        clientHeight: {
          get: () => 100,
        },
      });
    });

    afterAll(() => {
      domSpy.mockRestore();
    });

    it('work', () => {
      jest.useFakeTimers();
      const treeRef = React.createRef<any>();
      render(<Tree ref={treeRef} />);

      treeRef.current.scrollTo({ key: 'light', align: 'top' });
      jest.runAllTimers();

      expect(called).toBeTruthy();
      jest.useRealTimers();
    });
  });

  it('not crash if expandedKeys is null', () => {
    render(
      <Tree expandedKeys={null}>
        <TreeNode key="test" title="alive" />
      </Tree>,
    );
  });

  it('not crash if expandedKeys change to undefined', () => {
    const renderTree = (props?: any) => (
      <Tree expandedKeys={['light']} {...props}>
        <TreeNode key="light" title="light">
          <TreeNode key="bamboo" title="bamboo" />
        </TreeNode>
      </Tree>
    );
    const { container, rerender } = render(renderTree());
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(2);

    rerender(renderTree({ expandedKeys: undefined }));

    // Click should not crash
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
  });

  it('controlled should block expanded', () => {
    const { container } = render(
      <Tree
        expandedKeys={['1']}
        treeData={[{ key: '1', title: 1, children: [{ key: '2', title: 2 }] }]}
      />,
    );

    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(2);
  });

  it('support virtual', () => {
    const data = [];
    for (let i = 0; i < 99; i += 1) {
      data.push({
        key: i,
        title: i,
      });
    }

    const { container } = render(
      <Tree itemHeight={10} height={100} treeData={data} virtual={false} />,
    );

    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(99);
  });

  // https://github.com/ant-design/ant-design/issues/28349
  it('should not trigger expend when loading data', () => {
    const then = jest.fn(() => Promise.resolve());
    const loadData: any = jest.fn(() => ({ then }));
    const onExpand = jest.fn();
    const { container } = render(
      <Tree loadData={loadData} onExpand={onExpand}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );

    // trigger click to expand node
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    expect(onExpand).toBeCalled();

    // click again
    onExpand.mockReset();
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    expect(container.querySelector('.rc-tree-switcher')).toHaveClass(OPEN_CLASSNAME);
    expect(onExpand).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/31141
  it('should restore tree node loading and expand status when loadData fail', async () => {
    const loadData = () => new Promise((_, reject) => setTimeout(reject));
    const { container } = render(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>,
    );
    fireEvent.click(container.querySelector('.rc-tree-switcher'));
    expect(container.querySelector('.rc-tree-switcher')).toHaveClass('rc-tree-switcher_open');
    await delay(100);
    expect(container.querySelector('.rc-tree-switcher')).toHaveClass('rc-tree-switcher_close');
  });

  // https://github.com/ant-design/ant-design/issues/31141
  it('should support onScroll', async () => {
    const onScroll = jest.fn();
    const data = [];
    for (let i = 0; i < 99; i += 1) {
      data.push({
        key: i,
        title: i,
      });
    }
    const { container } = render(
      <Tree itemHeight={10} height={100} treeData={data} onScroll={onScroll} />,
    );
    fireEvent.scroll(container.querySelector('.rc-tree-list-holder'));
    expect(onScroll).toBeCalled();
  });

  it('should support rootStyle and rootClassName', () => {
    const data = [];
    for (let i = 0; i < 9; i += 1) {
      data.push({
        key: i,
        title: i,
      });
    }
    const { container } = render(
      <Tree treeData={data} rootClassName="root-tree" rootStyle={{ backgroundColor: 'cyan' }} />,
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('root-tree');
    expect(container.firstChild).toHaveStyle({ backgroundColor: 'cyan' });
  });
});
