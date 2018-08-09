/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Animate from 'rc-animate';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from '..';
import { nodeMatcher } from './util';

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
  // prefixCls
  it('prefixCls', () => {
    const withoutPrefix = render(
      <Tree />
    );
    expect(renderToJson(withoutPrefix)).toMatchSnapshot();

    const withPrefix = render(
      <Tree prefixCls="test-prefix" />
    );
    expect(renderToJson(withPrefix)).toMatchSnapshot();
  });

  // showLine
  it('showLine', () => {
    const wrapper = render(
      <Tree showLine />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
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
      </Tree>
    );
    expect(renderToJson(withIcon)).toMatchSnapshot();

    const withoutIcon = render(
      <Tree showIcon={false}>
        <TreeNode>
          <TreeNode>
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>
    );
    expect(renderToJson(withoutIcon)).toMatchSnapshot();

    const withOpenIcon = render(
      <Tree defaultExpandedKeys={['0-0']}>
        <TreeNode>
          <TreeNode key="0-0">
            <TreeNode />
          </TreeNode>
          <TreeNode />
        </TreeNode>
        <TreeNode />
      </Tree>
    );
    expect(renderToJson(withOpenIcon)).toMatchSnapshot();
  });

  describe('selectable', () => {
    // selectable - false
    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const withoutSelectableBase = (
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']} selectable={false}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      expect(renderToJson(render(withoutSelectableBase))).toMatchSnapshot();

      const withoutSelectable = mount(withoutSelectableBase);
      const parentNode = withoutSelectable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

      expect(handleOnSelect).not.toBeCalled();
      expect(handleOnCheck).not.toBeCalled(); // Will test in checkable
    });

    // selectable - true
    it('with selectable', () => {
      const handleOnSelect = jest.fn();

      const withSelectableBase = (
        <Tree onSelect={handleOnSelect} defaultExpandedKeys={['0-0']}>
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      expect(renderToJson(render(withSelectableBase))).toMatchSnapshot();

      const withSelectable = mount(withSelectableBase);
      const parentNode = withSelectable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      // Select leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

      // traverseTreeNodes loops origin TreeNode and
      // onSelect trigger on `cloneElement` which is not the same instance
      // TODO: use context instead of `cloneElement` to reduce
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      // un-select leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith([], {
        event: 'select',
        selected: false,
        node: targetNode.instance(),
        selectedNodes: [],
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      // Select leaf and then parent
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      });
      handleOnSelect.mockReset();

      parentNode.find('.rc-tree-node-content-wrapper').first().simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0'], {
        event: 'select',
        selected: true,
        node: parentNode.instance(),
        selectedNodes: [withSelectable.find(Tree).props().children],
        nativeEvent: expect.objectContaining({}),
      });
    });
  });

  // multiple - this prop works with selectable
  it('multiple', () => {
    const handleOnSelect = jest.fn();

    const multipleBase = (
      <Tree
        onSelect={handleOnSelect}
        defaultExpandAll
        multiple
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(render(multipleBase))).toMatchSnapshot();

    const wrapper = mount(multipleBase);
    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Leaf select
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
      event: 'select',
      selected: true,
      node: targetNode.instance(),
      selectedNodes: [parentNode.props().children],
      nativeEvent: expect.objectContaining({}),
    });
    handleOnSelect.mockReset();

    // Parent select
    parentNode.find('.rc-tree-node-content-wrapper').first().simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
      event: 'select',
      selected: true,
      node: parentNode.instance(),
      selectedNodes: [nodeMatcher({ key: '0-0-0' }), nodeMatcher({ key: '0-0' })],
      nativeEvent: expect.objectContaining({}),
    }));
    handleOnSelect.mockReset();

    // Leaf un-select
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
    expect(handleOnSelect).toBeCalledWith(['0-0'], {
      event: 'select',
      selected: false,
      node: targetNode.instance(),
      selectedNodes: [nodeMatcher({ key: '0-0' })],
      nativeEvent: expect.objectContaining({}),
    });
  });

  // checkable
  describe('checkable', () => {
    it('default', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const withCheckableBase = (
        <Tree
          onSelect={handleOnSelect}
          onCheck={handleOnCheck}
          defaultExpandedKeys={['0-0']}
          checkable
        >
          <TreeNode key="0-0">
            <TreeNode key="0-0-0" />
          </TreeNode>
        </Tree>
      );

      expect(renderToJson(render(withCheckableBase))).toMatchSnapshot();

      const withCheckable = mount(withCheckableBase);
      const parentNode = withCheckable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      // Click leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnSelect).toBeCalledWith(['0-0-0'], {
        event: 'select',
        selected: true,
        node: targetNode.instance(),
        selectedNodes: [parentNode.props().children],
        nativeEvent: expect.objectContaining({}),
      });
      expect(handleOnCheck).not.toBeCalled();
      expect(handleOnSelect).toBeCalled();

      handleOnCheck.mockReset();
      handleOnSelect.mockReset();

      // Click checkbox
      targetNode.find('.rc-tree-checkbox').simulate('click');

      expect(handleOnCheck).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
        event: 'check',
        checked: true,
        node: targetNode.instance(),
        checkedNodes: [nodeMatcher({ key: '0-0-0' }), nodeMatcher({ key: '0-0' })],
        nativeEvent: expect.objectContaining({}),
      }));
      expect(handleOnSelect).not.toBeCalled();
    });

    it('without selectable', () => {
      const handleOnSelect = jest.fn();
      const handleOnCheck = jest.fn();

      const withCheckableBase = (
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
        </Tree>
      );

      expect(renderToJson(render(withCheckableBase))).toMatchSnapshot();

      const withCheckable = mount(withCheckableBase);
      const parentNode = withCheckable.find(TreeNode).first();
      const targetNode = parentNode.find(TreeNode).last();

      // Click leaf
      targetNode.find('.rc-tree-node-content-wrapper').simulate('click');
      expect(handleOnCheck).toBeCalledWith(['0-0-0', '0-0'], expect.objectContaining({
        event: 'check',
        checked: true,
        node: targetNode.instance(),
        checkedNodes: [nodeMatcher({ key: '0-0-0' }), nodeMatcher({ key: '0-0' })],
        nativeEvent: expect.objectContaining({}),
      }));
      expect(handleOnSelect).not.toBeCalled();
    });
  });

  // Don't crash
  describe('invalidate checkedKeys', () => {
    const genWrapper = (checkedKeys) => mount(
      <Tree
        checkedKeys={checkedKeys}
        defaultExpandAll
        checkable
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    it('null', () => {
      const wrapper = genWrapper(null);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('number', () => {
      console.log('>>> Follow Warning is for test purpose. Don\'t be scared :)');
      const wrapper = genWrapper(123);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  // checkStrictly
  it('checkStrictly', () => {
    const handleOnCheck = jest.fn();

    const withCheckStrictlyBase = (
      <Tree
        onCheck={handleOnCheck}
        defaultExpandedKeys={['0-0']}
        checkable
        checkStrictly
      >
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(render(withCheckStrictlyBase))).toMatchSnapshot();

    const withCheckStrictly = mount(withCheckStrictlyBase);
    const parentNode = withCheckStrictly.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Click Leaf
    targetNode.find('.rc-tree-checkbox').simulate('click');
    expect(handleOnCheck).toBeCalledWith({
      checked: ['0-0-0'],
      halfChecked: [],
    }, expect.objectContaining({
      event: 'check',
      checked: true,
      node: targetNode.instance(),
      checkedNodes: [parentNode.props().children],
      nativeEvent: expect.objectContaining({}),
    }));
  });

  // draggable - is already full test in Tree.spec.js
  // autoExpandParent - is already full test in Tree.spec.js

  // defaultExpandAll
  it('defaultExpandAll', () => {
    const wrapper = render(
      <Tree defaultExpandAll>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  // defaultCheckedKeys - is already full test in Tree.spec.js
  // defaultSelectedKeys - is already full test in Tree.spec.js

  describe('loadData', () => {
    it('basic', () => {
      let called = 0;

      const handleLoadData = jest.fn();

      class Demo extends React.Component {
        state = {
          loaded: false,
        };

        loadData = (...args) => {
          called += 1;
          handleLoadData(...args);

          this.setState({ loaded: true });

          return Promise.resolve();
        };

        render() {
          // Hide icon will still show the icon for loading status
          return (
            <Tree loadData={this.loadData} showIcon={false}>
              <TreeNode key="0-0">
                {this.state.loaded ? <TreeNode key="0-0-0" /> : null}
              </TreeNode>
            </Tree>
          );
        }
      }

      const wrapper = mount(<Demo />);

      expect(handleLoadData).not.toBeCalled();

      const switcher = wrapper.find('.rc-tree-switcher');
      const node = wrapper.find(TreeNode).instance();
      switcher.simulate('click');

      return timeoutPromise().then(() => {
        expect(handleLoadData).toBeCalledWith(node);
        expect(called).toBe(1);
        expect(renderToJson(wrapper.render())).toMatchSnapshot();
      });
    });

    // https://github.com/ant-design/ant-design/issues/11689#issuecomment-411712770
    it('with expandedKeys', () => {
      let called = 0;
      const keys = {};
      const loadData = ({ props: { eventKey } }) => {
        keys[eventKey] = (keys[eventKey] || 0) + 1;

        return new Promise(() => {
          called += 1;
        });
      };

      mount(
        <Tree
          loadData={loadData}
          expandedKeys={['0', '1', '2']}
        >
          <TreeNode key="0" />
          <TreeNode key="1" />
          <TreeNode key="2" />
        </Tree>
      );

      return timeoutPromise().then(() => {
        expect(called).toBe(3);
        expect(keys[0]).toBe(1);
        expect(keys[1]).toBe(1);
        expect(keys[2]).toBe(1);
      });
    });
  });

  it('icon', () => {
    // Node icon has much higher priority
    const wrapper = render(
      <Tree defaultExpandAll icon={<span>ROOT ICON</span>}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" icon={<span>CUSTOMIZE ICON</span>} />
        </TreeNode>
      </Tree>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('onClick', () => {
    const onClick = jest.fn();

    const wrapper = mount(
      <Tree onClick={onClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Select leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('click');

    expect(onClick).toBeCalledWith(
      expect.objectContaining({}),
      targetNode.instance(),
    );
  });

  it('onDoubleClick', () => {
    const onClick = jest.fn();
    const onDoubleClick = jest.fn();

    const wrapper = mount(
      <Tree onClick={onClick} onDoubleClick={onDoubleClick} defaultExpandedKeys={['0-0']}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const parentNode = wrapper.find(TreeNode).first();
    const targetNode = parentNode.find(TreeNode).last();

    // Select leaf
    targetNode.find('.rc-tree-node-content-wrapper').simulate('doubleclick');

    expect(onClick).not.toBeCalled();
    expect(onDoubleClick).toBeCalledWith(
      expect.objectContaining({}),
      targetNode.instance(),
    );
  });

  describe('loadedKeys & onLoad', () => {
    it('has loadedKeys', () => {
      const loadData = jest.fn(() => Promise.resolve());
      const onLoad = jest.fn();

      const wrapper = mount(
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad}>
          <TreeNode key="0-0" />
        </Tree>
      );

      wrapper.find('.rc-tree-switcher').simulate('click');
      expect(loadData).not.toBeCalled();
      expect(onLoad).not.toBeCalled();
    });

    it('reset loadedKeys', () => {
      class FakePromise {
        constructor(val) {
          this.val = val;
        }
        then = (func) => {
          const ret = func(this.val);
          return new FakePromise(ret);
        }
      }

      let wrapper;

      const loadData = jest.fn(() => new FakePromise());
      const onLoad = jest.fn(() => {
        wrapper.setProps({ loadedKeys: ['0-0'] });
      });

      wrapper = mount(
        <Tree loadedKeys={['0-0']} loadData={loadData} onLoad={onLoad}>
          <TreeNode key="0-0" />
        </Tree>
      );
      wrapper.setProps({ loadedKeys: [] });
      wrapper.find('.rc-tree-switcher').simulate('click');
      expect(loadData).toBeCalledWith(wrapper.find(TreeNode).instance());
      expect(onLoad).toBeCalledWith(['0-0'], {
        event: 'load',
        node: wrapper.find(TreeNode).instance(),
      });
    });
  });

  it('treeData', () => {
    const treeData = [
      { key: 'K0', title: 'T0' },
      {
        key: 'K1', title: 'T1', children:
          [
            { key: 'K10', title: 'T10' },
            {
              key: 'K11', title: 'T11', children:
                [
                  { key: 'K110', title: 'T110' },
                  { key: 'K111', title: 'T111' },
                ]
            },
            { key: 'K12', title: 'T12' },
          ],
      },
    ];
    const wrapper = mount(<Tree treeData={treeData} defaultExpandAll />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('unstable_processTreeEntity', () => {
    const onProcessFinished = jest.fn();

    const handler = {
      initWrapper(wrapper) {
        return { ...wrapper, valueEntities: {} };
      },
      processEntity(entity, { valueEntities }) {
        valueEntities[entity.node.props.value] = entity;
      },
      onProcessFinished,
    };

    mount(
      <Tree unstable_processTreeEntity={handler}>
        <TreeNode key="K0" title="T0" value={0} />
        <TreeNode key="K1" title="T1" value={1}>
          <TreeNode key="K10" title="T10" value={10} />
          <TreeNode key="K11" title="T11" value={11} />
        </TreeNode>
      </Tree>
    );

    expect(onProcessFinished).toBeCalled();

    const valueList = Object.keys(onProcessFinished.mock.calls[0][0].valueEntities);
    expect(valueList).toEqual(['0', '1', '10', '11']);
  });

  describe('disabled', () => {
    it('basic', () => {
      const wrapper = render(
        <Tree defaultExpandAll disabled>
          <TreeNode key="0-0" />
        </Tree>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('treeNode not disabled', () => {
      const wrapper = render(
        <Tree defaultExpandAll disabled>
          <TreeNode key="0-0" disabled={false} />
        </Tree>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('openTransitionName', () => {
    const wrapper = mount(
      <Tree openTransitionName="test-trans">
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const { transitionName } = wrapper.find(Animate).props();
    expect(transitionName).toBe('test-trans');
  });

  it('openAnimation', () => {
    const openAnimation = {
      enter: 'test-enter',
      leave: 'test-leave',
    };
    const wrapper = mount(
      <Tree openAnimation={openAnimation}>
        <TreeNode key="0-0">
          <TreeNode key="0-0-0" />
        </TreeNode>
      </Tree>
    );

    const { animation } = wrapper.find(Animate).props();
    expect(animation).toEqual(openAnimation);
  });

  describe('custom switcher icon', () => {
    function switcherIcon(text, testLeaf) {
      const sfc = ({ isLeaf }) => {
        if (testLeaf) {
          return isLeaf ? <span>{text}</span> : null;
        } 
        return isLeaf ? null : <span>{text}</span>;
      };

      sfc.propTypes = {
        isLeaf: PropTypes.bool,
      };

      return sfc;
    }
    it('switcher icon', () => {
      const wrapper = render(
        <Tree defaultExpandAll switcherIcon={switcherIcon('switcherIcon')}>
          <TreeNode key="0-0" />
          <TreeNode key="0-1" switcherIcon={switcherIcon('switcherIconFromNode0-1')}>
            <TreeNode key="0-1-0" />
            <TreeNode key="0-1-1" />
          </TreeNode>
        </Tree>
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('switcher leaf icon', () => {
      const wrapper = render(
        <Tree defaultExpandAll switcherIcon={switcherIcon('switcherLeafIcon', true)}>
          <TreeNode key="0-0" />
          <TreeNode key="0-1" switcherIcon={switcherIcon('switcherLeafIconFromNode0-1', true)} />
          <TreeNode key="0-2">
            <TreeNode key="0-2-0" />
            <TreeNode key="0-2-1" switcherIcon={switcherIcon('switcherLeafIconFromNode0-2-1', true)} />
          </TreeNode>
          <TreeNode key="0-3" />
        </Tree>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
