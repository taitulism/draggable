import type {Point} from '../src/types';

const createEvent = (type: string, props: PointerEventInit = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function getElmFromPoint (p: Point) {
	const elm = document.elementFromPoint(...p) as HTMLElement;
	if (!elm) throw new Error('No element in current position');
	return elm;
}

function simulateMouseDown (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointerdown', {
		clientX: x,
		clientY: y,
		pointerId: 1,
	});

	elm.dispatchEvent(event);
}

function simulateMouseMove (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointermove', {
		clientX: x,
		clientY: y,
		pointerId: 1,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm: HTMLElement, point: Point) {
	const [x, y] = point;
	const event = createEvent('pointerup', {
		clientX: x,
		clientY: y,
		pointerId: 1,
	});

	elm.dispatchEvent(event);
}

export function createMouseSimulator () {
	let currentPosition: Point = [0, 0];
	let isDown = false;

	return {
		moveToElm (elm: HTMLElement) {
			if (!document.contains(elm)) return;

			const {x, y} = elm.getBoundingClientRect();
			currentPosition = [x, y];

			simulateMouseMove(elm, currentPosition);
		},

		down (offset?: Point) {
			if (isDown) throw new Error('Mouse is already down');
			isDown = true;

			if (offset) {
				currentPosition[0] += offset[0];
				currentPosition[1] += offset[1];
			}

			const elm = getElmFromPoint(currentPosition);
			simulateMouseDown(elm, currentPosition);
			return this;
		},

		move (point: Point) {
			const elm = getElmFromPoint(currentPosition);
			const [x, y] = currentPosition;

			currentPosition = [x + point[0], y + point[1]];

			simulateMouseMove(elm, currentPosition);
			return this;
		},

		up () {
			if (!isDown) throw new Error('Mouse is not down');
			isDown = false;

			const elm = getElmFromPoint(currentPosition);
			simulateMouseUp(elm, currentPosition);
			return this;
		},

		reset () {
			currentPosition = [0, 0];
			isDown = false;
		},
	};
}
