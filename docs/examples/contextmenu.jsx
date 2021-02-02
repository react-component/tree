/* eslint-disable no-console, react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import './contextmenu.less';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

function contains(root, n) {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

class Demo extends React.Component {
  state = {
    selectedKeys: ['0-1', '0-1-1'],
  };

  componentDidMount() {
    this.getContainer();
    // console.log(ReactDOM.findDOMNode(this), this.cmContainer);
    console.log(contains(ReactDOM.findDOMNode(this), this.cmContainer));
  }

  componentWillUnmount() {
    if (this.cmContainer) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      document.body.removeChild(this.cmContainer);
      this.cmContainer = null;
    }
  }

  onSelect = selectedKeys => {
    this.setState({ selectedKeys });
  };

  onRightClick = info => {
    console.log('right click', info);
    this.setState({ selectedKeys: [info.node.props.eventKey] });
    this.renderCm(info);
  };

  onMouseEnter = info => {
    console.log('enter', info);
    this.renderCm(info);
  };

  onMouseLeave = info => {
    console.log('leave', info);
  };

  getContainer() {
    if (!this.cmContainer) {
      this.cmContainer = document.createElement('div');
      document.body.appendChild(this.cmContainer);
    }
    return this.cmContainer;
  }

  renderCm(info) {
    if (this.toolTip) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      this.toolTip = null;
    }
    this.toolTip = (
      <Tooltip
        trigger="click"
        placement="bottomRight"
        prefixCls="rc-tree-contextmenu"
        defaultVisible
        overlay={<h4>{info.node.props.title}</h4>}
      >
        <span />
      </Tooltip>
    );

    const container = this.getContainer();
    Object.assign(this.cmContainer.style, {
      position: 'absolute',
      left: `${info.event.pageX}px`,
      top: `${info.event.pageY}px`,
    });

    ReactDOM.render(this.toolTip, container);
  }

  render() {
    return (
      <div>
        <h2>right click contextmenu</h2>
        <Tree
          onRightClick={this.onRightClick}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
          multiple
          defaultExpandAll
          showLine
          showIcon={false}
        >
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf0" key="l0" isLeaf />
              <TreeNode title="leaf1" key="l1" isLeaf />
              <TreeNode title="leaf2" key="l2" isLeaf />
            </TreeNode>
            <TreeNode title="parent 1-1" key="1-1">
              <TreeNode title="leaf" key="l11" isLeaf />
            </TreeNode>
          </TreeNode>
        </Tree>
        <h2>hover popup contextmenu</h2>
        <Tree
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onSelect={this.onSelect}
          multiple
          defaultExpandAll
          showLine
        >
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf" key="100" isLeaf />
              <TreeNode title="leaf" key="101" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="11">
              <TreeNode title="leaf" key="110" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

export default Demo;
