import {DragAxis} from '../src';

export const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

const createEvent = (type: string, props: PointerEventInit = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

// constant offset of the mouse relative to the elm top-left corner
const OFFSET = 10; // TODO:test huh?

export type Point = [number, number]

export function simulateMouseDown (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointerdown', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		pointerId: 1,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseMove (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointermove', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		pointerId: 1,
	});

	elm.dispatchEvent(event);
}

export function simulateMouseUp (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointerup', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
		pointerId: 1,
	});

	elm.dispatchEvent(event);
}

export function createTestContainerElm () {
	const container = document.createElement('div');

	container.id = 'test-dom-container';
	container.style.height = '200px';
	container.style.padding = '50px';

	return container;
}

// TODO:test - grip not in use
export function createDraggableElm (grip?: HTMLElement, axis?: DragAxis) {
	const elm = document.createElement('div');

	elm.dataset.dragRole = 'draggable';
	if (axis) elm.dataset.dragAxis = axis;

	elm.id = 'target';
	elm.style.width = '100px';
	elm.style.height = '100px';
	elm.style.backgroundColor = 'pink';

	grip && elm.appendChild(grip);

	return elm;
}

export function createGripsContainer () {
	const container = document.createElement('div');
	container.id = 'grips-container';

	const gripA = createGripElm('A');
	const gripB = createGripElm('B');
	container.appendChild(gripA);
	container.appendChild(gripB);

	return [container, gripA, gripB];
}

// TODO:test some tests not using this and should
export function createGripElm (id: string) {
	const grip = document.createElement('div');

	grip.dataset.dragRole = 'grip';
	grip.id = `grip-${id}`;
	return grip;
}
