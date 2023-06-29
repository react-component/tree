import * as React from 'react';

/**
 * Trigger only when component unmount
 */
export default function useUnmount(triggerStart: VoidFunction, triggerEnd: VoidFunction) {
  const [firstMount, setFirstMount] = React.useState(false);

  React.useLayoutEffect(() => {
    if (firstMount) {
      triggerStart();

      return () => {
        triggerEnd();
      };
    }
  }, [firstMount]);

  React.useLayoutEffect(() => {
    setFirstMount(true);

    return () => {
      setFirstMount(false);
    };
  }, []);
}
