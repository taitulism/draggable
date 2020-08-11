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

		drg.on('dragStart', () => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('emits onDrop', () => {
		const drg = draggable(target);
		let fired = false;

		drg.on('drop', () => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);
		simulateMouseUp(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('emits dragging', () => {
		const drg = draggable(target);
		let fired = false;

		drg.on('dragging', () => {
			fired = true;
		});

		simulateMouseDown(target, 50, 50);
		simulateMouseMove(target, 50, 50);
		simulateMouseUp(target, 50, 50);

		expect(fired).to.be.true;
	});

	it('moves the elm', () => {
		draggable(target);
		expect(target.style.left).to.be.empty;

		simulateMouseDown(target, 50, 50);

		simulateMouseMove(target, 50, 50);
		expect(target.style.left).to.equal('0px');

		simulateMouseMove(target, 150, 50);
		expect(target.style.left).to.equal('100px');
	});
});

