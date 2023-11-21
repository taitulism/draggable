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

const DEFAULT_POSITION = 120;
const px = 'px';
const TYPE_NUMBER = 'number';
const isNumber = thing => typeof thing == TYPE_NUMBER;

export default class Draggable {
	constructor (elm, opts = {}) {
		this.elm = elm;
		this.useGrip = false;
		this.gripHandle = null;
		this.isGripHtmlElm = false;
		this.isDraggable = true;
		this.startMouseX = 0;
		this.startMouseY = 0;
		this.events = createEventsObj();

		this.classname = opts.classname || DRAGGABLE;
		elm.classList.add(this.classname);

		initAxes(this, opts.axis);
		initPosition(this, elm, opts);
		initMouseHandlers(this);
		this.setGrip(opts.grip);
		this.elm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	moveTo ({top, left, right, bottom}) {
		const elmStyle = this.elm.style;
		if (top) elmStyle.top = top + px;
		else if (bottom) {
			elmStyle.bottom = bottom + px;
			elmStyle.top = '';
		}

		if (left) elmStyle.left = left + px;
		else if (right) {
			elmStyle.right = right + px;
			elmStyle.left = '';
		}

		return this;
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

		if (this.originalJsPosition) {
			this.elm.style.position = this.originalJsPosition;
		}

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
}

function onDragging (ev) {
	if (!this.isDraggable) return;

	// TODO: when have both axes - call `moveTo` only once
	if (this.xAxis) {
		const mouseMovedX = ev.clientX - this.startMouseX;
		this.moveTo({left: this.box.x + mouseMovedX});
	}

	if (this.yAxis) {
		const mouseMovedY = ev.clientY - this.startMouseY;
		this.moveTo({top: this.box.y + mouseMovedY});
	}

	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while dragging
	ev.preventDefault();
}

function onDrop (ev) {
	document.removeEventListener(MOUSE_MOVE, this.onDragging);
	this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop);

	this.box = null;
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

// eslint-disable-next-line complexity
function initPosition (drg, elm, opts) {
	const {
		top,
		left,
		bottom,
		right,
	} = opts;

	drg.originalJsPosition = elm.style.position || null;
	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
	}

	// TODO: use Number.isInteger(top)
	const hasTop = isNumber(top);
	const hasLeft = isNumber(left);
	const hasBottom = isNumber(bottom);
	const hasRight = isNumber(right);

	const hasInitX = hasLeft || hasRight;
	const hasInitY = hasTop || hasBottom;

	let newPosBox;

	if (hasInitX && hasInitY) {
		newPosBox = {};

		if (hasTop) newPosBox.top = top;
		else newPosBox.bottom = bottom;

		if (hasLeft) newPosBox.left = left;
		else newPosBox.right = right;
	}
	else if (!hasInitX && !hasInitY) {
		const isInDom = isElmInDom(drg.classname, elm);
		const currentBox = isInDom && elm.getBoundingClientRect();

		newPosBox = {
			top: isInDom ? currentBox.top : DEFAULT_POSITION,
			left: isInDom ? currentBox.left : DEFAULT_POSITION,
		};
	}
	else { // hasInitX XOR hasInitY
		const isInDom = isElmInDom(drg.classname, elm);
		const currentBox = isInDom && elm.getBoundingClientRect();

		if (hasInitX) {
			newPosBox = {top: isInDom ? currentBox.top : DEFAULT_POSITION};

			if (hasLeft) newPosBox.left = left;
			else newPosBox.right = right;
		}
		else { // hasInitY
			newPosBox = isInDom
				? {left: currentBox.left}
				: {right: DEFAULT_POSITION}
			;

			if (hasTop) newPosBox.top = top;
			else newPosBox.bottom = bottom;
		}
	}

	drg.moveTo(newPosBox);
}

function isElmInDom (classname, elm) {
	const draggables = document.getElementsByClassName(classname);
	return draggables && Array.from(draggables).includes(elm);
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
