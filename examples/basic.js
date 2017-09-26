/* eslint no-console:0 */
/* eslint no-alert:0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.less';
import './basic.less';

const Demo = React.createClass({
  propTypes: {
    keys: PropTypes.array,
  },
  getDefaultProps() {
    return {
      keys: ['0-0-0-0'],
    };
  },
  getInitialState() {
    const keys = this.props.keys;
    return {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true,
    };
  },
  onExpand(expandedKeys) {
    console.log('onExpand', expandedKeys, arguments);
  },
  onSelect(selectedKeys, info) {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  },
  onCheck(checkedKeys, info) {
    console.log('onCheck', checkedKeys, info);
  },
  onEdit() {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  },
  onDel(e) {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  },
  render() {
    const customLabel = (<span className="cus-label">
      <span>operations: </span>
      <span style={{ color: 'blue' }} onClick={this.onEdit}>Edit</span>&nbsp;
      <label onClick={(e) => e.stopPropagation()}><input type="checkbox" /> checked</label> &nbsp;
      <span style={{ color: 'red' }} onClick={this.onDel}>Delete</span>
    </span>);
    return (<div style={{ margin: '0 20px' }}>
      <h2>simple</h2>
      <Tree
        className="myCls" showLine checkable defaultExpandAll
        defaultExpandedKeys={this.state.defaultExpandedKeys}
        onExpand={this.onExpand}
        defaultSelectedKeys={this.state.defaultSelectedKeys}
        defaultCheckedKeys={this.state.defaultCheckedKeys}
        onSelect={this.onSelect} onCheck={this.onCheck}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title={customLabel} key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title="parent 1-1-0" key="0-0-1-0" disableCheckbox />
            <TreeNode title="parent 1-1-1" key="0-0-1-1" />
          </TreeNode>
        </TreeNode>
      </Tree>

      <h2>Check on Click TreeNode</h2>
      <Tree
        className="myCls"
        showLine
        checkable
        selectable={ false }
        defaultExpandAll
        onExpand={this.onExpand}
        defaultSelectedKeys={this.state.defaultSelectedKeys}
        defaultCheckedKeys={this.state.defaultCheckedKeys}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title="parent 1-1-0" key="0-0-1-0" disableCheckbox />
            <TreeNode title="parent 1-1-1" key="0-0-1-1" />
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
