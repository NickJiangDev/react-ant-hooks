import { Dependence } from './type';
export declare function useStaticCallback<T extends (...args: any[]) => any>(fn: T, dep?: Dependence): T;
export declare const useInterval: (callback: any, delay: number) => void;
export declare const usePrevious: (value: any) => undefined;
