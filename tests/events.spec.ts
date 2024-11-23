import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type DraggingLayer, draggable} from '../src';
import {
	createDraggableElm,
	createTestContainerElm,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
} from './utils';

describe('Events', () => {
	let drgElm: HTMLElement;
	let drgInstance: DraggingLayer;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createTestContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgInstance = draggable(drgElm);
		testContainerElm.appendChild(drgElm);
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	it('emits `drag-start` event', () => {
		drgInstance = draggable(drgElm);

		let fired = false;

		drgInstance.on('drag-start', () => {
			fired = true;
		});

		simulateMouseDown(drgElm, [50, 50]);
		expect(fired).to.be.true;
		simulateMouseUp(drgElm, [50, 50]);
	});

	it('emits `dragging` event', () => {
		drgInstance = draggable(drgElm);

		let fired = false;

		drgInstance.on('dragging', () => {
			fired = true;
		});

		simulateMouseDown(drgElm, [50, 50]);

		expect(fired).to.be.false;
		simulateMouseMove(drgElm, [50, 50]);
		expect(fired).to.be.true;

		simulateMouseUp(drgElm, [50, 50]);
	});

	it('emits `drag-end` event', () => {
		drgInstance = draggable(drgElm);

		let fired = false;

		drgInstance.on('drag-end', () => {
			fired = true;
		});

		simulateMouseDown(drgElm, [50, 50]);
		expect(fired).to.be.false;
		simulateMouseUp(drgElm, [50, 50]);
		expect(fired).to.be.true;
	});
});
