import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {DRAGGABLE} from '../src/classnames';
import {
	createDraggableElm,
	createGripsContainer,
	createTestContainerElm,
	Point,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('Options', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggable;
	let testContainerElm: HTMLElement;

	let box: DOMRect;
	let move: (x: number, y: number) => Point;

	beforeAll(() => {
		testContainerElm = createTestContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgInstance = draggable(drgElm);
		testContainerElm.appendChild(drgElm);
		box = drgElm.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
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
		it.only('restricts dragging along the X axis only', () => {
			draggable(drgElm, {axis: 'X'});
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(50, 50));

			expect(drgElm.style.transform).to.equal(translate(50, 0));

			// why container? see comment above
			simulateMouseMove(testContainerElm, move(150, 150));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			simulateMouseUp(testContainerElm, move(150, 150));
			simulateMouseMove(testContainerElm, move(300, 300));
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('restricts dragging along the Y axis only', () => {
			draggable(drgElm, {axis: 'Y'});
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(50, 50));

			expect(drgElm.style.transform).to.equal(translate(0, 50));

			// why container? see comment above
			simulateMouseMove(testContainerElm, move(150, 150));
			expect(drgElm.style.transform).to.equal(translate(0, 150));

			simulateMouseUp(testContainerElm, move(150, 150));
			simulateMouseMove(testContainerElm, move(300, 300));
			expect(drgElm.style.transform).to.equal(translate(0, 150));
		});
	});

	describe('grip', () => {
		let gripsContainer: HTMLElement;
		let gripA: HTMLElement;
		let gripB: HTMLElement;

		beforeEach(() => {
			const [container, gA, gB] = createGripsContainer();
			gripsContainer = container;
			gripA = gA;
			gripB = gB;
			drgElm.appendChild(gripsContainer);
		});

		afterEach(() => {
			drgInstance.setGrip(null);
			gripsContainer.remove();
		});

		it('drags the elm only if grabbed by a `grip` element', () => {
			draggable(drgElm, {grip: gripA});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` element selector', () => {
			draggable(drgElm, {grip: '#grip-B'});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` descendent element', () => {
			draggable(drgElm, {grip: gripsContainer});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('drags the elm only if grabbed by a `grip` selector descendent element', () => {
			draggable(drgElm, {grip: '#grips-container'});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('sets a classname on the grip element', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(drgElm, {grip: gripA});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});

		it('sets a classname on the grip element selector', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(drgElm, {grip: '#grip-A'});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});
	});

	describe('classname', () => {
		it('sets a prefix to the `draggable` classname', () => {
			draggable(drgElm, {classname: 'my-class'});
			expect(drgElm.classList.contains('my-class')).to.be.true;
			expect(drgElm.classList.contains(DRAGGABLE)).to.be.false;
		});
	});
});
