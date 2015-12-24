import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';

function handleSelect(info) {
  console.log('selected', info);
}
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
      switchIt: true,
    };
  },
  change() {
    this.setState({
      defaultSelectedKeys: [this.props.defaultSelectedKeys[this.state.switchIt ? 0 : 1]],
      switchIt: !this.state.switchIt,
    });
  },
  render() {
    return (<div>
      <h2>simple</h2>
      <Tree className="myCls" defaultSelectedKeys={this.state.defaultSelectedKeys} onSelect={handleSelect} multiple
        checkable defaultExpandAll showIcon={false} showLine>
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
      <button onClick={this.change}>change state</button>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
