import draggingSpec from './dragging.spec';
import eventsSpec from './events.spec';
import classnamesSpec from './classnames.spec';
import positionElevationSpec from './position-elevation.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('draggable', () => {
	let testDOMContainer;

	before(() => {
		testDOMContainer = document.createElement('div');
		testDOMContainer.id = 'test-dom-container';
		testDOMContainer.style.height = '400px';
		testDOMContainer.style.width = '1000';
		testDOMContainer.style.padding = '75px';
		document.body.appendChild(testDOMContainer);
	});

	after(() => {
		testDOMContainer.parentNode.removeChild(testDOMContainer);
		testDOMContainer = null;
	});

	it('is a function', () => expect(draggable).to.be.a('function'));

	it('returns a `Draggable` instance', () => {
		const target = document.createElement('div');
		const draggableInstance = draggable(target);
		const ctor = Object.getPrototypeOf(draggableInstance).constructor;

		expect(ctor.name).to.equal('Draggable');
	});

	describe('Dragging Around', draggingSpec);
	describe('Events', eventsSpec);
	describe('Classnames', classnamesSpec);
	describe('Position Elevation', positionElevationSpec);
	describe('Options', optionsSpec);
	describe('API', apiSpec);
});
