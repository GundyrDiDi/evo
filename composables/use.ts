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

export const usePending=()=>{}

export const useMountListen = (fn, unmount = true) => {
  let stop;
  onMounted(() => {
    stop = fn();
  });
  unmount && onUnmounted(stop);
};

// 和computed的get/set类似，不同之处在于调用sync来触发set
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

  type M = {
    data: Ref<T | undefined>;
  };

  const p = Promise.resolve({ data: val }) as M & Promise<M>;
  p.data = val;

  if (val.value === undefined) {
    fn().then((res) => {
      val.value = res;
    });
  }
  return p;
};

export const useLocalExpire = (name, step = "D") => {
  const l = useLocalStorage(name, "");
  if (!l.value) {
    l.value = dayjs().format("YYYY/MM/DD");
  }
};

/** 获取子组件的expose，并可以继续向上暴露 */
export const useExpose = <T extends Component, K extends Object>(self?: K) => {
  type Expose = any; // ExtractExposed<InstanceType<T>>
  const expose = reactive<Expose & K>((self ?? {}) as any);
  // defineExpose(expose); defineExpose是宏编程，即使引用也不会暴露出值

  const vins = (ref: Expose | null) => {
    if (ref) {
      Object.entries(ref).forEach(([k, v]) => {
        expose[k] = v;
      });
    }
  };
  return { expose, vins };
};