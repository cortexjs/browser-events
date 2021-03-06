// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



it('remove-all-listeners', function() {
    var assert = require('assert');
    var EventEmitter = require('../index');

    function expect(expected) {
        var actual = [];

        function listener(name) {
            actual.push(name);
            if (actual.length > expected.length) {
                assert.fail('Exceed call times');
            } else if (actual.length == expected.length) {
                assert.deepEqual(actual.sort(), expected.sort());
            }
        }

        return listener;
    }

    function listener() {}

    var e1 = new EventEmitter();
    e1.on('foo', listener);
    e1.on('bar', listener);
    e1.on('baz', listener);
    e1.on('baz', listener);
    var fooListeners = e1.listeners('foo');
    var barListeners = e1.listeners('bar');
    var bazListeners = e1.listeners('baz');
    e1.on('removeListener', expect(['bar', 'baz', 'baz']));
    e1.removeAllListeners('bar');
    e1.removeAllListeners('baz');
    assert.deepEqual(e1.listeners('foo'), [listener]);
    assert.deepEqual(e1.listeners('bar'), []);
    assert.deepEqual(e1.listeners('baz'), []);
    // after calling removeAllListeners,
    // the old listeners array should stay unchanged
    assert.deepEqual(fooListeners, [listener]);
    assert.deepEqual(barListeners, [listener]);
    assert.deepEqual(bazListeners, [listener, listener]);
    // after calling removeAllListeners,
    // new listeners arrays are different from the old
    assert.notEqual(e1.listeners('bar'), barListeners);
    assert.notEqual(e1.listeners('baz'), bazListeners);

    var e2 = new EventEmitter();
    e2.on('foo', listener);
    e2.on('bar', listener);
    // expect LIFO order
    e2.on('removeListener', expect(['foo', 'bar', 'removeListener']));
    e2.on('removeListener', expect(['foo', 'bar']));
    e2.removeAllListeners();
    console.log(e2);
    assert.deepEqual([], e2.listeners('foo'));
    assert.deepEqual([], e2.listeners('bar'));

    var e3 = new EventEmitter();
    e3.on('removeListener', listener);
    // check for regression where removeAllListeners throws when
    // there exists a removeListener listener, but there exists
    // no listeners for the provided event type
    assert.doesNotThrow(function() {
        e3.removeAllListeners.call(e3, 'foo');
    });
});