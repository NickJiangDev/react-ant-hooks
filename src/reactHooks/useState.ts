import { fromJS, is } from 'immutable';
import {
  useCallback,
  useEffect,
  useRef,
  useState as useReactState
} from 'react';
import { UseStateArray, UseStateInitial, UseStateOpts } from '../type';

/*
 * 重写useState
 * 在页面刷新的时候,会重新执行useState，导致生成的新的setValue函数
 * 从而导致子组件不必要的渲染，配合react.memo做性能优化，效果等同于reac.pureComponent
 * @param initial 初始值
 * @param opts 一些初始化的参数
 * @return value 当前的值
 * @return onchange函数
 * @return object 生成一个key为value,onChange的对象，方便和antd组件直接使用
 */
const useState = (
  initial: UseStateInitial,
  opts: UseStateOpts = {}
): UseStateArray => {
  const [value, onChange] = useReactState(initial);
  const {
    callBackDep = [], // setValue事件是否更换的依赖
    dep = [], // 当dep发生变化的时候，自动更新value，默认从不更新
    depType = 'dep', // 使用useEffect的两种场景
    customUseEffect = false // 是否使用自定义的Effect更新
  } = opts;
  const setValue = useCallback(
    (p: UseStateInitial) => onChange(p),
    callBackDep
  );

  let useEffectDep;
  // 第3种useEffect的方式
  const ref: any = useRef();
  const current: any = ref.current || {};
  const isDiff = contentDiff(dep, current.dep, +!!current.tag);
  useEffect(() => {
    ref.current = {
      tag: isDiff,
      dep
    };
  });

  /*
   * react更新数据一般有3种场景
   * 1、通过setValue操作手动的修改值
   * 更新条件：调用setValue
   * input的onchange事件，此时是不需要关注initial是否发生变化，即不需要使用useEffect
   * 默认dep不传为[]
   *
   * 2、dep 我们期望数据改变马上能够更新值
   * 更新条件：对应值所在的data发生了变化
   * mobx拉取数据成功，data不再为空对象，从而需要更新页面上的对应值
   *
   * 3、content 我们期望数据的内容真实的改变了才更新内容，而不是依赖发生变化
   * 更新条件：对应值所在的data的对应的value发生来变化
   * 比如在组件内部通过setValue操作已经修改值，但是由于mobx每次操作生产出来的store都是新的，
   * 如果走第一种场景的话，就会覆盖掉setValue操作产生的值
   */
  switch (depType) {
    case 'dep':
      useEffectDep = dep;
      break;
    case 'content':
      useEffectDep = [isDiff];
      break;
    default:
      useEffectDep = dep;
      break;
  }
  // 如果传入依赖，当依赖发生变化的时候，更新值
  useEffect(() => {
    if (!customUseEffect) {
      setValue(initial);
    }
  }, useEffectDep);
  return [value, setValue, { value, onChange: setValue}];
};

/*
 * 对比值是否发生了变化
 * 对于简单类型，走useEffect内部的机制 Object.is来diff
 * 对于复杂类型，通过immutable来diff
 * @param value 当前值
 * @param oldValue 上一个更新的值
 * @param tag 上一个更新的tag号
 */
const contentDiff = (
  value: UseStateInitial,
  oldValue: UseStateInitial,
  tag: number
) => {
  let isChange;
  if (typeof value === 'object' && typeof oldValue === 'object') {
    isChange = is(fromJS(value), fromJS(oldValue));
  } else {
    isChange = Object.is(value, oldValue);
  }
  return isChange ? ++tag : tag;
};
export default useState;
