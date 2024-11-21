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

const isSelector = (grip: ElementOrSelector): grip is string =>
	typeof grip === 'string';


export class Draggable {
	elm: HTMLElement;
	classname = DRAGGABLE;
	grip: HTMLElement | string | null = null;
	isDraggable = true;
	xAxis = false;
	yAxis = false;
	startX = 0;
	startY = 0;
	moveX = 0;
	moveY = 0;
	prevX = 0;
	prevY = 0;
	events: EventsObj = createEventsObj();

	constructor (elm: HTMLElement, opts: Options = {}) {
		this.elm = elm;
		this.classname = opts.classname || DRAGGABLE;
		elm.classList.add(this.classname);

		initAxes(this, opts.axis);
		opts.grip && this.setGrip(opts.grip);
		this.elm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	destroy () {
		this.elm.removeEventListener(MOUSE_DOWN, this.onDragStart);
		this.elm.removeEventListener(MOUSE_MOVE, this.onDragging);
		this.elm.removeEventListener(MOUSE_UP, this.onDrop);

		this.elm.classList.remove(this.classname, DRAGGING);

		const isSelector = typeof this.grip === 'string';
		this.grip && unsetGripClassname(this, isSelector);

		this.events = createEventsObj();
		// this.elm = null; // TODO: handle elm might be null (+destroy test)
	}

	disable () {
		this.isDraggable = false;
		this.elm.classList.add(DRAG_DISABLED);
	}

	enable () {
		this.isDraggable = true;
		this.elm.classList.remove(DRAG_DISABLED);
	}

	moveBy (x = 0, y = 0) {
		const translate = `translate(${x}px, ${y}px)`;
		this.elm.style.transform = translate;
	}

	setGrip (newGrip: ElementOrSelector | null) {
		if (newGrip === this.grip) return;

		const isCurrentGripSelector = typeof this.grip === 'string';
		this.grip && unsetGripClassname(this, isCurrentGripSelector);

		if (!newGrip) {
			this.grip = null;
			return;
		}

		const isNewGripSelector = typeof newGrip === 'string';
		if (!isNewGripSelector && !(newGrip instanceof HTMLElement)) return;
		// TODO: throw?

		this.grip = newGrip;

		setGripClassname(this, isNewGripSelector);
	}

	private matchesGrip (eventTarget: EventTarget) {
		const elm = eventTarget as HTMLElement;

		if (isSelector(this.grip!)) {
			return elm.matches(this.grip) || elm.closest(this.grip) !== null;
		}
		else {
			return this.grip === elm || (this.grip!).contains(elm);
		}
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
		if (!this.isDraggable) return;
		if (this.grip && !this.matchesGrip(ev.target!)) return;

		if (this.xAxis) this.startX = ev.clientX;
		if (this.yAxis) this.startY = ev.clientY;

		this.elm.classList.add(DRAGGING);

		this.elm.setPointerCapture(ev.pointerId);
		this.elm.addEventListener(MOUSE_MOVE, this.onDragging);
		this.elm.addEventListener(MOUSE_UP, this.onDrop);

		this.events.grab.forEach(cb => cb(ev));
	};

	onDragging = (ev: PointerEvent) => {
		if (!this.isDraggable) return;

		ev.preventDefault(); // prevent text selection

		this.moveX = this.xAxis ? (ev.clientX - this.startX) + this.prevX : 0;
		this.moveY = this.yAxis ? (ev.clientY - this.startY) + this.prevY : 0;

		this.moveBy(this.moveX, this.moveY);
		this.events.dragging.forEach(cb => cb(ev));
	};

	onDrop = (ev: PointerEvent) => {
		this.elm.releasePointerCapture(ev.pointerId);
		this.elm.removeEventListener(MOUSE_MOVE, this.onDragging);
		this.elm.removeEventListener(MOUSE_UP, this.onDrop);

		this.prevX = this.moveX;
		this.prevY = this.moveY;
		this.elm.classList.remove(DRAGGING);

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

// TODO: refactor
function initAxes (drg: Draggable, axisOpt: Options['axis']) {
	if (axisOpt) { // TODO:test uncovered block
		const axis = (axisOpt as string).toLowerCase();

		if (axis === 'x') drg.xAxis = true;
		else if (axis === 'y') drg.yAxis = true;
	}
	else {
		drg.xAxis = true;
		drg.yAxis = true;
	}
}

function setGripClassname (drg: Draggable, isSelector: boolean) {
	const grips = getGrips(drg.grip!, isSelector);

	for (const grip of grips) grip.classList.add(DRAG_GRIP);
}

function unsetGripClassname (drg: Draggable, isSelector: boolean) {
	const grips = getGrips(drg.grip!, isSelector);

	for (const grip of grips) grip.classList.remove(DRAG_GRIP);
}

function getGrips (grip: ElementOrSelector, isSelector: boolean) {
	return isSelector
		? document.querySelectorAll(grip as string)
		: [grip as HTMLElement]
	;
}
