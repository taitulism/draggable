import {beforeAll, beforeEach, afterEach, afterAll, describe, it, expect} from 'vitest';
import {Draggable, draggable} from '../src';
import {
	DRAGGABLE,
	DRAGGING,
} from '../src/classnames';
import {
	createDraggableElm,
	createTestContainerElm,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
} from './utils';

describe('Classnames', () => {
	let drgElm: HTMLElement;
	let drgInstance: Draggable;
	let testContainerElm: HTMLElement;

	beforeAll(() => {
		testContainerElm = createTestContainerElm();
		document.body.appendChild(testContainerElm);
	});

	beforeEach(() => {
		drgElm = createDraggableElm();
		drgInstance = draggable(drgElm);
		testContainerElm.appendChild(drgElm);
	});

	afterEach(() => {
		drgInstance.destroy();
		drgElm.remove();
	});

	afterAll(() => {
		testContainerElm.remove();
	});

	it('sets a `draggable` classname on elm', () => {
		expect(drgElm.classList.contains(DRAGGABLE)).to.be.true;
	});

	it('sets a `dragging` classname on elm when moving it', () => {
		expect(drgElm.classList.contains(DRAGGING)).to.be.false;
		simulateMouseDown(drgElm, [50, 50]);
		expect(drgElm.classList.contains(DRAGGING)).to.be.true;
		simulateMouseMove(drgElm, [50, 50]);
		expect(drgElm.classList.contains(DRAGGING)).to.be.true;
		simulateMouseUp(drgElm, [50, 50]);
		expect(drgElm.classList.contains(DRAGGING)).to.be.false;
	});

	it('leaves only the `draggable` classname on elm when droping it', () => {
		simulateMouseDown(drgElm, [50, 50]);
		simulateMouseMove(drgElm, [50, 50]);
		simulateMouseUp(drgElm, [50, 50]);
		expect(drgElm.classList.contains('draggable')).to.be.true;
		expect(drgElm.classList.length).to.equal(1);
	});
});
