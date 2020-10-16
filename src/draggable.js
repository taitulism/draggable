import createGripMatcher from './create-grip-matcher';
import isElmInDom from './is-elm-in-dom';
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
const getDraggableClassname = nsp => (nsp ? `${nsp}-${DRAGGABLE}` : DRAGGABLE);

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
	this.mainClassname = getDraggableClassname(opts.classNamespace);
	this.events = {
		grab: [],
		drop: [],
		dragging: []
	};

	elm.classList.add(this.mainClassname);
	this.initPosition(elm, opts);

	document.body.appendChild(this.elm);

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

// eslint-disable-next-line complexity
Draggable.prototype.initPosition = function initPosition (elm, opts) {
	const {
		top,
		left,
		bottom,
		right,
	} = opts;

	this.originalJsPosition = elm.style.position || null;
	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
	}

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
		const isInDom = isElmInDom(elm);
		const currentBox = isInDom && elm.getBoundingClientRect();

		newPosBox = {
			top: isInDom ? currentBox.top : DEFAULT_POSITION,
			left: isInDom ? currentBox.left : DEFAULT_POSITION,
		};
	}
	else { // hasInitX XOR hasInitY
		const isInDom = isElmInDom(elm);
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

	this.moveTo(newPosBox);
};

Draggable.prototype.moveTo = function moveTo ({top, left, right, bottom}) {
	const elmStyle = this.elm.style;
	if (top) elmStyle.top = top + px;
	if (left) elmStyle.left = left + px;
	if (right) elmStyle.right = right + px;
	if (bottom) elmStyle.bottom = bottom + px;
};

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
		this.moveTo({left: this.box.x + mouseMovedX});
	}

	if (this.yAxis) {
		const mouseMovedY = ev.clientY - this.startMouseY;
		this.moveTo({top: this.box.y + mouseMovedY});
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

	this.elm.classList.remove(this.mainClassname, DRAGGING);
	this.unsetGripClassname();

	this.events = null;
	this.elm = null;
};
