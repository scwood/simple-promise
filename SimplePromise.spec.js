const assert = require('assert');
const promisesAplusTests = require('promises-aplus-tests');
const {describe, it} = require('mocha');
const SimplePromise = require('./SimplePromise');

describe('Promises/A+ Tests', () => {
  const adapter = {
    resolved: SimplePromise.resolve,
    rejected: SimplePromise.reject,
    deferred: () => {
      let resolve;
      let reject;
      return {
        promise: new SimplePromise((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        }),
        resolve,
        reject,
      };
    },
  };
  promisesAplusTests.mocha(adapter);
});

describe('SimplePromise.all', () => {
  it('should throw TypeError when given non-iterable', () => {
    return assert.rejects(SimplePromise.all(4), {name: 'TypeError'});
  });

  it('should take iterable and resolve with array of values', () => {
    const iterable = 'hello';
    const expectedValues = ['h', 'e', 'l', 'l', 'o'];
    return SimplePromise.all(iterable).then(assertDeepEqual(expectedValues));
  });

  it('should resolve an array of promises to an array of values', () => {
    const promises = [delayedResolve(1), delayedResolve(2), delayedResolve(3)];
    const expectedValues = [1, 2, 3];
    return SimplePromise.all(promises).then(assertDeepEqual(expectedValues));
  });

  it('should reject with the first rejected value', () => {
    const error = new Error('failed!');
    const promises = [
      delayedResolve(),
      SimplePromise.reject(error),
      delayedResolve(),
    ];
    return assert.rejects(SimplePromise.all(promises), error);
  });
});

describe('Promise.resolve', () => {
  it('should take a primitive and return a resolved promise', () => {
    const expectedValue = 4;
    return SimplePromise.resolve(expectedValue).then(
      assertDeepEqual(expectedValue),
    );
  });

  it('should take a promise and resolve to the inner promises eventual state', () => {
    const expectedValue = 'test';
    const promise = delayedResolve(expectedValue);
    return SimplePromise.resolve(promise).then(assertDeepEqual(expectedValue));
  });
});

describe('Promise.reject', () => {
  it('should take a value and return a rejected promise with that value', () => {
    const error = new Error('test');
    return assert.rejects(SimplePromise.reject(error), error);
  });
});

function delayedResolve(value) {
  return new SimplePromise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 100);
  });
}

function assertDeepEqual(expectedValue) {
  return (value) => assert.deepEqual(expectedValue, value);
}
