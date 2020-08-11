// const TPL = require('./src/TPL');

module.exports = function draggable (elm, opts) {
	return new Draggable(elm, opts);
};

function Draggable (elm, opts) {
	this.elm = elm;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.elmX = 0;
	this.elmY = 0;
	this.events = {dragStart: [], drop: [], dragging: []};

	this.elm.classList.add('draggable');
	this.elm.style.position = 'relative';

	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	elm.addEventListener('mousedown', this.onDragStart);
	elm.addEventListener('mouseup', this.onDrop);
}

Draggable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Draggable.prototype.onDragStart = function (ev) {
	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;
	this.elmX = extractNumber(this.elm.style.left);
	this.elmY = extractNumber(this.elm.style.top);
	this.elm.classList.add('grabbed');

	document.addEventListener('mousemove', this.onDragging);
	this.events.dragStart.forEach(cb => cb(ev));
};

Draggable.prototype.onDragging = function (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.classList.replace('grabbed', 'dragging');

    // eslint-disable-next-line max-len
    // console.log(`${this.elmX} + ${ev.clientX - this.startMouseX} (${ev.clientX} - ${this.startMouseX})`);
	this.elm.style.left = this.elmX + mouseMovedX  + 'px';
	this.elm.style.top = this.elmY + mouseMovedY  + 'px';
	this.events.dragging.forEach(cb => cb(ev));
};

Draggable.prototype.onDrop = function (ev) {
	this.elm.classList.remove('grabbed', 'dragging');

	document.removeEventListener('mousemove', this.onDragging);
	this.events.drop.forEach(cb => cb(ev));
};

function extractNumber (rawValue) {
	return parseInt(rawValue || 0, 10);
}
