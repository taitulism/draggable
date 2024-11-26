[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
![Build Status](https://github.com/taitulism/draggable/actions/workflows/ci.yml/badge.svg)

draggable-elm
=============
Makes elements draggable. Vanilla style.

## Basic Usage
```html
<!-- HTML -->
<body>
	<div data-drag-role="draggable"></div>
</body>
```

```js
// js / ts
import {draggable} from 'draggable-elm';

draggable(contextElm?: HTMLElement);
```


### Context Element
Default - `document.body`

>NOTE: The context element is not necessarily a draggable element.

Calling the `draggable()` function binds a *single* event listener on the context element. By default it's the `<body>` element but you can pass in another element. This starts listenening to `pointerdown` events on draggable elements within that context element.

A "draggable element" is an element that has the `data-drag-role` attribute set to `"draggable"`.

If all you need is a single draggable element you can pass in such element to the `draggable()` function:

```html
<body>
	<div id="popup" data-drag-role="draggable"></div>
</body>
```

```js
import {draggable} from 'draggable-elm';

const popup = document.getElementById('popup');

draggable(popup);
```

## Data Attributes
Using different data attributes you can control the dragging behavior.

* `data-drag-role` - Possible values:
	* `"draggable"` - Makes the element draggable.
	* `"grip"` - The element becomes the handle of a draggable element. When used, users can only drag draggable elements by their grip element. Must be a descendant of a draggable element (throws an error when it's not).
&nbsp;

`data-drag-role="draggable"` can be used together with the following data attributes:
* `data-drag-axis`
	* `'x'` - Limit dragging movment along the `x` axis.
	* `'y'` - Limit dragging movment along the `y` axis.

	By default you can drag elements freely on both axes. You can Limit an element's movement to a single axis. 
&nbsp;

* `data-drag-disabled`
	* `"true"` - Disables dragging
	* `"false"` - Enables dragging

	Set this attribute when you need to toggle draggability of a draggable element.  
	This toggles draggability of a single draggable element. If you want to disable all draggables in a context see `.disable()` below.

### Example:
```html
<div
	class="card"
	data-drag-role="draggable"
	data-drag-axis="x"
	data-drag-disabled="false"
>
	<div
		class="card-title"
		data-drag-role="grip"
	>
		Grab here!
	</div>
	<div class="card-body">
		Grab the title to move the card
	</div>
</div>
```

### "read-only" data attributes
> Not actually read-only attributes per se but you probably should not change them.

While dragging an element it is set with a "read-only" data attribute: `data-drag-is-active="true"`. It is removed on drop. This is mostly for styling purposes.

`draggable-elm` moves elements around using CSS `translate(x, y)` which is a relative position to their original-natural position. When dropping an element its position is saved as a data-attribute `data-drag-position="x,y"`. These [x,y] values will be used as the new starting point for the following drag event.


## Instance API

### `draggable()`

Returns a `Draggable` instance: 
```js
const drg = draggable();
```
It has the following methods:

### **.enable() / .disable()**
Toggle draggability for all draggable elements within the context. When disabled, the main element gets a `'drag-disabled'` classname.


### **.on(eventName, callback)**
Listen to drag and drop events:
* **`'drag-start'`** - drag started, fires on `pointerdown` on a draggable element.
* **`'dragging'`** - dragging around, fires on `pointermove` (with `pointerdown`)
* **`'drag-stop'`** - dragging stopped, fires on `pointerup`.

**Event Aliases**  
For extra convenience, anything that contains `start`, `ing` or `stop`/`end`/`drop` will match its respective event. For example, you can use `dragging`/`moving`/`swiping` - all are aliases for the `pointermove` event.


### **.destroy()**
Kills the `Draggable` instance for good, unbinds event listeners, releases element references. Once destroyed, an instance cannot be revived. Use it when the context element is removed from the DOM.
