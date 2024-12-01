// export type DragRole = 'draggable' | 'grip';
export type DragAxis = 'x' | 'y'
export type Point = [number, number]

export type DraggableOptions = {
	padding?: number
	cornerPadding?: number
	container?: boolean
}

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
	// offsetX: number
	// offsetY: number
	startX: number
	startY: number
	moveX: number
	moveY: number
	prevX: number
	prevY: number
}

export type DragEventHandler = (dragEvent: DragEvent) => void
export type EventsObj = {
	grab: DragEventHandler | undefined
	drop: DragEventHandler | undefined
	dragging: DragEventHandler | undefined
};
