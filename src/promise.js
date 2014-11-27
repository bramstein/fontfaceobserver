goog.provide('fontface.Promise');

goog.scope(function () {
  /**
   * Create a new Promise.
   *
   * @template T
   * @param {function(function(T),function(T))} executor
   * @constructor
   */
  fontface.Promise = function Promise(executor) {
    /**
     * @private
     * @type {fontface.Promise.State}
     */
    this.state = fontface.Promise.State.PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
      executor(function(x) {
        promise.resolve(x);
      }, function (r) {
        promise.reject(r);
      });
    } catch (e) {
      promise.reject(e);
    }
  };

  var Promise = fontface.Promise;

  /**
   * @private
   * @enum {number}
   */
  Promise.State = {
    RESOLVED: 0,
    REJECTED: 1,
    PENDING: 2
  };


  /**
   * Create a rejected Promise.
   * @param {*} r The reason for rejection.
   * @return {!fontface.Promise}
   */
  Promise.reject = function (r) {
    return new Promise(function (resolve, reject) {
      reject(r);
    });
  };

  /**
   * Create a resolved Promise.
   * @param {*} x The value to resolve the Promise with.
   * @return {!fontface.Promise}
   */
  Promise.resolve = function (x) {
    return new Promise(function (resolve, reject) {
      resolve(x);
    });
  };

  /**
   * Resolve this Promise.
   * @param {T} x The value to resolve the Promise with.
   * @private
   */
  Promise.prototype.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === Promise.State.PENDING) {
      if (x === promise) {
        throw new TypeError('Promise fulfilled with itself.');
      }

      var called = false;

      try {
        var then = x && x['then'];

        if (x !== null && typeof x === 'object' && typeof then === 'function') {
          then.call(x, function (x) {
            if (!called) {
              promise.resolve(x);
            }
            called = true;

          }, function (r) {
            if (!called) {
              promise.reject(r);
            }
            called = true;
          });
          return;
        }
      } catch (e) {
        if (!called) {
          promise.reject(e);
        }
        return;
      }
      promise.state = Promise.State.RESOLVED;
      promise.value = x;
      promise.notify();
    }
  };

  /**
   * Reject this Promise.
   * @private
   * @param {T} reason The reason for rejection.
   */
  Promise.prototype.reject = function reject(reason) {
    var promise = this;

    if (promise.state === Promise.State.PENDING) {
      if (reason === promise) {
        throw new TypeError('Promise fulfilled with itself.');
      }

      promise.state = Promise.State.REJECTED;
      promise.value = reason;
      promise.notify();
    }
  };

  /**
   * Notify all handlers of a change in state.
   * @private
   */
  Promise.prototype.notify = function notify() {
    var promise = this;

    setTimeout(function () {
      if (promise.state !== Promise.State.PENDING) {
        while (promise.deferred.length) {
          var deferred = promise.deferred.shift(),
              onResolved = deferred[0],
              onRejected = deferred[1],
              resolve = deferred[2],
              reject = deferred[3];

          try {
            if (promise.state === Promise.State.RESOLVED) {
              if (typeof onResolved === 'function') {
                resolve(onResolved.call(undefined, promise.value));
              } else {
                resolve(promise.value);
              }
            } else if (promise.state === Promise.State.REJECTED) {
              if (typeof onRejected === 'function') {
                resolve(onRejected.call(undefined, promise.value));
              } else {
                reject(promise.value);
              }
            }
          } catch (e) {
            reject(e);
          }
        }
      }
    }, 0);
  };

  /**
   * @param {function(T):*} onRejected Called when this Promise is rejected.
   * @return {!fontface.Promise}
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  /**
   * @param {function(T):*=} onResolved Called when this Promise is resolved.
   * @param {function(T):*=} onRejected Called when this Promise is rejected.
   * @return {!fontface.Promise}
   */
  Promise.prototype.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise(function (resolve, reject) {
      promise.deferred.push([onResolved, onRejected, resolve, reject]);
      promise.notify();
    });
  };

  /**
   * @param {Array.<!fontface.Promise>} iterable
   * @return {!fontface.Promise}
   */
  Promise.all = function all(iterable) {
    return new Promise(function (resolve, reject) {
      var count = 0,
          result = [];

      if (iterable.length === 0) {
        resolve(result);
      }

      function resolver(i) {
        return function (x) {
          result[i] = x;
          count += 1;

          if (count === iterable.length) {
            resolve(result);
          }
        };
      }

      for (var i = 0; i < iterable.length; i += 1) {
        iterable[i].then(resolver(i), reject);
      }
    });
  };

  /**
   * @param {Array.<!fontface.Promise>} iterable
   * @return {!fontface.Promise}
   */
  Promise.race = function race(iterable) {
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < iterable.length; i += 1) {
        iterable[i].then(resolve, reject);
      }
    });
  };
});
