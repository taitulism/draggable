export default function createGripMatcher (grip, isSelector) {
	if (isSelector) { // `grip` is a string
		return function gripMatcher (eventTarget) {
			return eventTarget.matches(grip) || eventTarget.closest(grip) != null;
		};
	}

	// `grip` is an HTMLElement
	return function gripMatcher (eventTarget) {
		return grip === eventTarget || isInside(eventTarget, grip);
	};
}

function isInside (child, parent) {
	const actualParentNode = child.parentNode;
	if (actualParentNode === parent) return true;
	if (actualParentNode === document.body || actualParentNode == null) return false;
	return isInside(actualParentNode, parent);
}

