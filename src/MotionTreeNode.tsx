import * as React from 'react';
// @ts-ignore
import CSSMotion from 'rc-animate/lib/CSSMotion';
import TreeNode, { TreeNodeProps } from './TreeNode';
import { FlattenNode } from './interface';
import { getTreeNodeProps, TreeNodeRequiredProps } from './utils/treeUtil';

interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  motion?: any;
  motionNodes?: FlattenNode[];
  onMotionEnd: () => void;
  motionType?: 'show' | 'hide';

  treeNodeRequiredProps: TreeNodeRequiredProps;
}

const MotionTreeNode: React.FC<MotionTreeNodeProps> = (
  {
    className,
    style,
    motion,
    motionNodes,
    motionType,
    onMotionEnd,
    treeNodeRequiredProps,
    ...props
  },
  ref,
) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (motionNodes && motionType === 'hide' && visible) {
      setVisible(false);
    }
  }, [motionNodes]);

  if (motionNodes) {
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
            {motionNodes.map((treeNode: FlattenNode) => {
              const {
                data: { key, ...restProps },
              } = treeNode;
              delete restProps.children;

              const treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps);

              return <TreeNode {...restProps} {...treeNodeProps} data={treeNode.data} key={key} />;
            })}
          </div>
        )}
      </CSSMotion>
    );
  }
  return <TreeNode domRef={ref} className={className} style={style} {...props} />;
};

MotionTreeNode.displayName = 'MotionTreeNode';

const RefMotionTreeNode = React.forwardRef(MotionTreeNode);

export default RefMotionTreeNode;
