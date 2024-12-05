import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {draggables} from '../src';
import {translate} from './utils';
import {createMouseSimulator} from './mouse-simulator';
import {
	createContainerElm,
	createTargetElm,
	makeDraggable,
	addGrip,
	setAxis,
	addChild,
	addGripChild,
} from './dom-utils';

describe('Data Attributes', () => {
	let drgElm: HTMLElement;
	let testContainerElm: HTMLElement;
	let mouse: ReturnType<typeof createMouseSimulator>;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
		mouse = createMouseSimulator();
	});

	beforeEach(() => {
		drgElm = createTargetElm();
		testContainerElm.appendChild(drgElm);
		mouse.moveToElm(drgElm);
	});

	afterEach(() => {
		drgElm.remove();
		mouse.reset();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('An element with `data-drag-role="draggable"`', () => {
		it('becomes draggable', () => {
			const drgInstance = draggables();

			mouse.down();
			mouse.move([8, 12]);
			mouse.up();
			expect(drgElm.style.transform).to.be.empty;

			makeDraggable(drgElm);

			mouse.down();
			mouse.move([8, 12]);
			mouse.up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			drgInstance.destroy();
		});

		it('also by its children', () => {
			const drgInstance = draggables();
			const child = addChild(drgElm);
			makeDraggable(drgElm);
			mouse.moveToElm(child);

			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			drgInstance.destroy();
		});
	});

	describe('An element with `data-drag-role="grip"`', () => {
		it('becomes the closest draggable\'s grip', () => {
			const drgInstance = draggables();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);
			mouse.moveToElm(grip);

			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			drgInstance.destroy();
		});

		it('its children also function as grips', () => {
			const drgInstance = draggables();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);
			const gripChild = addGripChild(grip);
			mouse.moveToElm(gripChild);

			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			drgInstance.destroy();
		});

		it('prevents dragging the closest draggable not via grip', () => {
			const drgInstance = draggables();

			makeDraggable(drgElm);
			const grip = addGrip(drgElm);
			const child = addChild(drgElm);

			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.be.empty;

			mouse.moveToElm(child);
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.be.empty;

			mouse.moveToElm(grip);
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 12));

			drgInstance.destroy();
		});

		it.skip('throws if not inside a draggable element', () => {
			const originalWindowOnError = window.onerror;

			const promise = new Promise((resolve, reject) => {
				const drgInstance = draggables();

				// makeDraggable(drgElm);
				const grip = addGrip(drgElm);

				let errMsg: unknown;

				window.onerror = (message) => {
					errMsg = message;
					try {
						expect(errMsg).to.include('must be inside a draggable');
						mouse.up();
						drgInstance.destroy();
						window.onerror = originalWindowOnError;
						resolve(true);
					}
					catch (err) {
						reject(err);
					}
				};

				mouse.moveToElm(grip);
				mouse.down().move([8, 12]);
				expect(true).to.be.false;
			});

			return promise;
		});
	});

	describe('An element with `data-drag-axis="x | y"`', () => {
		it('makes the draggable element only move on that axis', () => {
			const drgInstance = draggables();

			makeDraggable(drgElm);

			setAxis(drgElm, 'x');
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(8, 0));

			// TODO:test - switching axis after move fails (no reset position)

			// reset position
			mouse.down().move([-8, -12]).up();
			expect(drgElm.style.transform).to.equal(translate(0, 0));

			setAxis(drgElm, 'y');
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.transform).to.equal(translate(0, 12));

			drgInstance.destroy();
		});
	});

	describe('While moving a draggable element', () => {
		it('sets an empty attribute `data-drag-active`', () => {
			const drgInstance = draggables();

			makeDraggable(drgElm);

			expect(drgElm.dataset).not.to.haveOwnProperty('dragActive');
			mouse.down();
			expect(drgElm.dataset).to.haveOwnProperty('dragActive');
			mouse.move([8, 12]);
			expect(drgElm.dataset).to.haveOwnProperty('dragActive');
			mouse.up();
			expect(drgElm.dataset).not.to.haveOwnProperty('dragActive');

			drgInstance.destroy();
		});
	});
});
