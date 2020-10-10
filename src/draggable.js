import createGripMatcher from './create-grip-matcher';
import {
	DRAGGABLE,
	DRAGGING,
	DRAG_DISABLED,
	DRAG_GRIP,
} from './classnames';

const MOUSE_DOWN = 'mousedown';
const MOUSE_MOVE = 'mousemove';
const MOUSE_UP = 'mouseup';
const px = 'px';

export default function Draggable (elm, opts = {}) {
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.elm = elm;
	this.useGrip = false;
	this.gripHandle = null;
	this.isGripHtmlElm = false;
	this.isDraggable = true;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.events = {
		grab: [],
		drop: [],
		dragging: []
	};

	this.originalJsPosition = elm.style.position || null;
	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
	}

	const box = elm.getBoundingClientRect();

	elm.style.top = box.top + px;
	elm.style.left = box.left + px;

	document.body.appendChild(this.elm);

	elm.classList.add(DRAGGABLE);

	if (opts.axis) {
		this.mouseUpContextElm = document;

		const axis = opts.axis.toLowerCase();

		if (axis === 'x') this.xAxis = true;
		else if (axis === 'y') this.yAxis = true;
	}
	else {
		this.mouseUpContextElm = elm;
		this.xAxis = true;
		this.yAxis = true;
	}

	this.setGrip(opts.grip);

	elm.addEventListener(MOUSE_DOWN, this.onDragStart);
}

Draggable.prototype.setGrip = function setGrip (newGrip) {
	if (newGrip === this.gripHandle) return;

	this.unsetGripClassname();

	if (!newGrip) {
		this.useGrip = false;
		this.gripHandle = null;
		return;
	}

	this.isGripHtmlElm = newGrip instanceof HTMLElement;
	if (!this.isGripHtmlElm && typeof newGrip !== 'string') return; // TODO: throw?

	this.useGrip = true;
	this.gripHandle = newGrip;
	this.matchesGrip = createGripMatcher(newGrip, this.isGripHtmlElm);

	this.setGripClassname();
};

Draggable.prototype.unsetGripClassname = function unsetGripClassname () {
	if (!this.useGrip) return;

	if (this.isGripHtmlElm) {
		this.gripHandle.classList.remove(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(this.gripHandle);
		for (const g of grips) {
			g.classList.remove(DRAG_GRIP);
		}
	}
};

Draggable.prototype.setGripClassname = function setGripClassname () {
	if (this.isGripHtmlElm) {
		this.gripHandle.classList.add(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(this.gripHandle);
		for (const g of grips) {
			g.classList.add(DRAG_GRIP);
		}
	}
};

Draggable.prototype.on = function on (eventName, callback) {
	const lowerEventName = eventName.toLowerCase();
	if (lowerEventName.includes('start')) {
		this.events.grab.push(callback);
	}
	else if (lowerEventName.includes('ing')) {
		this.events.dragging.push(callback);
	}
	else if (
		lowerEventName.includes('end') ||
		lowerEventName.includes('stop') ||
		lowerEventName.includes('drop')
	) {
		this.events.drop.push(callback);
	}
	return this;
};

Draggable.prototype.onDragStart = function onDragStart (ev) {
	if (!this.isDraggable) return;
	if (this.useGrip && !this.matchesGrip(ev.target)) return;

	this.box = this.elm.getBoundingClientRect();

	if (this.xAxis) {
		this.startMouseX = ev.clientX;
	}

	if (this.yAxis) {
		this.startMouseY = ev.clientY;
	}

	this.elm.classList.add(DRAGGING);

	document.addEventListener(MOUSE_MOVE, this.onDragging);
	this.mouseUpContextElm.addEventListener(MOUSE_UP, this.onDrop);

	this.events.grab.forEach(cb => cb(ev));
};

Draggable.prototype.onDragging = function onDragging (ev) {
	if (!this.isDraggable) return;

	if (this.xAxis) {
		const mouseMovedX = ev.clientX - this.startMouseX;
		this.elm.style.left = this.box.x + mouseMovedX  + px;
	}

	if (this.yAxis) {
		const mouseMovedY = ev.clientY - this.startMouseY;
		this.elm.style.top = this.box.y + mouseMovedY  + px;
	}

	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while draging
	ev.preventDefault();
};

Draggable.prototype.onDrop = function onDrop (ev) {
	document.removeEventListener(MOUSE_MOVE, this.onDragging);
	this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop);

	this.box = null;
	this.elm.classList.remove(DRAGGING);
	this.events.drop.forEach(cb => cb(ev));
};

Draggable.prototype.disable = function disable () {
	this.isDraggable = false;
	this.elm.classList.add(DRAG_DISABLED);
};

Draggable.prototype.enable = function enable () {
	this.isDraggable = true;
	this.elm.classList.remove(DRAG_DISABLED);
};

Draggable.prototype.destroy = function destroy () {
	this.elm.removeEventListener(MOUSE_DOWN, this.onDragStart);
	document.removeEventListener(MOUSE_MOVE, this.onDragging);
	this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop);

	if (this.originalJsPosition) {
		this.elm.style.position = this.originalJsPosition;
	}

	this.elm.classList.remove(DRAGGABLE, DRAGGING);

	this.events = null;
	this.elm = null;
};
