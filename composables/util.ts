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
