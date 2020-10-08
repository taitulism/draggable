import draggingSpec from './dragging.spec';
import eventsSpec from './events.spec';
import classnamesSpec from './classnames.spec';
import behaviorSpec from './behavior.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('draggable', () => {
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
	describe('Behavior', behaviorSpec);
	describe('Options', optionsSpec);
	describe('API', apiSpec);
});
