import { argvType, Bind, Dispatch, UseStateOpts } from './type';
interface UseInputOpts extends UseStateOpts {
    regxFn?: (opts: any) => string;
}
export declare const useInputState: (initial: any, opts?: UseInputOpts | undefined) => [any, Dispatch, Bind, Dispatch];
export declare const useTextAreaState: (initial: any, opts?: UseInputOpts | undefined) => [any, Dispatch, Bind, Dispatch];
export declare const useSelectState: (initial: any, opts?: UseStateOpts | undefined) => [any, Dispatch, Bind, argvType];
export declare const useCheckBoxState: (initial?: any, opts?: UseStateOpts | undefined) => [any, Dispatch, Bind];
export declare const useModalVisible: () => {
    visible: any;
    setVisible: Dispatch;
    hideModal: () => void;
    openModal: () => void;
};
export declare const useTableState: (initialState?: object | undefined) => {
    state: any;
    dispatch: Dispatch;
    onTablePaginationChange: (pageNum: number) => void;
    onSearch: (options: any) => void;
    onReload: () => void;
    pagination: {
        current: any;
        onChange: (pageNum: number) => void;
        total: number;
        pageSize: number;
    };
};
export {};
