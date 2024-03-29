import * as React from 'react';
import classNames from 'classnames';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
  width?: number
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, isStart, isEnd, width }) => {
  const widthStyle: React.CSSProperties = width >= 0 ? {
    width: width
  } : {}

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
        style={widthStyle}
      />,
    );
  }

  return (
    <span aria-hidden="true" className={`${prefixCls}-indent`}>
      {list}
    </span>
  );
};

export default React.memo(Indent);
