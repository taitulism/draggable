import type {ActiveDrag, DragAxis, DraggablesOptions, EventsObj} from './types';

export const DragzoneSelector = '[data-drag-zone]';
const DraggableSelector = '[data-drag-role="draggable"]';
const GripSelector = '[data-drag-role="grip"]';
const DragRoleSelector = `${DraggableSelector}, ${GripSelector}`;

const getClosestDragRole = (elm: HTMLElement) => elm.closest(DragRoleSelector);
const getClosestDraggable = (elm: HTMLElement) => elm.closest(DraggableSelector);

export const isDisabled = (dataset: DOMStringMap) =>
	'dragDisabled' in dataset && dataset.dragDisabled !== 'false';

export const createEventsObj = (): EventsObj => ({
	'dragStart': undefined,
	'dragging': undefined,
	'dragEnd': undefined,
});

export const moveBy = (elm: HTMLElement, x = 0, y = 0) => {
	elm.style.translate = `${x}px ${y}px`;
};

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

		if (!draggable) throw new Error(`A grip must be inside a draggable ${DraggableSelector}`);
		if (draggable.dataset.dragDisabled === 'true') return;

		return draggable;
	}
};

export function pointerWithinPadding (
	box: DOMRect,
	ev: PointerEvent,
	opts: DraggablesOptions,
) {
	const {clientX, clientY} = ev;
	const {padding, cornerPadding} = opts;

	const offsetLeft = clientX - box.x;
	const offsetTop = clientY - box.y;
	const offsetRight = box.x + box.width - clientX;
	const offsetBottom = box.y + box.height - clientY;

	if (padding) { /* Sides */
		return (
			offsetTop <= padding ||
			offsetBottom <= padding ||
			offsetLeft <= padding ||
			offsetRight <= padding
		);
	}

	if (cornerPadding) { /* Corners */
		return (
			offsetLeft <= cornerPadding && offsetTop <= cornerPadding ||
			offsetRight <= cornerPadding && offsetTop <= cornerPadding ||
			offsetRight <= cornerPadding && offsetBottom <= cornerPadding ||
			offsetLeft <= cornerPadding && offsetBottom <= cornerPadding
		);
	}
}

export function createActiveDrag (
	elm: HTMLElement,
	box: DOMRect,
	ev: PointerEvent,
	dragzoneElm: HTMLElement,
): ActiveDrag {
	const {dragAxis, dragPosition} = elm.dataset;
	const activeDrag: ActiveDrag = {
		elm,
		box,
		// dragzoneElm: dragzoneElm.getBoundingClientRect(),
		dragzoneBox: dragzoneElm.getBoundingClientRect(),
		axis: dragAxis as DragAxis,
		mouseStartX: !dragAxis || dragAxis === 'x' ? ev.clientX : 0,
		mouseStartY: !dragAxis || dragAxis === 'y' ? ev.clientY : 0,
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

export function drag (activeDrag: ActiveDrag, ev: PointerEvent) {
	const {box, dragzoneBox, axis, mouseStartX, mouseStartY, prevX, prevY} = activeDrag;

	let elmMoveX = 0;
	let elmMoveY = 0;

	if (!axis || axis === 'x') {
		const mouseMoveX = ev.clientX - mouseStartX;
		const elmX = box.x + mouseMoveX;

		elmMoveX = mouseMoveX + prevX;

		if (elmX < dragzoneBox.x) {
			elmMoveX += dragzoneBox.x - elmX;
		}
		else if (elmX + box.width > dragzoneBox.right) {
			elmMoveX -= elmX + box.width - dragzoneBox.right;
		}
	}

	if (!axis || axis === 'y') {
		const mouseMoveY = ev.clientY - mouseStartY;
		const elmY = box.y + mouseMoveY;

		elmMoveY = mouseMoveY + prevY;

		if (elmY < dragzoneBox.y) {
			elmMoveY += dragzoneBox.y - elmY;
		}
		else if (elmY + box.height > dragzoneBox.bottom) {
			elmMoveY -= elmY + box.height - dragzoneBox.bottom;
		}
	}

	return [elmMoveX, elmMoveY];
}
