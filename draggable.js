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

	elm.addEventListener('mousedown', this.onDragStart);
}

Draggable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Draggable.prototype.onDragStart = function (ev) {
	if (this.xAxis) {
		// this.startMouseX = ev.clientX;
		// this.elmX = extractNumber(this.elm.style.left);
		this.mouseOffsetX = ev.offsetX;
	}

	if (this.yAxis) {
		// this.startMouseY = ev.clientY;
		// this.elmY = extractNumber(this.elm.style.top);
		this.mouseOffsetY = ev.offsetY;
	}

	this.elm.classList.add('grabbed');

	this.mouseUpContextElm.addEventListener('mouseup', this.onDrop);
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
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	this.elm.classList.remove('grabbed', 'dragging');
	this.events.drop.forEach(cb => cb(ev));
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

// function extractNumber (rawValue) {
// 	return parseInt(rawValue || 0, 10);
// }
