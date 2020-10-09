import createGripMatcher from './create-grip-matcher';

export default function Draggable (elm, opts = {}) {
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.elm = elm;
	this.useGrip = false;
	this.gripHandle = null;
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

	elm.style.top = box.top + 'px';
	elm.style.left = box.left + 'px';

	document.body.appendChild(this.elm);

	elm.classList.add('draggable');

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

	elm.addEventListener('mousedown', this.onDragStart);
}

Draggable.prototype.setGrip = function setGrip (grip) {
	if (!grip) {
		this.gripHandle = null;
		return;
	}

	this.useGrip = true;
	this.gripHandle = grip;

	if (typeof grip == 'string') {
		this.matchesGrip = createGripMatcher(grip, true);
	}
	else if (grip instanceof HTMLElement) {
		this.matchesGrip = createGripMatcher(grip, false);
	}
};

Draggable.prototype.on = function on (eventName, callback) {
	this.events[eventName].push(callback);
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

	this.elm.classList.add('grabbed');

	document.addEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.addEventListener('mouseup', this.onDrop);

	this.events.grab.forEach(cb => cb(ev));
};

Draggable.prototype.onDragging = function onDragging (ev) {
	if (!this.isDraggable) return;

	if (this.xAxis) {
		const mouseMovedX = ev.clientX - this.startMouseX;
		this.elm.style.left = this.box.x + mouseMovedX  + 'px';
	}

	if (this.yAxis) {
		const mouseMovedY = ev.clientY - this.startMouseY;
		this.elm.style.top = this.box.y + mouseMovedY  + 'px';
	}

	this.elm.classList.add('dragging');
	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while draging
	ev.preventDefault();
};

Draggable.prototype.onDrop = function onDrop (ev) {
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	this.box = null;
	this.elm.classList.remove('grabbed', 'dragging');
	this.events.drop.forEach(cb => cb(ev));
};

Draggable.prototype.disable = function disable () {
	this.isDraggable = false;
	this.elm.classList.add('drag-disabled');
};

Draggable.prototype.enable = function enable () {
	this.isDraggable = true;
	this.elm.classList.remove('drag-disabled');
};

Draggable.prototype.destroy = function destroy () {
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
