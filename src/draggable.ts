import {
	createEventsObj,
	EventsObj,
	getDraggable,
	moveBy,
	DragEventHandler,
	ActiveDrag,
	createActiveDrag,
	withinPadding,
	isBoxInsideBox,
	isDisabled,
} from './internals';

const MOUSE_DOWN = 'pointerdown';
const MOUSE_MOVE = 'pointermove';
const MOUSE_UP = 'pointerup';

const ctxElms = new WeakSet();
const SameCtxErr = 'Context element already bound and cannot be bound twice. Destroy the previous one first.';

export {type DragEventHandler} from './internals';

export type DragRole = 'draggable' | 'grip';

export type DraggableOptions = {
	padding?: number
	cornerPadding?: number
}

export class Draggable {
	public isEnabled = true;
	private contextElm?: HTMLElement;
	private opts: DraggableOptions;
	private activeDrag!: ActiveDrag;
	private events: EventsObj = createEventsObj();

	constructor (elm: HTMLElement, opts: DraggableOptions) {
		if (ctxElms.has(elm)) throw new Error(SameCtxErr);

		ctxElms.add(elm);

		this.opts = opts;
		this.contextElm = elm;
		elm.addEventListener(MOUSE_DOWN, this.onDragStart);
	}

	public destroy () {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		if (this.contextElm) {
			ctxElms.delete(this.contextElm);
			this.contextElm.removeEventListener(MOUSE_DOWN, this.onDragStart);
			this.contextElm = undefined; // TODO:test - see destroy spec
		}

		this.events = createEventsObj();

		if (this.activeDrag?.elm) {
			delete this.activeDrag.elm.dataset.dragIsActive;

			// @ts-ignore
			this.activeDrag.elm = undefined;
		}

		this.disable();
	}

	public enable () {
		this.isEnabled = true;
	}

	public disable () {
		this.isEnabled = false;
	}

	public on (eventName: string, callback: DragEventHandler) {
		const lowerEventName = eventName.toLowerCase();

		if (lowerEventName.includes('start')) {
			this.events.grab = callback;
		}
		else if (lowerEventName.includes('ing')) {
			this.events.dragging = callback;
		}
		else if (
			// TODO: improve
			lowerEventName.includes('end') ||
			lowerEventName.includes('stop') ||
			lowerEventName.includes('drop')
		) {
			this.events.drop = callback;
		}

		return this;
	}

	public off (eventName: string) {
		const lowerEventName = eventName.toLowerCase();

		if (lowerEventName.includes('start')) {
			this.events.grab = undefined;
		}
		else if (lowerEventName.includes('ing')) {
			this.events.dragging = undefined;
		}
		else if (
			// TODO: improve
			lowerEventName.includes('end') ||
			lowerEventName.includes('stop') ||
			lowerEventName.includes('drop')
		) {
			this.events.drop = undefined;
		}

		return this;
	}

	private onDragStart = (ev: PointerEvent) => {
		if (!this.isEnabled) return;
		const draggableElm = getDraggable(ev.target);
		if (!draggableElm) return;

		const {padding, cornerPadding} = this.opts;

		if (padding && withinPadding(draggableElm, padding, ev, false)) return;
		if (cornerPadding && withinPadding(draggableElm, cornerPadding, ev, true)) return;

		this.activeDrag = createActiveDrag(draggableElm, ev);
		this.contextElm!.style.userSelect = 'none';

		// TODO: I don't like this name & value (dragActive = '' - key exist is enough)
		draggableElm.dataset.dragIsActive = 'true';

		window.addEventListener(MOUSE_MOVE, this.onDragging);
		window.addEventListener(MOUSE_UP, this.onDrop);

		this.events.grab?.({ev, elm: draggableElm, relPos: [0, 0]});
		ev.stopPropagation();
	};

	private onDragging = (ev: PointerEvent) => {
		const evTarget = ev.target as HTMLElement;

		if (!this.isEnabled || isDisabled(evTarget.dataset)) return;

		const {activeDrag} = this;
		const {elm, axis, startX, startY, prevX, prevY} = activeDrag;

		activeDrag.moveX = !axis || axis === 'x' ? (ev.clientX - startX) + prevX : 0;
		activeDrag.moveY = !axis || axis === 'y' ? (ev.clientY - startY) + prevY : 0;

		moveBy(elm!, activeDrag.moveX, activeDrag.moveY);

		this.events.dragging?.({ev, elm, relPos: [activeDrag.moveX, activeDrag.moveY]});
	};

	private onDrop = (ev: PointerEvent) => {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		const {activeDrag} = this;
		const {elm, moveX, moveY, prevX, prevY} = activeDrag;

		elm.dataset.dragPosition = (moveX || prevX) + ',' + (moveY || prevY);
		delete elm.dataset.dragIsActive;

		this.contextElm!.style.userSelect = '';
		this.events.drop?.({ev, elm, relPos: [moveX || prevX, moveY || prevY]});
	};
}
