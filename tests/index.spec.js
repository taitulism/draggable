/* global draggable */

// const draggable = require('../draggable');

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

// constant offset of the mouse relative to the elm top-left corner
const OFFSET = 10;

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		offsetX: OFFSET,
		offsetY: OFFSET,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		offsetX: OFFSET,
		offsetY: OFFSET,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		offsetX: OFFSET,
		offsetY: OFFSET,
	});

	elm.dispatchEvent(event);
}

const px = (num) => num + 'px';

describe('draggable', () => {
	let testDOMContainer, container, target, box, move, drg;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
		if (!testDOMContainer) {
			testDOMContainer = document.createElement('div');
			testDOMContainer.id = 'test-dom-container';
			document.body.appendChild(testDOMContainer);
		}
	});

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'container';

		target = document.createElement('div');
		target.id = 'target';

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		if (drg && drg.elm) drg.destroy();

		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		box = null;
		move = null;
	});

	after(() => {
		testDOMContainer = null;
	});

	it('is a function', () => expect(draggable).to.be.a('function'));

	it('returns a draggable instance', () => {
		const draggableInstance = draggable(target);
		const ctor = Object.getPrototypeOf(draggableInstance).constructor;

		expect(ctor.name).to.equal('Draggable');
	});

	describe('Dragging Around', () => {
		it('moves the elm on the X axis', () => {
			expect(target.style.left).to.be.empty;
			draggable(target);
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(target, ...move(0, 0));
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));
			simulateMouseMove(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseMove(target, ...move(0, 0));
			simulateMouseUp(target, ...move(0, 0));
			expect(target.style.left).to.equal(px(box.left));
		});

		it('moves the elm on the Y axis', () => {
			expect(target.style.top).to.be.empty;
			draggable(target);
			expect(target.style.top).equal(px(box.top));

			simulateMouseDown(target, ...move(0, 0));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseMove(target, ...move(0, 150));
			simulateMouseUp(target, ...move(0, 150));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseDown(target, ...move(0, 150));
			expect(target.style.top).to.equal(px(box.top + 150));
			simulateMouseMove(target, ...move(0, 150));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseMove(target, ...move(0, 0));
			simulateMouseUp(target, ...move(0, 0));
			expect(target.style.top).to.equal(px(box.top));
		});

		it('moves the elm freely on both axes', () => {
			expect(target.style.left).to.be.empty;
			expect(target.style.top).to.be.empty;
			draggable(target);
			expect(target.style.left).equal(px(box.left));
			expect(target.style.top).equal(px(box.top));

			simulateMouseDown(target, ...move(0, 0));
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseMove(target, ...move(150, 150));
			simulateMouseUp(target, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseDown(target, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top + 150));
			simulateMouseMove(target, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseMove(target, ...move(0, 0));
			simulateMouseUp(target, ...move(0, 0));
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top));
		});
	});

	describe('Events', () => {
		it('emits `grab` event', () => {
			drg = draggable(target);
			let fired = false;

			drg.on('grab', (ev) => { fired = true; });

			simulateMouseDown(target, 50, 50);
			expect(fired).to.be.true;
			simulateMouseUp(target, 50, 50);
		});

		it('emits `drop` event', () => {
			drg = draggable(target);
			let fired = false;

			drg.on('drop', (ev) => { fired = true; });

			simulateMouseDown(target, 50, 50);
			expect(fired).to.be.false;
			simulateMouseUp(target, 50, 50);
			expect(fired).to.be.true;

		});

		it('emits `dragging` event', () => {
			drg = draggable(target);
			let fired = false;

			drg.on('dragging', (ev) => { fired = true; });

			simulateMouseDown(target, 50, 50);

			expect(fired).to.be.false;
			simulateMouseMove(target, 50, 50);
			expect(fired).to.be.true;

			simulateMouseUp(target, 50, 50);
		});
	});

	describe('Classnames', () => {
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

		it('leaves only the `draggable` classname on elm when droping it', () => {
			draggable(target);
			simulateMouseDown(target, 50, 50);
			simulateMouseMove(target, 50, 50);
			simulateMouseUp(target, 50, 50);
			expect(target.classList.contains('draggable')).to.be.true;
			expect(target.classList.length).to.equal(1);
		});
	});

	describe('Behavior', () => {
		it('places the target element in the <body>', () => {
			expect(target.parentNode.nodeName).to.equal('DIV');
			draggable(target);
			expect(target.parentNode.nodeName).to.equal('BODY');
		});

		describe('Position Elevation', () => {
			it('if element position is `absolute` - keep it like that', () => {
				target.style.position = 'absolute';

				expect(target.style.position).to.equal('absolute');
				draggable(target);
				expect(target.style.position).to.equal('absolute');
			});

			it('if element position is not `absolute` - sets `position:absolute`', () => {
				target.style.position = 'static';

				expect(target.style.position).to.equal('static');
				draggable(target);
				expect(target.style.position).to.equal('absolute');
			});
		});
	});

	describe('Options', () => {
		describe('axis', () => {
			/*
				Why simulating a mouse move on container?
				When restricting to an axis, moving the mouse in the other axis (outside of target) misses the mouseup event.
				In this case, if the event is bound to target, the mouseup event occures outside (hence container).
				Fixed by binding the mouseup to the document.
				Test by keep moving the mouse after the drop and verify target is not moving.
			*/
			it('restricts dragging along the X axis only', () => {
				draggable(target, {axis: 'X'});
				expect(target.style.left).to.equal(px(box.left));
				expect(target.style.top).to.equal(px(box.top));

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(50, 50));

				expect(target.style.left).to.equal(px(box.left + 50));
				expect(target.style.top).to.equal(px(box.top));

				// why container? see comment above
				simulateMouseMove(container, ...move(150, 150));
				expect(target.style.left).to.equal(px(box.left + 150));
				expect(target.style.top).to.equal(px(box.top));

				simulateMouseUp(container, ...move(150, 150));
				simulateMouseMove(container, ...move(300, 300));
				expect(target.style.left).to.equal(px(box.left + 150));
				expect(target.style.top).to.equal(px(box.top));
			});

			it('restricts dragging along the Y axis only', () => {
				draggable(target, {axis: 'Y'});
				expect(target.style.left).to.equal(px(box.left));
				expect(target.style.top).to.equal(px(box.top));

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(50, 50));

				expect(target.style.left).to.equal(px(box.left));
				expect(target.style.top).to.equal(px(box.top + 50));

				// why container? see comment above
				simulateMouseMove(container, ...move(150, 150));
				expect(target.style.left).to.equal(px(box.left));
				expect(target.style.top).to.equal(px(box.top + 150));

				simulateMouseUp(container, ...move(150, 150));
				simulateMouseMove(container, ...move(300, 300));
				expect(target.style.left).to.equal(px(box.left));
				expect(target.style.top).to.equal(px(box.top + 150));
			});
		});

		describe('grip', () => {
			let gripsContainer, gripA, gripB

			beforeEach(() => {
				gripsContainer = document.createElement('div');
				gripsContainer.id = 'grips-container';

				gripA = document.createElement('div');
				gripA.id = 'grip-A';

				gripB = document.createElement('div');
				gripB.id = 'grip-B';

				gripsContainer.appendChild(gripA);
				gripsContainer.appendChild(gripB);
				target.appendChild(gripsContainer);
			});

			afterEach(() => {
				gripB && gripB.parentNode.removeChild(gripB);
				gripA && gripA.parentNode.removeChild(gripA);
				gripsContainer && gripsContainer.parentNode.removeChild(gripsContainer);
				gripsContainer = null;
				gripA = null;
				gripB = null;
			});

			it('drags the elm only if grabbed by a `grip` element', () => {
				draggable(target, {grip: gripA});

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(150, 0));
				simulateMouseUp(target, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left));

				simulateMouseDown(gripA, ...move(0, 0));
				simulateMouseMove(gripA, ...move(150, 0));
				simulateMouseUp(gripA, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left + 150));
			});

			it('drags the elm only if grabbed by a `grip` element selector', () => {
				draggable(target, {grip: '#grip-B'});

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(150, 0));
				simulateMouseUp(target, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left));

				simulateMouseDown(gripB, ...move(0, 0));
				simulateMouseMove(gripB, ...move(150, 0));
				simulateMouseUp(gripB, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left + 150));
			});

			it('drags the elm only if grabbed by a `grip` descendent element', () => {
				draggable(target, {grip: gripsContainer});

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(150, 0));
				simulateMouseUp(target, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left));

				simulateMouseDown(gripA, ...move(0, 0));
				simulateMouseMove(gripA, ...move(150, 0));
				simulateMouseUp(gripA, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left + 150));
			});

			it('drags the elm only if grabbed by a `grip` selector descendent element', () => {
				draggable(target, {grip: '#grips-container'});

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(150, 0));
				simulateMouseUp(target, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left));

				simulateMouseDown(gripB, ...move(0, 0));
				simulateMouseMove(gripB, ...move(150, 0));
				simulateMouseUp(gripB, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left + 150));
			});

			// ? :/
			it.skip('sets a classname on the grip element', () => {

			});
		});
	});

	describe('API', () => {
		describe('.enable() / .disable()', () => {
			it('toggles draggability', () => {
				expect(target.style.left).to.be.empty;
				drg = draggable(target);

				simulateMouseDown(target, ...move(0, 0));
				simulateMouseMove(target, ...move(150, 0));
				simulateMouseUp(target, ...move(150, 0));
				expect(target.style.left).to.equal(px(box.left + 150));

				simulateMouseDown(target, ...move(150, 0));
				simulateMouseMove(target, ...move(300, 0));
				simulateMouseUp(target, ...move(300, 0));
				expect(target.style.left).to.equal(px(box.left + 300));

				drg.disable();

				simulateMouseDown(target, ...move(300, 0));
				simulateMouseMove(target, ...move(450, 0));
				simulateMouseUp(target, ...move(450, 0));
				expect(target.style.left).to.equal(px(box.left + 300));

				drg.enable();

				simulateMouseDown(target, ...move(300, 0));
				simulateMouseMove(target, ...move(450, 0));
				simulateMouseUp(target, ...move(450, 0));
				expect(target.style.left).to.equal(px(box.left + 450));
			});

			it('toggles classname', () => {
				drg = draggable(target);

				expect(target.classList.contains('drag-disabled')).to.be.false;
				drg.disable();
				expect(target.classList.contains('drag-disabled')).to.be.true;
				drg.enable();
				expect(target.classList.contains('drag-disabled')).to.be.false;
			});
		});

		describe.skip('.setGrip()', () => {

		});

		describe('.destroy()', () => {
			it('removes all listeners', () => {
				drg = draggable(target);

				let grabs = 0;
				let moves = 0;
				let drops = 0;

				drg.on('grab', () => { grabs++; });
				drg.on('dragging', () => { moves++; });
				drg.on('drop', () => { drops++; });

				expect(grabs).to.equal(0);
				simulateMouseDown(target, 50, 50);
				expect(grabs).to.equal(1);

				expect(moves).to.equal(0);
				simulateMouseMove(target, 50, 50);
				expect(moves).to.equal(1);

				simulateMouseMove(target, 150, 150);
				expect(moves).to.equal(2);

				expect(drops).to.equal(0);
				simulateMouseUp(target, 150, 150);
				expect(drops).to.equal(1);

				expect(moves).to.equal(2);
				simulateMouseMove(target, 160, 160);
				expect(moves).to.equal(2);

				drg.destroy();

				expect(grabs).to.equal(1);
				simulateMouseDown(target, 160, 160);
				expect(grabs).to.equal(1);

				expect(moves).to.equal(2);
				simulateMouseMove(target, 160, 160);
				expect(moves).to.equal(2);

				expect(drops).to.equal(1);
				simulateMouseUp(target, 160, 160);
				expect(drops).to.equal(1);
			});

			it('removes all classnames', () => {
				drg = draggable(target);

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
				drg = draggable(target);

				expect(target.style.position).to.equal('absolute');
				drg.destroy();
				expect(target.style.position).to.equal('static');
			});

			it('releases the target element', () => {
				drg = draggable(target);

				expect(drg.elm).to.deep.equal(target);
				drg.destroy();
				expect(drg.elm).to.be.null;
			});
		});
	});

});
