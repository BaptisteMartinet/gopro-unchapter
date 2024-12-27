export function makeArrayUniq<T>(arr: ReadonlyArray<T>) {
  return Array.from(new Set(arr));
}

export function indexMultipleArrayItems<T>(
  arr: Iterable<T>,
  getItemKey: (item: T) => string
) {
  const map = new Map<string, Array<T>>();

  for (const item of arr) {
    const key = getItemKey(item);
    const val = map.get(key);
    if (val) {
      val.push(item);
      continue;
    }
    map.set(key, [item]);
  }
  return map;
}
