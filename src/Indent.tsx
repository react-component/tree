import * as React from 'react';

interface IndentProps {
  prefixCls: string;
  level: number;
  indentSize: number;
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, indentSize }) => {
  const list: React.ReactElement[] = [];
  for (let i = 0; i < level; i += 1) {
    list.push(
      <span
        key={i}
        aria-hidden="true"
        className={`${prefixCls}-indent`}
        style={{ display: 'inline-block', paddingLeft: indentSize, userSelect: 'none' }}
      />,
    );
  }

  return <>{list}</>;
};

export default Indent;
