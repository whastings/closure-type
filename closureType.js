(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.closureType = factory();
  }
}(this, function () {
  function closureType(closure, mixins) {
    return function() {
      var instance = {},
          initArgs = withInitArgs.bind(null, arguments),
          apiObj = applyMixins(mixins, instance, initArgs);

      closure(instance, apiObj, initArgs);

      return apiObj;
    };
  }

  function applyMixins(mixins, instance, initArgs) {
    var i, length,
        apiObj = {};

    if (!mixins || !mixins.length) {
      return apiObj;
    }

    for (i = 0, length = mixins.length; i < length; i++) {
      mixins[i](instance, apiObj, initArgs);
    }

    return apiObj;
  }

  function withInitArgs(args, fn) {
    return function() {
      return fn.apply(null, args);
    };
  }

  return closureType;
}));
