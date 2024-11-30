export type DragAxis = 'x' | 'y'
export type Point = [number, number]

export type DragEvent = {
	ev: PointerEvent
	elm: HTMLElement
	relPos: Point
}

export type ActiveDrag = {
	elm: HTMLElement
	box: DOMRect
	containerBox: DOMRect
	axis?: DragAxis
	offsetX: number
	offsetY: number
	startX: number
	startY: number
	moveX: number
	moveY: number
	prevX: number
	prevY: number
}

export function createActiveDrag (
	elm: HTMLElement,
	ev: PointerEvent,
	containerElm: HTMLElement,
): ActiveDrag {
	const {dragAxis, dragPosition} = elm.dataset;
	const activeDrag: ActiveDrag = {
		elm,
		box: elm.getBoundingClientRect(),
		containerBox: containerElm.getBoundingClientRect(),
		axis: dragAxis as DragAxis,
		startX: !dragAxis || dragAxis === 'x' ? ev.clientX : 0,
		startY: !dragAxis || dragAxis === 'y' ? ev.clientY : 0,
		offsetX: ev.offsetX,
		offsetY: ev.offsetY,
		moveX: 0,
		moveY: 0,
		prevX: 0,
		prevY: 0,
	};

	if (dragPosition) {
		const [x, y] = dragPosition.split(',');
		activeDrag.prevX = parseInt(x, 10);
		activeDrag.prevY = parseInt(y, 10);
	}

	return activeDrag;
}

export function withinPadding (
	elm: HTMLElement,
	padding: number,
	ev: PointerEvent,
	isCornerPad = false,
) {
	const box = elm.getBoundingClientRect();
	const {clientX, clientY} = ev;

	if (isCornerPad) { /* Corners */
		// TODO: clientX - box.x... offsetX?
		const topLeftX = clientX - box.x <= padding;
		const topLeftY = clientY - box.y <= padding;

		const topRightX = box.x + box.width - clientX <= padding;
		const topRightY = clientY - box.y <= padding;

		const bottomRightX = box.x + box.width - clientX <= padding;
		const bottomRightY = box.y + box.height - clientY <= padding;

		const bottomLeftX = clientX - box.x <= padding;
		const bottomLeftY = box.y + box.height - clientY <= padding;

		return (
			topLeftX && topLeftY
			|| topRightX && topRightY
			|| bottomRightX && bottomRightY
			|| bottomLeftX && bottomLeftY
		);
	}
	else { /* Sides */
		const XInPad = (clientX - box.x) <= padding || (box.width + box.x - clientX) <= padding;
		const YInPad = (clientY - box.y) <= padding || (box.height + box.y - clientY) <= padding;

		return XInPad || YInPad;
	}
}

export type DragEventHandler = (dragEvent: DragEvent) => void

export type EventsObj = {
	grab: DragEventHandler | undefined
	drop: DragEventHandler | undefined
	dragging: DragEventHandler | undefined
};

export const createEventsObj = (): EventsObj => ({
	grab: undefined,
	drop: undefined,
	dragging: undefined,
});

export const moveBy = (elm: HTMLElement, x = 0, y = 0) => {
	const translate = `translate(${x}px, ${y}px)`;
	elm.style.transform = translate;
};

const DraggableSelector = '[data-drag-role="draggable"]';
const GripSelector = '[data-drag-role="grip"]';
const DragRoleSelector = `${DraggableSelector}, ${GripSelector}`;

const getClosestDragRole = (elm: HTMLElement) => elm.closest(DragRoleSelector);
const getClosestDraggable = (elm: HTMLElement) => elm.closest(DraggableSelector);

export const isDisabled = (dataset: DOMStringMap) =>
	'dragDisabled' in dataset && dataset.dragDisabled !== 'false';

export const getDraggable = (evTarget: EventTarget | null) => {
	if (!evTarget || !(evTarget instanceof HTMLElement)) return;

	const dragRoleElm = getClosestDragRole(evTarget) as HTMLElement || undefined;
	if (!dragRoleElm) return;

	const {dragRole} = dragRoleElm.dataset;

	if (dragRole === 'draggable') {
		if (isDisabled(dragRoleElm.dataset)) return;

		const hasGrip = Boolean(dragRoleElm.querySelector(GripSelector));

		if (hasGrip) return;

		return dragRoleElm;
	}
	else if (dragRole === 'grip') {
		const draggable = getClosestDraggable(dragRoleElm) as HTMLElement;

		if (!draggable) {
			throw new Error(`A grip must be inside a draggable ${DraggableSelector}`);
		}

		if (draggable.dataset.dragDisabled === 'true') return;

		return draggable;
	}
};
