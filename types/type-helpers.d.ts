export {};

declare global {
  // Useful for grepping
  type IDoNotKnowFn = (...args: any[]) => any;
  type IDoNotKnow = any;

  type Maybe<T> = T | null;
  type IHash<T = any> = { [p: string]: T };
  type IAnyProps<T extends object = {}> = IHash & T;
  type IAnyFunction = (...args: any[]) => any;
  type IAction<T extends IHash = IHash> = T & { type: string };

  type OptionalToRequired<T> = { [K in keyof T]-?: T[K] };
  type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };
  type RequireProp<T, Key extends keyof T> = T & { [K in Key]-?: T[K] };

  type Diff<T, K> = T extends K ? never : T;
  type Filter<T, K> = T extends K ? T : never;

  // Get the args for a function as a tuple type
  type ArgsType<T> = T extends (...args: infer U) => any ? U : never;
  // Get the args for a constructor function as a tuple type
  type CtorArgsType<T> = T extends new (...args: infer U) => any ? U : never;

  // Extend the return type of a function. Resulting type is original function input with additional output
  type ExtendReturn<Fn, AddedProps> = Fn extends (...a: infer A) => infer R ? (...a: A) => R & AddedProps : never;

  // Gets the expected type of a resolved Promise
  type Resolved<P extends PromiseLike<any>> = ArgsType<ArgsType<P['then']>[0]>[0];

  /**
   * Type will be an object with only given keys
   * @example
   * type Person = { name: string; phone: number; address: string };
   * type OnlyNameAndPhone = Subset<Person, 'name'|'phone'>;
   *
   * const noAddress: OnlyNameAndPhone = {name: 'Joe', phone: 5554441234}
   */
  type Subset<T extends object, Keys extends keyof T> = { [P in Keys]: T[P] };

  /**
   * Type will be all keys that are NOT in the specified set
   * @example
   * type Person = { name: string; phone: number; address: string; birthday: Date };
   * type AnonContactKeys = DiffKeys<Person, 'name'|'birthday'>;
   *
   * const propsToDisplay: AnonContactKeys[] = ['phone', 'address']
   */
  type DiffKeys<T extends object, Attrs extends keyof T> = Diff<keyof T, Attrs>;

  /**
   * Type will be an object whose keys are NOT in the specified set
   * @example
   * type Person = { name: string; phone: number; address: string; birthday: Date };
   * type AnonContactInfo = ExcludeSubset<Person, 'name'|'birthday'>;
   *
   * const coldCall: AnonContactInfo = {phone: 5554441234, address: '123 Sesame St.'}
   */
  type ExcludeSubset<Obj extends object, Keys extends keyof Obj> = Subset<Obj, DiffKeys<Obj, Keys>>;

  /**
   * like { ...obj, ...anotherObj }
   *
   * Merge<{a: string, b: number}, {b: Date, c: number}>
   * ===
   * { a: string } & { b: Date, c: number }
   */
  type Merge<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
}
