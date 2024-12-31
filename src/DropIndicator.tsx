import React from 'react';

export interface DropIndicatorProps {
  dropPosition: -1 | 0 | 1;
  dropLevelOffset: number;
  indent: number;
}

const DropIndicator: React.FC<Readonly<DropIndicatorProps>> = props => {
  const { dropPosition, dropLevelOffset, indent } = props;
  const style: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    backgroundColor: 'red',
    height: 2,
  };
  switch (dropPosition) {
    case -1:
      style.top = 0;
      style.left = -dropLevelOffset * indent;
      break;
    case 1:
      style.bottom = 0;
      style.left = -dropLevelOffset * indent;
      break;
    case 0:
      style.bottom = 0;
      style.left = indent;
      break;
  }
  return <div style={style} />;
};

if (process.env.NODE_ENV !== 'production') {
  DropIndicator.displayName = 'DropIndicator';
}

export default DropIndicator;
