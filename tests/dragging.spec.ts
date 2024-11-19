import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {
	createDraggableElm,
	createTestContainerElm,
	Point,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('Dragging Around', () => {
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

	it('moves the elm on the X axis', () => {
		draggable(drgElm);

		simulateMouseDown(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.be.empty;

		simulateMouseMove(drgElm, move(150, 0));
		expect(drgElm.style.transform).to.equal(translate(150, 0));

		simulateMouseUp(drgElm, move(150, 0));
		expect(drgElm.style.transform).to.equal(translate(150, 0));

		simulateMouseDown(drgElm, move(150, 0));
		expect(drgElm.style.transform).to.equal(translate(150, 0));

		simulateMouseMove(drgElm, move(0, 0));
		simulateMouseUp(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.equal(translate(0, 0));
	});

	it('moves the elm on the Y axis', () => {
		draggable(drgElm);

		simulateMouseDown(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.be.empty;

		simulateMouseMove(drgElm, move(0, 150));
		expect(drgElm.style.transform).to.equal(translate(0, 150));

		simulateMouseUp(drgElm, move(0, 150));
		expect(drgElm.style.transform).to.equal(translate(0, 150));

		simulateMouseDown(drgElm, move(0, 150));
		expect(drgElm.style.transform).to.equal(translate(0, 150));

		simulateMouseMove(drgElm, move(0, 0));
		simulateMouseUp(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.equal(translate(0, 0));
	});

	it('moves the elm freely on both axes', () => {
		draggable(drgElm);

		simulateMouseDown(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.be.empty;

		simulateMouseMove(drgElm, move(150, 150));
		expect(drgElm.style.transform).to.equal(translate(150, 150));

		simulateMouseUp(drgElm, move(150, 150));
		expect(drgElm.style.transform).to.equal(translate(150, 150));

		simulateMouseDown(drgElm, move(150, 150));
		expect(drgElm.style.transform).to.equal(translate(150, 150));

		simulateMouseMove(drgElm, move(0, 0));
		simulateMouseUp(drgElm, move(0, 0));
		expect(drgElm.style.transform).to.equal(translate(0, 0));
	});
});