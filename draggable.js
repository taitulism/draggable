/* module.exports =  */function draggable (elm, opts) {
	return new Draggable(elm, opts);
};

function Draggable (elm, opts = {}) {
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.elm = elm;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.elmX = 0;
	this.elmY = 0;
	this.events = {grab: [], drop: [], dragging: []};
	this.originalPosition = elm.style.position || null;

	elm.classList.add('draggable');

	elm.addEventListener('mousedown', this.onDragStart);

	if (opts.axis) {
		this.singleAxis = true;
		const axis = opts.axis.toLowerCase();
		if (axis === 'x') this.xAxis = true;
		else if (axis === 'y') this.yAxis = true;
		document.addEventListener('mouseup', this.onDrop);
	}
	else {
		this.xAxis = true;
		this.yAxis = true;
		elm.addEventListener('mouseup', this.onDrop);
	}
}

Draggable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Draggable.prototype.onDragStart = function (ev) {
	this.elm.style.position = 'absolute';

	if (this.xAxis) {
		// this.startMouseX = ev.clientX;
		// this.elmX = extractNumber(this.elm.style.left);
		this.elm.style.left = ev.clientX - ev.offsetX  + 'px';
		this.mouseOffsetX = ev.offsetX;
	}

	if (this.yAxis) {
		// this.startMouseY = ev.clientY;
		// this.elmY = extractNumber(this.elm.style.top);
		this.elm.style.top = ev.clientY - ev.offsetY  + 'px';
		this.mouseOffsetY = ev.offsetY;
	}

	document.body.appendChild(this.elm);

	this.elm.classList.add('grabbed');

	document.addEventListener('mousemove', this.onDragging);
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

    // eslint-disable-next-line max-len
    // console.log(`${this.elmX} + ${ev.clientX - this.startMouseX} (${ev.clientX} - ${this.startMouseX})`);
};

Draggable.prototype.onDrop = function (ev) {
	this.elm.classList.remove('grabbed', 'dragging');

	document.removeEventListener('mousemove', this.onDragging);
	this.events.drop.forEach(cb => cb(ev));
};

Draggable.prototype.destroy = function () {
	this.elm.removeEventListener('mousedown', this.onDragStart);
	document.removeEventListener('mousemove', this.onDragging);
	if (this.singleAxis) {
		document.removeEventListener('mouseup', this.onDrop);
	}
	else {
		this.elm.removeEventListener('mouseup', this.onDrop);
	}

	this.elm.classList.remove('draggable', 'grabbed', 'dragging');

	if (this.originalPosition) {
		this.elm.style.position = this.originalPosition;
	}

	this.events = null;
	this.elm = null;
};

function extractNumber (rawValue) {
	return parseInt(rawValue || 0, 10);
}
