export function isEqual(obj1: any, obj2: any): boolean {
  //
  if (obj1 === obj2) {
    return true;
  }

  const isObj1 = Object.prototype.toString.call(obj1) == '[object Object]';
  const isObj2 = Object.prototype.toString.call(obj2) == '[object Object]';
  if ((!isObj1 && !Array.isArray(obj1)) || (!isObj2 && !Array.isArray(obj2))) {
    return false;
  }

  if (obj1.length !== obj2.length) {
    return false;
  }

  for (const key of Object.keys(obj1)) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
