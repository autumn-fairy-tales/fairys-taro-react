import { createContext, useContext, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { proxy, useSnapshot } from 'valtio';

export interface FairysValtioFormLayoutContextOptions {
  /**列数据*/
  colCount?: number;
  /**规则校验失败错误提示位置*/
  errorLayout?: 'left-bottom' | 'right-bottom' | 'top-right' | 'top-left';
  /**
   * label显示模式
   * @platform taro 支持 between
   */
  labelMode?: 'left' | 'top' | 'between';
  /**表单项 className*/
  formItemClassName?: string;
  /**表单项 style*/
  formItemStyle?: React.CSSProperties;
  /**表单项 label  className*/
  formItemLabelClassName?: string;
  /**表单项 label  style*/
  formItemLabelStyle?: React.CSSProperties;
  /**表单项 body  className*/
  formItemBodyClassName?: string;
  /**表单项 body  style*/
  formItemBodyStyle?: React.CSSProperties;
  /**
   * 底部边框类型
   */
  itemBorderType?: 'bottom' | 'body';
  /**边框颜色*/
  itemBorderColor?: React.CSSProperties['borderColor'];
}

export interface FairysValtioFormLayoutAttrsProps extends FairysValtioFormLayoutContextOptions {
  /**
   * @description gap 属性是用来设置网格行与列之间的间隙，该属性是row-gap and column-gap的简写形式。
   */
  gap?: string | number;
  /**标题*/
  title?: React.ReactNode;
  /**额外内容*/
  extra?: React.ReactNode;
  /**内容*/
  children?: React.ReactNode;
  /**是否占据整行*/
  isAllColSpan?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /**头部ClassName*/
  headerClassName?: string;
  /**头部样式*/
  headerStyle?: React.CSSProperties;
  /**内容ClassName*/
  bodyClassName?: string;
  /**内容样式*/
  bodyStyle?: React.CSSProperties;
  /**是否边框*/
  bordered?: boolean;
  /**显示阴影*/
  boxShadow?: boolean;
  /**最后一个是否显示底部边框*/
  lastItemBordered?: boolean;
}

export class FairysValtioFormLayoutInstance {
  state = proxy<FairysValtioFormLayoutContextOptions>({
    colCount: 1,
    errorLayout: 'right-bottom',
    labelMode: 'between',
    itemBorderType: 'bottom',
  });
  updated = (options: FairysValtioFormLayoutContextOptions = {}) => {
    const keys = Object.keys(options);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      this.state[key] = options[key];
    }
  };
}

export const useFairysValtioFormLayoutInstance = (instance?: FairysValtioFormLayoutInstance) => {
  const ref = useRef<FairysValtioFormLayoutInstance>();
  if (!ref.current) {
    if (instance) {
      ref.current = instance;
    } else {
      ref.current = new FairysValtioFormLayoutInstance();
    }
  }
  return ref.current;
};

export const FairysValtioFormLayoutContext = createContext<FairysValtioFormLayoutInstance>(
  new FairysValtioFormLayoutInstance(),
);

export const useFairysValtioFormLayoutContext = () => {
  const instance = useContext(FairysValtioFormLayoutContext);
  const state = useSnapshot(instance.state);
  return [state, instance] as const;
};

