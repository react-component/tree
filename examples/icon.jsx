/* eslint no-console:0 */
/* eslint no-alert:0 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tree, { TreeNode } from '../src';
import '../assets/index.less';
import './icon.less';

const Icon = ({ selected }) => (
  <span className={classNames('customize-icon', selected && 'selected-icon')} />
);
Icon.propTypes = {
  selected: PropTypes.bool,
};

const Demo = () => (
  <div>
    <h2>Customize icon with element</h2>
    <Tree defaultExpandAll>
      <TreeNode icon={<span className="customize-icon" />} title="Parent" key="0">
        <TreeNode icon={<span className="customize-icon sub-icon" />} title="Child" key="00" />
      </TreeNode>
    </Tree>

    <h2>Customize icon with component</h2>
    <Tree defaultExpandAll>
      <TreeNode icon={Icon} title="Parent" key="0">
        <TreeNode icon={Icon} title="Child" key="00" />
      </TreeNode>
    </Tree>

    <h2>Customize icon with Tree prop</h2>
    <Tree defaultExpandAll icon={Icon}>
      <TreeNode title="Parent" key="0">
        <TreeNode title="Child" key="00" />
      </TreeNode>
    </Tree>
  </div>
);

export default Demo;
