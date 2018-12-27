var assert = require('assert');

describe('match', function() {
  describe('type checking', function() {
    it('it should match basic types if string as arg', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});