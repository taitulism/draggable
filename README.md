[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/draggable.svg?branch=master)](https://travis-ci.org/taitulism/draggable)

Draggable
=========
Makes elements draggable. Vanilla style.

```js
const draggable = require('draggable');

const myElm = document.getElementById('target');

draggable(myElm, {options});
```

## Options

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
* **`'grab'`** - dragging started, on mouse down.
* **`'dragging'`** - moving around, on mouse move (with mouse down)
* **`'drop'`** - dragging stopped, on mouse up.

### **.destroy()**
Kills the `Draggable` instance for good, unbinds events, releases element references.


## Classnames
For styling, the main element will be given the following classes:
* `'draggable'` - from initialization until destruction.
* `'grabbed'` - when grabbing the element. On mouse down, before moving.
* `'dragging'` - when moving the element until mouse up.

&nbsp;

>### Position:
>On initialization, the target element will be placed inside the `<body>` element and will be given an inline style of `position: absolute`.
