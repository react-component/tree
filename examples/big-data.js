/* eslint no-console:0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree from 'rc-tree';
import Gen from './big-data-generator';

class Demo extends React.Component {
  static propTypes = {
    multiple: PropTypes.bool,
  };
  state = {
    gData: [],
    expandedKeys: [],
    checkedKeys: [],
    checkedKeys1: [],
    selectedKeys: [],
  };
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
    });
  }
  onCheckStrictly = (checkedKeys1, /* extra */) => {
    console.log(arguments);
    this.setState({
      checkedKeys1,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info);
    this.setState({
      selectedKeys,
    });
  }
  onGen = (data) => {
    this.setState({
      gData: data,
      expandedKeys: ['0-0-0-key'],
      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
      checkedKeys: ['0-0-0-key'],
      checkedKeys1: ['0-0-0-key'],
      selectedKeys: [],
    });
  }
  render() {
    const { gData, expandedKeys, checkedKeys, checkedKeys1, selectedKeys } = this.state;

    const $tree = gData.length ? (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 'auto' }}>
          <h3>normal check</h3>
          <Tree
            checkable multiple={this.props.multiple}
            defaultExpandedKeys={expandedKeys}
            onCheck={this.onCheck} checkedKeys={checkedKeys}
            onSelect={this.onSelect} selectedKeys={selectedKeys}
            treeData={gData}
          />
        </div>
        <div style={{ flex: 'auto' }}>
          <h3>checkStrictly</h3>
          <Tree
            checkable checkStrictly multiple={this.props.multiple}
            defaultExpandedKeys={expandedKeys}
            onCheck={this.onCheckStrictly} checkedKeys={checkedKeys1}
            onSelect={this.onSelect} selectedKeys={selectedKeys}
            treeData={gData}
          />
        </div>
      </div>
    ) : null;

    return (
      <div style={{ padding: '0 20px' }}>
        <Gen onGen={this.onGen} />

        {$tree}
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