/**
 * 布局属性处理
 * 
 * @example
 * 
 * ```tsx
import { Fragment } from 'react'
import { useFairysValtioFormLayoutAttrs, FairysValtioFormLayoutContext } from "@fairys/valtio-form"
import type { FairysValtioFormLayoutAttrsProps } from "@fairys/valtio-form"

export interface LayoutProps extends FairysValtioFormLayoutAttrsProps {}

export const Layout = (props: LayoutProps) => {
  const { children, title, extra } = props
  const { 
    formLayoutInstance,
    layoutName, layoutStyle,
    headerName, headerStyle,
    headerTitleName, headerExtraName,
    bodyName, bodyStyle
  } = useFairysValtioFormLayoutAttrs(props)

   return (
     <FairysValtioFormLayoutContext.Provider value={formLayoutInstance}>
       <div className={layoutName} style={layoutStyle}>
         <div>
           {title || extra ? (
             <div style={headerStyle} className={headerName}>
               <div className={headerTitleName}>{title}</div>
               <div className={headerExtraName}>{extra}</div>
             </div>
           ) : (
             <Fragment />
           )}
         </div>
         <div className={bodyName} style={bodyStyle}>
           {children}
         </div>
       </div>
     </FairysValtioFormLayoutContext.Provider>
   );
}
  ```
 * 
*/
export function useFairysValtioFormLayoutAttrs(props: FairysValtioFormLayoutAttrsProps) {
  const formLayoutInstance = useFairysValtioFormLayoutInstance();
  const [state] = useFairysValtioFormLayoutContext();
  const parent_colCount = state.colCount || 1;
  const parent_errorLayout = state.errorLayout || 'right-bottom';
  const parent_labelMode = state.labelMode || 'between';
  const parent_formItemClassName = state.formItemClassName;
  const parent_formItemStyle = state.formItemStyle;
  const parent_formItemLabelClassName = state.formItemLabelClassName;
  const parent_formItemLabelStyle = state.formItemLabelStyle;
  const parent_formItemBodyClassName = state.formItemBodyClassName;
  const parent_formItemBodyStyle = state.formItemBodyStyle;
  const parent_borderedType = state.itemBorderType || 'bottom';
  const parent_itemBorderColor = state.itemBorderColor;

  const {
    colCount = parent_colCount,
    errorLayout = parent_errorLayout,
    labelMode = parent_labelMode,
    formItemClassName = parent_formItemClassName,
    formItemStyle = parent_formItemStyle,
    formItemLabelClassName = parent_formItemLabelClassName,
    formItemLabelStyle = parent_formItemLabelStyle,
    formItemBodyClassName = parent_formItemBodyClassName,
    formItemBodyStyle = parent_formItemBodyStyle,
    itemBorderType = parent_borderedType,
    itemBorderColor = parent_itemBorderColor,
    lastItemBordered = true,
    gap,
    isAllColSpan = false,
    className,
    style,
    headerClassName,
    headerStyle,
    bodyClassName,
    bodyStyle,
    bordered,
    boxShadow,
  } = props;

  useMemo(
    () =>
      formLayoutInstance.updated({
        colCount,
        errorLayout,
        labelMode,
        formItemClassName,
        formItemStyle,
        formItemLabelClassName,
        formItemLabelStyle,
        formItemBodyClassName,
        formItemBodyStyle,
        itemBorderType,
        itemBorderColor,
      }),
    [
      colCount,
      errorLayout,
      labelMode,
      formItemClassName,
      formItemStyle,
      formItemLabelClassName,
      formItemLabelStyle,
      formItemBodyClassName,
      formItemBodyStyle,
      itemBorderType,
      itemBorderColor,
    ],
  );

  const layoutCls = useMemo(
    () =>
      clsx(
        `fairys-valtio-form-layout fairystaroform__text-[12px] fairystaroform__w-full fairystaroform__box-border fairystaroform__rounded-md`,
        {
          'fairys-valtio-form-layout-all-col-span': isAllColSpan,
          'fairys-taro-form-valtio-layout-box-shadow': boxShadow,
          'fairystaroform__border fairystaroform__border-solid fairystaroform__border-gray-200': bordered,
          'fairys-valtio-form-layout-last-item-no-border': !lastItemBordered,
        },
        className,
      ),
    [className, isAllColSpan, bordered, boxShadow, lastItemBordered],
  );
  const headerCls = useMemo(
    () =>
      clsx(
        `fairys-valtio-form-layout-header fairystaroform__flex fairystaroform__justify-between fairystaroform__items-center fairystaroform__flex-row fairystaroform__py-[12px]  fairystaroform__border-b fairystaroform__border-b-solid fairystaroform__border-b-gray-200 fairystaroform__box-border`,
        {
          'fairystaroform__px-[8px]': bordered || boxShadow,
          'fairystaroform__px-[4px]': !bordered && !boxShadow,
        },
        headerClassName,
      ),
    [headerClassName, bordered, boxShadow],
  );
  const headerTitleCls = useMemo(
    () =>
      clsx(
        `fairys-valtio-form-layout-header-title fairystaroform__text-[14px] fairystaroform__font-bold fairystaroform__box-border`,
      ),
    [],
  );
  const headerExtraCls = useMemo(() => clsx(`fairys-valtio-form-layout-header-extra fairystaroform__box-border`), []);

  const body_base = useMemo(() => {
    return clsx(
      'fairys-valtio-form-layout-body fairystaroform__px-[8px] fairystaroform__w-full fairystaroform__grid fairystaroform__gap-[2px] fairystaroform__box-border',
      bodyClassName,
    );
  }, [bodyClassName]);

  const styleBase = useMemo(() => {
    const css: React.CSSProperties = {};
    if (typeof gap === 'string') {
      css.gap = gap;
    }
    if (typeof gap === 'number') {
      css.gap = `${gap}px`;
    }
    if (colCount) {
      css.gridTemplateColumns = `repeat(${colCount}, auto)`;
    }
    return css;
  }, [colCount, gap]);

  return {
    colCount,
    errorLayout,
    labelMode,
    itemBorderType,
    formLayoutInstance,
    //======================
    layoutName: layoutCls,
    layoutStyle: style,
    //======================
    headerName: headerCls,
    headerStyle: headerStyle,
    headerTitleName: headerTitleCls,
    headerExtraName: headerExtraCls,
    //======================
    bodyName: body_base,
    bodyStyle: { ...styleBase, ...bodyStyle },
  } as FairysValtioFormLayoutAttrsReturn;
}

export interface FairysValtioFormLayoutAttrsReturn {
  /**列数*/
  colCount: number;
  /**规则校验失败错误提示位置*/
  errorLayout: string;
  /**
   * label显示模式
   * @platform taro 支持 between
   */
  labelMode: string;
  /**
   * 底部边框类型
   */
  itemBorderType: string;
  /**表单布局实例*/
  formLayoutInstance: FairysValtioFormLayoutInstance;
  /**布局ClassName*/
  layoutName: string;
  /**布局样式*/
  layoutStyle: React.CSSProperties;
  /**头部ClassName*/
  headerName: string;
  /**头部样式*/
  headerStyle: React.CSSProperties;
  /**头部标题ClassName*/
  headerTitleName: string;
  /**头部额外内容ClassName*/
  headerExtraName: string;
  /**内容ClassName*/
  bodyName: string;
  /**内容样式*/
  bodyStyle: React.CSSProperties;
}
