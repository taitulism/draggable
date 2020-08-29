/* module.exports =  */function draggable (elm, opts) {
	return new Draggable(elm, opts);
};

function Draggable (elm, opts = {}) {
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.elm = elm;
	this.useGrip = false;
	this.gripHandle = null;
	this.isDraggable = true;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.elmX = 0;
	this.elmY = 0;
	this.events = {grab: [], drop: [], dragging: []};

	this.originalJsPosition = elm.style.position || null;
	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
	}

	const {top, left} = elm.getBoundingClientRect();

	elm.style.top = top + 'px';
	elm.style.left = left + 'px';

	document.body.appendChild(this.elm);

	elm.classList.add('draggable');

	if (opts.axis) {
		this.mouseUpContextElm = document;

		const axis = opts.axis.toLowerCase();

		if (axis === 'x')
			this.xAxis = true;
		else if (axis === 'y')
			this.yAxis = true;
	}
	else {
		this.mouseUpContextElm = elm;
		this.xAxis = true;
		this.yAxis = true;
	}

	this.initGrip(opts.grip);

	elm.addEventListener('mousedown', this.onDragStart);
}

Draggable.prototype.initGrip = function (grip) {
	if (!grip) return;

	this.useGrip = true;
	this.gripHandle = grip;

	if (typeof grip == 'string') {
		this.matchesGrip = createGripMatcher(grip, true);
	}
	else if (grip instanceof HTMLElement) {
		this.matchesGrip = createGripMatcher(grip, false);
	}
};

Draggable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Draggable.prototype.onDragStart = function (ev) {
	if (!this.isDraggable) return;
	if (this.useGrip && !this.matchesGrip(ev.target)) return;

	if (this.xAxis) {
		// this.startMouseX = ev.clientX;
		// this.elmX = extractNumber(this.elm.style.left);

		// this.mouseOffsetX = ev.offsetX; // ev.offsetX is experimental
		this.mouseOffsetX = ev.clientX - extractNumber(this.elm.style.left);
	}

	if (this.yAxis) {
		// this.startMouseY = ev.clientY;
		// this.elmY = extractNumber(this.elm.style.top);

		// this.mouseOffsetY = ev.offsetY;  // ev.offsetY is experimental
		this.mouseOffsetY = ev.clientY - extractNumber(this.elm.style.top);
	}

	this.elm.classList.add('grabbed');

	document.addEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.addEventListener('mouseup', this.onDrop);

	this.events.grab.forEach(cb => cb(ev));
};

Draggable.prototype.onDragging = function (ev) {
	if (this.xAxis) {
		// const mouseMovedX = ev.clientX - this.startMouseX;
		// this.elm.style.left = this.elmX + mouseMovedX  + 'px';
		this.elm.style.left = ev.clientX - this.mouseOffsetX  + 'px';
	}

	if (this.yAxis) {
		// const mouseMovedY = ev.clientY - this.startMouseY;
		// this.elm.style.top = this.elmY + mouseMovedY  + 'px';
		this.elm.style.top = ev.clientY - this.mouseOffsetY  + 'px';
	}

	this.elm.classList.replace('grabbed', 'dragging');
	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while draging
	ev.preventDefault();

    // eslint-disable-next-line max-len
    // console.log(`${this.elmX} + ${ev.clientX - this.startMouseX} (${ev.clientX} - ${this.startMouseX})`);
};

Draggable.prototype.onDrop = function (ev) {
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	this.elm.classList.remove('grabbed', 'dragging');
	this.events.drop.forEach(cb => cb(ev));
};

Draggable.prototype.disable = function () {
	this.isDraggable = false;
};

Draggable.prototype.enable = function () {
	this.isDraggable = true;
};


Draggable.prototype.destroy = function () {
	this.elm.removeEventListener('mousedown', this.onDragStart);
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	if (this.originalJsPosition) {
		this.elm.style.position = this.originalJsPosition;
	}

	this.elm.classList.remove('draggable', 'grabbed', 'dragging');

	this.events = null;
	this.elm = null;
};

function extractNumber (rawValue) {
	return parseInt(rawValue || 0, 10);
}

function isInside (child, parent) {
	const actualParentNode = child.parentNode;
	if (actualParentNode === parent) return true;
	if (actualParentNode === document.body || actualParentNode == null) return false;
	return isInside(actualParentNode, parent);
}

function createGripMatcher (grip, isSelector) {
	if (isSelector) { // grip is string
		return function (eventTarget) {
			return eventTarget.matches(grip) || eventTarget.closest(grip) != null;
		};
	}
	else { // grip is HTMLElement
		return function (eventTarget) {
			return grip == eventTarget || isInside(eventTarget, grip);
		};
	}
}
