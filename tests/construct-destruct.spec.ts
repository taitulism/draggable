import {describe, it, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';
import {type Draggable, draggable} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {
	type Point,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('draggable', () => {
	let drgElm: HTMLElement;
	let drgElm2: HTMLElement;
	let testContainerElm: HTMLElement;
	let box: DOMRect;
	let box2: DOMRect;
	let move: (x: number, y: number) => Point;
	let move2: (x: number, y: number) => Point;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgElm2 = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		document.body.appendChild(drgElm2);
		box = drgElm.getBoundingClientRect();
		box2 = drgElm2.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
		move2 = (x, y) => [(box.left + x), (box2.top + y)];
	});

	afterEach(() => {
		drgElm.remove();
		drgElm2.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('Creation', () => {
		it('is a function', () => expect(draggable).to.be.a('function'));

		it('returns a `Draggable` instance', () => {
			const drgInstance = draggable();
			const ctor = Object.getPrototypeOf(drgInstance).constructor;

			expect(ctor.name).to.equal('Draggable');
			drgInstance.destroy();
		});

		describe('with no arguments', () => {
			it('enable all draggables under <body>', () => {
				const drgInstance = draggable();

				simulateMouseDown(drgElm, move(0, 0));
				simulateMouseMove(drgElm, move(100, 80));
				simulateMouseUp(drgElm, move(100, 80));
				expect(drgElm.style.transform).to.equal(translate(100, 80));

				simulateMouseDown(drgElm2, move2(10, 510));
				simulateMouseMove(drgElm2, move2(28, 580));
				simulateMouseUp(drgElm2, move2(28, 580));
				expect(drgElm2.style.transform).to.equal(translate(18, 70));

				drgInstance.destroy();
			});
		});

		describe('with an HTML element', () => {
			it('enable all draggables under given element', () => {
				const drgInstance = draggable(testContainerElm);

				simulateMouseDown(drgElm, move(0, 0));
				simulateMouseMove(drgElm, move(100, 80));
				simulateMouseUp(drgElm, move(100, 80));
				expect(drgElm.style.transform).to.equal(translate(100, 80));

				simulateMouseDown(drgElm2, move2(10, 510));
				simulateMouseMove(drgElm2, move2(28, 580));
				simulateMouseUp(drgElm2, move2(28, 580));
				expect(drgElm2.style.transform).to.be.empty;

				drgInstance.destroy();
			});
		});
	});

	describe('.destroy()', () => {
		let drgInstance: Draggable;

		beforeEach(() => {
			drgInstance = draggable();
		});

		afterEach(() => {
			drgInstance.destroy();
		});

		it('disables dragging', () => {
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(100, 80));
			simulateMouseUp(drgElm, move(100, 80));
			expect(drgElm.style.transform).to.equal(translate(100, 80));

			drgInstance.destroy();

			simulateMouseDown(drgElm, move(100, 80));
			simulateMouseMove(drgElm, move(124, 96));
			simulateMouseUp(drgElm, move(124, 96));
			expect(drgElm.style.transform).to.equal(translate(100, 80));
		});

		it('removes all listeners', () => {
			let grabs = 0;
			let moves = 0;
			let drops = 0;

			drgInstance.on('start', () => {
				grabs++;
			});
			drgInstance.on('ing', () => {
				moves++;
			});
			drgInstance.on('drop', () => {
				drops++;
			});

			expect(grabs).to.equal(0);
			simulateMouseDown(drgElm, [50, 50]);
			expect(grabs).to.equal(1);

			expect(moves).to.equal(0);
			simulateMouseMove(drgElm, [50, 50]);
			expect(moves).to.equal(1);

			simulateMouseMove(drgElm, [150, 150]);
			expect(moves).to.equal(2);

			expect(drops).to.equal(0);
			simulateMouseUp(drgElm, [150, 150]);
			expect(drops).to.equal(1);

			expect(moves).to.equal(2);
			simulateMouseMove(drgElm, [160, 160]);
			expect(moves).to.equal(2);

			drgInstance.destroy();

			simulateMouseDown(drgElm, [160, 160]);
			simulateMouseMove(drgElm, [160, 160]);
			simulateMouseUp(drgElm, [160, 160]);

			expect(grabs).to.equal(1);
			expect(moves).to.equal(2);
			expect(drops).to.equal(1);
		});
	});
});
