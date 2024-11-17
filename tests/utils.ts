export const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

const createEvent = (type: string, props: unknown = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

// constant offset of the mouse relative to the elm top-left corner
const OFFSET = 10;

export type Point = [number, number]

export function simulateMouseDown (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('mousedown', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseMove (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('mousemove', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});

	elm.dispatchEvent(event);
}

export function simulateMouseUp (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('mouseup', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});

	elm.dispatchEvent(event);
}

export function createDraggableElm (grip?: HTMLElement) {
	const elm = document.createElement('div');

	elm.id = 'target';
	elm.style.width = '100px';
	elm.style.height = '100px';
	elm.style.backgroundColor = 'pink';

	grip && elm.appendChild(grip);

	return elm;
}

export function createTestContainerElm () {
	const container = document.createElement('div');

	container.id = 'test-dom-container';
	container.style.height = '400px';
	container.style.width = '1000';
	container.style.padding = '75px';

	return container;
}

export function createGripElm (id: string) {
	const grip = document.createElement('div');
	grip.id = `grip-${id}`;
	return grip;
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
