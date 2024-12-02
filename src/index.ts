import {Draggables} from './Draggables';
import type {DraggablesOptions} from './types';

export * from './Draggables';
export type * from './types';

const defaultOptions: DraggablesOptions = {
	padding: 0,
	cornerPadding: 0,
};

export const draggables = (
	elmOrOpts?: HTMLElement | DraggablesOptions,
	dragOptions?: DraggablesOptions,
) => (
	elmOrOpts instanceof HTMLElement
		? new Draggables(elmOrOpts, dragOptions || defaultOptions)
		: new Draggables(document.body, elmOrOpts || defaultOptions)
);
