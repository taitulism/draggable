import createGripMatcher from './create-grip-matcher';
import {
	DRAGGABLE,
	DRAGGING,
	DRAG_DISABLED,
	DRAG_GRIP,
} from './classnames';

const MOUSE_DOWN = 'mousedown';
const MOUSE_MOVE = 'mousemove';
const MOUSE_UP = 'mouseup';

type MouseEventHandler = (ev: MouseEvent) => void

type EventsObj = {
	grab: Array<MouseEventHandler>,
	drop: Array<MouseEventHandler>,
	dragging: Array<MouseEventHandler>
};

export type ElementOrSelector = HTMLElement | string

export type Options = {
	classname?: string
	grip?: ElementOrSelector
	axis?: 'x' | 'y'
}

export class Draggable {
	elm: HTMLElement;
	classname = DRAGGABLE;
	useGrip = false;
	gripHandle: HTMLElement | string | null = null;
	isGripHtmlElm = false;
	isDraggable = true;
	startMouseX = 0;
	startMouseY = 0;
	mouseMoveX = 0;
	mouseMoveY = 0;
	xAxis = false;
	yAxis = false;
	prevMouseMoveX = 0;
	prevMouseMoveY = 0;
	mouseUpContextElm: HTMLElement | Document = document;
	events: EventsObj = createEventsObj();
	matchesGrip?: (eventTarget: HTMLElement) => boolean;

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
		document.removeEventListener(MOUSE_MOVE, this.onDragging);
		this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop as EventListener);

		this.elm.classList.remove(this.classname, DRAGGING);
		unsetGripClassname(this);

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
		if (newGrip === this.gripHandle) return;

		unsetGripClassname(this);

		if (!newGrip) {
			this.useGrip = false;
			this.gripHandle = null;
			return;
		}

		this.isGripHtmlElm = newGrip instanceof HTMLElement;
		if (!this.isGripHtmlElm && typeof newGrip !== 'string') return; // TODO: throw?

		this.useGrip = true;
		this.gripHandle = newGrip;
		this.matchesGrip = createGripMatcher(newGrip, this.isGripHtmlElm);

		setGripClassname(this);
	}

	on (eventName: string, callback: MouseEventHandler) {
		const lowerEventName = eventName.toLowerCase();

		if (lowerEventName.includes('start')) {
			this.events.grab.push(callback);
		}
		else if (lowerEventName.includes('ing')) {
			this.events.dragging.push(callback);
		}
		else if (
			lowerEventName.includes('end') ||
			lowerEventName.includes('stop') ||
			lowerEventName.includes('drop')
		) {
			this.events.drop.push(callback);
		}

		return this;
	}

	onDragStart = (ev: MouseEvent) => {
		if (!this.isDraggable) return;
		if (this.useGrip && !this.matchesGrip?.(ev.target as HTMLElement)) return;

		if (this.xAxis) this.startMouseX = ev.clientX;
		if (this.yAxis) this.startMouseY = ev.clientY;

		this.elm.classList.add(DRAGGING);

		document.addEventListener(MOUSE_MOVE, this.onDragging);
		this.mouseUpContextElm.addEventListener(MOUSE_UP, this.onDrop as EventListener);

		this.events.grab.forEach(cb => cb(ev));
	};

	onDragging = (ev: MouseEvent) => {
		if (!this.isDraggable) return;

		this.mouseMoveX =
			this.xAxis ? (ev.clientX - this.startMouseX) + this.prevMouseMoveX : 0;

		this.mouseMoveY =
			this.yAxis ? (ev.clientY - this.startMouseY) + this.prevMouseMoveY : 0;

		this.moveBy(this.mouseMoveX, this.mouseMoveY);
		this.events.dragging.forEach(cb => cb(ev));

		// prevent text selection while dragging
		ev.preventDefault();
	};

	onDrop = (ev: MouseEvent) => {
		document.removeEventListener(MOUSE_MOVE, this.onDragging);
		this.mouseUpContextElm.removeEventListener(MOUSE_UP, this.onDrop as EventListener);

		this.prevMouseMoveX = this.mouseMoveX;
		this.prevMouseMoveY = this.mouseMoveY;
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

function initAxes (drg: Draggable, axisOpt: Options['axis']) {
	if (axisOpt) { // TODO:test uncovered block
		drg.mouseUpContextElm = document;

		const axis = (axisOpt as string).toLowerCase();

		if (axis === 'x') drg.xAxis = true;
		else if (axis === 'y') drg.yAxis = true;
	}
	else {
		drg.mouseUpContextElm = drg.elm;
		drg.xAxis = true;
		drg.yAxis = true;
	}
}

function unsetGripClassname (drg: Draggable) {
	if (!drg.useGrip) return;

	if (drg.isGripHtmlElm) {
		(drg.gripHandle as HTMLElement).classList.remove(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(drg.gripHandle as string);
		for (const g of grips) {
			g.classList.remove(DRAG_GRIP);
		}
	}
}

function setGripClassname (drg: Draggable) {
	if (drg.isGripHtmlElm) {
		(drg.gripHandle as HTMLElement).classList.add(DRAG_GRIP);
	}
	else {
		const grips = document.querySelectorAll(drg.gripHandle as string);
		for (const g of grips) {
			g.classList.add(DRAG_GRIP);
		}
	}
}
