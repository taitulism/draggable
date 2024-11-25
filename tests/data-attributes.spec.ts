import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {
	createContainerElm,
	createTargetElm,
	makeDraggable,
	addGrip,
	setAxis,
} from './dom-utils';
import {
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('Data Attributes', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggable;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createTargetElm();
		drgInstance = draggable();
		testContainerElm.appendChild(drgElm);
	});

	afterEach(() => {
		drgInstance.destroy();
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

		it.todo('its children also become grips', () => {
			// const drgInstance = draggable();

			// makeDraggable(drgElm);
			// const grip = addGrip(drgElm);

			// simulateMouseDown(grip, [62, 62]);
			// simulateMouseMove(grip, [70, 80]);
			// simulateMouseUp(grip, [70, 80]);
			// expect(drgElm.style.transform).to.equal(translate(8, 18));

			// drgInstance.destroy();
		});

		it('prevents dragging the closest draggable not via grip', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);

			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [70, 80]);
			simulateMouseUp(drgElm, [70, 80]);
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
			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [100, 100]);
			simulateMouseUp(drgElm, [100, 100]);
			expect(drgElm.style.transform).to.equal(translate(50, 0));

			// reset position
			// TODO:test - switching axis after move fails
			simulateMouseDown(drgElm, [100, 100]);
			simulateMouseMove(drgElm, [50, 50]);
			simulateMouseUp(drgElm, [50, 50]);
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			setAxis(drgElm, 'y');
			simulateMouseDown(drgElm, [50, 50]);
			simulateMouseMove(drgElm, [100, 100]);
			simulateMouseUp(drgElm, [100, 100]);
			expect(drgElm.style.transform).to.equal(translate(0, 50));

			drgInstance.destroy();
		});
	});

	describe('When moving a draggable element', () => {
		it('it sets `data-drag-active="true"` while moving', () => {
			const drgInstance = draggable();

			makeDraggable(drgElm);

			expect(drgElm.dataset).not.to.haveOwnProperty('dragIsActive');
			simulateMouseDown(drgElm, [50, 50]);
			expect(drgElm.dataset).to.haveOwnProperty('dragIsActive');
			simulateMouseMove(drgElm, [100, 100]);
			expect(drgElm.dataset).to.haveOwnProperty('dragIsActive');
			simulateMouseUp(drgElm, [100, 100]);
			expect(drgElm.dataset).not.to.haveOwnProperty('dragIsActive');

			drgInstance.destroy();
		});
	});
});
