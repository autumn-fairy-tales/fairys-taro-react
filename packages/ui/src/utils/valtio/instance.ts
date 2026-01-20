import { proxy, ref } from 'valtio';
import React from 'react';

/**
 * 单个proxy对象数据基础实例封装
 */
export class ProxyInstanceObjectBase<T extends Object = any> {
  /**不使用ref存储的字段*/
  notRefFields: string[] = [];
  /**proxy 可状态更新字段 */
  store = proxy<T>({} as T);
  /**初始化存储值*/
  _ctor = (inital?: Partial<T>, fields?: string[]) => {
    this._setValues(inital || {}, fields);
    return this;
  };
  /**更新store数据 循环对象进行存储，当值是对象的时候存储为ref*/
  _setValues = <K = T>(values: Partial<K>, fields?: string[]) => {
    if (!this.store) {
      this.store = proxy({}) as T;
    }
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(fields) && fields.includes(key)) {
        this.store[key] = values[key];
      } else if (Array.isArray(this.notRefFields) && this.notRefFields.includes(key)) {
        this.store[key as keyof T] = value;
      } else if (React.isValidElement(value) || typeof value === 'function') {
        this.store[key] = ref(values[key]);
      } else if (typeof value === 'object' && value !== null) {
        this.store[key] = ref(values[key]);
      } else {
        this.store[key] = values[key];
      }
    });
    return this;
  };

  /**删除字段值*/
  _deleteValue = (names: string | string[]) => {
    if (Array.isArray(names)) {
      let cacheValue = this.store;
      const newNames = [...names];
      const lastField = newNames.pop();
      for (let index = 0; index < newNames.length; index++) {
        cacheValue = cacheValue[newNames[index]];
      }
      if (cacheValue && lastField) {
        delete cacheValue[lastField];
      }
    } else {
      delete this.store[names];
    }
    return this;
  };

  /**创建 ref 对象 (ref对象不做监听更新)*/
  _createRef = <K extends Object = any>(inital?: K) => {
    return ref<K>(inital || ({} as K)) as K;
  };
}
