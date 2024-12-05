import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggables, draggables} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {createMouseSimulator} from './mouse-simulator';

describe('Events', () => {
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

	describe('.on()', () => {
		it('emits `drag-start` event', () => {
			let fired = false;

			drgInstance.on('drag-start', () => {
				fired = true;
			});

			expect(fired).to.be.false;
			mouse.down();
			expect(fired).to.be.true;
			mouse.up();
		});

		it('emits `dragging` event', () => {
			let fired = false;

			drgInstance.on('dragging', () => {
				fired = true;
			});

			mouse.down();

			expect(fired).to.be.false;
			mouse.move([15, 15]);
			expect(fired).to.be.true;

			mouse.up();
		});

		it('emits `drag-end` event', () => {
			let fired = false;

			drgInstance.on('drag-end', () => {
				fired = true;
			});

			mouse.down();

			expect(fired).to.be.false;
			mouse.up();
			expect(fired).to.be.true;
		});

		it('passes `DragEvent` object to all event handlers', () => {
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
				expect(dragEv.relPos).to.deep.equal([9, 13]);
			});
			drgInstance.on('drag-end', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([9, 13]);
			});

			mouse.down();
			mouse.move([9, 13]);
			mouse.up();
			expect(count).to.equal(3);
		});
	});

	describe('.off()', () => {
		it('stops emitting `drag-start` events', () => {
			let count = 0;

			drgInstance.on('drag-start', () => count++);

			expect(count).to.equal(0);
			mouse.down();
			expect(count).to.equal(1);

			mouse.move([8, 12]);
			mouse.up();

			expect(count).to.equal(1);
			mouse.down();
			expect(count).to.equal(2);

			mouse.move([9, 13]);
			mouse.up();

			drgInstance.off('drag-start');

			expect(count).to.equal(2);
			mouse.down();
			expect(count).to.equal(2);

			mouse.move([17, 25]).up();
		});

		it('stops emitting `dragging` events', () => {
			let count = 0;

			drgInstance.on('dragging', () => count++);

			mouse.down();
			expect(count).to.equal(0);
			mouse.move([8, 12]);
			expect(count).to.equal(1);
			mouse.up();

			mouse.down();
			expect(count).to.equal(1);
			mouse.move([9, 13]);
			expect(count).to.equal(2);
			mouse.up();

			drgInstance.off('dragging');

			mouse.down();
			expect(count).to.equal(2);
			mouse.move([17, 25]);
			expect(count).to.equal(2);
			mouse.up();
		});

		it('stops emitting `drag-end`s event', () => {
			let count = 0;

			drgInstance.on('drag-end', () => count++);

			mouse.down();
			mouse.move([10, 10]);

			expect(count).to.equal(0);
			mouse.up();
			expect(count).to.equal(1);

			mouse.down();
			mouse.move([10, 10]);

			expect(count).to.equal(1);
			mouse.up();
			expect(count).to.equal(2);

			drgInstance.off('drag-end');

			mouse.down();
			mouse.move([10, 10]);

			expect(count).to.equal(2);
			mouse.up();
			expect(count).to.equal(2);
		});
	});
});
