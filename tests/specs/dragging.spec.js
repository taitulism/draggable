import {createTarget, simulateMouseDown, simulateMouseMove, simulateMouseUp, translate} from '../utils';

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
		draggable(target);

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.transform).to.be.empty;

		simulateMouseMove(target, ...move(150, 0));
		expect(target.style.transform).to.equal(translate(150, 0));

		simulateMouseUp(target, ...move(150, 0));
		expect(target.style.transform).to.equal(translate(150, 0));

		simulateMouseDown(target, ...move(150, 0));
		expect(target.style.transform).to.equal(translate(150, 0));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.transform).to.equal(translate(0, 0));
	});

	it('moves the elm on the Y axis', () => {
		draggable(target);

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.transform).to.be.empty;

		simulateMouseMove(target, ...move(0, 150));
		expect(target.style.transform).to.equal(translate(0, 150));

		simulateMouseUp(target, ...move(0, 150));
		expect(target.style.transform).to.equal(translate(0, 150));

		simulateMouseDown(target, ...move(0, 150));
		expect(target.style.transform).to.equal(translate(0, 150));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.transform).to.equal(translate(0, 0));
	});

	it('moves the elm freely on both axes', () => {
		draggable(target);

		simulateMouseDown(target, ...move(0, 0));
		expect(target.style.transform).to.be.empty;

		simulateMouseMove(target, ...move(150, 150));
		expect(target.style.transform).to.equal(translate(150, 150));

		simulateMouseUp(target, ...move(150, 150));
		expect(target.style.transform).to.equal(translate(150, 150));

		simulateMouseDown(target, ...move(150, 150));
		expect(target.style.transform).to.equal(translate(150, 150));

		simulateMouseMove(target, ...move(0, 0));
		simulateMouseUp(target, ...move(0, 0));
		expect(target.style.transform).to.equal(translate(0, 0));
	});
};
