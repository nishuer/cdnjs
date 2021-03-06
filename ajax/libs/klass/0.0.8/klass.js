/**
  * Klass.js - copyright @dedfat
  * https://github.com/polvero/klass
  * Follow our software http://twitter.com/dedfat
  * MIT License
  */
!function(context){
  var fnTest = /xyz/.test(function (){xyz;}) ? /\bsupr\b/ : /.*/,
      noop = function(){}, proto = 'prototype',
      isFn = function (o) {
        return typeof o === 'function';
      };

  function klass(o){
    var methods, _constructor = isFn(o) ? (methods = {}, o) : (methods = o, noop);
    return extend.call(_constructor, o, 1);
  };

  function extend(o, fromSub) {
    o = o || noop;
    var supr = this,
        _methods,
        _constructor = isFn(o) ? (_methods = {}, o) : (_methods = o, this),
        fn = function () {
          fromSub || isFn(o) && supr.apply(this, arguments);
          _constructor.apply(this, arguments);
        },
        prototype = new noop();

    fn.methods = function (prop) {
      for (var name in prop) {
        prototype[name] = isFn(prop[name]) &&
          isFn(supr[proto][name]) && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              this.supr = supr[proto][name];
              return fn.apply(this, arguments);
            };
          })(name, prop[name]) :
          prop[name];
      }

      fn[proto] = prototype;
      return this;
    }

    fn.methods.call(fn, _methods).constructor = this;
    fn.extend = arguments.callee;

    if (!fromSub) {
      for (var key in supr.prototype) {
        fn[proto][key] = supr.prototype[key];
      }
    }

    fn.statics = function (o) {
      for (var k in o) {
        o.hasOwnProperty(k) && (this[k] = o[k]);
      }
      return this;
    };

    function implement(name, f) {
      return function () {
        f.apply(this, arguments);
        return this;
      };
    }

    fn[proto].implement = function (ob) {
      for (var k in ob) {
        this[k] = implement(k, ob[k]);
      }
      return this;
    };

    return fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = klass;
  } else {
    context.klass = klass;
  }

}(this);
