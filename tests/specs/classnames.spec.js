import {createTarget, simulateMouseDown, simulateMouseMove, simulateMouseUp} from '../utils';
import {
	DRAGGABLE,
	DRAGGING,
} from '../../src/classnames';

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

	it('sets a `draggable` classname on elm', () => {
		draggable(target);
		expect(target.classList.contains(DRAGGABLE)).to.be.true;
	});

	it('sets a `dragging` classname on elm when moving it', () => {
		draggable(target);
		expect(target.classList.contains(DRAGGING)).to.be.false;
		simulateMouseDown(target, [50, 50]);
		expect(target.classList.contains(DRAGGING)).to.be.true;
		simulateMouseMove(target, [50, 50]);
		expect(target.classList.contains(DRAGGING)).to.be.true;
		simulateMouseUp(target, [50, 50]);
		expect(target.classList.contains(DRAGGING)).to.be.false;
	});

	it('leaves only the `draggable` classname on elm when droping it', () => {
		draggable(target);
		simulateMouseDown(target, [50, 50]);
		simulateMouseMove(target, [50, 50]);
		simulateMouseUp(target, [50, 50]);
		expect(target.classList.contains('draggable')).to.be.true;
		expect(target.classList.length).to.equal(1);
	});
};
