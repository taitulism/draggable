type PointerEventHandler = (ev: PointerEvent) => void

type EventsObj = {
	grab: Array<PointerEventHandler>,
	drop: Array<PointerEventHandler>,
	dragging: Array<PointerEventHandler>
};

export type ElementOrSelector = HTMLElement | string

export type Options = {
	classname?: string
	grip?: ElementOrSelector
	axis?: 'x' | 'y'
}

type DragAxis = 'x' | 'y'

type ActiveDrag = {
	elm?: HTMLElement
	axis?: DragAxis
	startX: number
	startY: number
	moveX: number
	moveY: number
	prevX: number
	prevY: number
}

const MOUSE_DOWN = 'pointerdown';
const MOUSE_MOVE = 'pointermove';
const MOUSE_UP = 'pointerup';

const createEventsObj = (): EventsObj => ({
	grab: [],
	drop: [],
	dragging: [],
});

const moveBy = (elm: HTMLElement, x = 0, y = 0) => {
	const translate = `translate(${x}px, ${y}px)`;
	elm.style.transform = translate;
};

export class Draggable {
	contextElm: HTMLElement;
	isDraggable = true;
	events: EventsObj = createEventsObj();

	activeDrag!: ActiveDrag;

	constructor (elm: HTMLElement, opts: Options = {}) {
		this.contextElm = elm;
		this.contextElm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	destroy () {
		this.contextElm.removeEventListener(MOUSE_DOWN, this.onDragStart);
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		delete this.activeDrag.elm?.dataset.dragIsActive;

		this.events = createEventsObj();
		// this.contextElm = null; // TODO: handle elm might be null (+destroy test)
	}

	disable () {
		this.isDraggable = false;
		this.contextElm.setAttribute('disabled', '');
	}

	enable () {
		this.isDraggable = true;
		this.contextElm.removeAttribute('disabled');
	}

	on (eventName: string, callback: PointerEventHandler) {
		const lowerEventName = eventName.toLowerCase();

		if (lowerEventName.includes('start')) {
			this.events.grab.push(callback);
		}
		else if (lowerEventName.includes('ing')) {
			this.events.dragging.push(callback);
		}
		else if (
			// TODO: improve
			lowerEventName.includes('end') ||
			lowerEventName.includes('stop') ||
			lowerEventName.includes('drop')
		) {
			this.events.drop.push(callback);
		}

		return this;
	}

	onDragStart = (ev: PointerEvent) => {
		const evTarget = ev.target as HTMLElement;
		const {dragRole} = evTarget.dataset;
		if (!dragRole || evTarget.hasAttribute('disabled')) return;

		let draggableElm: HTMLElement;

		if (dragRole === 'draggable') {
			draggableElm = evTarget;
		}
		else if (dragRole === 'grip') {
			const closest = evTarget.closest('[data-drag-role="draggable"]') as HTMLElement;

			if (!closest) return;
			// TODO: throw

			draggableElm = closest;
		}

		// TODO: fn
		const activeDrag: ActiveDrag = {
			elm: draggableElm!,
			axis: draggableElm!.dataset.dragAxis as DragAxis,
			startX: 0,
			startY: 0,
			moveX: 0,
			moveY: 0,
			prevX: 0,
			prevY: 0,
		};

		draggableElm!.dataset.dragIsActive = 'true';

		if (draggableElm!.dataset.dragPosition) {
			const [x, y] = draggableElm!.dataset.dragPosition.split(',');
			activeDrag.prevX = parseInt(x, 10);
			activeDrag.prevY = parseInt(y, 10);
		}

		if (activeDrag.axis === 'x') {
			activeDrag.startX = ev.clientX;
		}
		else if (activeDrag.axis === 'y') {
			activeDrag.startY = ev.clientY;
		}
		else {
			activeDrag.startX = ev.clientX;
			activeDrag.startY = ev.clientY;
		}

		this.activeDrag = activeDrag;
		window.addEventListener(MOUSE_MOVE, this.onDragging);
		window.addEventListener(MOUSE_UP, this.onDrop);

		this.events.grab.forEach(cb => cb(ev));
	};

	onDragging = (ev: PointerEvent) => {
		const evTarget = ev.target as HTMLElement;

		if (evTarget.hasAttribute('disabled')) return;

		ev.preventDefault(); // prevent text selection

		const {activeDrag} = this;
		const {elm, axis, startX, startY, prevX, prevY} = activeDrag;

		activeDrag.moveX = !axis || axis === 'x' ? (ev.clientX - startX) + prevX : 0;
		activeDrag.moveY = !axis || axis === 'y' ? (ev.clientY - startY) + prevY : 0;

		moveBy(elm!, activeDrag.moveX, activeDrag.moveY);

		this.events.dragging.forEach(cb => cb(ev));
	};

	onDrop = (ev: PointerEvent) => {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		const {activeDrag} = this;
		const {elm, moveX, moveY} = activeDrag;

		elm!.dataset.dragPosition = moveX + ',' + moveY;
		delete elm!.dataset.dragIsActive;

		this.events.drop.forEach(cb => cb(ev));
	};
}
