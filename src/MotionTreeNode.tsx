import * as React from 'react';
// @ts-ignore
import CSSMotion from 'rc-animate/lib/CSSMotion';
import classNames from 'classnames';
import TreeNode, { TreeNodeProps } from './TreeNode';

interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  visible: boolean;
  motion?: any;
}

const MotionTreeNode: React.FC<MotionTreeNodeProps> = (
  { visible, motion, className, style, ...props },
  ref,
) => (
    <CSSMotion ref={ref} visible={visible} {...motion}>
      {({ className: motionClassName, style: motionStyle }, motionRef) => (
          <TreeNode
            domRef={motionRef}
            className={classNames(className, motionClassName)}
            style={{
              ...style,
              ...motionStyle,
            }}
            {...props}
          />
        )}
    </CSSMotion>
  );

const RefMotionTreeNode = React.forwardRef(MotionTreeNode);

export default RefMotionTreeNode;
