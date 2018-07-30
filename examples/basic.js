/* eslint no-console:0 */
/* eslint no-alert:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.less';
import './basic.less';

const treeData = [
  {
    key: '0-0', title: 'parent 1', children:
      [
        {
          key: '0-0-0', title: 'parent 1-1', children:
            [
              { key: '0-0-0-0', title: 'parent 1-1-0' },
            ],
        },
        {
          key: '0-0-1', title: 'parent 1-2', children:
            [
              { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
              { key: '0-0-1-1', title: 'parent 1-2-1' },
            ],
        },
      ],
  },
];

const arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

const getSvgIcon = (path, iStyle = {}, style = {}) => {
  return (
    <i style={iStyle}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{ verticalAlign: '-.125em', ...style }}
      >
        <path d={path} />
      </svg>
    </i>
  );
}

class Demo extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  static defaultProps = {
    keys: ['0-0-0-0'],
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
    };
  }

  state = {
    useIcon: false,
  };
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys, arguments);
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };
  onDel = (e) => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };
  toggleSwitcherIcon = () => {
    this.setState({
      useIcon: !this.state.useIcon,
    });
  };
  render() {
    const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: 'blue' }} onClick={this.onEdit}>Edit</span>&nbsp;
        <label onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>
        &nbsp;
        <span style={{ color: '#EB0000' }} onClick={this.onDel}>Delete</span>
      </span>
    );

    const switcherIcon = ({ expanded }) => {
      return this.state.useIcon &&
        getSvgIcon(arrowPath, { cursor: 'pointer' }, { transform: `rotate(${expanded ? 90 : 0}deg)` }) || null;
    };
    const switcherLeafIcon = this.state.useIcon &&
      getSvgIcon(arrowPath, { cursor: 'pointer' }, { transform: 'rotate(270deg)' }) ||
      undefined;
    const treeCls = `myCls${this.state.useIcon && ' customIcon' || ''}`;

    return (
      <div id="demo" style={{ margin: '0 20px' }}>
        <div>
          <button onClick={this.toggleSwitcherIcon}>Toggle Custom Switcher Icon</button>
          <span style={{ marginLeft: '1rem' }}>
            Is using custom switcher icon: {this.state.useIcon && 'true' || 'false'}.
          </span>
        </div>
        <h2>simple</h2>
        <Tree
          className={treeCls} showLine checkable defaultExpandAll
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect} onCheck={this.onCheck}
          switcherIcon={switcherIcon}
          switcherLeafIcon={switcherLeafIcon}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title={customLabel} key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" style={{ background: 'rgba(255, 0, 0, 0.1)' }} />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="parent 1-1-0" key="0-0-1-0" disableCheckbox />
              <TreeNode title="parent 1-1-1" key="0-0-1-1" />
            </TreeNode>
            <TreeNode title="parent 1-2" key="0-0-2" disabled>
              <TreeNode title="parent 1-2-0" key="0-0-2-0" disabled />
              <TreeNode title="parent 1-2-1" key="0-0-2-1" />
            </TreeNode>
          </TreeNode>
        </Tree>

        <h2>Check on Click TreeNode</h2>
        <Tree
          className={treeCls}
          showLine
          checkable
          selectable={false}
          defaultExpandAll
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={treeData}
          switcherIcon={switcherIcon}
          switcherLeafIcon={switcherLeafIcon}
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
