export function nodeMatcher({ props = {}, ...rest }) {
  return expect.objectContaining({
    ...rest,
    props: expect.objectContaining(props),
  });
}
