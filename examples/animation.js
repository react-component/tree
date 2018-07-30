/* eslint no-console:0, react/no-danger: 0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';

const STYLE = `
.transition-appear,
.transition-leave {
  overflow: hidden;
  transition: height 0.3s ease-out;
}
`;

const animation = {
  appear(node) {
    node.style.height = 0;
    setTimeout(() => {
      node.style.height = `${node.scrollHeight}px`;
    });
    return {};
  },
  leave(node) {
    node.style.height = `${node.scrollHeight}px`;
    console.log('1 >>>', node.style.height);
    setTimeout(() => {
      node.style.height = 0;
      console.log('2 >>>', node.style.height);
    });
    return {};
  },
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
          openAnimation={animation}
          openTransitionName="transition"

          height={hasHeight ? 300 : null}
        >
          <TreeNode title="parent 1" key="p1">
            <TreeNode key="p10" title="leaf"/>
            <TreeNode title="parent 1-1" key="p11">
              <TreeNode title="parent 2-1" key="p21">
                <TreeNode title="leaf"/>
                <TreeNode title="leaf"/>
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
              <TreeNode key="p22" title="leaf"/>
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
