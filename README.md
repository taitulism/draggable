[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
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

* **`top`** - Number. Initial top position in pixels.
* **`bottom`** - Number. Initial bottom position in pixels.
* **`left`** - Number. Initial left position in pixels.
* **`right`** - Number. Initial right position in pixels.
* **`axis`** - String. Restrict movement along a single axis, `'x'` or `'y'`.
* **`grip`** - Element | String (element selector). A grip handle element to activate draggability upon mouse down. By default you can start dragging from anywhere within the main element.
* **`classNamespace`** - String. A prefix for the `draggable` classname (`class="<prefix>-draggable"`). Use for avoiding conflicts with other draggable libraries, or just branding.

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

### **.moveTo({top, left, bottom, right})**
Sets the element position. The argument is an object containing one or more of the positioning properties:
* `top`
* `left`
* `bottom`
* `right`

> `top` and `left` are preferred over `bottom` and `right`, respectively.

### **.destroy()**
Kills the `Draggable` instance for good, unbinds events, releases element references.


## Classnames
For styling, the main element will be given the following classes:
* `'draggable'` - from initialization until destruction.
* `'dragging'` - on mouse down, until mouse up.

Any element that is set as a grip handle will be given the classname: `'drag-grip-handle'`.

&nbsp;

>### Position:
>On initialization, the target element will be placed inside the `<body>` element and will be given an inline style of `position: absolute`.
