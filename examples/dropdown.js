/* eslint react/no-multi-comp:0 */
/* eslint no-console:0 */
/* eslint react/no-string-refs:0 */

import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import Trigger from 'rc-trigger';
import { gData } from './util';
import './dropdown.less';

const placements = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
    offset: [0, -3],
    targetOffset: [0, 0],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
    offset: [0, 3],
    targetOffset: [0, 0],
  },
};
class DropdownTree extends React.Component {
  static propTypes = {
    onVisibleChange: PropTypes.func,
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    trigger: PropTypes.array,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
  };
  static defaultProps = {
    prefixCls: 'demo-dropdown-tree',
    trigger: ['hover'],
    overlayClassName: '',
    overlayStyle: {},
    defaultVisible: false,
    onVisibleChange() {
    },
    placement: 'bottomLeft',
  };
  constructor(props) {
    super(props);
    if ('visible' in props) {
      this.state = {
        visible: props.visible,
      };
      return;
    }
    this.state = {
      visible: props.defaultVisible,
    };
  }
  componentWillReceiveProps(props) {
    if ('visible' in props) {
      this.setState({
        visible: props.visible,
      });
    }
  }
  onChange = (value) => {
    console.log('change', value);
  }
  onSelect = (value) => {
    console.log('select ', value);
  }
  onClick = (e) => {
    const props = this.props;
    const overlayProps = props.overlay.props;
    if (!('visible' in props)) {
      this.setState({
        visible: false,
      });
    }
    if (overlayProps.onClick) {
      overlayProps.onClick(e);
    }
  }
  onVisibleChange = (v) => {
    const props = this.props;
    if (!('visible' in props)) {
      this.setState({
        visible: v,
      });
    }
    props.onVisibleChange(v);
  }
  getPopupElement = () => {
    const props = this.props;
    return React.cloneElement(props.overlay, {
      // prefixCls: `${props.prefixCls}-menu`,
      onClick: this.onClick,
    });
  }
  render() {
    const { prefixCls, children,
      transitionName, animation,
      align, placement,
      overlayClassName, overlayStyle,
      trigger } = this.props;
    return (
      <Trigger
        prefixCls={prefixCls}
        ref="trigger"
        popupClassName={overlayClassName}
        popupStyle={overlayStyle}
        builtinPlacements={placements}
        action={trigger}
        popupPlacement={placement}
        popupAlign={align}
        popupTransitionName={transitionName}
        popupAnimation={animation}
        popupVisible={this.state.visible}
        popup={this.getPopupElement()}
        onPopupVisibleChange={this.onVisibleChange}
      >{children}</Trigger>
    );
  }
}

class Demo extends React.Component {
  state = {
    visible: false,
    inputValue: '',
    sel: '',
    expandedKeys: [],
    autoExpandParent: true,
  };
  onChange = (event) => {
    this.filterKeys = [];
    this.setState({
      inputValue: event.target.value,
    });
  }
  onVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected: ', info);
    this.setState({
      visible: false,
      sel: info.node.props.title,
    });
  }
  onExpand = (expandedKeys) => {
    this.filterKeys = undefined;
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded chilren keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  filterTreeNode = (treeNode) => {
    console.log(treeNode);
    // 根据 key 进行搜索，可以根据其他数据，如 value
    return this.filterFn(treeNode.props.eventKey);
  }
  filterFn = (key) => {
    if (this.state.inputValue && key.indexOf(this.state.inputValue) > -1) {
      return true;
    }
    return false;
  }
  render() {
    const loop = data => {
      return data.map((item) => {
        if (this.filterKeys && this.filterFn(item.key)) {
          this.filterKeys.push(item.key);
        }
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    let expandedKeys = this.state.expandedKeys;
    let autoExpandParent = this.state.autoExpandParent;
    if (this.filterKeys) {
      expandedKeys = this.filterKeys;
      autoExpandParent = true;
    }

    const overlay = (<div>
      <input placeholder="请筛选" value={this.state.inputValue} onChange={this.onChange} />
      <Tree
        onExpand={this.onExpand} expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={this.onSelect} filterTreeNode={this.filterTreeNode}
      >
        {loop(gData)}
      </Tree>
    </div>);

    return (<div style={{ padding: '10px 30px' }}>
      <h3>tree in dropdown</h3>
      <DropdownTree
        trigger={['click']}
        onVisibleChange={this.onVisibleChange}
        visible={this.state.visible}
        closeOnSelect={false}
        overlay={overlay} animation="slide-up"
      >
        <div className="demo-dropdown-trigger">{this.state.sel}</div>
      </DropdownTree>
    </div>);
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
