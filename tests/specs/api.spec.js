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

	describe('.enable() / .disable()', () => {
		it('toggles draggability', () => {
			expect(target.style.left).to.be.empty;
			drg = draggable(target);

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(150, 0));
			simulateMouseUp(target, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(target, ...move(150, 0));
			simulateMouseMove(target, ...move(300, 0));
			simulateMouseUp(target, ...move(300, 0));
			expect(target.style.left).to.equal(px(box.left + 300));

			drg.disable();

			simulateMouseDown(target, ...move(300, 0));
			simulateMouseMove(target, ...move(450, 0));
			simulateMouseUp(target, ...move(450, 0));
			expect(target.style.left).to.equal(px(box.left + 300));

			drg.enable();

			simulateMouseDown(target, ...move(300, 0));
			simulateMouseMove(target, ...move(450, 0));
			simulateMouseUp(target, ...move(450, 0));
			expect(target.style.left).to.equal(px(box.left + 450));
		});

		it('toggles draggability while dragging', () => {
			expect(target.style.left).to.be.empty;
			drg = draggable(target);

			simulateMouseDown(target, ...move(0, 0));
			simulateMouseMove(target, ...move(100, 0));
			expect(target.style.left).to.equal(px(box.left + 100));

			drg.disable();

			simulateMouseMove(target, ...move(200, 0));
			expect(target.style.left).to.equal(px(box.left + 100));
			simulateMouseUp(target, ...move(200, 0));
		});

		it('toggles classname', () => {
			drg = draggable(target);

			expect(target.classList.contains('drag-disabled')).to.be.false;
			drg.disable();
			expect(target.classList.contains('drag-disabled')).to.be.true;
			drg.enable();
			expect(target.classList.contains('drag-disabled')).to.be.false;
		});
	});

	describe('.on', () => {
		it('is chainable', () => {
			drg = draggable(target);
			expect(drg.on('grab', () => null)).to.deep.equal(drg);
		});
	});

	describe('.setGrip()', () => {
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

		it('sets the drag handle element', () => {
			drg = draggable(target, {grip: gripA});

			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(150, 0));
			simulateMouseUp(gripA, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(300, 0));
			simulateMouseUp(gripB, ...move(300, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			drg.setGrip(gripB);

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(300, 0));
			simulateMouseUp(gripA, ...move(300, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(150, 0));
			simulateMouseUp(gripB, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 300));
		});

		it('sets the drag handle element selector', () => {
			drg = draggable(target, {grip: '#grip-A'});

			expect(target.style.left).to.equal(px(box.left));

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(150, 0));
			simulateMouseUp(gripA, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(300, 0));
			simulateMouseUp(gripB, ...move(300, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			drg.setGrip('#grip-B');

			simulateMouseDown(gripA, ...move(0, 0));
			simulateMouseMove(gripA, ...move(300, 0));
			simulateMouseUp(gripA, ...move(300, 0));
			expect(target.style.left).to.equal(px(box.left + 150));

			simulateMouseDown(gripB, ...move(0, 0));
			simulateMouseMove(gripB, ...move(150, 0));
			simulateMouseUp(gripB, ...move(150, 0));
			expect(target.style.left).to.equal(px(box.left + 300));
		});

		it('sets the grip classname on the new grip', () => {
			drg = draggable(target);
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			expect(gripB.classList.contains('drag-grip-handle')).to.be.false;

			drg.setGrip(gripA);
			expect(gripA.classList.contains('drag-grip-handle')).to.be.true;
			expect(gripB.classList.contains('drag-grip-handle')).to.be.false;

			drg.setGrip('#grip-B');
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			expect(gripB.classList.contains('drag-grip-handle')).to.be.true;

			drg.setGrip();
			expect(gripA.classList.contains('drag-grip-handle')).to.be.false;
			expect(gripB.classList.contains('drag-grip-handle')).to.be.false;
		});
	});

	describe('.destroy()', () => {
		it('removes all listeners', () => {
			drg = draggable(target);

			let grabs = 0;
			let moves = 0;
			let drops = 0;

			drg.on('grab', () => { grabs++; });
			drg.on('dragging', () => { moves++; });
			drg.on('drop', () => { drops++; });

			expect(grabs).to.equal(0);
			simulateMouseDown(target, 50, 50);
			expect(grabs).to.equal(1);

			expect(moves).to.equal(0);
			simulateMouseMove(target, 50, 50);
			expect(moves).to.equal(1);

			simulateMouseMove(target, 150, 150);
			expect(moves).to.equal(2);

			expect(drops).to.equal(0);
			simulateMouseUp(target, 150, 150);
			expect(drops).to.equal(1);

			expect(moves).to.equal(2);
			simulateMouseMove(target, 160, 160);
			expect(moves).to.equal(2);

			drg.destroy();

			expect(grabs).to.equal(1);
			simulateMouseDown(target, 160, 160);
			expect(grabs).to.equal(1);

			expect(moves).to.equal(2);
			simulateMouseMove(target, 160, 160);
			expect(moves).to.equal(2);

			expect(drops).to.equal(1);
			simulateMouseUp(target, 160, 160);
			expect(drops).to.equal(1);
		});

		it('removes all classnames', () => {
			drg = draggable(target);

			simulateMouseDown(target, 50, 50);
			simulateMouseMove(target, 50, 50);
			simulateMouseMove(target, 150, 150);
			simulateMouseUp(target, 150, 150);
			simulateMouseMove(target, 160, 160);

			drg.destroy();
			expect(target.classList.contains('draggable')).to.be.false;

			simulateMouseDown(target, 160, 160);
			expect(target.classList.contains('grabbed')).to.be.false;

			simulateMouseMove(target, 160, 160);
			expect(target.classList.contains('dragging')).to.be.false;
		});

		it('resets original position', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			drg = draggable(target);

			expect(target.style.position).to.equal('absolute');
			drg.destroy();
			expect(target.style.position).to.equal('static');
		});

		it('releases the target element', () => {
			drg = draggable(target);

			expect(drg.elm).to.deep.equal(target);
			drg.destroy();
			expect(drg.elm).to.be.null;
		});
	});
};
