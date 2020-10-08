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

	it('places the target element in the <body>', () => {
		expect(target.parentNode.nodeName).to.equal('DIV');
		draggable(target);
		expect(target.parentNode.nodeName).to.equal('BODY');
	});

	describe('Position Elevation', () => {
		it('if element position is `absolute` - keep it like that', () => {
			target.style.position = 'absolute';

			expect(target.style.position).to.equal('absolute');
			draggable(target);
			expect(target.style.position).to.equal('absolute');
		});

		it('if element position is not `absolute` - sets `position:absolute`', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			draggable(target);
			expect(target.style.position).to.equal('absolute');
		});
	});
};
