import { useRef, createContext, useContext, useMemo } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { formatePath, formateName } from 'form/utils';
export interface FairysValtioFormParentAttrsState {
  name?: string;
}

/***
 * 父级属性
 */
export class FairysValtioFormParentAttrs {
  state = proxy<FairysValtioFormParentAttrsState>({
    name: '',
  });
  // ===================================================更新状态================================================================
  updated = (attrs: Record<string, any>) => {
    this.state = { ...this.state, ...attrs };
  };
  /***更新父级字段值*/
  updatedName = (name?: string, parentName?: string) => {
    this.state.name = formateName(name, parentName);
  };
}

/**初始化父级属性*/
export const useFairysValtioFormParentAttrs = (instance?: FairysValtioFormParentAttrs) => {
  const parentAttrs = useRef<FairysValtioFormParentAttrs>();
  if (!parentAttrs.current) {
    if (instance) {
      parentAttrs.current = instance;
    } else {
      parentAttrs.current = new FairysValtioFormParentAttrs();
    }
  }
  return parentAttrs.current;
};

/***父级属性上下文*/
export const FairysValtioFormParentAttrsContext = createContext<FairysValtioFormParentAttrs>(
  new FairysValtioFormParentAttrs(),
);

/***获取父级属性实例*/
export const useFairysValtioFormParentAttrsContext = () => useContext(FairysValtioFormParentAttrsContext);

/***获取父级属性状态*/
export const useFairysValtioFormParentAttrsState = () => {
  const instance = useFairysValtioFormParentAttrsContext();
  const state = useSnapshot(instance.state);
  return [state, instance] as const;
};

export interface FairysValtioFormAttrsNameOptions {
  name?: string;
  /**是否拼接父级字段名*/
  isJoinParentField?: boolean;
}

/***获取属性名和路径*/
export const useFairysValtioFormAttrsName = (options: FairysValtioFormAttrsNameOptions = {}) => {
  const { name, isJoinParentField = true } = options;
  const formAttrsNameInstance = useFairysValtioFormParentAttrs();
  const [state] = useFairysValtioFormParentAttrsState();
  const parentName = state.name;
  const _name = useMemo(
    () => (isJoinParentField ? formateName(name, parentName) : name),
    [name, parentName, isJoinParentField],
  );
  const _paths = useMemo(() => formatePath(_name), [_name]);
  useMemo(() => formAttrsNameInstance.updatedName(_name), [_name]);

  return {
    formAttrsNameInstance,
    parentName,
    name: _name,
    paths: _paths,
  };
};
