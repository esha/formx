(function(D, FORMx) {
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
    module("validate API");

    test('FORMx', function() {
        ok(FORMx, "FORMx should be present");
    });

    test("FORMx.validate", function() {
        ok(FORMx.validate, "FORMx.validate should be present");
    });

}(document, window.FORMx));

