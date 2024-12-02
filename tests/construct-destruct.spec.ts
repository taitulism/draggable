import {describe, it, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';
import {type Draggables, draggables} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';

describe('draggables', () => {
	let drgElm: HTMLElement;
	let drgElm2: HTMLElement;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgElm2 = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		document.body.appendChild(drgElm2);
	});

	afterEach(() => {
		drgElm.remove();
		drgElm2.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('Creation', () => {
		it('is a function', () => expect(draggables).to.be.a('function'));

		it('returns a `Draggables` instance', () => {
			const drgInstance = draggables();
			const ctor = Object.getPrototypeOf(drgInstance).constructor;

			expect(ctor.name).to.equal('Draggables');
			drgInstance.destroy();
		});

		describe('with no arguments', () => {
			it('enable all draggables under <body>', () => {
				const drgInstance = draggables();

				simulateMouseDown(drgElm, [0, 0]);
				simulateMouseMove(drgElm, [100, 80]);
				simulateMouseUp(drgElm, [100, 80]);
				expect(drgElm.style.transform).to.equal(translate(100, 80));

				simulateMouseDown(drgElm2, [10, 510]);
				simulateMouseMove(drgElm2, [28, 580]);
				simulateMouseUp(drgElm2, [28, 580]);
				expect(drgElm2.style.transform).to.equal(translate(18, 70));

				drgInstance.destroy();
			});
		});

		describe('with an HTML element', () => {
			it('enable all draggables under given element', () => {
				const drgInstance = draggables(testContainerElm);

				simulateMouseDown(drgElm, [0, 0]);
				simulateMouseMove(drgElm, [100, 80]);
				simulateMouseUp(drgElm, [100, 80]);
				expect(drgElm.style.transform).to.equal(translate(100, 80));

				simulateMouseDown(drgElm2, [10, 510]);
				simulateMouseMove(drgElm2, [28, 580]);
				simulateMouseUp(drgElm2, [28, 580]);
				expect(drgElm2.style.transform).to.be.empty;

				drgInstance.destroy();
			});
		});

		describe('When called again with the same context element', () => {
			it('throws an error', () => {
				// test default <body>
				let drgInstance1: Draggables;
				const badFn1 = () => {
					drgInstance1 = draggables();
					/* errInstance = */ draggables();
				};

				expect(badFn1).to.throw('already bound and cannot be bound twice');
				drgInstance1!.destroy();

				// test given element
				let drgInstance2: Draggables;
				const badFn2 = () => {
					drgInstance2 = draggables(testContainerElm);
					/* errInstance = */ draggables(testContainerElm);
				};

				expect(badFn2).to.throw('already bound and cannot be bound twice');
				drgInstance2!.destroy();
			});
		});

		describe('When one context element contains another', () => {
			it('only triggers the inner one', () => {
				const drgInstance1 = draggables();
				const drgInstance2 = draggables(testContainerElm);

				let count1 = 0;
				let count2 = 0;

				drgInstance1.on('start', () => {
					count1++;
				});
				drgInstance2.on('start', () => {
					count2++;
				});

				simulateMouseDown(drgElm, [0, 0]);
				simulateMouseUp(drgElm, [0, 0]);

				drgInstance1.destroy();
				drgInstance2.destroy();

				expect(count1).to.equal(0);
				expect(count2).to.equal(1);
			});
		});
	});

	describe('.destroy()', () => {
		let drgInstance: Draggables;

		beforeEach(() => {
			drgInstance = draggables();
		});

		afterEach(() => {
			drgInstance.destroy();
		});

		it('disables dragging', () => {
			simulateMouseDown(drgElm, [0, 0]);
			simulateMouseMove(drgElm, [100, 80]);
			simulateMouseUp(drgElm, [100, 80]);
			expect(drgElm.style.transform).to.equal(translate(100, 80));

			drgInstance.destroy();

			simulateMouseDown(drgElm, [100, 80]);
			simulateMouseMove(drgElm, [124, 96]);
			simulateMouseUp(drgElm, [124, 96]);
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
