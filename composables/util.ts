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

export const _values = <T extends Object>(t?: T) => {
  return t ? (Object.values(t) as Valueof<T>[]) : [];
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

//
export const _clone = <T>(data: T): T => {
  if (typeof data !== "object" || data === null) return data;
  const copy = (Array.isArray(data) ? [] : {}) as T;
  Object.entries(data).forEach(([key, value]) => {
    copy[key] = _clone(value);
  });
  return copy;
};

//
export const _lock = (runtime = 5) => {
  let lock = false;
  const wrap =
    (fn: (...a) => unknown) =>
    (...r) => {
      if (lock) return;
      lock = true;
      const res = fn(...r);
      setTimeout(() => {
        lock = false;
      }, runtime);
      return res;
    };
  return wrap;
};

//
const _until = <T extends (...r: any) => any, R = Awaited<ReturnType<T>>>(
  fn: T,
  opts: {
    count?: number;
    delay?: number;
    filter?: (v: R) => any;
  } = {}
) => {
  const { count = 10, delay = 30, filter = (v) => !!v } = opts;
  const wrap = (...r) => {
    let cost = 0;
    return (async function _(...r) {
      const data = await fn(...r);
      cost++;
      if (filter(data)) return data;
      if (cost >= count) {
        throw new Error(`Max try ${cost} fail`);
      }
      await _wait(delay);
      return _(...r);
    })(...r);
  };
  return wrap as (...p: Parameters<T>) => Promise<R>;
};
