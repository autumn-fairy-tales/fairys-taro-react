import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from './instance';
export * from './instance';

/**创建简单的状态管理*/
export const useValtioState = <T extends object>(inital?: T) => {
  const instance = useRef(new ProxyInstanceObjectBase<T>()._ctor(inital)).current;
  const state = useSnapshot(instance.store);
  const dispatch = (value: Partial<T>) => {
    instance._setValues(value);
  };
  return [state, dispatch, instance, (state as any).__defaultValue] as const;
};

export const useValtioInstaceState = <
  T extends object = any,
  K extends ProxyInstanceObjectBase<T> = ProxyInstanceObjectBase<T>,
  M extends { new (...args: any[]): K } = { new (...args: any[]): K },
>(
  Instance: M,
) => {
  const instance = useRef(new Instance()).current;
  const state = useSnapshot(instance.store);
  const dispatch = (value: Partial<T>) => {
    instance._setValues(value);
  };

  return [state, dispatch, instance, (state as any).__defaultValue] as const;
};
