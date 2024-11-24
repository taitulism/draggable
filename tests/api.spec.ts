import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
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

describe('API', () => {
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
		testContainerElm.appendChild(drgElm);
		box = drgElm.getBoundingClientRect();
		drgInstance = draggable();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('.enable() / .disable()', () => {
		it('toggles instance.isEnabled', () => {
			expect(drgInstance.isEnabled).to.be.true;

			drgInstance.disable();
			expect(drgInstance.isEnabled).to.be.false;

			drgInstance.enable();
			expect(drgInstance.isEnabled).to.be.true;
		});

		it('toggles draggability', () => {
			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			simulateMouseDown(drgElm, move(150, 0));
			simulateMouseMove(drgElm, move(300, 0));
			simulateMouseUp(drgElm, move(300, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));

			drgInstance.disable();

			simulateMouseDown(drgElm, move(300, 0));
			simulateMouseMove(drgElm, move(450, 0));
			simulateMouseUp(drgElm, move(450, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));

			drgInstance.enable();

			simulateMouseDown(drgElm, move(300, 0));
			simulateMouseMove(drgElm, move(450, 0));
			simulateMouseUp(drgElm, move(450, 0));
			expect(drgElm.style.transform).to.equal(translate(450, 0));
		});

		it('toggles draggability while dragging', () => {
			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(100, 0));
			expect(drgElm.style.transform).to.equal(translate(100, 0));

			drgInstance.disable();

			simulateMouseMove(drgElm, move(200, 0));
			expect(drgElm.style.transform).to.equal(translate(100, 0));
			simulateMouseUp(drgElm, move(200, 0));
		});
	});

	describe('.on', () => {
		it('is chainable', () => {
			drgInstance = draggable(drgElm);
			expect(drgInstance.on('start', () => null)).to.deep.equal(drgInstance);
		});
	});

	describe.skip('.setGrip()', () => {
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
			// drgInstance.setGrip(null);
			gripsContainer.remove();
		});

		it('sets the drag handle element', () => {
			// drgInstance.setGrip(gripA);

			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(gripA, move(1, 1));
			simulateMouseMove(gripA, move(10, 8));
			simulateMouseUp(gripA, move(10, 8));
			expect(drgElm.style.transform).to.equal(translate(9, 7));

			simulateMouseDown(gripB, move(10, 8));
			simulateMouseMove(gripB, move(25, 13));
			simulateMouseUp(gripB, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(9, 7)); // no move

			// drgInstance.setGrip(gripB);

			simulateMouseDown(gripA, move(10, 8));
			simulateMouseMove(gripA, move(25, 13));
			simulateMouseUp(gripA, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(9, 7)); // no move

			simulateMouseDown(gripB, move(10, 8));
			simulateMouseMove(gripB, move(25, 13));
			simulateMouseUp(gripB, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(24, 12));
		});

		it('sets the drag handle element selector', () => {
			// drgInstance.setGrip('#grip-A');

			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(gripA, move(1, 1));
			simulateMouseMove(gripA, move(10, 8));
			simulateMouseUp(gripA, move(10, 8));
			expect(drgElm.style.transform).to.equal(translate(9, 7));

			simulateMouseDown(gripB, move(10, 8));
			simulateMouseMove(gripB, move(25, 13));
			simulateMouseUp(gripB, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(9, 7)); // no move

			// drgInstance.setGrip('#grip-B');

			simulateMouseDown(gripA, move(10, 8));
			simulateMouseMove(gripA, move(25, 13));
			simulateMouseUp(gripA, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(9, 7)); // no move

			simulateMouseDown(gripB, move(10, 8));
			simulateMouseMove(gripB, move(25, 13));
			simulateMouseUp(gripB, move(25, 13));
			expect(drgElm.style.transform).to.equal(translate(24, 12));
		});

		it('sets the grip classname on the new grip', () => {
			drgInstance = draggable(drgElm);
			expect(gripA.classList.contains('DRAG_GRIP')).to.be.false;
			expect(gripB.classList.contains('DRAG_GRIP')).to.be.false;

			// drgInstance.setGrip(gripA);
			expect(gripA.classList.contains('DRAG_GRIP')).to.be.true;
			expect(gripB.classList.contains('DRAG_GRIP')).to.be.false;

			// drgInstance.setGrip('#grip-B');
			expect(gripA.classList.contains('DRAG_GRIP')).to.be.false;
			expect(gripB.classList.contains('DRAG_GRIP')).to.be.true;

			// drgInstance.setGrip(null);
			expect(gripA.classList.contains('DRAG_GRIP')).to.be.false;
			expect(gripB.classList.contains('DRAG_GRIP')).to.be.false;
		});
	});
});
