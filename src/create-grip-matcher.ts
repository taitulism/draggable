import {type ElementOrSelector} from './draggable';

// TODO: improve
export default function createGripMatcher (grip: ElementOrSelector, isHtmlElm: boolean) {
	if (isHtmlElm) {
		return function gripMatcher (eventTarget: HTMLElement) {
			return grip === eventTarget || (grip as HTMLElement).contains(eventTarget);
		};
	}

	// `grip` is an elm selector string
	return function gripMatcher (eventTarget: EventTarget) {
		const elm = eventTarget as HTMLElement;
		return elm.matches(grip as string) || elm.closest(grip as string) !== null;
	};
}
