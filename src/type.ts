
export interface UseStateType<T = any> {
  value: T;
  setValue: any;
}

/*------------- useState -----------------*/

// useState的初始化值
export type UseStateInitial = any;

// onchange函数的类型
export type Dispatch = (T: UseStateInitial) => void;

export interface Bind {
  value: UseStateInitial;
  onChange?: Dispatch;
}

// 依赖
export type Dependence = any[];

// useState的第二个参数类型
export interface UseStateOpts {
  callBackDep?: Dependence;
  customUseEffect?: boolean;
  dep?: Dependence;
  depType?: string;
  debug?: boolean;
}

// useState返回值

export type UseStateArray = [UseStateInitial, Dispatch, Bind];

// useSetState

export interface SetStateValue {
  state: UseStateInitial;
  setState: Dispatch;
}

// 模拟的生命周期所传入的函数

export type Callback = (...args: any[]) => any;

/*------------- antd -----------------*/

// antd select的其他参数类型
export type argvType = any[];

export interface UseInputOpts extends UseStateOpts {
  regxFn?: (opts: any) => string;
}