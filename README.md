[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
[![Build Status](https://travis-ci.org/taitulism/draggable.svg?branch=develop)](https://travis-ci.org/taitulism/draggable)

draggable-elm
=============
Makes elements draggable. Vanilla style.

```js
const draggable = require('draggable-elm');

const myElm = document.getElementById('target');

draggable(myElm, {options});
```

## Options

* **`classname`** - String. A replacement for the `draggable` classname.
* **`axis`** - String. Restrict movement along a single axis, `'x'` or `'y'`.
* **`grip`** - Element | String (element selector). A grip handle element to activate draggability upon mouse down. By default you can start dragging from anywhere within the main element.

## API
Calling the `draggable()` function returns a `Draggable` instance: 
```js
const d = draggable(elm);
```
It has the following methods:

### **.enable() / .disable()**
Toggle draggability. When disabled, the main element gets a `'drag-disabled'` classname.

### **.setGrip(newGrip)**
Sets a new grip handle. Argument could be either an HTML Element or an element selector string (e.g. `'#my-grip'`). See the `grip` option above.

### **.on(eventName, callback)**
Listen to drag and drop events:
* **`'drag-start'`** - dragging started, on mouse down.
* **`'dragging'`** - moving around, on mouse move (with mouse down)
* **`'drag-stop'`** - dragging stopped, on mouse up.

**Event Aliases**  
For extra convenience, anything that contains `start`, `stop`/`end`/`drop` or `ing` will match its respective event.

### **.moveBy(x, y)**
Sets the element **relative position**. It utilizes css `translate(x, y)`.
Does not accumulate. Every call sets the element position relative to its original position and not relative to its current position.
This method wan't made to be used during an active dragging, but for one-time positioning.

### **.destroy()**
Kills the `Draggable` instance for good, unbinds events, releases element references.


## Classnames
For styling, the main element will be given the following classes:
* `'draggable'` - from initialization until destruction.
* `'dragging'` - on mouse down, until mouse up.

Any element that is set as a grip handle will be given the classname: `'drag-grip-handle'`.
