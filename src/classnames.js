export const DRAGGABLE = 'draggable';
export const DRAGGING = 'dragging';
export const DRAG_DISABLED = 'drag-disabled';
export const DRAG_GRIP = 'drag-grip-handle';

export function getDraggableClassname (namespace) {
	return namespace ? `${namespace}-${DRAGGABLE}` : DRAGGABLE;
}
