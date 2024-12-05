import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggables, draggables} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {translate} from './utils';
import {createMouseSimulator} from './mouse-simulator';

describe('Dragging Around', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggables;
	let testContainerElm: HTMLElement;
	let mouse: ReturnType<typeof createMouseSimulator>;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
		mouse = createMouseSimulator();
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		drgInstance = draggables();
		mouse.moveToElm(drgElm);
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
		mouse.reset();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('Basic Dragging', () => {
		it('moves the elm on the X axis', () => {
			mouse.down();
			expect(drgElm.style.transform).to.be.empty;

			mouse.move([8, 0]);
			expect(drgElm.style.transform).to.equal(translate(8, 0));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(8, 0));

			mouse.down();
			expect(drgElm.style.transform).to.equal(translate(8, 0));

			mouse.move([-8, 0]);
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(0, 0));
		});

		it('moves the elm on the Y axis', () => {
			mouse.down();
			expect(drgElm.style.transform).to.be.empty;

			mouse.move([0, 12]);
			expect(drgElm.style.transform).to.equal(translate(0, 12));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(0, 12));

			mouse.down();
			expect(drgElm.style.transform).to.equal(translate(0, 12));

			mouse.move([0, -12]);
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(0, 0));
		});

		it('moves the elm freely on both axes', () => {
			mouse.down();
			expect(drgElm.style.transform).to.be.empty;

			mouse.move([8, 12]);
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			mouse.down();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			mouse.move([-8, -12]);
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(0, 0));
		});
	});

	describe('Sequential Dragging', () => {
		it('continues from the last position', () => {
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			mouse.move([33, 33]);

			mouse.down().move([-13, -18]).up();
			expect(drgElm.style.transform).to.equal(translate(-5, -6));
		});
	});

	// TODO:test - add checks against initial box
	// 	const newBox = drgElm.getBoundingClientRect();
	// 	expect(newBox.left).to.equal(75 + 7);
});
