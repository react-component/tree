function raf(callback: Function) {
  return setTimeout(callback);
}

raf.cancel = (id: number) => {
  clearTimeout(id);
};

export default raf;
