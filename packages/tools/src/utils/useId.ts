import { useRef, useMemo } from 'react';
let localId = 0;

export const createUseId = (suffix: string = 'D') => {
  const count = localId++;
  return `FAIRYS_TARO_UI_${count.toString(32)}_${suffix}`;
};

export const useId = (suffix: string = 'D') => {
  const count = useRef(localId++);
  return useMemo(() => {
    return `FAIRYS_TARO_UI_${count.current.toString(32)}_${suffix}`;
  }, [count.current]);
};
