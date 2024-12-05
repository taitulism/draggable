import {describe, it, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';
import {type Draggables, draggables} from '../src';
import {createContainerElm, createDraggableElm} from './dom-utils';
import {translate} from './utils';
import {createMouseSimulator} from './mouse-simulator';

describe('draggables', () => {
	let drgElm: HTMLElement;
	let drgElm2: HTMLElement;
	let testContainerElm: HTMLElement;
	let mouse: ReturnType<typeof createMouseSimulator>;

	beforeAll(() => {
		testContainerElm = createContainerElm();
		document.body.appendChild(testContainerElm);
		mouse = createMouseSimulator();
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgElm2 = createDraggableElm();
		testContainerElm.appendChild(drgElm);
		document.body.appendChild(drgElm2);
		mouse.moveToElm(drgElm);
	});

	afterEach(() => {
		drgElm.remove();
		drgElm2.remove();
		mouse.reset();
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
			it('enables all draggables under <body>', () => {
				const drgInstance = draggables();

				mouse.down().move([8, 12]).up();
				expect(drgElm.style.translate).to.equal(translate(8, 12));

				mouse.moveToElm(drgElm2);

				mouse.down().move([9, 13]).up();
				expect(drgElm2.style.translate).to.equal(translate(9, 13));

				drgInstance.destroy();
			});
		});

		describe('with an HTML element', () => {
			it('enables all draggables under given element', () => {
				const drgInstance = draggables(testContainerElm);

				mouse.down().move([8, 12]).up();
				expect(drgElm.style.translate).to.equal(translate(8, 12));

				mouse.moveToElm(drgElm2);

				mouse.down().move([8, 12]).up();
				expect(drgElm2.style.translate).to.be.empty;

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

				mouse.down().up();

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
			mouse.down().move([8, 12]).up();
			expect(drgElm.style.translate).to.equal(translate(8, 12));

			drgInstance.destroy();

			mouse.down().move([9, 13]).up();
			expect(drgElm.style.translate).to.equal(translate(8, 12));
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
			mouse.down();
			expect(grabs).to.equal(1);

			expect(moves).to.equal(0);
			mouse.move([8, 12]);
			expect(moves).to.equal(1);

			mouse.move([8, 12]);
			expect(moves).to.equal(2);

			expect(drops).to.equal(0);
			mouse.up();
			expect(drops).to.equal(1);

			expect(moves).to.equal(2);
			mouse.move([9, 13]);
			expect(moves).to.equal(2);

			drgInstance.destroy();

			mouse.down().move([9, 13]).up();
			expect(grabs).to.equal(1);
			expect(moves).to.equal(2);
			expect(drops).to.equal(1);
		});
	});
});
