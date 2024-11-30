import {Draggable, DraggableOptions} from './draggable';

export * from './draggable';

const defaultOptions: DraggableOptions = {
	padding: 0,
	cornerPadding: 0,
	container: true,
};

export const draggable = (
	elmOrOpts?: HTMLElement | DraggableOptions,
	dragOptions?: DraggableOptions,
) => (
	elmOrOpts instanceof HTMLElement
		? new Draggable(elmOrOpts, dragOptions || defaultOptions)
		: new Draggable(document.body, elmOrOpts || defaultOptions)
);
