export default function(promise) {
  var cancellable = new CancellablePromise(function(resolve, reject) {
    promise.then(function(value) {
      ifNotCancelled(cancellable, resolve, value)
    }, function(value) {
      ifNotCancelled(cancellable, reject, value)
    })
  })
  return cancellable;
}

class CancellablePromise extends Promise {
  cancel() {
    cancelledPromises.set(this, true)
  }
}

var cancelledPromises = new WeakMap()

function ifNotCancelled(promise, fn, value) {
  if (!cancelledPromises.has(promise)) {
    fn(value)
  }
}
