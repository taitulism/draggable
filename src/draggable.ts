import {
	DRAGGABLE,
	DRAGGING,
	DRAG_DISABLED,
	DRAG_GRIP,
} from './classnames';

const MOUSE_DOWN = 'pointerdown';
const MOUSE_MOVE = 'pointermove';
const MOUSE_UP = 'pointerup';

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

// const isSelector = (grip: ElementOrSelector): grip is string =>
// 	typeof grip === 'string';

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

export class Draggable {
	contextElm: HTMLElement;
	classname = DRAGGABLE;
	// grip: HTMLElement | string | null = null;
	isDraggable = true;
	// startX = 0;
	// startY = 0;
	// moveX = 0;
	// moveY = 0;
	// prevX = 0;
	// prevY = 0;
	events: EventsObj = createEventsObj();

	activeDrag!: ActiveDrag;

	constructor (elm: HTMLElement, opts: Options = {}) {
		this.contextElm = elm;
		// this.classname = opts.classname || DRAGGABLE;
		// elm.classList.add(this.classname);

		// opts.grip && this.setGrip(opts.grip);
		this.contextElm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	destroy () {
		this.contextElm.removeEventListener(MOUSE_DOWN, this.onDragStart);
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		// this.contextElm.classList.remove(this.classname, DRAGGING);

		// const isSelector = typeof this.grip === 'string';
		// this.grip && unsetGripClassname(this, isSelector);

		this.events = createEventsObj();
		// this.elm = null; // TODO: handle elm might be null (+destroy test)
	}

	disable () {
		this.isDraggable = false;
		this.contextElm.classList.add(DRAG_DISABLED);
	}

	enable () {
		this.isDraggable = true;
		this.contextElm.classList.remove(DRAG_DISABLED);
	}

	moveBy (elm: HTMLElement, x = 0, y = 0) {
		const translate = `translate(${x}px, ${y}px)`;
		elm.style.transform = translate;
	}

	// setGrip (newGrip: ElementOrSelector | null) {
	// 	if (newGrip === this.grip) return;

	// 	const isCurrentGripSelector = typeof this.grip === 'string';
	// 	this.grip && unsetGripClassname(this, isCurrentGripSelector);

	// 	if (!newGrip) {
	// 		this.grip = null;
	// 		return;
	// 	}

	// 	const isNewGripSelector = typeof newGrip === 'string';
	// 	if (!isNewGripSelector && !(newGrip instanceof HTMLElement)) return;
	// 	// TODO: throw?

	// 	this.grip = newGrip;

	// 	setGripClassname(this, isNewGripSelector);
	// }

	// private matchesGrip (eventTarget: EventTarget) {
	// 	const elm = eventTarget as HTMLElement;

	// 	if (isSelector(this.grip!)) {
	// 		return elm.matches(this.grip) || elm.closest(this.grip) !== null;
	// 	}
	// 	else {
	// 		return this.grip === elm || (this.grip!).contains(elm);
	// 	}
	// }

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
		// if (!this.isDraggable) return;
		// if (this.grip && !this.matchesGrip(ev.target!)) return;
		const evTarget = ev.target as HTMLElement;
		const {dragRole} = evTarget.dataset;
		if (!dragRole) return;

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

		draggableElm!.classList.add(DRAGGING);

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

		// this.events.grab.forEach(cb => cb(ev));
	};

	onDragging = (ev: PointerEvent) => {
		// if (!this.isDraggable) return;
		ev.preventDefault(); // prevent text selection

		const {activeDrag} = this;
		const {elm, axis, startX, startY, prevX, prevY} = activeDrag;

		activeDrag.moveX = !axis || axis === 'x' ? (ev.clientX - startX) + prevX : 0;
		activeDrag.moveY = !axis || axis === 'y' ? (ev.clientY - startY) + prevY : 0;

		this.moveBy(
			elm!,
			activeDrag.moveX,
			activeDrag.moveY,
		);

		// this.events.dragging.forEach(cb => cb(ev));
	};

	onDrop = (ev: PointerEvent) => {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);
		const {activeDrag} = this;
		const {elm, moveX, moveY} = activeDrag;

		// const evTarget = ev.target as HTMLElement;

		elm!.dataset.dragPosition = moveX + ',' + moveY;
		elm!.classList.remove(DRAGGING);

		this.events.drop.forEach(cb => cb(ev));
	};
}


/* ---------------------------------------------------------------------------------------------- */


function createEventsObj (): EventsObj {
	return {
		grab: [],
		drop: [],
		dragging: [],
	};
}

// function setGripClassname (drg: Draggable, isSelector: boolean) {
// 	const grips = getGrips(drg.grip!, isSelector);

// 	for (const grip of grips) grip.classList.add(DRAG_GRIP);
// }

// function unsetGripClassname (drg: Draggable, isSelector: boolean) {
// 	const grips = getGrips(drg.grip!, isSelector);

// 	for (const grip of grips) grip.classList.remove(DRAG_GRIP);
// }

// function getGrips (grip: ElementOrSelector, isSelector: boolean) {
// 	return isSelector
// 		? document.querySelectorAll(grip as string)
// 		: [grip as HTMLElement]
// 	;
// }
