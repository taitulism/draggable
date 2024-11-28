import {Draggable, DraggableOptions} from './draggable';

export * from './draggable';

export const draggable = (
	elm: HTMLElement = document.body,
	opts: DraggableOptions = {padding: 0, cornerPadding: 0},
) => new Draggable(elm, opts);

