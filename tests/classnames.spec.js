import {simulateMouseDown, simulateMouseMove, simulateMouseUp} from './utils';

export default () => {
	let testDOMContainer, container, target, drg;

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
	});

	afterEach(() => {
		if (drg && drg.elm) drg.destroy();

		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;
	});

	after(() => {
		testDOMContainer = null;
	});

	it('sets a `draggable` classname on elm', () => {
		draggable(target);
		expect(target.classList.contains('draggable')).to.be.true;
	});

	it('sets a `grabbed` classname on elm when grabbing it', () => {
		draggable(target);
		expect(target.classList.contains('grabbed')).to.be.false;
		simulateMouseDown(target, 50, 50);
		expect(target.classList.contains('grabbed')).to.be.true;
		simulateMouseUp(target, 50, 50);
		expect(target.classList.contains('grabbed')).to.be.false;
	});

	it('sets a `dragging` classname on elm when moving it', () => {
		draggable(target);
		expect(target.classList.contains('dragging')).to.be.false;
		simulateMouseDown(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.false;
		simulateMouseMove(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.true;
		simulateMouseUp(target, 50, 50);
		expect(target.classList.contains('dragging')).to.be.false;
	});

	it('leaves only the `draggable` classname on elm when droping it', () => {
		draggable(target);
		simulateMouseDown(target, 50, 50);
		simulateMouseMove(target, 50, 50);
		simulateMouseUp(target, 50, 50);
		expect(target.classList.contains('draggable')).to.be.true;
		expect(target.classList.length).to.equal(1);
	});
};
