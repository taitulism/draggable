import {Draggable} from './draggable';

export * from './draggable';

export const draggable = (elm: HTMLElement = document.body) => new Draggable(elm);

