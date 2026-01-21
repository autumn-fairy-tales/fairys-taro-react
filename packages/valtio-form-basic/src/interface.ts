export type MObject<T> = {
  [K in keyof T]: T[K];
};
export type MakeFieldRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
