import { LazyEditCell, EditCell, Test1 } from "#components";
import type { VueInstance } from "@vueuse/core";

// 声明范型的vue组件还有问题，无法推导
type ExtractComponentProps<T> = WithObject<
  T extends new () => {
    $props: infer P;
  }
    ? P
    : never
>;

type WithObject<T> = T extends object ? T : {};

type ExtractEmits<T> = UnionToIntersection<
  Exclude<
    {
      [K in keyof T]: K extends `on${infer EventName}`
        ? {
            [k in EventName]: Exclude<T[K], undefined>;
          }
        : never;
    }[keyof T],
    undefined
  >
>;

/** test */
type z = typeof EditCell;
type p = typeof LazyEditCell extends z ? 1 : 2;
type a = ExtractComponentProps<typeof Test1>;
type b = ExtractEmits<a>;

export type Comp<
  T extends Component = Component,
  Props = ExtractComponentProps<T>,
  PartProps = Partial<Props>,
  Emits = ExtractEmits<Props>
> = {
  readonly id: string;
  readonly component: T;
  props: Props;
  ref?: VueInstance;
  key: string;
  visible: boolean;
  filter: () => unknown;
  readonly set: (props: PartProps) => void;
  readonly on: <E extends keyof Emits>(EventName: E, fn: Emits[E]) => void;
  readonly mount: (props?: PartProps) => void;
  readonly reload: (props?: PartProps) => void;
  readonly unmount: () => void;
};

type Options<P> = Partial<{
  global: boolean;
  visible: boolean;
  filter: () => unknown;
  props: P;
}>;

export const useComp = <
  T extends Component,
  C extends Comp<T>,
  O extends Options<C["props"]>
>(
  recordComponent: Record<string, T>,
  options?: O
) => {
  const comps = useComps().value;
  const [[componentName, component]] = Object.entries(recordComponent);
  const {
    global = false,
    visible = false,
    props = {},
    filter = () => true,
  } = options ?? {};
  const id = global ? componentName : _randomKey(componentName);
  const comp = comps[id] as Comp | undefined;
  // 全局组件
  if (comp) {
    comp.set(props);
    // 如果是复用全局的组件，重新生成key
    comp.key = _randomId();
    visible && comp.mount();
    // filter应该不能覆盖，暂时不处理
  } else {
    let comp: Comp = {
      id,
      component,
      props,
      key: _randomId(),
      visible,
      filter,
      set(p) {
        comp.props = { ...comp.props, ...p };
      },
      on(EventName, fn) {
        comp.props[`on${EventName as string}`] = fn;
      },
      mount(p) {
        comp.visible = true;
        p && comp.set(p);
        if (!comps[id]) {
          comps[id] = toRaw(comp);
        }
      },
      reload(p) {
        comp.key = _randomId();
        p && comp.set(p);
      },
      unmount() {
        comp.visible = false;
        if (!global) {
          delete comps[id];
        }
      },
    };
    comps[id] = comp;
    // 转为响应性的代理值
    comp = comps[id];
  }
  if (!global) {
    // 外层组件卸载时，同时也卸载
    onUnmounted?.(() => {
      comp?.unmount();
    });
  } else {
    // 全局则提供一个remove方法
    const remove = () => {
      delete comps[id];
    };
    Object.assign(comps[id], { remove });
  }
  return comps[id] as Readonly<Comp<T>> &
    (O["global"] extends true ? { remove: () => void } : {});
};

// 客户端可以全局声明，仅在客户端使用
const clientComps = ref({} as Record<string, Comp>);

// 如果是服务端，由于useState不能保存Component，所以使用pinia绕过useState，但pinia本质上也是将值作为全局值保存，所以不能使用ref(响应性)。这里是一种偷鸡的方式
export const useServerComp = defineStore("serverComp", () => {
  // 并非ref值，因为服务端不需要响应性
  const value = {} as Record<string, Comp>;
  return { value };
});

export const useComps = () =>
  import.meta.server ? useServerComp() : clientComps;

/**
 * 基于useComp的管理弹窗state
 */
export const useModalComp = defineStore("modal", () => {
  const comps = useComps().value;

  const modals = [];
  const group = [];

  // 需要控制排序的弹窗
  const queue = ref([]);
  // 在一个循环内，获取所有queue的条件
  watch(queue, () => {});

  const mount = <
    T extends Component,
    C extends Comp<T>,
    O extends Options<C["props"]>
  >(
    c: T,
    opts: O
  ) => {};
  return {
    mount,
  };
});
