import 'rc-tree/assets/index.less';
import 'rc-tree/assets/demo-contextmenu.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import assign from 'object-assign';
import Tooltip from 'rc-tooltip';

const Demo = React.createClass({
  propTypes: {},
  componentDidMount() {
    this.getTipContainer();
  },
  componentWillUnmount() {
    if (this.tipContainer) {
      ReactDOM.unmountComponentAtNode(this.tipContainer);
      document.body.removeChild(this.tipContainer);
      this.tipContainer = null;
    }
  },
  onSelect(info) {
    console.log('selected', info);
  },
  onRightClick(info) {
    console.log('right click', info);
    this.setPosition(info);
    this.renderToolTip(info.node.props.title);
  },
  onMouseEnter(info) {
    console.log('enter', info);
    this.setPosition(info);
    this.renderToolTip(info.node.props.title);
  },
  onMouseLeave(info) {
    console.log('leave', info);
  },
  setPosition(info) {
    assign(this.tipContainer.style, {
      position: 'absolute',
      left: info.event.pageX + 'px',
      top: info.event.pageY + 'px',
    });
  },
  getTipContainer() {
    if (!this.tipContainer) {
      this.tipContainer = document.createElement('div');
      document.body.appendChild(this.tipContainer);
    }
    return this.tipContainer;
  },
  renderToolTip(txt) {
    if (this.toolTip) {
      ReactDOM.unmountComponentAtNode(this.tipContainer);
      this.toolTip = null;
    }
    this.toolTip = (<Tooltip trigger="click" placement="bottomRight" prefixCls="rc-tree-contextmenu"
             defaultVisible overlay={<h4>{txt}</h4>}>
        <span></span>
    </Tooltip>);
    ReactDOM.render(this.toolTip, this.getTipContainer());
  },
  render() {
    return (
      <div>
        <h2>right click contextmenu</h2>
        <Tree onRightClick={this.onRightClick} onSelect={this.onSelect}
          defaultSelectedKeys={['0-1', '0-1-1']}
          multiple defaultExpandAll showLine>
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf0" />
              <TreeNode title="leaf1" />
              <TreeNode title="leaf2" />
            </TreeNode>
            <TreeNode title="parent 1-1">
              <TreeNode title="leaf" />
            </TreeNode>
          </TreeNode>
        </Tree>
        <h2>hover popup contextmenu</h2>
        <Tree onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onSelect={this.onSelect}
           multiple defaultExpandAll showLine>
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf" />
              <TreeNode title="leaf" />
            </TreeNode>
            <TreeNode title="parent 1-1">
              <TreeNode title="leaf" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  },
});
ReactDOM.render(<Demo />, document.getElementById('__react-content'));
