## 什么是react-antchooks

可拔插的完美兼容antd组件的hooks。

antchook - (ant-c-hook)

ant: 基于antd社区量身定做的Hooks

c  : 包含自定义的方法Hooks


### 背景
react v16.8版本以后，社区增加了hooks方法，迎来了react社区函数式编程的春天。

虽然react已经给出的Hooks能覆盖业务中绝大多数场景，但实际业务中还是会有很多由Hooks衍生出来 - 功能相同的代码，而且多次出现在你的业务组件中，本文以antd组件为例：

- 控制模态框的显隐
- table分页列表每次都需要去操心pagesize、pageindex
- 输入框的onChange回调参数为（Array | String | Event | any）
- 使用的hooks因为props而多次渲染
- ...

虽然这些问题都可以通过业务逻辑来实现，但每次遇到相同的组件，就会有相同的问题，导致我们的代码量冗余，可维护性差等等。

### 我们需要的点

- 无需关心变量的开始形态和最终形态，有一个可拔插的Hook来消化掉变量，并抛出方法
- 当props不变时，无需重新执行Hooks，如果有依赖关系则通过参数控制
- 具备伪react的生命周期Hooks
- 无需写过多逻辑代码，适配antd组件
- 学习心智成本低，使用方便

### antcHooks提供的类型范围

- 生命周期
- antd Hooks
- 提供带有依赖关系的useState

### 安装条件

- react >= v16.8.0
- antd

### 快速开始

#### 安装
```node
npm install react-antchooks
```
or
```node
yarn add react-antchooks
```

#### 使用

```js
import * as React from 'react';
import { Input } from 'antd';
import { useDidMount, useANTCState, useInputState, useStaticCallback } from "react-antchooks";

const App = () => {
  useDidMount(() => {
      // 页面初始化回调
  });

  // p标签变量
  const [value, setValue] = useState(1);
  // input hook
  const [inputValue, ,inputValueProps] = useInputState('');
  // add Handler
  const addValue = useStaticCallback(() => setValue(++value));
  // render
  return (
    <div>
        <Input {...inputValueProps} />
        <p>{value}</p>
    </div>
  );
};

```

### Hooks实例

- 强化原生Hooks
    -  [useANTCState](#useANTCState)
    -  [useForceUpdate](#useForceUpdate)

- antd组件Hooks
    -  [useInputState](#useInputState)
    -  [useModalVisible](#useModalVisible)
    -  [useTableState](#useTableState)
    -  [useSelectState](#useSelectState)
    -  [useTextAreaState](#useTextAreaState)

- 生命周期Hooks
    -  [useWillUnmount](#useWillUnmount)
    -  [useDidMount](#useDidMount)
    -  [useDidUpdate](#useDidUpdate)


### 描述

 <span id="useANTCState">useANTCState</span>

```js

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
const [value, onChange, object] = useANTCState(initial, opts);

react更新数据一般有3种场景
 1、通过setValue操作手动的修改值
 更新条件：调用setValue
 input的onchange事件，此时是不需要关注initial是否发生变化，即不需要使用useEffect
 默认dep不传为[]

 2、dep 我们期望数据改变马上能够更新值
 更新条件：对应值所在的data发生了变化
 mobx拉取数据成功，data不再为空对象，从而需要更新页面上的对应值

 3、content 我们期望数据的内容真实的改变了才更新内容，而不是依赖发生变化
 更新条件：对应值所在的data的对应的value发生来变化
 比如在组件内部通过setValue操作已经修改值，但是由于mobx每次操作生产出来的store都是新的，
 如果走第一种场景的话，就会覆盖掉setValue操作产生的值
```

 <span id="useForceUpdate">useForceUpdate</span>

```js

/*
 * 强制更新 forceUpdate
 * 调用的时候必须先初始化，是为了把hooks的上下文绑定到Function Component上
 */
const {state, setState} = useForceUpdate();

```

 <span id="useInputState">useInputState</span>

```js

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
const [value, onChange, valueProps, setValue] = useForceUpdate(initial, opts);

```

 <span id="useModalVisible">useModalVisible</span>

```js
/*
 * 模态框显示隐藏的封装
 * @returns visible
 * @returns setVisible
 * @returns hideModal 关闭模态框
 * @returns openModal 打开模态框
 */
const {visible, openModal, hideModal} = useModalVisible(false);

```

 <span id="useTableState">useTableState</span>

```js
/*
 * Table的分页，搜索，刷新事件的封装
 * @param {page = 1, per_page = 12, ...opts } 初始化值 和内置的初始化值合并
 * @returns state
 * @returns dispatch
 * @returns onTablePaginationChange 分页事件
 * @returns onSearch 搜索事件
 * @returns onReload 刷新
 */
const {state, dispatch, onTablePaginationChange, onSearch, onReload} = useTableState(initialState);

```

 <span id="useSelectState">useSelectState</span>

```js
/*
 * 全局统一select的onchange事件
 * @param initial 初始化值
 * @param opts 一些初始化的参数
 * @return value 当前的值
 * @return onchange函数
 * @return antd Select组件onchange事件的一个参数后的所有参数
 * @return object 生成一个key为value,onChange的对象，方便和antd组件直接使用
 */
const [value, onChange, valueProps, setValue] = useSelectState(initial, opts);

```

 <span id="useTextAreaState">useTextAreaState</span>

```js
// 同Input
const [value, onChange, valueProps, setValue] = useTextAreaState(initial, opts);

```


<span id="useWillUnmount">useWillUnmount</span>

```js
useWillUnmount(fn);
```

<span id="useDidMount">useDidMount</span>

```js
useDidMount(fn);
```

<span id="useDidUpdate">useDidUpdate</span>

```js
useDidUpdate(fn);
```