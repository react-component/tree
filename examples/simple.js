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
  onExpand(treeNode, expanded, expandedKeys) {
    console.log(treeNode, expanded, expandedKeys);
    const keys = this.props.keys;
    this.setState({
      defaultExpandedKeys: ['0-1', keys[this.state.switchIt ? 0 : 1]],
      switchIt: !this.state.switchIt,
    });
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
      <p style={{color: 'red'}}>
        tips: 把 defaultXX 前的 default 去掉，可变为受控组件 <br />
        (defaultExpandAll 除外)
      </p>
      <Tree className="myCls" multiple checkable defaultExpandAll
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="parent 1-0" key="0-1-1">
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="random2">
            <TreeNode title={<span style={{color: 'red'}}>sss</span>} />
          </TreeNode>
        </TreeNode>
      </Tree>

      <br />
      <div><button onClick={this.change}>change state</button></div>
      <br />

      <Tree className="myCls" multiple checkable key={1}
          expandedKeys={this.state.defaultExpandedKeys}
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          checkedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="parent 1-0" key="0-1-1">
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="random2">
            <TreeNode title={<span style={{color: 'red'}}>sss</span>} />
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
