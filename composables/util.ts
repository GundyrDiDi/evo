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

export const _unique = <T>(arr?: T[]) => {
  return [...new Set(arr)];
};

export const _trim = (arr?: string[]) => {
  return arr?.map((v) => v.trim()).filter((v) => v) ?? [];
};

export const _unique_trim = (val?: string[]) => _trim(_unique(val));

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

// todo:类型定义
export const _lock = (runtime = 10) => {
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
export const _until = <
  T extends (...r: any) => any,
  R = Awaited<ReturnType<T>>
>(
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

//
export const _valid = <T extends (...a) => any>(
  checkFn,
  fn: T,
  failFn = (...r) => {}
) => {
  const wrap = async (...r) => {
    const b = await checkFn(...r);
    return b ? fn(...r) : failFn(...r);
  };
  return wrap as T;
};

type Clxs = string | number | (string | number)[];
type ClxsValue = Clxs | { class: Clxs };
export const _mergeClass = (
  original: Record<string, any>,
  ...clxs: ClxsValue[]
): string => {
  // 初始化类名列表
  const normalizeToArray = (value: any): string[] => {
    if (value === null || value === undefined) return [];
    if (typeof value === "string")
      return value.split(/\s+/).filter((x) => x !== "");
    if (typeof value === "number") return [String(value)];
    if (Array.isArray(value))
      return value.flatMap(normalizeToArray).filter((x) => x !== "");
    return [];
  };
  const clxList: string[] = [];

  // 处理原始对象的类名
  if ("class" in original && original.class !== undefined) {
    const originalValue = original.class;

    // 处理字符串类名
    if (typeof originalValue === "string") {
      clxList.push(...originalValue.split(/\s+/).filter((x) => x !== ""));
    }
    // 处理数组类名
    else if (Array.isArray(originalValue)) {
      originalValue.forEach((item) => {
        if (typeof item === "string") {
          clxList.push(...item.split(/\s+/).filter((x) => x !== ""));
        } else if (typeof item === "number") {
          clxList.push(String(item));
        } else if (Array.isArray(item)) {
          // 处理嵌套数组
          clxList.push(...normalizeToArray(item));
        }
      });
    }
    // 处理数字类名
    else if (typeof originalValue === "number") {
      clxList.push(String(originalValue));
    }
  }

  // 处理传入的额外类名
  for (const clx of clxs) {
    // 处理对象格式 { class: ... }
    if (typeof clx === "object" && clx !== null && "class" in clx) {
      const classValue = clx.class;

      if (typeof classValue === "string") {
        clxList.push(...classValue.split(/\s+/).filter((x) => x !== ""));
      } else if (typeof classValue === "number") {
        clxList.push(String(classValue));
      } else if (Array.isArray(classValue)) {
        clxList.push(...normalizeToArray(classValue));
      }
    }
    // 直接处理其他类型
    else {
      clxList.push(...normalizeToArray(clx));
    }
  }

  // 去重并设置结果
  return [...new Set(clxList)].join(" ");
};

import _dayjs from "dayjs";

export const dayjs = _dayjs;

export const _iso = (a: string | Date) => dayjs(a).toISOString();

export const _date_str = (a?: string | Date, format = "YYYY/MM/DD") =>
  dayjs(a).format(format);
