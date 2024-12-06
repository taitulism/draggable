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
			expect(drgElm.style.translate).to.be.empty;

			mouse.move([8, 0]);
			expect(drgElm.style.translate).to.equal(translate(8, 0));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(8, 0));

			mouse.down();
			expect(drgElm.style.translate).to.equal(translate(8, 0));

			mouse.move([-8, 0]);
			expect(drgElm.style.translate).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(0, 0));
		});

		it('moves the elm on the Y axis', () => {
			mouse.down();
			expect(drgElm.style.translate).to.be.empty;

			mouse.move([0, 12]);
			expect(drgElm.style.translate).to.equal(translate(0, 12));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(0, 12));

			mouse.down();
			expect(drgElm.style.translate).to.equal(translate(0, 12));

			mouse.move([0, -12]);
			expect(drgElm.style.translate).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(0, 0));
		});

		it('moves the elm freely on both axes', () => {
			mouse.down();
			expect(drgElm.style.translate).to.be.empty;

			mouse.move([8, 12]);
			expect(drgElm.style.translate).to.equal(translate(8, 12));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(8, 12));

			mouse.down();
			expect(drgElm.style.translate).to.equal(translate(8, 12));

			mouse.move([-8, -12]);
			expect(drgElm.style.translate).to.equal(translate(0, 0));

			mouse.up();
			expect(drgElm.style.translate).to.equal(translate(0, 0));
		});

		it('only moves when supposed to', () => {
			mouse.move([10, 10]);
			expect(drgElm.style.translate).to.be.empty;
			mouse.down();
			expect(drgElm.style.translate).to.be.empty;
			mouse.move([10, 10]);
			expect(drgElm.style.translate).to.equal(translate(10, 10));
			mouse.up();

			mouse.move([11, 11]);
			expect(drgElm.style.translate).to.equal(translate(10, 10));
		});
	});

	describe('Sequential Dragging', () => {
		it('different grabbing points', () => {
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.translate).to.equal(translate(8, 12));

			mouse.move([30, 30]);

			mouse.down().move([-13, -18]).up();
			expect(drgElm.style.translate).to.equal(translate(-5, -6));

			mouse.move([-15, -15]);

			mouse.down().move([45, 16]).up();
			expect(drgElm.style.translate).to.equal(translate(40, 10));

			mouse.move([-10, -10]);

			mouse.down().move([10, 40]).up();
			expect(drgElm.style.translate).to.equal(translate(50, 50));
		});

		it('continous dragging', () => {
			mouse.down();

			mouse.move([10, 10]);
			expect(drgElm.style.translate).to.equal(translate(10, 10));

			mouse.move([10, -10]);
			expect(drgElm.style.translate).to.equal(translate(20, 0));

			mouse.move([20, 20]);
			expect(drgElm.style.translate).to.equal(translate(40, 20));

			mouse.move([-20, 20]);
			expect(drgElm.style.translate).to.equal(translate(20, 40));

			mouse.move([-20, -40]);
			expect(drgElm.style.translate).to.equal(translate(0, 0));

			mouse.up();
		});
	});
});
