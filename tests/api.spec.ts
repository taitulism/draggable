import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {type Draggable, draggable} from '../src';
import {
	createDraggableElm,
	createGripsContainer,
	createTestContainerElm,
	Point,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
	translate,
} from './utils';
import {
	DRAGGABLE,
	DRAGGING,
	DRAG_DISABLED,
	DRAG_GRIP,
} from '../src/classnames';

describe('API', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggable;
	let testContainerElm: HTMLElement;

	let box: DOMRect;
	let move: (x: number, y: number) => Point;

	beforeAll(() => {
		testContainerElm = createTestContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgInstance = draggable(drgElm);
		testContainerElm.appendChild(drgElm);
		box = drgElm.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	describe('.enable() / .disable()', () => {
		it('toggles draggability', () => {
			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(150, 0));
			simulateMouseUp(drgElm, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			simulateMouseDown(drgElm, move(150, 0));
			simulateMouseMove(drgElm, move(300, 0));
			simulateMouseUp(drgElm, move(300, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));

			drgInstance.disable();

			simulateMouseDown(drgElm, move(300, 0));
			simulateMouseMove(drgElm, move(450, 0));
			simulateMouseUp(drgElm, move(450, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));

			drgInstance.enable();

			simulateMouseDown(drgElm, move(300, 0));
			simulateMouseMove(drgElm, move(450, 0));
			simulateMouseUp(drgElm, move(450, 0));
			expect(drgElm.style.transform).to.equal(translate(450, 0));
		});

		it('toggles draggability while dragging', () => {
			expect(drgElm.style.transform).to.be.empty;
			simulateMouseDown(drgElm, move(0, 0));
			simulateMouseMove(drgElm, move(100, 0));
			expect(drgElm.style.transform).to.equal(translate(100, 0));

			drgInstance.disable();

			simulateMouseMove(drgElm, move(200, 0));
			expect(drgElm.style.transform).to.equal(translate(100, 0));
			simulateMouseUp(drgElm, move(200, 0));
		});

		it('toggles classname', () => {
			drgInstance = draggable(drgElm);

			expect(drgElm.classList.contains(DRAG_DISABLED)).to.be.false;
			drgInstance.disable();
			expect(drgElm.classList.contains(DRAG_DISABLED)).to.be.true;
			drgInstance.enable();
			expect(drgElm.classList.contains(DRAG_DISABLED)).to.be.false;
		});
	});

	describe('.on', () => {
		it('is chainable', () => {
			drgInstance = draggable(drgElm);
			expect(drgInstance.on('start', () => null)).to.deep.equal(drgInstance);
		});
	});

	describe('.setGrip()', () => {
		let gripsContainer: HTMLElement;
		let gripA: HTMLElement;
		let gripB: HTMLElement;

		beforeEach(() => {
			const [container, gA, gB] = createGripsContainer();
			gripsContainer = container;
			gripA = gA;
			gripB = gB;
			drgElm.appendChild(gripsContainer);
		});

		afterEach(() => {
			drgInstance.setGrip(null);
			gripsContainer.remove();
		});

		it('sets the drag handle element', () => {
			drgInstance = draggable(drgElm, {grip: gripA});

			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(1, 0));
			simulateMouseMove(gripA, move(150, 3));
			simulateMouseUp(gripA, move(150, 3));
			expect(drgElm.style.transform).to.equal(translate(149, 3));

			// TODO:test after the first drag it's no longer at 0,0 (same for next test)
			// TODO:test also, why checking transform in these tests?
			simulateMouseDown(gripB, move(154, 3));
			simulateMouseMove(gripB, move(300, 5));
			simulateMouseUp(gripB, move(300, 5));
			expect(drgElm.style.transform).to.equal(translate(146, 2));

			drgInstance.setGrip(gripB);

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(300, 0));
			simulateMouseUp(gripA, move(300, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));

			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));
		});

		it('sets the drag handle element selector', () => {
			drgInstance = draggable(drgElm, {grip: '#grip-A'});

			expect(drgElm.style.transform).to.be.empty;

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(150, 0));
			simulateMouseUp(gripA, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));


			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(300, 0));
			simulateMouseUp(gripB, move(300, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));


			drgInstance.setGrip('#grip-B');

			simulateMouseDown(gripA, move(0, 0));
			simulateMouseMove(gripA, move(300, 0));
			simulateMouseUp(gripA, move(300, 0));
			expect(drgElm.style.transform).to.equal(translate(150, 0));


			simulateMouseDown(gripB, move(0, 0));
			simulateMouseMove(gripB, move(150, 0));
			simulateMouseUp(gripB, move(150, 0));
			expect(drgElm.style.transform).to.equal(translate(300, 0));
		});

		it('sets the grip classname on the new grip', () => {
			drgInstance = draggable(drgElm);
			expect(gripA.classList.contains(DRAG_GRIP)).to.be.false;
			expect(gripB.classList.contains(DRAG_GRIP)).to.be.false;

			drgInstance.setGrip(gripA);
			expect(gripA.classList.contains(DRAG_GRIP)).to.be.true;
			expect(gripB.classList.contains(DRAG_GRIP)).to.be.false;

			drgInstance.setGrip('#grip-B');
			expect(gripA.classList.contains(DRAG_GRIP)).to.be.false;
			expect(gripB.classList.contains(DRAG_GRIP)).to.be.true;

			drgInstance.setGrip(null);
			expect(gripA.classList.contains(DRAG_GRIP)).to.be.false;
			expect(gripB.classList.contains(DRAG_GRIP)).to.be.false;
		});
	});

	describe('.moveBy(x, y)', () => {
		it('moves the element using CSS `transform`', () => {
			expect(drgElm.style.transform).to.be.empty;
			drgInstance.moveBy(50, 25);
			expect(drgElm.style.transform).to.equal('translate(50px, 25px)');
		});

		it('replaces the current `transform` value', () => {
			expect(drgElm.style.transform).to.be.empty;

			drgInstance.moveBy(10, 15);
			expect(drgElm.style.transform).to.equal('translate(10px, 15px)');

			drgInstance.moveBy(2, 4);
			expect(drgElm.style.transform).not.to.equal('translate(12px, 19px)');
			expect(drgElm.style.transform).to.equal('translate(2px, 4px)');
		});

		it('moves the element relative to its original position', () => {
			expect(box.left).to.equal(75);
			drgInstance.moveBy(7, 0);

			const newBox = drgElm.getBoundingClientRect();
			expect(newBox.left).to.equal(75 + 7);

			drgInstance.moveBy(3, 0);

			const newBox2 = drgElm.getBoundingClientRect();
			expect(newBox2.left).to.equal(75 + 3);
		});
	});

	describe('.destroy()', () => {
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

			expect(grabs).to.equal(1);
			simulateMouseDown(drgElm, [160, 160]);
			expect(grabs).to.equal(1);

			expect(moves).to.equal(2);
			simulateMouseMove(drgElm, [160, 160]);
			expect(moves).to.equal(2);

			expect(drops).to.equal(1);
			simulateMouseUp(drgElm, [160, 160]);
			expect(drops).to.equal(1);
		});

		it('removes all classnames', () => {
			const gripA = document.createElement('div');
			gripA.id = 'grip-A';

			const inst = draggable(drgElm, {grip: gripA});

			simulateMouseDown(drgElm, [80, 80]);
			simulateMouseMove(drgElm, [100, 100]);
			simulateMouseMove(drgElm, [112, 112]);
			simulateMouseUp(drgElm, [112, 112]);
			simulateMouseMove(drgElm, [160, 160]);

			inst.destroy();
			expect(gripA.classList.contains(DRAG_GRIP)).to.be.false;
			expect(drgElm.classList.contains(DRAGGABLE)).to.be.false;

			simulateMouseDown(drgElm, [140, 140]);
			expect(drgElm.classList.contains(DRAGGING)).to.be.false;

			simulateMouseMove(drgElm, [145, 145]);
			expect(drgElm.classList.contains(DRAGGING)).to.be.false;
		});

		it('releases the target element', () => {
			expect(drgInstance.elm).to.deep.equal(drgElm);
			drgInstance.destroy();
			// expect(drgInstance.elm).to.be.null;
		});
	});
});
