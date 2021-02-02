/* eslint-disable no-console, react/no-unescaped-entities */
import '../../assets/index.less';
import React from 'react';
import 'rc-dialog/assets/index.css';
import Modal from 'rc-dialog';
import Tree, { TreeNode } from 'rc-tree';
import { gData, getRadioSelectKeys } from './utils/dataUtil';

class Demo extends React.Component {
  static defaultProps = {
    multiple: true,
  };

  state = {
    // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
    expandedKeys: ['0-0-0-key'],
    autoExpandParent: true,
    // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
    checkedKeys: ['0-0-0-key'],
    checkStrictlyKeys: { checked: ['0-0-1-key'], halfChecked: [] },
    selectedKeys: [],
    treeData: [],
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded chilren keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({
      checkedKeys,
    });
  };

  onCheckStrictly = checkedKeys => {
    console.log(checkedKeys);
    // const { checkedNodesPositions } = extra;
    // const pps = filterParentPosition(checkedNodesPositions.map(i => i.pos));
    // console.log(checkedNodesPositions.filter(i => pps.indexOf(i.pos) > -1).map(i => i.node.key));
    const cks = {
      checked: checkedKeys.checked || checkedKeys,
      halfChecked: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
    };
    this.setState({
      // checkedKeys,
      checkStrictlyKeys: cks,
      // checkStrictlyKeys: checkedKeys,
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info);
    this.setState({
      selectedKeys,
    });
  };

  onRbSelect = (selectedKeys, info) => {
    let newSelectedKeys = selectedKeys;
    if (info.selected) {
      newSelectedKeys = getRadioSelectKeys(gData, selectedKeys, info.node.props.eventKey);
    }
    this.setState({
      selectedKeys: newSelectedKeys,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      expandedKeys: ['0-0-0-key', '0-0-1-key'],
      checkedKeys: ['0-0-0-key'],
      visible: true,
    });
    // simulate Ajax
    setTimeout(() => {
      this.setState({
        treeData: [...gData],
      });
    }, 2000);
  };

  triggerChecked = () => {
    this.setState({
      checkedKeys: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
    });
  };

  render() {
    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} disableCheckbox={item.key === '0-0-0-key'}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });
    // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
    return (
      <div style={{ padding: '0 20px' }}>
        <h2>dialog</h2>
        <button type="button" className="btn btn-primary" onClick={this.showModal}>
          show dialog
        </button>
        <Modal
          title="TestDemo"
          visible={this.state.visible}
          onOk={this.handleOk}
          onClose={this.onClose}
        >
          {this.state.treeData.length ? (
            <Tree
              checkable
              className="dialog-tree"
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
            >
              {loop(this.state.treeData)}
            </Tree>
          ) : (
            'loading...'
          )}
        </Modal>

        <h2>controlled</h2>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {loop(gData)}
        </Tree>
        <button type="button" onClick={this.triggerChecked}>
          trigger checked
        </button>

        <h2>checkStrictly</h2>
        <Tree
          checkable
          multiple={this.props.multiple}
          defaultExpandAll
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          onCheck={this.onCheckStrictly}
          checkedKeys={this.state.checkStrictlyKeys}
          checkStrictly
        >
          {loop(gData)}
        </Tree>

        <h2>radio's behavior select (in the same level)</h2>
        <Tree
          multiple
          defaultExpandAll
          onSelect={this.onRbSelect}
          selectedKeys={getRadioSelectKeys(gData, this.state.selectedKeys)}
        >
          {loop(gData)}
        </Tree>
      </div>
    );
  }
}

export default Demo;
