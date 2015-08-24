'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';
import velocity from 'velocity-animate';

function handleCheck(info) {
  console.log('check: ', info);
}

const animation = {
  enter(node, done){
    var ok = false;

    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }
    node.style.display='none';
    velocity(node, 'slideDown', {
      duration: 300,
      complete: complete
    });
    return {
      stop: function () {
        velocity(node, 'finish');
        // velocity complete is async
        complete();
      }
    };
  },

  leave(node, done){
    var ok = false;

    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    velocity(node, 'slideUp', {
      duration: 300,
      complete: complete
    });
    return {
      stop: function () {
        velocity(node, 'finish');
        // velocity complete is async
        complete();
      }
    };
  },
};

var checkedTree = (
  <Tree defaultExpandAll={true} checkable={true}
      onCheck={handleCheck} defaultCheckedKeys={['p1', 'p22']}>
    <TreeNode title="parent 1" key="p1" >
      <TreeNode key="p10" title="leaf" />
      <TreeNode title="parent 1-1" key="p11">
        <TreeNode title="parent 2-1" key="p21">
          <TreeNode>test</TreeNode>
          <TreeNode title={<span>sss</span>} />
        </TreeNode>
        <TreeNode key="p22" title="leaf" />
      </TreeNode>
    </TreeNode>
    <TreeNode key="p12" title="leaf" />
  </Tree>
);

var demo = (
  <div>
    <h2>checked</h2>
    {React.cloneElement(checkedTree, {
      openAnimation: animation,
      // openAnimation: 'slide-up',
    })}
  </div>
)

React.render(demo, document.getElementById('__react-content'));
