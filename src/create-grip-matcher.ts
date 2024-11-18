import {type ElementOrSelector} from './draggable';

export default function createGripMatcher (grip: ElementOrSelector, isHtmlElm: boolean) {
	if (isHtmlElm) {
		return function gripMatcher (eventTarget: HTMLElement) {
			return grip === eventTarget || (grip as HTMLElement).contains(eventTarget);
			// return grip === eventTarget || isInside(eventTarget, grip as HTMLElement);
		};
	}

	// `grip` is an elm selector string
	return function gripMatcher (eventTarget: EventTarget) {
		const elm = eventTarget as HTMLElement;
		return elm.matches(grip as string) || elm.closest(grip as string) !== null;
	};
}

// TODO: use Element.contains()
// function isInside (child: HTMLElement, parent: HTMLElement) {
// 	const actualParentElm = child.parentElement;
// 	if (actualParentElm === parent) return true;
// 	if (actualParentElm === document.body || actualParentElm === null) return false;
// 	return isInside(actualParentElm, parent);
// }

