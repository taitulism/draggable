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
		it('listens to `grab` events', () => {
			let fired = false;

			drgInstance.on('grab', () => fired = true);

			expect(fired).to.be.false;
			mouse.down();
			expect(fired).to.be.true;
			mouse.up();
		});

		it('listens to `dragStart` events', () => {
			let fired = false;

			drgInstance.on('dragStart', () => fired = true);

			expect(fired).to.be.false;
			mouse.down();
			expect(fired).to.be.false;
			mouse.move([2, 2]);
			expect(fired).to.be.true;
			mouse.up();
		});

		it('listens to `dragging` events', () => {
			let fired = false;

			drgInstance.on('dragging', () => fired = true);

			mouse.down();
			expect(fired).to.be.false;
			mouse.move([2, 2]);
			expect(fired).to.be.false;
			mouse.move([2, 2]);
			expect(fired).to.be.true;

			mouse.up();
		});

		it('listens to `drag-end` events', () => {
			let fired = false;

			drgInstance.on('dragEnd', () => fired = true);

			mouse.down();
			expect(fired).to.be.false;
			mouse.up();
			expect(fired).to.be.true;
		});

		it('passes `DragEventWrapper` object to all event handlers', () => {
			let count = 0;

			// TODO:test use spy because errors inside handlers are uncaught
			drgInstance.on('grab', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([0, 0]);
			});
			drgInstance.on('dragStart', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([2, 2]);
			});
			drgInstance.on('dragging', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([9, 10]);
			});
			drgInstance.on('dragEnd', (dragEv) => {
				count++;
				expect(dragEv.elm).toBe(drgElm);
				expect(dragEv.ev).to.be.instanceOf(Event);
				expect(dragEv.relPos).to.deep.equal([9, 10]);
			});

			mouse.down().move([2, 2]).move([7, 8]).up();
			expect(count).to.equal(4);
		});
	});

	describe('.off()', () => {
		it('stops listening to `grab` events', () => {
			let count = 0;

			drgInstance.on('grab', () => count++);

			expect(count).to.equal(0);
			mouse.down();
			expect(count).to.equal(1);

			mouse.move([2, 2]).up();

			expect(count).to.equal(1);
			mouse.down();
			expect(count).to.equal(2);

			mouse.move([2, 2]).up();

			drgInstance.off('grab');

			expect(count).to.equal(2);
			mouse.down();
			expect(count).to.equal(2);

			mouse.move([2, 2]).up();
		});

		it('stops listening to `dragStart` events', () => {
			let count = 0;

			drgInstance.on('dragStart', () => count++);

			expect(count).to.equal(0);
			mouse.down().move([2, 2]);
			expect(count).to.equal(1);
			mouse.up();

			expect(count).to.equal(1);
			mouse.down().move([2, 2]);
			expect(count).to.equal(2);
			mouse.up();

			drgInstance.off('dragStart');

			expect(count).to.equal(2);
			mouse.down().move([2, 2]);
			expect(count).to.equal(2);
			mouse.up();
		});

		it('stops listening to `dragging` events', () => {
			let count = 0;

			drgInstance.on('dragging', () => count++);

			mouse.down();
			mouse.move([2, 2]);
			expect(count).to.equal(0);
			mouse.move([2, 2]);
			expect(count).to.equal(1);
			mouse.up();

			mouse.down();
			mouse.move([2, 2]);
			expect(count).to.equal(1);
			mouse.move([2, 2]);
			expect(count).to.equal(2);
			mouse.up();

			drgInstance.off('dragging');

			mouse.down();
			expect(count).to.equal(2);
			mouse.move([2, 2]);
			expect(count).to.equal(2);
			mouse.move([2, 2]);
			expect(count).to.equal(2);
			mouse.up();
		});

		it('stops listening to `dragEnd`s event', () => {
			let count = 0;

			drgInstance.on('dragEnd', () => count++);

			mouse.down();
			mouse.move([2, 2]);

			expect(count).to.equal(0);
			mouse.up();
			expect(count).to.equal(1);

			mouse.down();
			mouse.move([2, 2]);

			expect(count).to.equal(1);
			mouse.up();
			expect(count).to.equal(2);

			drgInstance.off('dragEnd');

			mouse.down();
			mouse.move([2, 2]);

			expect(count).to.equal(2);
			mouse.up();
			expect(count).to.equal(2);
		});
	});
});
