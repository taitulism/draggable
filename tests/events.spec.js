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

	it('emits `grab` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('grab', () => { fired = true; });

		simulateMouseDown(target, 50, 50);
		expect(fired).to.be.true;
		simulateMouseUp(target, 50, 50);
	});

	it('emits `dragging` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('dragging', () => { fired = true; });

		simulateMouseDown(target, 50, 50);

		expect(fired).to.be.false;
		simulateMouseMove(target, 50, 50);
		expect(fired).to.be.true;

		simulateMouseUp(target, 50, 50);
	});

	it('emits `drop` event', () => {
		drg = draggable(target);
		let fired = false;

		drg.on('drop', () => { fired = true; });

		simulateMouseDown(target, 50, 50);
		expect(fired).to.be.false;
		simulateMouseUp(target, 50, 50);
		expect(fired).to.be.true;

	});
};
