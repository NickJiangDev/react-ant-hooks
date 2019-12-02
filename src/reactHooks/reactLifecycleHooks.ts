import { useEffect, useRef } from '../reactHooks';
import { Callback } from '../type';
/*
 * 生命周期 componentWillUnmount
 * @param fn
 */
export const useWillUnmount = (fn: Callback) =>
  useEffect(() => {
    return () => fn && fn();
  }, []);

/*
 * 生命周期 componentDidMount
 * @param fn
 */
export const useDidMount = (fn: Callback) =>
  useEffect(() => {
    if (!!fn) {
      fn();
    }
  }, []);

/*
 * 生命周期 componentDidUpdate
 * @param fn
 */

export const useDidUpdate = (fn: Callback) => {
  const mounting = useRef(true);
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false;
    } else {
      fn();
    }
  });
};
