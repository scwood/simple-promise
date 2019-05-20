function SimplePromise(resolver) {
  const STATES = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
  };
  let currentState = STATES.PENDING;
  let finalValue;
  const consumers = [];

  if (!isFunction(resolver)) {
    throw new TypeError(`Promise resolver ${resolver} is not a function`);
  }
  resolver(resolve.bind(this), reject);

  this.then = (onFulfilled, onRejected) => {
    return new SimplePromise((resolve, reject) => {
      consumers.push({resolve, reject, onFulfilled, onRejected});
      broadcast();
    });
  };

  this.catch = (onRejected) => {
    return this.then(undefined, onRejected);
  };

  function fulfill(value) {
    transition(STATES.FULFILLED, value);
  }

  function reject(reason) {
    transition(STATES.REJECTED, reason);
  }

  function transition(state, value) {
    if (!isPending()) {
      return;
    }
    currentState = state;
    finalValue = value;
    broadcast();
  }

  function resolve(value) {
    if (this === value) {
      throw new TypeError('Resolved value is promise itself');
    } else if (value instanceof SimplePromise) {
      value.then(resolve, reject);
    } else if (isFunction(value) || isObject(value)) {
      let then;
      let wasCalled = false;
      try {
        then = value.then;
        if (isFunction(then)) {
          then.call(
            value,
            (y) => {
              if (!wasCalled) {
                wasCalled = true;
                resolve(y);
              }
            },
            (r) => {
              if (!wasCalled) {
                wasCalled = true;
                reject(r);
              }
            },
          );
        } else {
          fulfill(value);
        }
      } catch (error) {
        if (!wasCalled) {
          reject(error);
        }
      }
    } else {
      fulfill(value);
    }
  }

  function broadcast() {
    if (isPending()) {
      return;
    }
    setTimeout(() => {
      consumers.splice(0).forEach((consumer) => {
        const callback = isFulfilled()
          ? consumer.onFulfilled
          : consumer.onRejected;
        if (isFunction(callback)) {
          try {
            consumer.resolve(callback(finalValue));
          } catch (error) {
            consumer.reject(error);
          }
        } else if (isFulfilled()) {
          consumer.resolve(finalValue);
        } else {
          consumer.reject(finalValue);
        }
      });
    });
  }

  function isPending() {
    return currentState === STATES.PENDING;
  }

  function isFulfilled() {
    return currentState === STATES.FULFILLED;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function isObject(value) {
    return value === Object(value);
  }
}

SimplePromise.resolve = (value) => {
  return new SimplePromise((resolve) => resolve(value));
};

SimplePromise.reject = (reason) => {
  return new SimplePromise((resolve, reject) => reject(reason));
};

SimplePromise.all = (values) => {
  return new SimplePromise((resolve, reject) => {
    let numResolved = 0;
    const results = [];
    const promises = values.map((v) => SimplePromise.resolve(v));
    promises.forEach((promise, i) => {
      promise
        .then((value) => {
          results[i] = value;
          numResolved++;
          if (numResolved === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};

module.exports = SimplePromise;
