import { useCallback, useState } from './reactHooks';
import { useStaticCallback } from './utilHooks';
// import Schema from 'async-validator';
import {
  argvType,
  Bind,
  Dispatch,
  UseStateInitial,
  UseStateOpts,
  UseInputOpts
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

  // 当前序号基数
  const baseNo = (state.page - 1) * state.per_page;

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
    baseNo,
    pagination: {
      ...initialPagination,
      current: state.page,
      onChange: onTablePaginationChange
    }
  };
};


// const defaultStore = {};
// const defaultError = {};
// const initialState: FormDefaultState = {
//   store: defaultStore,
//   error: defaultError,
// };

// function reducer(state: any, action: any) {
//   switch (action.type) {
//     case 'update':
//       const { store, error } = action;
//       return {
//         store: {
//           ...state.store,
//           ...store
//         },
//         error: {
//           ...state.error,
//           ...error
//         }
//       };
//     case 'reset':
//       return initialState;
//     default:
//       return state;
//   }
// }

// interface FieldsValue {
//   [index: string]: {
//     value: string | boolean;
//     error: any;
//   };
// }

// interface FormDefaultState {
//   store: object;
//   error: object;
// }

// interface FieldDecoratorOptions {
//   rules?: any[];
//   onChange?: (e: any) => string;
// }
// // Schema.warning = () => {
// //   // 注释掉打印
// // };

// // 默认onchange事件
// const defaultOnChange = (e: any) => e.target.value;

// /*
// * form
// */

// export const useForm = () => {
// const [{ store, error }, dispatch] = useReducer(reducer, initialState);
// // 根据id获取对应的值
// const getFieldValue = useStaticCallback((name: string) => store[name], [
//   store
// ]);
// // 根据id数组获取对应的值
// const getFieldsValue = useStaticCallback(
//   (nameArr: string[] | undefined) => {
//     if (Array.isArray(nameArr)) {
//       return nameArr.reduce((p: object, v: string) => {
//         p[v] = getFieldValue(v);
//         return p;
//       }, {});
//     } else {
//       return store;
//     }
//   },
//   [store]
// );
// // 根据id后去对应的错误信息的第一个message
// const getFieldErrorFirstMessage: (
//   name: string
// ) => string = useStaticCallback(
//   (name: string) =>
//     error[name] ? error[name][0] && error[name][0].message : '',
//   [error]
// );

// // 根据id获取对应的错误信息
// const getFieldError = useStaticCallback((name: string) => error[name], [
//   error
// ]);

// // 根据id数组后去对应的错误信息
// const getFieldsError = useStaticCallback(
//   (nameArr: string[] | undefined) => {
//     if (Array.isArray(nameArr)) {
//       return nameArr.reduce((p: object, v: string) => {
//         p[v] = getFieldError(v);
//         return p;
//       }, {});
//     } else {
//       return error;
//     }
//   },
//   [error]
// );

// // 重置
// const resetFields = useStaticCallback(() => {
//   dispatch({ type: 'reset' });
// });

// // 设置一组输入控件的值和错误状态
// const setFields = useStaticCallback(
//   (values: FieldsValue) => {
//     const fields: FormDefaultState = Object.entries(values).reduce(
//       (p: FormDefaultState, [key, field]: any) => {
//         p.store[key] = field.value;
//         p.error[key] = field.error;
//         return p;
//       },
//       {
//         store,
//         error
//       }
//     );
//     dispatch({
//       type: 'update',
//       error: fields.error,
//       store: fields.store
//     });
//   },
//   [store, error]
// );

// // 设置一组输入控件的值
// const setFieldsValue = useStaticCallback(
//   (values: object) => {
//     dispatch({
//       type: 'update',
//       error: {},
//       store: {
//         ...store,
//         ...values
//       }
//     });
//   },
//   [store]
// );
// // 包裹input的HOC
// const getFieldDecorator = (
//   name: string,
//   opts: FieldDecoratorOptions = {}
// ) => {
//   const { onChange = defaultOnChange, rules = [], ...props } = opts;

//   const schema = new Schema({ [name]: rules });
//   const onChangeHandler = (e: any) => {
//     const value = onChange(e);
//     // 没有规则的时候不进行校验
//     if (Array.isArray(rules) && !rules.length) {
//       dispatch({
//         type: 'update',
//         error: { [name]: null },
//         store: { [name]: value }
//       });
//     } else {
//       schema.validate(
//         {
//           [name]: value
//         },
//         (errors: any[]) => {
//           dispatch({
//             type: 'update',
//             error: { [name]: errors },
//             store: { [name]: value }
//           });
//         }
//       );
//     }
//   };
//   return (Component: ReactElement) => {
//     return React.cloneElement(Component, {
//       value: store[name],
//       onChange: onChangeHandler,
//       ...props
//     });
//   };
// };
// return {
//   getFieldDecorator,
//   getFieldError,
//   getFieldsError,
//   getFieldsValue,
//   getFieldValue,
//   resetFields,
//   setFieldsValue,
//   setFields,
//   getFieldErrorFirstMessage,
//   store,
//   error
// };
// };