import {px, simulateMouseDown, simulateMouseMove, simulateMouseUp} from './utils';

export default () => {
	let testDOMContainer, container, target, box, move, drg;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
		if (!testDOMContainer) {
			testDOMContainer = document.createElement('div');
			testDOMContainer.id = 'test-dom-container';
			document.body.appendChild(testDOMContainer);
		}
	});

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'container';
		container.style.height = '400px';
		container.style.width = '1000';
		container.style.padding = '20px';

		target = document.createElement('div');
		target.id = 'target';
		target.style.width = '100px';
		target.style.height = '100px';
		target.style.backgroundColor = 'pink';

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();
		move = (x, y) => [(box.left + x), (box.top + y)];
	});

	afterEach(() => {
		if (drg && drg.elm) drg.destroy();

		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		box = null;
		move = null;
	});

	after(() => {
		testDOMContainer = null;
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
			simulateMouseMove(container, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left + 150));
			expect(target.style.top).to.equal(px(box.top));

			simulateMouseUp(container, ...move(150, 150));
			simulateMouseMove(container, ...move(300, 300));
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
			simulateMouseMove(container, ...move(150, 150));
			expect(target.style.left).to.equal(px(box.left));
			expect(target.style.top).to.equal(px(box.top + 150));

			simulateMouseUp(container, ...move(150, 150));
			simulateMouseMove(container, ...move(300, 300));
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

		// ? :/
		it.skip('sets a classname on the grip element');
	});
};
