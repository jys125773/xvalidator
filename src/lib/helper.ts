const toStr = Object.prototype.toString;

const TO_STRING_REG = /\[object\s(\w+)\]/;
const TO_STRING_MEMORIZE_MAP: Record<string, string> = {};
export function getType(value: any) {
  const typeKey = toStr.call(value);
  let type = TO_STRING_MEMORIZE_MAP[typeKey];
  if (!type) {
    const match = typeKey.match(TO_STRING_REG);
    type = match && match[1] ? match[1].toLowerCase() : '';
    if (type) {
      TO_STRING_MEMORIZE_MAP[typeKey] = type;
    }
  }
  return type;
}

export function isObject(value: any) {
  return getType(value) === 'object';
}

export function isArray(value: any) {
  return getType(value) === 'array';
}

const NATURAL_NUM_REG = /^(?:0|[1-9]\d*)$/;
export function isIndex(value: string | number) {
  return typeof value === 'string'
    ? NATURAL_NUM_REG.test(value)
    : value >= 0 && value % 1 === 0;
}

export function caskPath(path: string[] | string): string[] {
  if (typeof path === 'string') {
    return path
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
  }
  return path;
}

export function get(source: any, path: string[] | string, defaultValue?: any) {
  const paths = caskPath(path);
  const { length } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
}

export function merge(
  target: Record<string, any>,
  source: Record<string, any>,
) {
  let value: any, mergeValue: any;
  for (const prop in source) {
    if (source.hasOwnProperty(prop)) {
      value = target[prop];
      mergeValue = source[prop];
      if (isObject(mergeValue) && isObject(value)) {
        target[prop] = merge(value, mergeValue);
      } else {
        target[prop] = mergeValue;
      }
    }
  }
  return target;
}

export function compose(funcs: Function[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (arg: any) => a(b(arg)));
}
