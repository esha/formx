(function(D) {
/*
======== A Handy Little QUnit Reference ========
http://api.qunitjs.com/

Test methods:
  module(name, {[setup][ ,teardown]})
  test(name, callback)
  expect(numberOfAssertions)
  stop(increment)
  start(decrement)
Test assertions:
  ok(value, [message])
  equal(actual, expected, [message])
  notEqual(actual, expected, [message])
  deepEqual(actual, expected, [message])
  notDeepEqual(actual, expected, [message])
  strictEqual(actual, expected, [message])
  notStrictEqual(actual, expected, [message])
  throws(block, [expected], [message])
*/
    module("ajax");

    test("don't cause page reload", function() {
        expect(8);
        var form = D.query('form[ajax]');
        ok(form);
        equal(form.getAttribute('ajax'), 'ready');
        ok(!form.matches('.invalid'));

        form.setAttribute('action', 'ajaxTest');
        window.ajaxTest = function(values, e) {
            ok(values);
            strictEqual(form, this);
            equal(e.type, 'submit');
        };

        var button = form.query('button');
        ok(button);
        equal(button.type, 'submit');
        button.click();
        delete window.ajaxTest;
    });

}(document));
