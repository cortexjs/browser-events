# events [![Build Status](https://travis-ci.org/cortexjs/browser-events.png?branch=master)](https://travis-ci.org/cortexjs/browser-events)

A port of 'events' for cortex from node.js, make your node code run in browsers.

## Documentation

[Node.js Events](http://nodejs.org/api/events.html)

## Usage

```js
function MyConstructor () {}
var util = require('util');
var events = require('events');
util.inherits(MyConstructor, events);
```

### What's the main difference with neuron 1.0 events ?

#### No arguments overloading for method `.on` 

neuron 1.0:
```js
instance.on({
  event1: function(){},
  event2: function(){}
});
```

events:
```js
instance
  .on('event1', function(){})
  .on('event2', function(){})
```

#### Method `.off` no longer exists

`.off()` -> `removeAllListeners()`

`.off(event)` -> `removeAllListeners(event)`

`.off(event, listener)` -> `removeListener(event, listener)`

```js
// neuron 1.0
instance.off({
  event1: listener1,
  event2: listener2
});

// events
instance
  .removeListener(event1, listener1)
  .removeListener(event2, listener2)
```
