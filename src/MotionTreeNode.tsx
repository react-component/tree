import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { TreeContext } from './contextTypes';
import { FlattenNode, TreeNodeProps } from './interface';
import TreeNode from './TreeNode';
import { getTreeNodeProps, TreeNodeRequiredProps } from './utils/treeUtil';

interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  active: boolean;
  motion?: any;
  motionNodes?: FlattenNode[];
  onMotionStart: () => void;
  onMotionEnd: () => void;
  motionType?: 'show' | 'hide';

  treeNodeRequiredProps: TreeNodeRequiredProps;
}

const MotionTreeNode: React.ForwardRefRenderFunction<HTMLDivElement, MotionTreeNodeProps> = (
  {
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
  },
  ref,
) => {
  const { prefixCls } = React.useContext(TreeContext);
  const [visible, setVisible] = React.useState(true);

  useLayoutEffect(() => {
    if (motionNodes && motionType === 'hide' && visible) {
      setVisible(false);
    }
  }, [motionNodes]);

  const onVisibleChanged = (nextVisible: boolean) => {
    if (visible === nextVisible) {
      console.log('onVisibleChanged', nextVisible);
      onOriginMotionEnd();
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
            className={classNames(`${prefixCls}-treenode-motion`, motionClassName)}
            style={motionStyle}
          >
            {motionNodes.map((treeNode: FlattenNode) => {
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
};

MotionTreeNode.displayName = 'MotionTreeNode';

const RefMotionTreeNode = React.forwardRef(MotionTreeNode);

export default RefMotionTreeNode;
