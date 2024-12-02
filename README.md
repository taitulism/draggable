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

draggable(contextElm, options);
```

#### Section Links:
* [Context Element](#context-element)
* [Boundary Element](#boundary-element)
* [Data Attributes](#data-attributes)
* Instance API:
	* [Creation](#draggablecontextelement-options)
	* [Enable / Disable](#enable--disable)
	* [Events](#oneventname-callback--offeventname)
	* [Destruction](#destroy)


### Context Element
Default - `document.body`

>NOTE: The context element is not necessarily a draggable element.

At creation, passing an element to the `draggable(ctxElm)` function binds a *single* event listener to the passed in element. This starts listening to `pointerdown` events on draggable elements within that context element. If no element was passed in at creation the default context element will be the `<body>` element.

Many times the context element would be the immediate parent of the draggable elements, the "board" of the "stickynotes". If you have more than one "board" you can either make a single context for all off them (a mutual ancestor or the `<body>`) or prefer to work with multiple instances/contexts.

Things to consider:
1. There's one `Draggable` instace per context element.
2. Each instance/context binds its own `pointerdown` event listener.
3. Each context is the boundary element to its draggable elements (by default).

### Boundary Element
>**TL;DR** The boundary element is set according to the following precedence order:
>1. The draggable element's closest parent with `data-drag-container` attribute.
>2. If none found - then the context element passed in at creation.
>3. If created with no context or `{container: false}` was used - then the `<body>`.

To prevent users from dragging an element off-screen and being unable to retrieve it, a boundary element is always defined.

By default, the context element acts as the movement container for its descendant draggable elements. However, if the `{container: false}` option is specified during initialization (see [Creation](#draggablecontextelement-options)), the `<body>` element will serve as the boundary.

Alternatively, you can designate a different element as the boundary by adding the `data-drag-container` attribute to it (see [data-drag-container](#data-attributes)).


## Data Attributes
Using different data attributes you can control the dragging behavior.

> To make an element "draggable" set its `data-drag-role` attribute to `"draggable"`.

* `data-drag-container` - set this attribute (key only, no value) on the element you want to define as the boundary element of its descendant draggable elements (see [Boundary Element](#boundary-element)).
* `data-drag-role` = `"draggable" | "grip"`
	* `"draggable"` - Makes the element draggable.  
	Can be used together with:
		* `data-drag-axis` = `"x" | "y"`  
		By default you can drag elements freely on both axes. You can Limit an element's movement to a single axis. 
			* `"x"` - Limit dragging movment along the `x` axis.
			* `"y"` - Limit dragging movment along the `y` axis.
		* `data-drag-disabled`
			* `"true"` - Disables dragging
			* `"false"` - Enables dragging

			Set this attribute when you need to toggle draggability of a draggable element.  
			This toggles draggability of a single draggable element. If you want to disable all draggables in a context see [`.disable()`](#enable--disable) below.
	* `"grip"` - The element becomes the handle of a draggable element. When used, users can only drag draggable elements by their grip element. Must be a descendant of a draggabl element elements (i.e. you cannot drag them outside of the container (throws an error when it's not).  

### Example:
```html
<div
	class="card"
	data-drag-role="draggable"
	data-drag-axis="x"
	data-drag-disabled="false"
>
	<div class="card-title" data-drag-role="grip">
		Grab here!
	</div>
	<div class="card-body">
		Grab the title to move the card
	</div>
</div>
```

### "read-only" data attributes
> Not actually read-only attributes per se but you probably should not change them.

#### `data-drag-active` (key only attribute)
While dragging an element it is set with a "read-only" data attribute: `data-drag-active` . It is removed on drop. This is mostly for styling purposes.

```css
[data-drag-active] {
	background-color: yellow;
}
```

#### `data-drag-position="x,y"`
Elements are moved around using CSS `translate(x, y)` which sets a relative position to an element's original-natural position. When dropping an element its [x,y] position is saved as value of the data-attribute `data-drag-position="x,y"`. This position will be used as the new starting point for the following drag event.


## Instance API

### `draggable(contextElement, options)`
#### arguments
* `contextElement: HTMLElement` - optional. See [Context Element](#context-element) section above.
* `options: DragOptions` - optional. The instance's configuration object, applied for all draggable elements under the context element:
	* `padding: number` - Blocks drag-start if the draggable element was grabbed by its **edge** within this number of pixels. Default is `0`.
	* `cornerPadding: number` - Blocks drag-start if the draggable element was grabbed by its **corner** within this number of pixels. Default is `0`.
	* `container: boolean` - Pass `false` if you don't want the context element to be the boundary of its draggable elements. Default is `true`. See [Boundary Element](#boundary-element) for details.
```js
draggable();             // -->  <body>
draggable({padding: 8}); // -->  <body>
draggable(myElm);
draggable(myElm, {padding: 8});
```

> The padding options are for dealing with draggable elements that are also resizable (by grabbing their corners/edges).

Returns a `Draggable` instance:
```js
const dInstance = draggable();
```
It has the following methods:

### **.enable() / .disable()**
Toggle draggability for all draggable elements within the context. When disabled, the main element gets a `'drag-disabled'` classname.


### **.on(eventName, callback) / .off(eventName)**
Start and stop listening to drag events:
* **`'drag-start'`** - drag started, fires on `pointerdown` on a draggable element.
* **`'dragging'`** - dragging around, fires on `pointermove` (with `pointerdown`)
* **`'drag-stop'`** - dragging stopped, fires on `pointerup`.

A `Draggable` instance can only hold one event listener for each event (unlike a classic EventEmitter):

```js
const doSomething = () => {...}
const doSomethingElse = () => {...}
const stopDoingThing = () => {...}

const d = draggable()
	.on('drag-start', doSomething)     // <-- this is replaced
	.on('drag-start', doSomethingElse) // <-- by  (same event)
	.on('drop', stopDoingThing)

d.off('drop');
```

**Event Handlers**  
The event handlers get called with a `DragEvent` object which holds 3 properties:
* `ev` - the vanilla pointer event (type `PointerEvent`)
* `elm` - the draggable element, which is not always the `ev.target` (type `HTMLElement`), 
* `relPos` - the draggable element's relative position (in pixels), that is, relative to its pre-drag position (type `[x: number, y: number]`)

```js
draggable().on('dragging', (dragEv) => {
	console.log(
		dragEv.elm,       // e.g. <div data-drag-role="draggable">
		dragEv.ev.target, // e.g. <div data-drag-role="grip">
		dragEv.relPos     // e.g. [3, -8] (on 'drag-start' event it's always [0,0])
	);
});
```

**Event Aliases**  
For extra convenience, anything that contains `start`, `ing` or `stop`/`end`/`drop` will match its respective event. For example, you can use `dragging`/`moving`/`swiping` - all are aliases for the `pointermove` event.

### **.destroy()**
Kills the `Draggable` instance for good, unbinds event listeners, releases element references. Once destroyed, an instance cannot be revived. Use it when the context element is removed from the DOM.
