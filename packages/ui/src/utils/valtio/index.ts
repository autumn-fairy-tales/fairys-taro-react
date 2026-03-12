import { useRef } from 'react';
import { useSnapshot, proxy } from 'valtio';
import { ProxyInstanceObjectBase, useProxyInstanceObjectBase } from './instance';
export * from './instance';
export * from './context';

/**创建简单的状态管理*/
export const useValtioState = <T extends object>(inital?: T) => {
  const instance = useProxyInstanceObjectBase(inital);
  const state = useSnapshot(instance.store);
  return [state, instance, (state as any).__defaultValue] as [T, ProxyInstanceObjectBase<T>, any];
};

const usNewInstance = <
  T extends object = any,
  K extends ProxyInstanceObjectBase<T> = ProxyInstanceObjectBase<T>,
  M extends { new (...args: any[]): K } = { new (...args: any[]): K },
>(
  Instance: M,
) => {
  const ref = useRef<K>();
  if (!ref.current) {
    ref.current = new Instance();
  }
  return ref.current;
};

export const useValtioInstaceState = <
  T extends object = any,
  K extends ProxyInstanceObjectBase<T> = ProxyInstanceObjectBase<T>,
  M extends { new (...args: any[]): K } = { new (...args: any[]): K },
>(
  Instance: M,
) => {
  const instance = usNewInstance<T, K, M>(Instance);
  const state = useSnapshot(instance.store);
  return [state, instance, (state as any).__defaultValue] as [T, K, any];
};

/**
 * 创建valtio proxy 状态管理
 */
export const useValtioProxyState = <T extends object>(inital?: T) => {
  const instance = useRef<T>();
  if (!instance.current) {
    instance.current = proxy(inital || ({} as T));
  }
  const state = useSnapshot(instance.current);
  return [state, instance.current, (state as any).__defaultValue] as [T, T, any];
};
