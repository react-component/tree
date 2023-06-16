import * as React from 'react';

/**
 * Trigger only when component unmount
 */
export default function useUnmount(callback: VoidFunction) {
  const [enabled, setEnabled] = React.useState(false);

  React.useLayoutEffect(
    () => () => {
      if (enabled) {
        callback();
      }
    },
    [enabled],
  );

  React.useLayoutEffect(() => {
    setEnabled(true);
  }, []);
}
