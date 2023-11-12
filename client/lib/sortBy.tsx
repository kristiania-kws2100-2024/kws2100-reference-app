export function sortBy<T>(fn: (p: T) => string) {
  return function (a: T, b: T) {
    return fn(a).localeCompare(fn(b));
  };
}
