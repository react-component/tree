import 'rc-tree/assets/index.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import { gData, /* filterParentPosition,*/ getFilterExpandedKeys, getRadioSelectKeys } from './util';

const Demo = React.createClass({
  propTypes: {
    multiple: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      multiple: true,
    };
  },
  getInitialState() {
    return {
      expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
      checkedKeys: ['0-0-0-key'],
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
  onCheck(checkedKeys) {
    this.setState({
      checkedKeys,
    });
  },
  onCheckStrictly(checkedKeys, /* extra*/) {
    console.log(arguments);
    // const { checkedNodesPositions } = extra;
    // const pps = filterParentPosition(checkedNodesPositions.map(i => i.pos));
    // console.log(checkedNodesPositions.filter(i => pps.indexOf(i.pos) > -1).map(i => i.node.key));
    this.setState({
      checkedKeys,
      halfCheckedKeys: ['0-0-key'],
    });
  },
  onSelect(selectedKeys, info) {
    console.log('onSelect', selectedKeys, info);
    this.setState({
      selectedKeys,
    });
  },
  onRbSelect(selectedKeys, info) {
    let _selectedKeys = selectedKeys;
    if (info.selected) {
      _selectedKeys = getRadioSelectKeys(gData, selectedKeys, info.node.props.eventKey);
    }
    this.setState({
      selectedKeys: _selectedKeys,
    });
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return (<TreeNode key={item.key} title={item.title}
                            disableCheckbox={item.key === '0-0-0-key' ? true : false}>
            {loop(item.children)}
          </TreeNode>);
        }
        return <TreeNode key={item.key} title={item.title}/>;
      });
    };
    // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
    return (<div style={{padding: '0 20px'}}>
      <h2>controlled</h2>
      <Tree checkable multiple={this.props.multiple} defaultExpandAll
            onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
            onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}>
        {loop(gData)}
      </Tree>
      <h2>checkStrictly</h2>
      <Tree checkable multiple={this.props.multiple} defaultExpandAll
            onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
            onCheck={this.onCheckStrictly}
            checkedKeys={this.state.checkedKeys} halfCheckedKeys={this.state.halfCheckedKeys}
            checkStrictly>
        {loop(gData)}
      </Tree>
      <h2>radio's behavior select (in the same level)</h2>
      <Tree multiple defaultExpandAll
            onSelect={this.onRbSelect}
            selectedKeys={getRadioSelectKeys(gData, this.state.selectedKeys)}>
        {loop(gData)}
      </Tree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
