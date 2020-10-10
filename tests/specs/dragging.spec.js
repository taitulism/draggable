import {px, createTarget, simulateMouseDown, simulateMouseMove, simulateMouseUp} from '../utils';

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

	it('moves the elm on the X axis', () => {
		expect(target.style.left).to.be.empty;
		draggable(target);
		expect(target.style.left).to.equal(px(box.left));

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.left).to.equal(px(box.left));

		simulateMouseMove(target, ...move(150, 0));
		simulateMouseUp(target, ...move(150, 0));
		expect(target.style.left).to.equal(px(box.left + 150));

		simulateMouseDown(target, ...move(150, 0));
		expect(target.style.left).to.equal(px(box.left + 150));
		simulateMouseMove(target, ...move(150, 0));
		expect(target.style.left).to.equal(px(box.left + 150));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.left).to.equal(px(box.left));
	});

	it('moves the elm on the Y axis', () => {
		expect(target.style.top).to.be.empty;
		draggable(target);
		expect(target.style.top).equal(px(box.top));

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.top).to.equal(px(box.top));

		simulateMouseMove(target, ...move(0, 150));
		simulateMouseUp(target, ...move(0, 150));
		expect(target.style.top).to.equal(px(box.top + 150));

		simulateMouseDown(target, ...move(0, 150));
		expect(target.style.top).to.equal(px(box.top + 150));
		simulateMouseMove(target, ...move(0, 150));
		expect(target.style.top).to.equal(px(box.top + 150));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.top).to.equal(px(box.top));
	});

	it('moves the elm freely on both axes', () => {
		expect(target.style.left).to.be.empty;
		expect(target.style.top).to.be.empty;
		draggable(target);
		expect(target.style.left).equal(px(box.left));
		expect(target.style.top).equal(px(box.top));

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.left).to.equal(px(box.left));
		expect(target.style.top).to.equal(px(box.top));

		simulateMouseMove(target, ...move(150, 150));
		simulateMouseUp(target, ...move(150, 150));
		expect(target.style.left).to.equal(px(box.left + 150));
		expect(target.style.top).to.equal(px(box.top + 150));

		simulateMouseDown(target, ...move(150, 150));
		expect(target.style.left).to.equal(px(box.left + 150));
		expect(target.style.top).to.equal(px(box.top + 150));
		simulateMouseMove(target, ...move(150, 150));
		expect(target.style.left).to.equal(px(box.left + 150));
		expect(target.style.top).to.equal(px(box.top + 150));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.left).to.equal(px(box.left));
		expect(target.style.top).to.equal(px(box.top));
	});
};
