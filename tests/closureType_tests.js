'use strict';

var closureType = require('../closureType'),
    test = require('tape');

test('type', function(t) {
  t.test('a type returns the api object passed to the closure', function(st) {
    var apiObj,
        type;
    st.plan(1);

    type = closureType(function(self, api) {
      apiObj = api;
    });

    st.equal(type(), apiObj);
  });

  t.test('a type passes a function wrapping init args to the closure', function(st) {
    var type,
        instance;
    st.plan(1);

    type = closureType(function(self, api, initArgs) {
      api.init = initArgs(function(a, b, c, d) {
        return [a, b, c, d];
      });
    });

    instance = type('foo', 'bar', 'baz', 'qux');
    st.same(instance.init(), ['foo', 'bar', 'baz', 'qux']);
  });
});

test('mixins', function(t) {
  t.test('it invokes all mixins and closure w/ the same api object', function(st) {
    var type, api1, api2, api3;
    st.plan(2);

    function mixin1(self, api) {
      api1 = api;
    }

    function mixin2(self, api) {
      api2 = api;
    }

    type = closureType(function(self, api) {
      api3 = api;
    }, [mixin1, mixin2]);

    type();
    st.ok(api1 === api2);
    st.ok(api2 === api3);
  });

  t.test('it invokes all mixins and closure w/ same instance object', function(st) {
    var type, inst1, inst2, inst3;
    st.plan(2);

    function mixin1(self) {
      inst1 = self;
    }

    function mixin2(self) {
      inst2 = self;
    }

    type = closureType(function(self) {
      inst3 = self;
    }, [mixin1, mixin2]);

    type();
    st.ok(inst1 === inst2);
    st.ok(inst2 === inst3);
  });

  t.test('it invokes all mixins from left to right before running the closure', function(st) {
    var order = [],
        type,
        instance;
    st.plan(4);

    function mixin1(self, api) {
      api.mixin1Method = function() {};
      order.push(1);
    }

    function mixin2(self, api) {
      api.mixin2Method = function() {};
      order.push(2);
    }

    type = closureType(function(self, api) {
      api.typeMethod = function() {};
      order.push(3);
    }, [mixin1, mixin2]);

    instance = type();
    st.same(order, [1, 2, 3]);
    ['mixin1Method', 'mixin2Method', 'typeMethod'].forEach(function(method) {
      st.ok(typeof instance[method] === 'function');
    });
  });

  t.test('it binds all own methods of an object mixin to the instance', function(st) {
    var type, instance, instanceContext, context1, context2, mixinObj;
    st.plan(2);

    mixinObj = {
      method1: function() {
        context1 = this;
      },
      method2: function() {
        context2 = this;
      }
    };

    type = closureType(function(self) {
      instanceContext = self;
    }, [mixinObj]);

    instance = type();
    instance.method1();
    instance.method2();
    st.ok(context1 === context2);
    st.ok(context2 === instanceContext);
  });
});
