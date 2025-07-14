export type RecordValue<T> = T[keyof T];

export type Affix<T extends string, U extends string> = `${T}_${U}`;

export type Flat<T> = { [P in keyof T]: T[P] };

export type UnionToIntersection<T> = (
  T extends any ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Tree<T, K extends string = "children"> = T & { [P in K]?: T[] };

export type orArray<T> = T extends infer P?(P|P[]):never

type FindEnumKey<_, T = Exclude<_, null>, U = Database["public"]["Enums"]> = {
  [P in keyof U]: U[P] extends T ? (T extends U[P] ? P : never) : never;
}[keyof U];

type EnumValues<T> = [T] extends [Enum_Name]
  ? T extends never
    ? {}
    : { enum_name: T }
  : {};

type FilterNever<T> = T extends [infer A1, never] ? [A1] : T;

// type test1 = EnumValues<FindEnumKey<Tables<"game">["platform"]>>;

// class Comp1<
//   T extends Component = Component,
//   Props = ExtractComponentProps<T>,
//   PartProps = Partial<Props>,
//   Emits = ExtractEmits<Props>
// > {
//   readonly id: string;
//   readonly component: T;
//   readonly props: Props;
//   ref?:VueInstance;
//   key: string;
//   visible: boolean;
//   filter: () => any;
//   set(props:PartProps){

//   }
//   on<E extends keyof Emits>(EventName: E, fn: Emits[E]){

//   }
//   mount(props?: PartProps){}
//   reload(props?: PartProps){}
//   unmount(){}
//   constructor({id,component,props,visible}){
//     this.id=id
//     this.component=component
//     this
//   }
// }