import { useEffect, useRef, useCallback } from './reactHooks';
import {  Dependence, UseStateInitial } from './type';

/*
 * 快捷使用useCallback来声明静态函数的方法
 * @param fn
 */
export function useStaticCallback <
  T extends (...args: any[]) => any
> (fn: T, dep: Dependence = []): T {
  return useCallback(fn, dep);
}

export const useInterval = (callback: any, delay: number) => {
  const savedCallback: any = useRef();

  // 保存最近的一次callback
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 开始计时
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return () => {
      //
    };
  }, [delay]);
};

/*
 * 获取更新前的值
 * @param {*} value
 * @return {*} 返回更新前的value
 */
export const usePrevious = (value: UseStateInitial) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  