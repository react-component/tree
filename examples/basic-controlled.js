import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import { gData, getCheckedKeys, getFilterExpandedKeys } from './util';

const Demo = React.createClass({
  propTypes: {
    multiple: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      multiple: false,
    };
  },
  getInitialState() {
    return {
      expandedKeys: getFilterExpandedKeys(gData, ['0-0-0']),
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
    };
  },
  onExpand(treeNode, expand, expandedKeys) {
    console.log('onExpand', expand, expandedKeys);
    const index = expandedKeys.indexOf(treeNode.props.eventKey);
    if (expand) {
      if (index > -1) {
        expandedKeys.splice(index, 1);
      }
    } else {
      if (index === -1) {
        expandedKeys.push(treeNode.props.eventKey);
      }
    }
    this.setState({
      expandedKeys: expandedKeys,
    });
  },
  onCheck(info) {
    console.log('check: ', info);
    this.setState({
      checkedKeys: getCheckedKeys(info.node, info.checkedKeys, info.allCheckedNodesKeys),
      selectedKeys: ['0-3', '0-4'],
    });
  },
  onSelect(info) {
    console.log('selected: ', info);
    let selectedKeys = [...this.state.selectedKeys];
    const index = selectedKeys.indexOf(info.node.props.eventKey);
    if (index > -1) {
      selectedKeys.splice(index, 1);
    } else if (this.props.multiple) {
      selectedKeys.push(info.node.props.eventKey);
    } else {
      selectedKeys = [info.node.props.eventKey];
    }
    this.setState({
      selectedKeys: selectedKeys,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key} disableCheckbox={item.key === '0-0-0' ? true : false}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    return (<div>
      <h2>controlled</h2>
      <Tree checkable multiple={this.props.multiple}
          onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
          onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}>
        {loop(gData)}
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
