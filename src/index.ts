import {Draggable, Options} from './draggable';

export * from './draggable';

export const draggable = (
	elm: HTMLElement,
	opts: Options = {},
) => new Draggable(elm, opts);

