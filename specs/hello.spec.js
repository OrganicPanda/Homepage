/*
* specs/hello.spec.js
*/
var hl = require("../hello.js");

// testing hello function
describe("hello", function() {
    it('returns "Hello world"', function() {
        expect(hl.hello()).toEqual("Hello world");
    });
});