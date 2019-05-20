const SimplePromise = require('./SimplePromise');

// adapter used by the Promises/A+ tests
module.exports = {
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
