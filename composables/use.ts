//
export const useOutClick = (call: (a: MouseEvent) => void) => {
  const t = ref();
  onUnmounted(onClickOutside(t, call));
  return t;
};

export const useFnHook = <F>({
  before,
  after,
}: {
  before: () => void;
  after: () => void;
}) => {
  const hook = <F extends (...a: any[]) => any>(fn: F) => {
    return (async (...arg: Parameters<F>) => {
      await before();
      let r;
      try {
        r = await fn(...arg);
      } catch (err) {
        console.error(err);
      }
      after();
      return r;
    }) as F;
  };
  return hook;
};

export const useLoading = () => {
  const [loading, toggle] = useToggle(false);
  const hook = useFnHook({
    before: () => toggle(true),
    after: () => toggle(false),
  });
  return [loading, hook] as const;
};

export const useMountListen = (fn, unmount = true) => {
  let stop;
  onMounted(() => {
    stop = fn();
  });
  unmount && onUnmounted(stop);
};

export const useCopy = <T extends Ref>(original: T) => {
  const copy = ref() as T;
  const lock = _lock();
  watchEffect(
    lock(() => {
      copy.value = _clone(original.value);
    })
  );
  const sync = lock(() => {
    original.value = _clone(copy.value);
  });
  return { copy, sync };
};

export const useAsyncCahe = <T>(name, fn: () => Promise<T>) => {
  const val = useState<T | undefined>(name, () => undefined);

  const p = Promise.resolve({ data: val }) as {
    data: Ref<T | undefined>;
  } & Promise<{
    data: Ref<T | undefined>;
  }>;
  p.data = val;

  if (val.value === undefined) {
    fn().then((res) => {
      val.value = res;
    });
  }
  return p;
};