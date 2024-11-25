import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {draggable} from '../src';
import {
	createDraggableElm,
	createGripsContainer,
	createContainerElm,
	Point,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('Options', () => {
	let drgElm: HTMLElement;
	let testContainerElm: HTMLElement;

	let box: DOMRect;
	let move: (x: number, y: number) => Point;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		box = drgElm.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('axis', () => {
		it('restricts dragging along the X axis only', () => {
			const drgInstance = draggable({axis: 'x'});

			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(50, 50));
			expect(drgElm.style.transform).to.equal(translate(50, 0));

			simulateMouseMove(drgElm, move(150, 150));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			simulateMouseUp(drgElm, move(150, 150));
			simulateMouseMove(drgElm, move(300, 300));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			drgInstance.destroy();
		});

		it('restricts dragging along the Y axis only', () => {
			const drgInstance = draggable(drgElm, {axis: 'y'});

			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(50, 50));
			expect(drgElm.style.transform).to.equal(translate(0, 50));

			simulateMouseMove(drgElm, move(150, 150));
			expect(drgElm.style.transform).to.equal(translate(0, 150));

			simulateMouseUp(drgElm, move(150, 150));
			simulateMouseMove(drgElm, move(300, 300));
			expect(drgElm.style.transform).to.equal(translate(0, 150));

			drgInstance.destroy();
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
			gripsContainer.remove();
		});

		it('drags the elm only if grabbed by a `grip` element', () => {
			const drgInstance = draggable(drgElm, {grip: gripA});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			drgInstance.destroy();
		});

		it('drags the elm only if grabbed by a `grip` element selector', () => {
			const drgInstance = draggable(drgElm, {grip: '#grip-B'});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			drgInstance.destroy();
		});

		it('drags the elm only if grabbed by a `grip` descendent element', () => {
			const drgInstance = draggable(drgElm, {grip: gripsContainer});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			drgInstance.destroy();
		});

		it('drags the elm only if grabbed by a `grip` selector descendent element', () => {
			const drgInstance = draggable(drgElm, {grip: '#grips-container'});

			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			drgInstance.destroy();
		});

		it('sets a classname on the grip element', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			const drgInstance = draggable(drgElm, {grip: gripA});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;

			drgInstance.destroy();
		});

		it('sets a classname on the grip element selector', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			const drgInstance = draggable(drgElm, {grip: '#grip-A'});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;

			drgInstance.destroy();
		});
	});

	describe('classname', () => {
		it('sets a prefix to the `draggable` classname', () => {
			const drgElm = document.createElement('div');

			const drgInstance = draggable(drgElm, {classname: 'my-class'});
			expect(drgElm.classList.contains('my-class')).to.be.true;
			expect(drgElm.classList.contains('DRAGGABLE')).to.be.false;

			drgInstance.destroy();
		});
	});
});
