import { createContext, Fragment, useContext, useMemo, useRef } from 'react';
import { View } from '@tarojs/components';
import clsx from 'clsx';
import { proxy, useSnapshot } from 'valtio';

export interface FairysTaroValtioFormLayoutContextOptions {
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
  borderedType?: 'bottom' | 'body';
}

export interface FairysTaroValtioFormLayoutProps extends FairysTaroValtioFormLayoutContextOptions {
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

export class FairysTaroValtioFormLayoutInstance {
  state = proxy<FairysTaroValtioFormLayoutContextOptions>({
    colCount: 1,
    errorLayout: 'right-bottom',
    labelMode: 'between',
    borderedType: 'bottom',
  });
  updated = (options: FairysTaroValtioFormLayoutContextOptions = {}) => {
    const keys = Object.keys(options);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      this.state[key] = options[key];
    }
  };
}

export const useFairysTaroValtioFormLayoutInstance = (instance?: FairysTaroValtioFormLayoutInstance) => {
  const ref = useRef<FairysTaroValtioFormLayoutInstance>();
  if (!ref.current) {
    if (instance) {
      ref.current = instance;
    } else {
      ref.current = new FairysTaroValtioFormLayoutInstance();
    }
  }
  return ref.current;
};

export const FairysTaroValtioFormLayoutContext = createContext<FairysTaroValtioFormLayoutInstance>(
  new FairysTaroValtioFormLayoutInstance(),
);

export const useFairysTaroValtioFormLayoutContext = () => {
  const instance = useContext(FairysTaroValtioFormLayoutContext);
  const state = useSnapshot(instance.state);
  return [state, instance] as const;
};

export function FairysTaroValtioFormLayout(props: FairysTaroValtioFormLayoutProps) {
  const formLayoutInstance = useFairysTaroValtioFormLayoutInstance();
  const [state] = useFairysTaroValtioFormLayoutContext();
  const parent_colCount = state.colCount || 1;
  const parent_errorLayout = state.errorLayout || 'right-bottom';
  const parent_labelMode = state.labelMode || 'between';
  const parent_formItemClassName = state.formItemClassName;
  const parent_formItemStyle = state.formItemStyle;
  const parent_formItemLabelClassName = state.formItemLabelClassName;
  const parent_formItemLabelStyle = state.formItemLabelStyle;
  const parent_formItemBodyClassName = state.formItemBodyClassName;
  const parent_formItemBodyStyle = state.formItemBodyStyle;
  const parent_borderedType = state.borderedType || 'bottom';

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
    borderedType = parent_borderedType,
    lastItemBordered = true,
    gap,
    title,
    extra,
    children,
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
        borderedType,
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
      borderedType,
    ],
  );

  const layoutCls = useMemo(
    () =>
      clsx(
        `fairys-taro-valtio-form-layout fairystaroform__text-[12px] fairystaroform__w-full fairystaroform__box-border fairystaroform__rounded-md`,
        {
          'fairys-taro-valtio-form-layout-all-col-span': isAllColSpan,
          'fairys-taro-form-valtio-layout-box-shadow': boxShadow,
          'fairystaroform__border fairystaroform__border-solid fairystaroform__border-gray-200': bordered,
          'fairys-taro-valtio-form-layout-last-item-no-border': !lastItemBordered,
        },
        className,
      ),
    [className, isAllColSpan, bordered, boxShadow, lastItemBordered],
  );

  const headerCls = useMemo(
    () =>
      clsx(
        `fairys-taro-valtio-form-layout-header fairystaroform__flex fairystaroform__justify-between fairystaroform__items-center fairystaroform__flex-row fairystaroform__py-[12px]  fairystaroform__border-b fairystaroform__border-b-solid fairystaroform__border-b-gray-200 fairystaroform__box-border`,
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
        `fairys-taro-valtio-form-layout-header-title fairystaroform__text-[14px] fairystaroform__font-bold fairystaroform__box-border`,
      ),
    [],
  );
  const headerExtraCls = useMemo(
    () => clsx(`fairys-taro-valtio-form-layout-header-extra fairystaroform__box-border`),
    [],
  );

  const body_base = useMemo(() => {
    return clsx(
      'fairys-taro-valtio-form-layout-body fairystaroform__px-[8px] fairystaroform__w-full fairystaroform__grid fairystaroform__gap-[2px] fairystaroform__box-border',
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

  return (
    <FairysTaroValtioFormLayoutContext.Provider value={formLayoutInstance}>
      <View className={layoutCls} style={style}>
        <View>
          {title || extra ? (
            <View style={headerStyle} className={headerCls}>
              <View className={headerTitleCls}>{title}</View>
              <View className={headerExtraCls}>{extra}</View>
            </View>
          ) : (
            <Fragment />
          )}
        </View>
        <View className={body_base} style={{ ...styleBase, ...bodyStyle }}>
          {children}
        </View>
      </View>
    </FairysTaroValtioFormLayoutContext.Provider>
  );
}
