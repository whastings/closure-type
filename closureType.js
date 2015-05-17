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
    var i, length, mixin, mixinType,
        apiObj = {};

    if (!mixins || !mixins.length) {
      return apiObj;
    }

    for (i = 0, length = mixins.length; i < length; i++) {
      mixin = mixins[i];
      mixinType = typeof mixin;
      if (mixinType === 'function') {
        mixin(instance, apiObj, initArgs);
      } else if (mixinType === 'object') {
        extendWithContext(apiObj, mixin, instance);
      }
    }

    return apiObj;
  }

  function extend(target, source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  }

  function extendWithContext(target, source, context) {
    var key, value;
    for (key in source) {
      if (source.hasOwnProperty(key)) {
        value = source[key];
        if (typeof value === 'function') {
          target[key] = value.bind(context);
        } else {
          target[key] = value;
        }
      }
    }
  }

  function withInitArgs(args, fn) {
    return function() {
      return fn.apply(null, args);
    };
  }

  extend(closureType, {
    extend: extend
  });

  return closureType;
}));
