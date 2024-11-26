import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
} from './utils';

describe('Events', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggable;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		drgInstance = draggable();
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('.on()', () => {
		it('emits `drag-start` event', () => {
			let fired = false;

			drgInstance.on('drag-start', () => {
				fired = true;
			});

			expect(fired).to.be.false;
			simulateMouseDown(drgElm, [0, 0]);
			expect(fired).to.be.true;
			simulateMouseUp(drgElm, [0, 0]);
		});

		it('emits `dragging` event', () => {
			let fired = false;

			drgInstance.on('dragging', () => {
				fired = true;
			});

			simulateMouseDown(drgElm, [0, 0]);

			expect(fired).to.be.false;
			simulateMouseMove(drgElm, [15, 15]);
			expect(fired).to.be.true;

			simulateMouseUp(drgElm, [15, 15]);
		});

		it('emits `drag-end` event', () => {
			let fired = false;

			drgInstance.on('drag-end', () => {
				fired = true;
			});

			simulateMouseDown(drgElm, [0, 0]);

			expect(fired).to.be.false;
			simulateMouseUp(drgElm, [0, 0]);
			expect(fired).to.be.true;
		});

		it('passed DragEvent object to all event handlers', () => {
			let count = 0;

			// TODO:test use spy because errors inside handlers are uncaught
			drgInstance.on('drag-start', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([0, 0]);
			});
			drgInstance.on('dragging', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([15, 15]);
			});
			drgInstance.on('drag-end', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([15, 15]);
			});

			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);
			simulateMouseUp(drgElm, [15, 15]);

			expect(count).to.equal(3);
		});
	});

	describe('.off()', () => {
		it('stops emitting `drag-start` events', () => {
			let count = 0;

			drgInstance.on('drag-start', () => count++);

			expect(count).to.equal(0);
			simulateMouseDown(drgElm, [0, 0]);
			expect(count).to.equal(1);

			simulateMouseMove(drgElm, [15, 15]);
			simulateMouseUp(drgElm, [15, 15]);

			expect(count).to.equal(1);
			simulateMouseDown(drgElm, [15, 15]);
			expect(count).to.equal(2);

			simulateMouseMove(drgElm, [30, 30]);
			simulateMouseUp(drgElm, [30, 30]);

			drgInstance.off('drag-start');

			expect(count).to.equal(2);
			simulateMouseDown(drgElm, [30, 30]);
			expect(count).to.equal(2);

			simulateMouseMove(drgElm, [45, 45]);
			simulateMouseUp(drgElm, [45, 45]);
		});

		it('stops emitting `dragging` events', () => {
			let count = 0;

			drgInstance.on('dragging', () => count++);

			simulateMouseDown(drgElm, [0, 0]);
			expect(count).to.equal(0);
			simulateMouseMove(drgElm, [15, 15]);
			expect(count).to.equal(1);
			simulateMouseUp(drgElm, [15, 15]);

			simulateMouseDown(drgElm, [15, 15]);
			expect(count).to.equal(1);
			simulateMouseMove(drgElm, [30, 30]);
			expect(count).to.equal(2);
			simulateMouseUp(drgElm, [30, 30]);

			drgInstance.off('dragging');

			simulateMouseDown(drgElm, [30, 30]);
			expect(count).to.equal(2);
			simulateMouseMove(drgElm, [45, 45]);
			expect(count).to.equal(2);
			simulateMouseUp(drgElm, [45, 45]);
		});

		it('stops emitting `drag-end`s event', () => {
			let count = 0;

			drgInstance.on('drag-end', () => count++);

			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);

			expect(count).to.equal(0);
			simulateMouseUp(drgElm, [15, 15]);
			expect(count).to.equal(1);

			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);

			expect(count).to.equal(1);
			simulateMouseUp(drgElm, [0, 0]);
			expect(count).to.equal(2);

			drgInstance.off('drag-end');

			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [15, 15]);

			expect(count).to.equal(2);
			simulateMouseUp(drgElm, [0, 0]);
			expect(count).to.equal(2);
		});
	});
});
