import { useCallback } from 'react';
import { SetStateValue, UseStateInitial } from '../type';
import useState from './useState';
/*
 * 强制更新 forceUpdate
 * 调用的时候必须先初始化，是为了把hooks的上下文绑定到Function Component上
 */
export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(Math.random());
};

export const useSetState = (initialValue: UseStateInitial): SetStateValue => {
  const [value, setValue] = useState(initialValue);
  return {
    setState: useCallback((v: UseStateInitial) => {
      return setValue((oldValue: UseStateInitial) => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v)
      }));
    }, []),
    state: value
  };
};
