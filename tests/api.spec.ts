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

describe('API', () => {
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
});
