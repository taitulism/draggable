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
