'use strict';

import 'rc-tree/assets/index.less';
import React from 'react';
import Tree, {TreeNode} from 'rc-tree';
import velocity from 'velocity-animate';

function enter2(node, done) {
  var ok = false;

  function complete() {
    if (!ok) {
      ok = 1;
      done();
    }
  }

  node.style.display = 'none';
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
}

const animation = {
  enter(node, done){
    console.log('enter', node);
    return enter2.apply(this, arguments);
  },

  appear(node){
    console.log('appear', node);
    return enter2.apply(this, arguments);
  },

  leave(node, done){
    console.log('leave', node);
    var ok = false;

    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    node.style.display = 'block';
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

var demo = (
  <div>
    <h2>expanded</h2>
    <Tree defaultExpandAll={false}
          openAnimation={animation}>
      <TreeNode title="parent 1" key="p1">
        <TreeNode key="p10" title="leaf"/>
        <TreeNode title="parent 1-1" key="p11">
          <TreeNode title="parent 2-1" key="p21">
            <TreeNode title="leaf"/>
            <TreeNode title="leaf"/>
          </TreeNode>
          <TreeNode key="p22" title="leaf"/>
        </TreeNode>
      </TreeNode>
    </Tree>

  </div>
);

React.render(demo, document.getElementById('__react-content'));
