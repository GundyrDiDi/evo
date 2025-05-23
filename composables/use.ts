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
        console.log(err);
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
