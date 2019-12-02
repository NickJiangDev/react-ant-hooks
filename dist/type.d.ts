export interface UseStateType<T = any> {
    value: T;
    setValue: any;
}
export declare type UseStateInitial = any;
export declare type Dispatch = (T: UseStateInitial) => void;
export interface Bind {
    value: UseStateInitial;
    onChange?: Dispatch;
}
export declare type Dependence = any[];
export interface UseStateOpts {
    callBackDep?: Dependence;
    customUseEffect?: boolean;
    dep?: Dependence;
    depType?: string;
    debug?: boolean;
}
export declare type UseStateArray = [UseStateInitial, Dispatch, Bind];
export interface SetStateValue {
    state: UseStateInitial;
    setState: Dispatch;
}
export declare type Callback = (...args: any[]) => any;
export declare type argvType = any[];
export interface UseInputOpts extends UseStateOpts {
    regxFn?: (opts: any) => string;
}
