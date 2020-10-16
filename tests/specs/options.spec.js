import { DRAGGABLE } from '../../src/classnames';
import {
	px,
	createTarget,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp
} from '../utils';

const DEFAULT_POSITION = 120;

export default () => {
	let testDOMContainer, target, box, move, drg;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
		box = target.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		drg && drg.elm && drg.destroy();
		target.parentNode.removeChild(target);
		target = null;
		box = null;
		move = null;
	});

	describe('axis', () => {
		/*
			Why simulating a mouse move on container?
			When restricting to an axis, moving the mouse in the other axis (outside of target)
			misses the mouseup event.
			In this case, if the event is bound to target, the mouseup event occures
			outside (hence the container).
			Fixed by binding the mouseup to the document.
			Test by keep moving the mouse after the drop and verify target is not moving.
		*/
		it('restricts dragging along the X axis only', () => {
			draggable(target, {axis: 'X'});
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(50, 50));

			expect(target.style.left).to.equal(px(box.left + 50));
			expect(target.style.top).to.equal(px(box.top));

			// why container? see comment above
			simulateMouseMove(testDOMContainer, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseUp(testDOMContainer, ...move(150, 150));
			simulateMouseMove(testDOMContainer, ...move(300, 300));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top));
		});

		it('restricts dragging along the Y axis only', () => {
			draggable(target, {axis: 'Y'});
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(50, 50));

			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top + 50));

			// why container? see comment above
			simulateMouseMove(testDOMContainer, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseUp(testDOMContainer, ...move(150, 150));
			simulateMouseMove(testDOMContainer, ...move(300, 300));
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top + 150));
		});
	});

	describe('grip', () => {
		let gripsContainer, gripA, gripB;

		beforeEach(() => {
			gripsContainer = document.createElement('div');
			gripsContainer.id = 'grips-container';

			gripA = document.createElement('div');
			gripA.id = 'grip-A';

			gripB = document.createElement('div');
			gripB.id = 'grip-B';

			gripsContainer.appendChild(gripA);
			gripsContainer.appendChild(gripB);
			target.appendChild(gripsContainer);
		});

		afterEach(() => {
			gripB && gripB.parentNode.removeChild(gripB);
			gripA && gripA.parentNode.removeChild(gripA);
			gripsContainer && gripsContainer.parentNode.removeChild(gripsContainer);
			gripsContainer = null;
			gripA = null;
			gripB = null;
		});

		it('drags the elm only if grabbed by a `grip` element', () => {
			draggable(target, {grip: gripA});

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(150, 0));
			simulateMouseUp(gripA, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));
		});

		it('drags the elm only if grabbed by a `grip` element selector', () => {
			draggable(target, {grip: '#grip-B'});

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(150, 0));
			simulateMouseUp(gripB, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));
		});

		it('drags the elm only if grabbed by a `grip` descendent element', () => {
			draggable(target, {grip: gripsContainer});

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(150, 0));
			simulateMouseUp(gripA, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));
		});

		it('drags the elm only if grabbed by a `grip` selector descendent element', () => {
			draggable(target, {grip: '#grips-container'});

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(150, 0));
			simulateMouseUp(gripB, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));
		});

		it('sets a classname on the grip element', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(target, {grip: gripA});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});

		it('sets a classname on the grip element selector', () => {
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			draggable(target, {grip: '#grip-A'});
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
		});
	});

	describe('classNamespace', () => {
		it('sets a prefix to the `draggable` classname', () => {
			draggable(target, {classNamespace: 'prefix'});
			expect(target.classList.contains(DRAGGABLE)).to.be.false;
			expect(target.classList.contains(`prefix-${DRAGGABLE}`)).to.be.true;
		});
	});

	describe('top', () => {
		it('sets the initial top position of the element', () => {
			draggable(target, {top: 30});

			const newBox = target.getBoundingClientRect();
			expect(newBox.top).to.equal(30);
			expect(newBox.left).to.equal(box.left);
		});
	});

	describe('left', () => {
		it('sets the initial left position of the element', () => {
			draggable(target, {left: 30});

			const newBox = target.getBoundingClientRect();
			expect(newBox.left).to.equal(30);
			expect(newBox.top).to.equal(box.top);
		});
	});

	describe('right', () => {
		it('sets the initial right position of the element', () => {
			const htmlElm = document.getRootNode().firstElementChild;
			const clientWidth = htmlElm.clientWidth;

			draggable(target, {right: 30});

			const newBox = target.getBoundingClientRect();
			expect(clientWidth - newBox.right).to.equal(30);
		});
	});

	describe('bottom', () => {
		it('sets the initial bottom position of the element', () => {
			const htmlElm = document.getRootNode().firstElementChild;
			const clientHeight = htmlElm.clientHeight;

			draggable(target, {bottom: 30});

			const newBox = target.getBoundingClientRect();
			expect(clientHeight - newBox.bottom).to.equal(30);
			expect(newBox.left).to.equal(box.left);
		});
	});

	describe('Mixed Initial Position', () => {
		describe('when target is in the DOM', () => {
			it('sets the initial top-left position of the element', () => {
				draggable(target, {top: 31, left: 32});

				const newBox = target.getBoundingClientRect();
				expect(newBox.top).to.equal(31);
				expect(newBox.left).to.equal(32);
			});

			it('sets the initial bottom-right position of the element', () => {
				const htmlElm = document.getRootNode().firstElementChild;
				const clientWidth = htmlElm.clientWidth;
				const clientHeight = htmlElm.clientHeight;

				draggable(target, {bottom: 31, right: 32});

				const newBox = target.getBoundingClientRect();
				expect(clientHeight - newBox.bottom).to.equal(31);
				expect(clientWidth - newBox.right).to.equal(32);
			});

			it('sets the initial top-right position of the element', () => {
				const htmlElm = document.getRootNode().firstElementChild;
				const clientWidth = htmlElm.clientWidth;

				draggable(target, {top: 31, right: 32});

				const newBox = target.getBoundingClientRect();
				expect(newBox.top).to.equal(31);
				expect(clientWidth - newBox.right).to.equal(32);
			});

			it('sets the initial bottom-left position of the element', () => {
				const htmlElm = document.getRootNode().firstElementChild;
				const clientHeight = htmlElm.clientHeight;

				draggable(target, {bottom: 31, left: 32});

				const newBox = target.getBoundingClientRect();
				expect(clientHeight - newBox.bottom).to.equal(31);
				expect(newBox.left).to.equal(32);
			});
		});

		describe('when target is NOT in the DOM', () => {
			it('sets the initial top-left position of the element', () => {
				const htmlElm = document.getRootNode().firstElementChild;
				const clientWidth = htmlElm.clientWidth;

				target.remove();

				draggable(target, {top: 31});

				const newBox = target.getBoundingClientRect();
				expect(newBox.top).to.equal(31);
				expect(clientWidth - newBox.right).to.equal(DEFAULT_POSITION);
			});

			it('sets the initial bottom-right position of the element', () => {
				target.remove();

				const htmlElm = document.getRootNode().firstElementChild;
				const clientWidth = htmlElm.clientWidth;
				const clientHeight = htmlElm.clientHeight;

				draggable(target, {bottom: 31});

				const newBox = target.getBoundingClientRect();
				expect(clientHeight - newBox.bottom).to.equal(31);
				expect(clientWidth - newBox.right).to.equal(DEFAULT_POSITION);
			});

			it('sets the initial top-right position of the element', () => {
				target.remove();

				const htmlElm = document.getRootNode().firstElementChild;
				const clientWidth = htmlElm.clientWidth;

				draggable(target, {top: 31, right: 32});

				const newBox = target.getBoundingClientRect();
				expect(newBox.top).to.equal(31);
				expect(clientWidth - newBox.right).to.equal(32);
			});

			it('sets the initial bottom-left position of the element', () => {
				target.remove();

				const htmlElm = document.getRootNode().firstElementChild;
				const clientHeight = htmlElm.clientHeight;

				draggable(target, {bottom: 31, left: 32});

				const newBox = target.getBoundingClientRect();
				expect(clientHeight - newBox.bottom).to.equal(31);
				expect(newBox.left).to.equal(32);
			});
		});

	});
};
