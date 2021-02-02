/* eslint no-console:0 */
/* eslint no-alert:0 */
import React from 'react';
import classNames from 'classnames';
import Tree, { TreeNode } from 'rc-tree';
import '../../assets/index.less';
import './icon.less';

const Icon = ({ selected }) => (
  <span className={classNames('customize-icon', selected && 'selected-icon')} />
);

const Demo = () => (
  <div>
    <h2>Customize icon with element</h2>
    <Tree defaultExpandAll>
      <TreeNode icon={<span className="customize-icon" />} title="Parent">
        <TreeNode icon={<span className="customize-icon sub-icon" />} title="Child" />
      </TreeNode>
    </Tree>

    <h2>Customize icon with component</h2>
    <Tree defaultExpandAll>
      <TreeNode icon={Icon} title="Parent">
        <TreeNode icon={Icon} title="Child" />
      </TreeNode>
    </Tree>

    <h2>Customize icon with Tree prop</h2>
    <Tree defaultExpandAll icon={Icon}>
      <TreeNode title="Parent">
        <TreeNode title="Child" />
      </TreeNode>
    </Tree>
  </div>
);

export default Demo;
