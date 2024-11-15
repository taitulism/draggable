/* eslint-disable no-invalid-this */
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

export default class Draggable {
	constructor (elm, opts = {}) {
		this.elm = elm;
		this.useGrip = false;
		this.gripHandle = null;
		this.isGripHtmlElm = false;
		this.isDraggable = true;
		this.startMouseX = 0;
		this.startMouseY = 0;
		this.mouseMoveX = 0;
		this.mouseMoveY = 0;
		this.prevMouseMoveX = 0;
		this.prevMouseMoveY = 0;
		this.events = createEventsObj();

		this.classname = opts.classname || DRAGGABLE;
		elm.classList.add(this.classname);

		initAxes(this, opts.axis);
		initMouseHandlers(this);
		this.setGrip(opts.grip);
		this.elm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	moveBy (x = 0, y = 0) {
		const translate = `translate(${x}px, ${y}px)`;

		this.elm.style.transform = translate;
	}

	setGrip (newGrip) {
		if (newGrip === this.gripHandle) return;

		unsetGripClassname(this);

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

		setGripClassname(this);
	}

	on (eventName, callback) {
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
	}

	disable () {
		this.isDraggable = false;
		this.elm.classList.add(DRAG_DISABLED);
	}

	enable () {
		this.isDraggable = true;
		this.elm.classList.remove(DRAG_DISABLED);
	}

	destroy () {
		this.elm.removeEventListener(MOUSE_DOWN, this.onDragStart);
		document.removeEventListener(MOUSE_MOVE, this.onDragging);
		this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop);

		this.elm.classList.remove(this.classname, DRAGGING);
		unsetGripClassname(this);

		this.events = null;
		this.elm = null;
	}
}

/* ---------------------------------------------------------------------------------------------- */

function onDragStart (ev) {
	if (!this.isDraggable) return;
	if (this.useGrip && !this.matchesGrip(ev.target)) return;

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
}

function onDragging (ev) {
	if (!this.isDraggable) return;

	this.mouseMoveX =
		this.xAxis ? (ev.clientX - this.startMouseX) + this.prevMouseMoveX : 0;

	this.mouseMoveY =
		this.yAxis ? (ev.clientY - this.startMouseY) + this.prevMouseMoveY : 0;

	this.moveBy(this.mouseMoveX, this.mouseMoveY);
	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while dragging
	ev.preventDefault();
}

function onDrop (ev) {
	document.removeEventListener(MOUSE_MOVE, this.onDragging);
	this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop);

	this.prevMouseMoveX = this.mouseMoveX;
	this.prevMouseMoveY = this.mouseMoveY;
	this.elm.classList.remove(DRAGGING);
	this.events.drop.forEach(cb => cb(ev));
}

/* ---------------------------------------------------------------------------------------------- */

function createEventsObj () {
	return {
		grab: [],
		drop: [],
		dragging: []
	};
}

function initMouseHandlers (drg) {
	drg.onDragStart = onDragStart.bind(drg);
	drg.onDragging = onDragging.bind(drg);
	drg.onDrop = onDrop.bind(drg);
}

function initAxes (drg, axisOpt) {
	if (axisOpt) {
		drg.mouseUpContextElm = document;

		const axis = axisOpt.toLowerCase();

		if (axis === 'x') drg.xAxis = true;
		else if (axis === 'y') drg.yAxis = true;
	}
	else {
		drg.mouseUpContextElm = drg.elm;
		drg.xAxis = true;
		drg.yAxis = true;
	}
}

function unsetGripClassname (drg) {
	if (!drg.useGrip) return;

	if (drg.isGripHtmlElm) {
		drg.gripHandle.classList.remove(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(drg.gripHandle);
		for (const g of grips) {
			g.classList.remove(DRAG_GRIP);
		}
	}
}

function setGripClassname (drg) {
	if (drg.isGripHtmlElm) {
		drg.gripHandle.classList.add(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(drg.gripHandle);
		for (const g of grips) {
			g.classList.add(DRAG_GRIP);
		}
	}
}
