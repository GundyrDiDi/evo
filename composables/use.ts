//
export const useOutClick = (call: (a: MouseEvent) => void) => {
  const t = ref();
  onClickOutside(t, call);
  return t;
};

