define(function() {

  "use strict";

  return function(callback, wait, scope) {
    var last, timestamp, timeout, context, args;

    return function() {
      last = Date.now() - timestamp;

      if (last < wait) return;

      clearTimeout(timeout);
      context = scope || this;
      args = arguments;
      timestamp = Date.now();
      timeout = setTimeout(function() {
        callback.apply(context, args);
        context = args = null;
      }, wait);
    };
  };

});
