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

export function _randomId(): string {
  // 取时间戳后6位 + 4位随机字符
  return (
    Date.now().toString(36).slice(-6) +
    Math.random().toString(36).substring(2, 6)
  );
}

export const _randomKey = (key) => `${_randomId()}_${key}`;

export const _wait = (t: number = 0) => new Promise((r) => setTimeout(r, t));
