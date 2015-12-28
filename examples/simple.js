import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

const Demo = React.createClass({
  propTypes: {
    defaultSelectedKeys: PropTypes.array,
  },
  getDefaultProps() {
    return {
      defaultSelectedKeys: ['0-1', 'random'],
    };
  },
  getInitialState() {
    return {
      defaultSelectedKeys: this.props.defaultSelectedKeys,
      defaultCheckedKeys: this.props.defaultSelectedKeys,
      switchIt: true,
    };
  },
  onSelect(info) {
    console.log('selected', info);
  },
  onCheck(info) {
    console.log('onCheck', info);
  },
  change() {
    this.setState({
      defaultSelectedKeys: [this.props.defaultSelectedKeys[this.state.switchIt ? 0 : 1]],
      defaultCheckedKeys: [this.props.defaultSelectedKeys[this.state.switchIt ? 1 : 0]],
      switchIt: !this.state.switchIt,
    });
  },
  render() {
    return (<div>
      <h2>simple</h2>
      <Tree className="myCls" multiple checkable defaultExpandAll showLine
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="parent 1-0" key="0-1-1">
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="parent 1-1">
            <TreeNode title={<span style={{color: 'red'}}>sss</span>} />
          </TreeNode>
        </TreeNode>
      </Tree>

      <div><button onClick={this.change}>change state</button></div>

      <Tree className="myCls" multiple checkable defaultExpandAll key={Date.now()}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="parent 1-0" key="0-1-1">
            <TreeNode title="leaf" key="random" />
            <TreeNode title="leaf" />
          </TreeNode>
          <TreeNode title="parent 1-1">
            <TreeNode title={<span style={{color: 'red'}}>sss</span>} />
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
