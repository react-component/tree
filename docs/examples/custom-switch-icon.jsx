/* eslint no-console:0 */
/* eslint no-alert:0 */
import React from 'react';
import '../../assets/index.less';
import Tree, { TreeNode } from 'rc-tree';

const arrowPath =
  'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

const getSvgIcon = (path, iStyle = {}, style = {}) => (
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

class Demo extends React.Component {
  static defaultProps = {
    keys: ['0-0-0-0'],
  };

  constructor(props) {
    super(props);
    const { keys } = props;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
    };
  }

  render() {
    const switcherIcon = obj => {
      if (obj.data.key?.startsWith('0-0-3')) {
        return false;
      }
      if (obj.isLeaf) {
        return getSvgIcon(
          arrowPath,
          { cursor: 'pointer', backgroundColor: 'white' },
          { transform: 'rotate(270deg)' },
        );
      }
      return getSvgIcon(
        arrowPath,
        { cursor: 'pointer', backgroundColor: 'white' },
        { transform: `rotate(${obj.expanded ? 90 : 0}deg)` },
      );
    };
    const treeCls = `myCls${(this.state.useIcon && ' customIcon') || ''}`;

    return (
      <div id="demo" style={{ margin: '0 20px' }}>
        <h2>custom switch icon</h2>
        <Tree
          className={treeCls}
          showLine
          checkable
          defaultExpandAll
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          switcherIcon={switcherIcon}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
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
            <TreeNode title="parent 1-3" key="0-0-3">
              <TreeNode title="parent 1-3-0" key="0-0-3-0" />
              <TreeNode title="parent 1-3-1" key="0-0-3-1" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

export default Demo;
