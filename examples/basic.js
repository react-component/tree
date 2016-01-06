import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

const Demo = React.createClass({
  propTypes: {
    keys: PropTypes.array,
  },
  getDefaultProps() {
    return {
      keys: ['0-1-1', 'random2'],
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
  onExpand(treeNode, expand, expandedKeys) {
    console.log('onExpand', expand, expandedKeys);
  },
  onSelect(info) {
    console.log('selected', info);
  },
  onCheck(info) {
    console.log('onCheck', info);
  },
  change() {
    const keys = this.props.keys;
    this.setState({
      defaultExpandedKeys: ['0-1', keys[this.state.switchIt ? 0 : 1]],
      defaultSelectedKeys: [keys[this.state.switchIt ? 0 : 1]],
      defaultCheckedKeys: [keys[this.state.switchIt ? 1 : 0]],
      switchIt: !this.state.switchIt,
    });
  },
  render() {
    return (<div style={{margin: '0 20px'}}>
      <h2>simple</h2>
      <Tree className="myCls" showLine multiple checkable
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="parent 1-0" key="0-1-1" disableCheckbox>
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="random2">
            <TreeNode title={<span style={{color: 'red'}}>sss</span>} />
          </TreeNode>
        </TreeNode>
      </Tree>

      <br />
      <div>
        <button onClick={this.change}>change state</button>
        <p>defaultXX 的初始化状态不会改变</p>
      </div>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
