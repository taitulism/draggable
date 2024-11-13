import { DRAGGABLE } from '../../src/classnames';
import {
	createTarget,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate
} from '../utils';

export default () => {
	let testDOMContainer, target, box, move, drg;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
		box = target.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drg && drg.elm && drg.destroy();
		target.parentNode.removeChild(target);
		target = null;
		box = null;
		move = null;
	});

	describe('axis', () => {
		/*
			Why simulating a mouse move on container?
			When restricting to an axis, moving the mouse in the other axis (outside of target)
			misses the mouseup event.
			In this case, if the event is bound to target, the mouseup event occures
			outside (hence the container).
			Fixed by binding the mouseup to the document.
			Test by keep moving the mouse after the drop and verify target is not moving.
		*/
		it('restricts dragging along the X axis only', () => {
			draggable(target, {axis: 'X'});
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(50, 50));

			expect(target.style.transform).to.equal(translate(50, 0));

			// why container? see comment above
			simulateMouseMove(testDOMContainer, move(150, 150));
			expect(target.style.transform).to.equal(translate(150, 0));

			simulateMouseUp(testDOMContainer, move(150, 150));
			simulateMouseMove(testDOMContainer, move(300, 300));
			expect(target.style.transform).to.equal(translate(150, 0));
		});

		it('restricts dragging along the Y axis only', () => {
			draggable(target, {axis: 'Y'});
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(50, 50));

			expect(target.style.transform).to.equal(translate(0, 50));

			// why container? see comment above
			simulateMouseMove(testDOMContainer, move(150, 150));
			expect(target.style.transform).to.equal(translate(0, 150));

			simulateMouseUp(testDOMContainer, move(150, 150));
			simulateMouseMove(testDOMContainer, move(300, 300));
			expect(target.style.transform).to.equal(translate(0, 150));
		});
	});

	describe('grip', () => {
		let gripsContainer, gripA, gripB;

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

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(150, 0));
			simulateMouseUp(target, move(150, 0));
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(target.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` element selector', () => {
			draggable(target, {grip: '#grip-B'});

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(150, 0));
			simulateMouseUp(target, move(150, 0));
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(target.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` descendent element', () => {
			draggable(target, {grip: gripsContainer});

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(150, 0));
			simulateMouseUp(target, move(150, 0));
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(target.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` selector descendent element', () => {
			draggable(target, {grip: '#grips-container'});

			simulateMouseDown(target, move(0, 0));
			simulateMouseMove(target, move(150, 0));
			simulateMouseUp(target, move(150, 0));
			expect(target.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(target.style.transform).to.equal(translate(150, 0));
		});

		it('sets a classname on the grip element', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(target, {grip: gripA});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});

		it('sets a classname on the grip element selector', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(target, {grip: '#grip-A'});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});
	});

	describe('classname', () => {
		it('sets a prefix to the `draggable` classname', () => {
			draggable(target, {classname: 'my-class'});
			expect(target.classList.contains('my-class')).to.be.true;
			expect(target.classList.contains(DRAGGABLE)).to.be.false;
		});
	});
};
