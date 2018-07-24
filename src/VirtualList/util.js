export function getStyle(element) {
  if (!element) return null;

  if (typeof window !== 'undefined' && 'getComputedStyle' in window) {
    return window.getComputedStyle(element);
  }
  return null;
}

export function getHeight(element) {
  const style = getStyle(element) || {};
  const match = (style.height || '').match(/^(\d*(\.\d+)?)px/);
  return match ? Number(match[1]) : null;
}
