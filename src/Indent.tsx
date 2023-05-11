import classNames from 'classnames';
import * as React from 'react';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
}

const Indent = ({ prefixCls, level, isStart, isEnd }: IndentProps) => {
  const indentRef = React.useRef(null);
  const baseClassName = `${prefixCls}-indent-unit`;
  const list: React.ReactElement[] = [];
  for (let i = 0; i < level; i += 1) {
    list.push(
      <span
        key={i}
        className={classNames(baseClassName, {
          [`${baseClassName}-start`]: isStart[i],
          [`${baseClassName}-end`]: isEnd[i],
        })}
      />,
    );
  }

  React.useEffect(() => {
    indentRef.current.style.width = indentRef.current.clientWidth + 'px';
  }, []);

  return (
    <span aria-hidden="true" className={`${prefixCls}-indent`} ref={indentRef}>
      {list}
    </span>
  );
};

export default React.memo(Indent);
