import {Draggable} from './draggable';
import type {DraggableOptions} from './types';

export * from './draggable';
export type * from './types';

const defaultOptions: DraggableOptions = {
	padding: 0,
	cornerPadding: 0,
};

export const draggable = (
	elmOrOpts?: HTMLElement | DraggableOptions,
	dragOptions?: DraggableOptions,
) => (
	elmOrOpts instanceof HTMLElement
		? new Draggable(elmOrOpts, dragOptions || defaultOptions)
		: new Draggable(document.body, elmOrOpts || defaultOptions)
);
