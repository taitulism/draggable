import type {ActiveDrag, DragEventHandler, DraggableOptions, EventsObj} from './types';
import {
	createEventsObj,
	getDraggable,
	moveBy,
	createActiveDrag,
	pointerWithinPadding,
	isDisabled,
	drag,
	DragzoneSelector,
} from './internals';

const MOUSE_DOWN = 'pointerdown';
const MOUSE_MOVE = 'pointermove';
const MOUSE_UP = 'pointerup';

const ctxElms = new WeakSet();
const SameCtxErr = 'Context element already bound and cannot be bound twice. Destroy the previous one first.';

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
			delete this.activeDrag.elm.dataset.dragActive;

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

		const box = draggableElm.getBoundingClientRect();
		if (pointerWithinPadding(box, ev, this.opts)) return;

		const dragzoneElm = (draggableElm.closest(DragzoneSelector) || document.body) as HTMLElement;

		this.activeDrag = createActiveDrag(draggableElm, box, ev, dragzoneElm);
		this.contextElm!.style.userSelect = 'none';

		draggableElm.dataset.dragActive = ''; // Key only

		window.addEventListener(MOUSE_MOVE, this.onDragging);
		window.addEventListener(MOUSE_UP, this.onDrop);

		this.events.grab?.({ev, elm: draggableElm, relPos: [0, 0]});
		ev.stopPropagation();
	};

	private onDragging = (ev: PointerEvent) => {
		const evTarget = ev.target as HTMLElement;

		if (!this.isEnabled || isDisabled(evTarget.dataset)) return;

		const {activeDrag} = this;
		const {elm} = activeDrag;
		const [elmMoveX, elmMoveY] = drag(activeDrag, ev);

		moveBy(elm, elmMoveX, elmMoveY);

		activeDrag.moveX = elmMoveX;
		activeDrag.moveY = elmMoveY;

		this.events.dragging?.({ev, elm, relPos: [elmMoveX, elmMoveY]});
	};

	private onDrop = (ev: PointerEvent) => {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		const {activeDrag} = this;
		const {elm, moveX, moveY, prevX, prevY} = activeDrag;

		elm.dataset.dragPosition = `${moveX},${moveY}`;
		delete elm.dataset.dragActive;

		this.contextElm!.style.userSelect = '';
		this.events.drop?.({ev, elm, relPos: [moveX || prevX, moveY || prevY]});
	};
}
