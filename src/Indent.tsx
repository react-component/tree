import * as React from 'react';
import classNames from 'classnames';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
}

const Indent = React.forwardRef<{ getWidth(): number }, IndentProps>(
  ({ prefixCls, level, isStart, isEnd }, ref) => {
    const baseClassName = `${prefixCls}-indent-unit`;
    const list: React.ReactElement[] = [];
    for (let i = 0; i < level; i += 1) {
      list.push(
        <span
          key={i}
          className={classNames(baseClassName, {
            [`${baseClassName}-start`]: isStart[i + 1],
            [`${baseClassName}-end`]: isEnd[i + 1],
            [`${baseClassName}-end-first-level`]: !i && isEnd[0],
          })}
        />,
      );
    }

    const measurerIndentRef = React.createRef<HTMLSpanElement>();

    React.useImperativeHandle(ref, () => ({
      getWidth() {
        return measurerIndentRef.current.offsetWidth;
      },
    }));

    const measurerIndent = (
      <span
        key={-1}
        className={baseClassName}
        ref={measurerIndentRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
    );

    return (
      <span aria-hidden="true" className={`${prefixCls}-indent`}>
        {measurerIndent}
        {list}
      </span>
    );
  },
);

export default Indent;
