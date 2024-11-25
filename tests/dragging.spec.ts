import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {
	type Point,
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
		testContainerElm = createContainerElm();
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

	it('moves the elm on the X axis', () => {
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

	// TODO:test - add checks against initial box
	// 	const newBox = drgElm.getBoundingClientRect();
	// 	expect(newBox.left).to.equal(75 + 7);
});
