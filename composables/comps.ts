import { LazyEditCell, EditCell, Test1 } from "#components";
import type { VueInstance } from "@vueuse/core";

// 声明范型的vue组件还有问题，无法推导
type ExtractComponentProps<T> = MustObject<
  T extends new () => {
    $props: infer P;
  }
    ? P
    : never
>;

type MustObject<T> = T extends object ? T : {};

type FilterNever<T> = T extends [infer A1, never] ? [A1] : T;

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

type z = typeof EditCell;
type p = typeof LazyEditCell extends z ? 1 : 2;

// type m

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

export const comps = ref(new Map<string, Comp>());

export const useComps = () =>
  import.meta.server
    ? useState("comps", () => new Map<string, Comp>())
    : comps;

type Options<P> = Partial<{
  global: boolean;
  visible: boolean;
  filter: () => unknown;
  props: P;
}>;

export const useComp = <T extends Component, C extends Comp<T>>(
  recordComponent: Record<string, T>,
  options?: Options<C["props"]>
) => {
  const comps = useComps().value;
  const [[componentName, component]] = Object.entries(recordComponent);
  const {
    global = false,
    visible = false,
    props = {} as C["props"],
    filter = () => true,
  } = options ?? {};
  const id = global ? componentName : _randomKey(componentName);
  const comp = comps.get(id) as Comp<T> | undefined;
  if (comp) {
    comp.set(props);
    // 如果是复用全局的组件，重新生成key
    comp.key = _randomId();
    visible && comp.mount();
    // filter应该不能覆盖，暂时不处理
  } else {
    const comp: Comp<T> = {
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
        if (!global && !comps.get(id)) {
          comps.set(id, comp as Comp);
        }
      },
      reload(p) {
        comp.key = _randomId();
        p && comp.set(p);
      },
      unmount() {
        comp.visible = false;
        if (!global) {
          comps.delete(id);
        }
      },
    };
    comps.set(id, comp as Comp);
  }
  return comps.get(id) as Readonly<Comp<T>>;
};
