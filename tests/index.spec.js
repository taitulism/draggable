const {expect} = require('chai');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const draggable = require('../');

const setWinDoc = (dom) => {
	global.window = dom.window;
	global.document = dom.window.document;
};

const createEvent = (type, props = {}) => {
	const event = new global.window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

describe('draggable', () => {
	let container, target;
	beforeEach(() => JSDOM.fromFile('./tests/test.html').then((dom) => {
		setWinDoc(dom);
		container = document.getElementById('container');
		target = document.getElementById('target');
	}));

	afterEach(() => {
		global.window.close();
		target = null;
		container = null;
		global.window = null;
		global.document = null;
	});

	it('is a function', () => expect(draggable).to.be.a('function'));

	it('returns a draggable instance', () => {
		const draggableInstance = draggable(target);
		const ctor = Object.getPrototypeOf(draggableInstance).constructor;

		expect(ctor.name).to.equal('Draggable');
	});

	it('emits onDragStart', () => {
		const drg = draggable(target);
		let fired = false;

		drg.on('dragStart', (ev) => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('emits onDrop', () => {
		const drg = draggable(target);
		let fired = false;

		drg.on('drop', (ev) => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);
		simulateMouseUp(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('emits dragging', () => {
		const drg = draggable(target);
		let fired = false;

		drg.on('dragging', (ev) => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);
		simulateMouseMove(target, 50, 50);
		simulateMouseUp(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('moves the elm on the X axis', () => {
		draggable(target);
		expect(target.style.left).to.be.empty;

		simulateMouseDown(target, 50, 50);

		simulateMouseMove(target, 50, 50);
		expect(target.style.left).to.equal('0px');

		simulateMouseMove(target, 150, 50);
		expect(target.style.left).to.equal('100px');
	});

	it('moves the elm on the Y axis', () => {
		draggable(target);
		expect(target.style.top).to.be.empty;

		simulateMouseDown(target, 50, 50);

		simulateMouseMove(target, 50, 50);
		expect(target.style.left).to.equal('0px');

		simulateMouseMove(target, 50, 150);
		expect(target.style.top).to.equal('100px');
	});

	it('sets `draggable` classname on elm', () => {
		draggable(target);
		expect(target.classList.contains('draggable')).to.be.true;
	});

	it('sets `grabbed` classname on elm when grabbing it', () => {
		draggable(target);
		expect(target.classList.contains('grabbed')).to.be.false;
		simulateMouseDown(target, 50, 50);
		expect(target.classList.contains('grabbed')).to.be.true;
		simulateMouseUp(target, 50, 50);
		expect(target.classList.contains('grabbed')).to.be.false;
	});

	it('sets `dragging` classname on elm when moving it', () => {
		draggable(target);
		expect(target.classList.contains('dragging')).to.be.false;
		simulateMouseDown(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.false;
		simulateMouseMove(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.true;
		simulateMouseUp(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.false;
	});

	describe('options', () => {
		describe('axis', () => {

		});
	});
});

