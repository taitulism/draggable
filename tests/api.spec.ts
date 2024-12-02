import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggables, draggables} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('API', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggables;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		drgInstance = draggables();
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
			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [50, 0]);
			simulateMouseUp(drgElm, [50, 0]);
			expect(drgElm.style.transform).to.equal(translate(50, 0));

			simulateMouseDown(drgElm, [50, 0]);
			simulateMouseMove(drgElm, [100, 0]);
			simulateMouseUp(drgElm, [100, 0]);
			expect(drgElm.style.transform).to.equal(translate(100, 0));

			drgInstance.disable();

			simulateMouseDown(drgElm, [100, 0]);
			simulateMouseMove(drgElm, [150, 0]);
			simulateMouseUp(drgElm, [150, 0]);
			expect(drgElm.style.transform).to.equal(translate(100, 0));

			drgInstance.enable();

			simulateMouseDown(drgElm, [100, 0]);
			simulateMouseMove(drgElm, [150, 0]);
			simulateMouseUp(drgElm, [150, 0]);
			expect(drgElm.style.transform).to.equal(translate(150, 0));
		});

		it('toggles draggability while dragging', () => {
			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [100, 0]);
			expect(drgElm.style.transform).to.equal(translate(100, 0));

			drgInstance.disable();

			simulateMouseMove(drgElm, [200, 0]);
			expect(drgElm.style.transform).to.equal(translate(100, 0));
			simulateMouseUp(drgElm, [200, 0]);
		});
	});

	describe('.on', () => {
		it('is chainable', () => {
			drgInstance = draggables(drgElm);
			expect(drgInstance.on('start', () => null)).to.deep.equal(drgInstance);
		});
	});
});
