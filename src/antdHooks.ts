import { useCallback, useState } from './reactHooks';
import { useStaticCallback } from './utilHooks';
import {
  argvType,
  Bind,
  Dispatch,
  UseStateInitial,
  UseStateOpts
} from './type';


/*
 * 全局统一input的onchange事件
 * 其中第二个参数opts:{regex}
 * regex 支持传入正则，对即将改变的值注入规则，类型为[Regexp, string]
 * @param initial 初始化的值
 * @param opts 一些初始化的参数
 * @return value 当前的值
 * @return onchange函数
 * @return 未经修饰的onchange函数
 * @return object 生成一个key为value,onChange的对象，方便和antd组件直接使用
 */
interface UseInputOpts extends UseStateOpts {
  regxFn?: (opts: any) => string;
}
const regxDefaultFn = (str: string) => str;
const regxTextAreaDefaultFn = (str: string) => str;
export const useInputState = (
  initial: UseStateInitial,
  opts?: UseInputOpts
): [UseStateInitial, Dispatch, Bind, Dispatch] => {
  const { regxFn = regxDefaultFn, ...props } = opts || {};
  const [value, setValue] = useState(initial, props);
  const onChange = useCallback(
    (e: any) => setValue(regxFn(e.target.value)),
    []
  );
  return [value, onChange, { value, onChange }, setValue];
};

export const useTextAreaState = (
  initial: UseStateInitial,
  opts?: UseInputOpts
): [UseStateInitial, Dispatch, Bind, Dispatch] => {
  const { regxFn = regxTextAreaDefaultFn, ...props } = opts || {};
  const [value, setValue] = useState(initial, props);
  const onChange = useCallback(
    (e: any) => setValue(regxFn(e.target.value)),
    []
  );
  return [value, onChange, { value, onChange }, setValue];
};

/*
 * 全局统一select的onchange事件
 * @param initial 初始化值
 * @param opts 一些初始化的参数
 * @return value 当前的值
 * @return onchange函数
 * @return antd Select组件onchange事件的一个参数后的所有参数
 * @return object 生成一个key为value,onChange的对象，方便和antd组件直接使用
 */
export const useSelectState = (
  initial: UseStateInitial,
  opts?: UseStateOpts
): [UseStateInitial, Dispatch, Bind, argvType] => {
  const [value, setValue] = useState(initial, opts);
  const [argvs, setArgv] = useState(undefined);
  const onChange = useCallback((e: any, ...argv: any) => {
    setValue(e);
    setArgv(argv);
  }, []);
  return [value, onChange, { value, onChange }, argvs];
};

/*
 * 全局统一checkBox的onchange事件
 * @param initial 初始化值
 * @return value 当前的值
 * @return onchange函数
 * @return object 生成一个key为value,onChange的对象，方便和antd组件直接使用
 */
export const useCheckBoxState = (
  initial: UseStateInitial = [],
  opts?: UseStateOpts
): [UseStateInitial, Dispatch, Bind] => {
  const [value, onChange, bind] = useState(initial, opts);
  return [value, onChange, bind];
};


/*
 * 模态框显示隐藏的封装
 * @returns visible
 * @returns setVisible
 * @returns hideModal 关闭模态框
 * @returns openModal 打开模态框
 */
export const useModalVisible = () => {
  const [visible, setVisible] = useState(false);
  const hideModal = useStaticCallback(() => setVisible(false));
  const openModal = useStaticCallback(() => setVisible(true));

  return {
    visible,
    setVisible,
    hideModal,
    openModal
  };
};

/*
 * Table的分页，搜索，刷新事件的封装
 * @param initialState 初始化值 和内置的初始化值合并
 * @returns state
 * @returns dispatch
 * @returns onTablePaginationChange 分页事件
 * @returns onSearch 搜索事件
 * @returns onReload 刷新
 */
const initialParams = {
  page: 1,
  per_page: 12
};
const initialPagination = {
  total: 0,
  pageSize: 12
};
export const useTableState = (initialState?: object) => {
  const [state, dispatch] = useState({ ...initialParams, ...initialState });

  // 分页事件
  const onTablePaginationChange = useStaticCallback(
    (pageNum: number) => {
      const opts = { ...state, page: pageNum };
      dispatch(opts);
    },
    [state]
  );

  // 刷新事件
  const onReload = useStaticCallback(() => {
    const opts = { ...state, page: 1 };
    dispatch(opts);
  }, [state]);

  // 搜索事件
  const onSearch = useStaticCallback(
    (options: any) => {
      const opts = { ...state, ...options, page: 1 };
      dispatch(opts);
    },
    [state]
  );

  return {
    state,
    dispatch,
    onTablePaginationChange,
    onSearch,
    onReload,
    pagination: {
      ...initialPagination,
      current: state.page,
      onChange: onTablePaginationChange
    }
  };
};
