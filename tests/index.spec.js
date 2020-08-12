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
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
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

	describe('dragging arround', () => {
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

		it('moves the elm freely on both axes', () => {
			draggable(target);
			expect(target.style.left).to.be.empty;
			expect(target.style.top).to.be.empty;

			simulateMouseDown(target, 20, 30);

			simulateMouseMove(target, 20, 30);
			expect(target.style.left).to.equal('0px');
			expect(target.style.top).to.equal('0px');

			simulateMouseMove(target, 180, 200);
			expect(target.style.left).to.equal('160px');
			expect(target.style.top).to.equal('170px');

			simulateMouseMove(target, 90, 250);
			expect(target.style.left).to.equal('70px');
			expect(target.style.top).to.equal('220px');
		});
	});

	describe('events', () => {
		it('emits `grab` event', () => {
			const drg = draggable(target);
			let fired = false;

			drg.on('grab', (ev) => {
				fired = true;
			});

			simulateMouseDown(target, 50, 50);

			expect(fired).to.be.true;
		});

		it('emits `drop` event', () => {
			const drg = draggable(target);
			let fired = false;

			drg.on('drop', (ev) => {
				fired = true;
			});

			simulateMouseDown(target, 50, 50);
			simulateMouseUp(target, 50, 50);

			expect(fired).to.be.true;
		});

		it('emits `dragging` event', () => {
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
	});

	describe('classnames', () => {
		it('sets a `draggable` classname on elm', () => {
			draggable(target);
			expect(target.classList.contains('draggable')).to.be.true;
		});

		it('sets a `grabbed` classname on elm when grabbing it', () => {
			draggable(target);
			expect(target.classList.contains('grabbed')).to.be.false;
			simulateMouseDown(target, 50, 50);
			expect(target.classList.contains('grabbed')).to.be.true;
			simulateMouseUp(target, 50, 50);
			expect(target.classList.contains('grabbed')).to.be.false;
		});

		it('sets a `dragging` classname on elm when moving it', () => {
			draggable(target);
			expect(target.classList.contains('dragging')).to.be.false;
			simulateMouseDown(target, 50, 50);
			expect(target.classList.contains('dragging')).to.be.false;
			simulateMouseMove(target, 50, 50);
			expect(target.classList.contains('dragging')).to.be.true;
			simulateMouseUp(target, 50, 50);
			expect(target.classList.contains('dragging')).to.be.false;
		});
	});

	describe('behavior', () => {
		it('sets position: absolute on the target element', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			draggable(target);
			simulateMouseDown(target, 50, 50);
			expect(target.style.position).to.equal('absolute');
		});

		it('puts the target element in the <body>', () => {
			expect(target.parentNode.nodeName).to.equal('DIV');
			draggable(target);
			simulateMouseDown(target, 50, 50);
			expect(target.parentNode.nodeName).to.equal('BODY');
		});
	});

	describe('options', () => {
		describe('axis', () => {
			it('restricts dragging along the X axis only', () => {
				draggable(target, {axis: 'X'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.equal('0px');
				expect(target.style.top).to.be.empty;

				simulateMouseMove(target, 150, 150);
				expect(target.style.left).to.equal('100px');
				expect(target.style.top).to.be.empty;
			});

			it('restricts dragging along the Y axis only', () => {
				draggable(target, {axis: 'Y'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.equal('0px');

				simulateMouseMove(target, 150, 150);
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.equal('100px');
			});

			it('opt:axis bug', () => {
				/*
					When restricting to an axis, moving the mouse in the other
					axis misses the mouseup event (mouse is outside of target).
					The event is bound to target but the mouseup event occures outside.
					Fixed by binding the mouseup to the document.
					Test by keep moving the mouse after the drop and verify target is not moving.
				*/

				draggable(target, {axis: 'X'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.equal('0px');
				expect(target.style.top).to.be.empty;

				simulateMouseMove(target, 180, 180);
				expect(target.style.left).to.equal('130px');
				expect(target.style.top).to.be.empty;

				simulateMouseUp(document, 180, 180);
				simulateMouseMove(target, 400, 400);
				expect(target.style.left).to.equal('130px');
			});
		});
	});

	describe('destruction', () => {
		it('removes all listeners', () => {
			const drg = draggable(target);

			let grabCount = 0;
			let moveCount = 0;
			let dropCount = 0;

			drg.on('grab', () => { grabCount++; });
			drg.on('dragging', () => { moveCount++; });
			drg.on('drop', () => { dropCount++; });

			simulateMouseDown(target, 50, 50);
			expect(grabCount).to.equal(1);

			simulateMouseMove(target, 50, 50);
			expect(moveCount).to.equal(1);

			simulateMouseMove(target, 150, 150);
			expect(moveCount).to.equal(2);

			simulateMouseUp(target, 150, 150);
			expect(dropCount).to.equal(1);

			simulateMouseMove(target, 160, 160);
			expect(moveCount).to.equal(2);

			drg.destroy();

			simulateMouseDown(target, 160, 160);
			expect(grabCount).to.equal(1);

			simulateMouseMove(target, 160, 160);
			expect(moveCount).to.equal(2);

			simulateMouseUp(target, 160, 160);
			expect(dropCount).to.equal(1);
		});

		it('removes all classnames', () => {
			const drg = draggable(target);

			simulateMouseDown(target, 50, 50);
			simulateMouseMove(target, 50, 50);
			simulateMouseMove(target, 150, 150);
			simulateMouseUp(target, 150, 150);
			simulateMouseMove(target, 160, 160);

			drg.destroy();
			expect(target.classList.contains('draggable')).to.be.false;

			simulateMouseDown(target, 160, 160);
			expect(target.classList.contains('grabbed')).to.be.false;

			simulateMouseMove(target, 160, 160);
			expect(target.classList.contains('dragging')).to.be.false;
		});

		it('resets original position', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			const drg = draggable(target);

			simulateMouseDown(target, 50, 50);
			expect(target.style.position).to.equal('absolute');
			drg.destroy();
			expect(target.style.position).to.equal('static');
		});

		it('releases the target element', () => {
			const drg = draggable(target);

			simulateMouseDown(target, 50, 50);
			simulateMouseMove(target, 50, 50);
			simulateMouseMove(target, 150, 150);
			simulateMouseUp(target, 150, 150);

			expect(drg.elm).to.deep.equal(target);
			drg.destroy();
			expect(drg.elm).to.be.null;
		});
	});
});

