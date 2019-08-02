import * as React from 'react';
// @ts-ignore
import CSSMotion from 'rc-animate/lib/CSSMotion';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { FlattenDataNode } from './interface';

interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  motion?: any;
  motionNodes?: FlattenDataNode[];
  onMotionEnd: () => void;
  motionType?: 'show' | 'hide';
}

const MotionTreeNode: React.FC<MotionTreeNodeProps> = (
  { className, style, motion, motionNodes, motionType, onMotionEnd, ...props },
  ref,
) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (motionNodes && motionType === 'hide' && visible) {
      setVisible(false);
    }
  }, [motionNodes]);

  console.log('>>>', props);
  if (motionNodes) {
    console.log('!!!');
    return (
      <CSSMotion
        ref={ref}
        visible={visible}
        {...motion}
        motionAppear={motionType === 'show'}
        onAppearEnd={onMotionEnd}
        onLeaveEnd={onMotionEnd}
      >
        {({ className: motionClassName, style: motionStyle }, motionRef) => (
          <div ref={motionRef} className={motionClassName} style={motionStyle}>
            {motionNodes.map((treeNode: FlattenDataNode) => {
              const treeNodeProps = { ...treeNode };

              return <TreeNode {...treeNodeProps} eventKey={treeNode.key} pos="" />;
            })}
          </div>
        )}
      </CSSMotion>
    );
  }
  return <TreeNode domRef={ref} className={className} style={style} {...props} />;
};

const RefMotionTreeNode = React.forwardRef(MotionTreeNode);

export default RefMotionTreeNode;
