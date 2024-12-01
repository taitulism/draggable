import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {draggable} from '../src';
import {
	createContainerElm,
	createTargetElm,
	makeDraggable,
	addGrip,
	setAxis,
	addChild,
	addGripChild,
} from './dom-utils';
import {
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('Data Attributes', () => {
	let drgElm: HTMLElement;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createTargetElm();
		testContainerElm.appendChild(drgElm);
	});

	afterEach(() => {
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('An element with `data-drag-role="draggable"`', () => {
		it('becomes draggable', () => {
			const drgInstance = draggable();

			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [101, 80]);
			simulateMouseUp(drgElm, [101, 80]);
			expect(drgElm.style.transform).to.be.empty;

			makeDraggable(drgElm);

			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [101, 80]);
			simulateMouseUp(drgElm, [101, 80]);
			expect(drgElm.style.transform).to.equal(translate(51, 30));

			drgInstance.destroy();
		});

		it('also by its children', () => {
			const drgInstance = draggable();
			const child = addChild(drgElm);
			makeDraggable(drgElm);

			simulateMouseDown(child, [30, 25]);
			simulateMouseMove(child, [51, 50]);
			simulateMouseUp(child, [51, 80]);
			expect(drgElm.style.transform).to.equal(translate(21, 25));

			drgInstance.destroy();
		});
	});

	describe('An element with `data-drag-role="grip"`', () => {
		it('becomes the closest draggable\'s grip', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);

			simulateMouseDown(grip, [62, 62]);
			simulateMouseMove(grip, [70, 80]);
			simulateMouseUp(grip, [70, 80]);
			expect(drgElm.style.transform).to.equal(translate(8, 18));

			drgInstance.destroy();
		});

		it('its children also function as grips', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);
			const gripChild = addGripChild(grip);

			simulateMouseDown(gripChild, [62, 62]);
			simulateMouseMove(gripChild, [70, 80]);
			simulateMouseUp(gripChild, [70, 80]);
			expect(drgElm.style.transform).to.equal(translate(8, 18));

			drgInstance.destroy();
		});

		it('prevents dragging the closest draggable not via grip', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);
			const child = addChild(drgElm);

			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [70, 80]);
			simulateMouseUp(drgElm, [70, 80]);
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(child, [62, 62]);
			simulateMouseMove(child, [70, 80]);
			simulateMouseUp(child, [70, 80]);
			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(grip, [62, 62]);
			simulateMouseMove(grip, [70, 80]);
			simulateMouseUp(grip, [70, 80]);
			expect(drgElm.style.transform).to.equal(translate(8, 18));

			drgInstance.destroy();
		});

		it.skip('throws if not inside a draggable element', () => {
			const originalWindowOnError = window.onerror;

			const promise = new Promise((resolve, reject) => {
				const drgInstance = draggable();

				// makeDraggable(drgElm);
				const grip = addGrip(drgElm);

				let errMsg: unknown;

				window.onerror = (message) => {
					errMsg = message;
					try {
						expect(errMsg).to.include('must be inside a draggable');
						simulateMouseUp(grip, [62, 62]);
						drgInstance.destroy();
						window.onerror = originalWindowOnError;
						resolve(true);
					}
					catch (err) {
						reject(err);
					}
				};

				simulateMouseDown(grip, [62, 62]);
				expect(true).to.be.false;
			});

			return promise;
		});
	});

	describe('An element with `data-drag-axis="x | y"`', () => {
		it('makes the draggable element only move on that axis', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);

			setAxis(drgElm, 'x');
			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);
			simulateMouseUp(drgElm, [15, 15]);
			expect(drgElm.style.transform).to.equal(translate(15, 0));

			// reset position
			// TODO:test - switching axis after move fails
			simulateMouseDown(drgElm, [15, 15]);
			simulateMouseMove(drgElm, [0, 0]);
			simulateMouseUp(drgElm, [0, 0]);
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			setAxis(drgElm, 'y');
			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);
			simulateMouseUp(drgElm, [15, 15]);
			expect(drgElm.style.transform).to.equal(translate(0, 15));

			drgInstance.destroy();
		});
	});

	describe('While moving a draggable element', () => {
		it('sets an empty attribute `data-drag-active`', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);

			expect(drgElm.dataset).not.to.haveOwnProperty('dragActive');
			simulateMouseDown(drgElm, [50, 50]);
			expect(drgElm.dataset).to.haveOwnProperty('dragActive');
			simulateMouseMove(drgElm, [100, 100]);
			expect(drgElm.dataset).to.haveOwnProperty('dragActive');
			simulateMouseUp(drgElm, [100, 100]);
			expect(drgElm.dataset).not.to.haveOwnProperty('dragActive');

			drgInstance.destroy();
		});
	});
});
