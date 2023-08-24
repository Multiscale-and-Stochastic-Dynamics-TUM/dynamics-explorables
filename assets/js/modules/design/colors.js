export function getCSSColor(colorVar) {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue(colorVar);
}