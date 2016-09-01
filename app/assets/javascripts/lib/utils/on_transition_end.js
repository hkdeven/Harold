// takes a listener, a function and an optional delay
define([], function() {

  "use strict";

  return function(args) {
    var $listener = args.$listener,
        delay = args.delay,

        // Ignore any bubbled events
        fn = function(e) {
          $listener[0] == e.target && args.fn();
        };

    if (window.lp.supports.transitionend) {
      $listener.on(window.lp.supports.transitionend, fn);
    } else {
      setTimeout(fn, delay | 0);
    }
  };

});
