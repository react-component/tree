import { clsx } from 'clsx';
import CSSMotion from '@rc-component/motion';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { TreeContext } from './contextTypes';
import type { FlattenNode, TreeNodeProps } from './interface';
import TreeNode from './TreeNode';
import useUnmount from './useUnmount';
import { getTreeNodeProps, type TreeNodeRequiredProps } from './utils/treeUtil';

interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  active: boolean;
  motion?: any;
  motionNodes?: FlattenNode[];
  onMotionStart: () => void;
  onMotionEnd: () => void;
  motionType?: 'show' | 'hide';

  treeNodeRequiredProps: TreeNodeRequiredProps;
}

const MotionTreeNode = React.forwardRef<HTMLDivElement, MotionTreeNodeProps>((oriProps, ref) => {
  const {
    className,
    style,
    motion,
    motionNodes,
    motionType,
    onMotionStart: onOriginMotionStart,
    onMotionEnd: onOriginMotionEnd,
    active,
    treeNodeRequiredProps,
    ...props
  } = oriProps;
  const [visible, setVisible] = React.useState(true);
  const { prefixCls } = React.useContext(TreeContext);

  // Calculate target visible here.
  // And apply in effect to make `leave` motion work.
  const targetVisible = motionNodes && motionType !== 'hide';

  useLayoutEffect(() => {
    if (motionNodes) {
      if (targetVisible !== visible) {
        setVisible(targetVisible);
      }
    }
  }, [motionNodes]);

  const triggerMotionStart = () => {
    if (motionNodes) {
      onOriginMotionStart();
    }
  };

  // Should only trigger once
  const triggerMotionEndRef = React.useRef(false);
  const triggerMotionEnd = () => {
    if (motionNodes && !triggerMotionEndRef.current) {
      triggerMotionEndRef.current = true;
      onOriginMotionEnd();
    }
  };

  // Effect if unmount
  useUnmount(triggerMotionStart, triggerMotionEnd);

  // Motion end event
  const onVisibleChanged = (nextVisible: boolean) => {
    if (targetVisible === nextVisible) {
      triggerMotionEnd();
    }
  };

  if (motionNodes) {
    return (
      <CSSMotion
        ref={ref}
        visible={visible}
        {...motion}
        motionAppear={motionType === 'show'}
        onVisibleChanged={onVisibleChanged}
      >
        {({ className: motionClassName, style: motionStyle }, motionRef) => (
          <div
            ref={motionRef}
            className={clsx(`${prefixCls}-treenode-motion`, motionClassName)}
            style={motionStyle}
          >
            {motionNodes.map(treeNode => {
              const {
                data: { ...restProps },
                title,
                key,
                isStart,
                isEnd,
              } = treeNode;
              delete restProps.children;

              const treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps);

              return (
                <TreeNode
                  {...(restProps as Omit<typeof restProps, 'children'>)}
                  {...treeNodeProps}
                  title={title}
                  active={active}
                  data={treeNode.data}
                  key={key}
                  isStart={isStart}
                  isEnd={isEnd}
                />
              );
            })}
          </div>
        )}
      </CSSMotion>
    );
  }
  return <TreeNode domRef={ref} className={className} style={style} {...props} active={active} />;
});

if (process.env.NODE_ENV !== 'production') {
  MotionTreeNode.displayName = 'MotionTreeNode';
}

export default MotionTreeNode;
