import {createTarget, simulateMouseDown, simulateMouseMove, simulateMouseUp} from '../utils';

export default () => {
	let testDOMContainer, target, drg;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
	});

	afterEach(() => {
		drg && drg.elm && drg.destroy();
		target.parentNode.removeChild(target);
		target = null;
	});

	it('emits `drag-start` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('drag-start', () => { fired = true; });

		simulateMouseDown(target, [50, 50]);
		expect(fired).to.be.true;
		simulateMouseUp(target, [50, 50]);
	});

	it('emits `dragging` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('dragging', () => { fired = true; });

		simulateMouseDown(target, [50, 50]);

		expect(fired).to.be.false;
		simulateMouseMove(target, [50, 50]);
		expect(fired).to.be.true;

		simulateMouseUp(target, [50, 50]);
	});

	it('emits `drag-end` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('drag-end', () => { fired = true; });

		simulateMouseDown(target, [50, 50]);
		expect(fired).to.be.false;
		simulateMouseUp(target, [50, 50]);
		expect(fired).to.be.true;

	});
};
