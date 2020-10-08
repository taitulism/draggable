const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

// constant offset of the mouse relative to the elm top-left corner
const OFFSET = 10;

export function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});

	elm.dispatchEvent(event);
}

export function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: (x || 0) + OFFSET,
		clientY: (y || 0) + OFFSET,
	});

	elm.dispatchEvent(event);
}

export const px = num => num + 'px';
