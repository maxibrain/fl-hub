import * as _ from 'lodash';

export function getObjectPatch<T>(object: T, base: T): Partial<T> {
  const changes = <R extends _.Dictionary<any>>(o: R, b: R) => {
    let arrayIndexCounter = 0;
    const isArray = _.isArray(b);
    return _.transform(o, (result, value, key) => {
      if (!_.isEqual(value, b[key])) {
        const resultKey = isArray ? arrayIndexCounter++ : key;
        result[resultKey] = _.isObject(value) && _.isObject(b[key]) ? changes(value, b[key]) : value;
      }
    });
  };
  return changes(object, base) as Partial<T>;
}

export function applyObjectPatch<T>(object: T, patch: Partial<T>): T {
  return _.merge(object, patch);
}

export function applyObjectPatches<T>(object: T, patches: Array<Partial<T>>): T {
  return patches.reduce((acc, current) => applyObjectPatch(acc, current), object) as T;
}

export function createObjectFromPatches<T>(patches: Array<Partial<T>>): T {
  return applyObjectPatches(null, patches);
}

export function isEmpty(object: any): boolean {
  return _.isEmpty(object);
}
