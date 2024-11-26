import {createEventsObj, EventsObj, getDraggable, moveBy, PointerEventHandler} from './internals';

export {type PointerEventHandler} from './internals';
export type DragRole = 'draggable' | 'grip'
export type DragAxis = 'x' | 'y'

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

const ctxElms = new WeakSet();
const SameCtxErr = 'Context element already bound and cannot be bound twice. Destroy the previous one first.';

export class Draggable {
	public isEnabled = true;
	private contextElm?: HTMLElement;
	private activeDrag!: ActiveDrag;
	private events: EventsObj = createEventsObj();

	constructor (elm: HTMLElement) {
		if (ctxElms.has(elm)) throw new Error(SameCtxErr);

		ctxElms.add(elm);

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

	public on (eventName: string, callback: PointerEventHandler) {
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

		// TODO: fn
		const activeDrag: ActiveDrag = {
			elm: draggableElm,
			axis: draggableElm.dataset.dragAxis as DragAxis,
			startX: 0,
			startY: 0,
			moveX: 0,
			moveY: 0,
			prevX: 0,
			prevY: 0,
		};

		// TODO: I don't like this name & value (dragActive = '' - key exist is enough)
		draggableElm.dataset.dragIsActive = 'true';

		if (draggableElm.dataset.dragPosition) {
			const [x, y] = draggableElm.dataset.dragPosition.split(',');
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
		this.contextElm!.style.userSelect = 'none';

		window.addEventListener(MOUSE_MOVE, this.onDragging);
		window.addEventListener(MOUSE_UP, this.onDrop);

		this.events.grab?.(ev);
		ev.stopPropagation();
	};

	private onDragging = (ev: PointerEvent) => {
		const evTarget = ev.target as HTMLElement;

		if (
			!this.isEnabled
			|| 'dragDisabled' in evTarget.dataset && evTarget.dataset.dragDisabled !== 'false'
		) {
			return;
		}

		const {activeDrag} = this;
		const {elm, axis, startX, startY, prevX, prevY} = activeDrag;

		activeDrag.moveX = !axis || axis === 'x' ? (ev.clientX - startX) + prevX : 0;
		activeDrag.moveY = !axis || axis === 'y' ? (ev.clientY - startY) + prevY : 0;

		moveBy(elm!, activeDrag.moveX, activeDrag.moveY);

		this.events.dragging?.(ev);
	};

	private onDrop = (ev: PointerEvent) => {
		window.removeEventListener(MOUSE_MOVE, this.onDragging);
		window.removeEventListener(MOUSE_UP, this.onDrop);

		const {activeDrag} = this;
		const {elm, moveX, moveY, prevX, prevY} = activeDrag;

		elm!.dataset.dragPosition = (moveX || prevX) + ',' + (moveY || prevY);
		delete elm!.dataset.dragIsActive;

		this.contextElm!.style.userSelect = '';
		this.events.drop?.(ev);
	};
}
