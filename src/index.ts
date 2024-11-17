import {Draggable} from './draggable';
export {Draggable} from './draggable';

export const draggable = (
	elm: HTMLElement,
	opts: unknown = {},
) => new Draggable(elm, opts);
