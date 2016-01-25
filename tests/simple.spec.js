const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Tree = require('../');
const TreeNode = Tree.TreeNode;
const $ = require('jquery');

describe('simple tree', () => {
  let instance;
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <Tree className="forTest">
        <TreeNode title="1"/>
      </Tree>, div
    );
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should have checkbox, default expand all treeNode, not show icon, show line', (done) => {
    instance = ReactDOM.render(
      <Tree selectable checkable defaultExpandAll showIcon={false} showLine multiple>
        <TreeNode title="parent 1" key="0-0" className="spe">
          <TreeNode title="leaf 1" key="0-0-0" disabled>
            <TreeNode title="leaf" key="random"/>
            <TreeNode title="leaf"/>
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" disableCheckbox />
        </TreeNode>
      </Tree>, div);

    setTimeout(()=> {
      const dom = $(ReactDOM.findDOMNode(instance));
      // have checkbox
      expect(dom.find('.rc-tree-checkbox').length).to.be(5);
      // expand all treeNode
      dom.find('.rc-tree-switcher').each((index, item) => {
        // console.log(item);
        if (item.className.indexOf('-noop') === -1) {
          expect(item.className.indexOf('_open') !== -1).to.be(true);
        }
      });
      // not show icon
      expect(dom.find('.rc-tree-iconEle').length).to.be(0);
      // show line
      expect(dom.find('.rc-tree-line').length).to.be(1);

      done();
    }, 50);
  });

  it('should set default expandedKeys, selectedKeys and checkedKeys', function() {
    instance = ReactDOM.render(
      <Tree checkable defaultExpandedKeys={['0-0']} defaultSelectedKeys={['0-0']} defaultCheckedKeys={['0-0']}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div);
    const li = $(instance.refs['treeNode-0-0'].refs.li);
    expect(li.find('.rc-tree-switcher')[0].className).to.contain('open');
    expect(li.find('.rc-tree-checkbox-checked').length).to.be(5);
    expect(li.find('.rc-tree-node-selected').length).to.be(1);
  });

  it('should set expandedKeys, selectedKeys, checkedKeys and controlled', function() {
    instance = ReactDOM.render(
      <Tree checkable expandedKeys={['0-0']} selectedKeys={['0-0']} checkedKeys={['0-0']}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div);
    const li = $(instance.refs['treeNode-0-0'].refs.li);
    expect(li.find('.rc-tree-switcher')[0].className).to.contain('open');
    expect(li.find('.rc-tree-checkbox-checked').length).to.be(5);
    expect(li.find('.rc-tree-node-selected').length).to.be(1);
  });

  it('should expand specific treeNode', function(done) {
    function cb() {
      setTimeout(() => {
        expect($(instance.refs['treeNode-0-0'].refs.li).find('.rc-tree-switcher')[0].className).to.contain('open');
        done();
      });
    }
    instance = ReactDOM.render(
      <Tree onExpand={cb}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div);
    Simulate.click($(instance.refs['treeNode-0-0'].refs.li).find('.rc-tree-switcher')[0]);
  });

  it('should select one item or more', (done) => {
    let count = 0;
    function handleSelect(_, arg) {
      count++;
      expect(arg.selected).to.be(true);
      if (count === 2) {
        done();
      }
    }
    instance = ReactDOM.render(
      <Tree selectable multiple onSelect={handleSelect}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0"/>
          <TreeNode title="leaf 2" key="0-0-1"/>
        </TreeNode>
      </Tree>, div);
    Simulate.click(instance.refs['treeNode-0-0'].refs['treeNode-0-0-0'].refs.selectHandle);
    Simulate.click(instance.refs['treeNode-0-0'].refs['treeNode-0-0-1'].refs.selectHandle);
  });

  it('should fire check event', function(done) {
    function cb(checkedKeys) {
      expect(checkedKeys.indexOf('0-0-0-1') > -1).to.be(true);
      done();
    }
    instance = ReactDOM.render(
      <Tree checkable onCheck={cb}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div
    );
    const ele = ReactDOM.findDOMNode(instance.refs['treeNode-0-0'].refs['treeNode-0-0-0'].refs.checkbox);
    Simulate.click(ele);
  });

  it('should fire rightClick callback', function(done) {
    function cb(info) {
      expect(info.node.props.title).to.be('parent 1');
      done();
    }
    instance = ReactDOM.render(
      <Tree onRightClick={cb}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div
    );
    Simulate.contextMenu(instance.refs['treeNode-0-0'].refs.selectHandle);
  });

  it('should filter treeNode', function() {
    function filterTreeNode(treeNode) {
      return treeNode.props.title.indexOf('parent') > -1;
    }
    instance = ReactDOM.render(
      <Tree filterTreeNode={filterTreeNode}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="leaf 1" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="leaf 2" key="0-0-1" />
        </TreeNode>
      </Tree>, div
    );
    expect($(instance.refs.tree).find('.filter-node').length).to.be(1);
  });

  it('should dynamic load treeNodes', (done) => {
    function loadData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
          done();
        }, 500);
      });
    }
    instance = ReactDOM.render(
      <Tree loadData={loadData}>
        <TreeNode title="parent 1" key="0-0" />
      </Tree>, div
    );
    instance.refs['treeNode-0-0'].onExpand();
  });
});
