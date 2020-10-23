import * as React from 'react';
import classNames from 'classnames';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
}

const Indent = ({ prefixCls, level, isStart, isEnd }: IndentProps) => {
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

  return (
    <span aria-hidden="true" className={`${prefixCls}-indent`}>
      {list}
    </span>
  );
};

export default Indent;
