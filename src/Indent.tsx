import * as React from 'react';

interface IndentProps {
  prefixCls: string;
  level: number;
  indentSize: number;
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, indentSize }) => {
  if (!level) {
    return null;
  }

  const list: React.ReactElement[] = [];
  for (let i = 0; i < level; i += 1) {
    list.push(
      <span
        key={i}
        className={`${prefixCls}-indent-unit`}
        style={{ display: 'inline-block', paddingLeft: indentSize, userSelect: 'none' }}
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
