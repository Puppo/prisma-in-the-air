export type Sorting<T, K extends keyof T = keyof T> = ReadonlyArray<
  [K, "asc" | "desc"]
>;
