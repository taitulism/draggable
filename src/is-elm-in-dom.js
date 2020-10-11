import { DRAGGABLE } from './classnames';

export default function isElmInDom (elm) {
	const draggables = document.getElementsByClassName(DRAGGABLE);

	if (draggables == null) return false;

	return Array.from(draggables).includes(elm);
}
