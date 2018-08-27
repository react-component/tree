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
          defaultExpandAll={false}
          defaultExpandedKeys={['p1', 'p11', 'p21', 'l1']}
          motion={motion}

          height={hasHeight ? 300 : null}
        >
          <TreeNode title="parent 1" key="p1">
            <TreeNode key="1-0" title="1-0">
              <TreeNode key="1-0-0" title="1-0-0"/>
              <TreeNode key="1-0-1" title="1-0-1"/>
            </TreeNode>
            <TreeNode key="p10" title="leaf"/>
            <TreeNode title="parent 1-1" key="p11">
              <TreeNode title="parent 2-1" key="p21">
                <TreeNode title="leaf"/>
                <TreeNode title="leaf">
                  <TreeNode title="sub leaf 1" />
                  <TreeNode title="sub leaf 2" />
                  <TreeNode title="sub leaf 3" />
                  <TreeNode title="sub leaf 4" />
                  <TreeNode title="sub leaf 5" />
                  <TreeNode title="sub leaf 6" />
                  <TreeNode title="sub leaf 7" />
                </TreeNode>
                <TreeNode title="leaf"/>
                <TreeNode title="leaf"/>
                <TreeNode title="leaf" key="l1">
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                  <TreeNode title="sub leaf"/>
                </TreeNode>
              </TreeNode>
              <TreeNode key="p22" title="leaf">
                <TreeNode title="sub leaf"/>
                <TreeNode title="sub leaf"/>
              </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
