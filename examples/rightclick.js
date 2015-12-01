import 'rc-tree/assets/index.less';
import 'rc-tree/assets/contextmenu.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import assign from 'object-assign';
import Tooltip from 'rc-tooltip';

const TreeDemo = React.createClass({
  propTypes: {},
  getDefaultProps() {
    return {
    };
  },
  getInitialState() {
    return {
    };
  },
  componentDidMount() {
    // this.renderToolTip();
    this.getTipContainer();
  },
  componentWillUnmount() {
    if (this.tipContainer) {
      ReactDOM.unmountComponentAtNode(this.tipContainer);
      document.body.removeChild(this.tipContainer);
      this.tipContainer = null;
    }
    // remove event listener if it has
    // ...
  },
  getTipContainer() {
    if (!this.tipContainer) {
      this.tipContainer = document.createElement('div');
      document.body.appendChild(this.tipContainer);
    }
    return this.tipContainer;
  },
  handleSelect(info) {
    console.log('selected', info);
  },
  handleContextMenu(info) {
    console.log('handleContextMenu', info);
    // var trigger = this.refs.triggerELe.getDOMNode();
    const trigger = this.tipContainer;
    const style = {
      position: 'absolute',
      left: info.event.pageX + 'px',
      top: info.event.pageY + 'px',
    };
    assign(trigger.style, style);
    if (this.toolTip) {
      ReactDOM.unmountComponentAtNode(trigger);
      this.toolTip = null;
    }
    this.renderToolTip(info.node.props.eventKey);
  },
  renderToolTip(key) {
    const overlay = (<div>
      <h4>{key}</h4>
      <p><a herf="">link</a></p>
    </div>);
    this.toolTip = (<Tooltip placement="bottomRight" trigger="click" prefixCls="rc-tree-contextmenu"
             defaultVisible overlay={overlay}>
        <span></span>
    </Tooltip>);
    ReactDOM.render(this.toolTip, this.getTipContainer());
  },
  render() {
    return (
      <div>
        <h2>right click contextmenu</h2>
        <Tree onRightClick={this.handleContextMenu} onSelect={this.handleSelect}
          defaultSelectedKeys={['0-1', '0-1-1']}
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
ReactDOM.render(<TreeDemo />, document.getElementById('__react-content'));
