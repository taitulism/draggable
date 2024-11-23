import {DraggingLayer} from './draggable';

export * from './draggable';

export const draggable = (elm: HTMLElement = document.body) => new DraggingLayer(elm);

