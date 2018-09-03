/* eslint no-console:0, react/no-danger: 0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';

const STYLE = `
.transition-appear,
.transition-leave {
  overflow: hidden;
  transition: height 100000000000000s ease-out;
  transition: height 0.3s ease-out;
}
`;

const oriHeight = (ele) => ({ height: ele.scrollHeight });
const collapseHeight = () => ({ height: 0 });

const motion = {
  motionName: 'transition',
  onAppearStart: collapseHeight,
  onAppearActive: oriHeight,
  onLeaveStart: oriHeight,
  onLeaveActive: collapseHeight,
};

class Demo extends React.Component {
  state = {
    hasHeight: true,
  };

  onChange = () => {
    this.setState({
      hasHeight: !this.state.hasHeight,
    });
  };

  render() {
    const { hasHeight } = this.state;

    return (
      <div>
        <h2>expanded</h2>
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />

        <div>
          <label>
            <input type="checkbox" checked={hasHeight} onChange={this.onChange} />
            {' '}
            Use virtual list (By set `height` prop)
          </label>
        </div>

        <Tree
          // defaultExpandAll={false}
          defaultExpandedKeys={['key_0', 'key_1', 'key_5', 'key_18']}
          // defaultExpandAll
          motion={motion}

          height={hasHeight ? 300 : null}
        >
          <TreeNode key="key_0" title="treeNode 0">
            <TreeNode key="key_1" title="treeNode 1">
              <TreeNode key="1-0-0" title="treeNode 2"/>
              <TreeNode key="1-0-1" title="treeNode 3"/>
            </TreeNode>
            <TreeNode key="p10" title="treeNode 4"/>
            <TreeNode key="key_5" title="treeNode 5">
              <TreeNode key="key_6" title="treeNode 6">
                <TreeNode title="treeNode 7"/>
                <TreeNode key="key_8" title="treeNode 8">
                  <TreeNode title="treeNode 9" />
                  <TreeNode title="treeNode 10" />
                  <TreeNode title="treeNode 11" />
                  <TreeNode title="treeNode 12" />
                  <TreeNode title="treeNode 13" />
                  <TreeNode title="treeNode 14" />
                  <TreeNode title="treeNode 15" />
                </TreeNode>
                <TreeNode title="treeNode 16"/>
                <TreeNode title="treeNode 17"/>
                <TreeNode key="key_18" title="treeNode 18">
                  <TreeNode title="treeNode 19"/>
                  <TreeNode title="treeNode 20"/>
                  <TreeNode title="treeNode 21"/>
                  <TreeNode title="treeNode 22"/>
                  <TreeNode title="treeNode 23"/>
                  <TreeNode title="treeNode 24"/>
                  <TreeNode title="treeNode 25"/>
                  <TreeNode title="treeNode 26"/>
                  <TreeNode title="treeNode 27"/>
                  <TreeNode title="treeNode 28"/>
                  <TreeNode title="treeNode 29"/>
                  <TreeNode title="treeNode 30"/>
                  <TreeNode title="treeNode 31"/>
                  <TreeNode title="treeNode 32"/>
                  <TreeNode title="treeNode 33"/>
                  <TreeNode title="treeNode 34"/>
                  <TreeNode title="treeNode 35"/>
                </TreeNode>
              </TreeNode>
              <TreeNode key="key_36" title="treeNode 36">
                <TreeNode title="treeNode 37"/>
                <TreeNode title="treeNode 38"/>
              </TreeNode>
              <TreeNode key="key_39" title="treeNode 39">
                <TreeNode title="treeNode 40"/>
                <TreeNode title="treeNode 41"/>
              </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
