import {DraggingLayer, Options} from './draggable';

export * from './draggable';

export const draggable = (
	elm: HTMLElement,
	opts: Options = {},
) => new DraggingLayer(elm, opts);

