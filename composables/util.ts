export const _pick = <T, K extends keyof T>(obj: T, k: K | K[]) => {
  const t = {} as { [P in K]: T[P] };
  if (Array.isArray(k)) {
    [...new Set(k)].forEach((k1) => {
      t[k1] = obj[k1];
    });
  } else {
    t[k] = obj[k];
  }
  return t;
};

export const _unique = <T>(arr: T[]) => {
  return [...new Set(arr)];
};

export const _values = <T extends Object>(t: T) => {
  return Object.values(t) as RecordValue<T>;
};

export const _listenEvent = <T extends string>(
  event: T,
  fn: any,
  el: Element | Document = document
) => {
  el.addEventListener(event, fn);
  return () => el.removeEventListener(event, fn);
};

export const _onceEvent = <T extends string>(
  event: T,
  fn: Function,
  el: Element | Document = document
) => {
  const once = (e: any) => {
    fn(e);
    el.removeEventListener(event, once);
  };
  el.addEventListener(event, once);
  return () => el.removeEventListener(event, once);
};

export function _isMouseOver(element: Element, mouseEvent: MouseEvent) {
  const rect = element.getBoundingClientRect();
  const x = mouseEvent.clientX;
  const y = mouseEvent.clientY;

  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
