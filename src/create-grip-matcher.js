export default function createGripMatcher (grip, isHtmlElm) {
	if (isHtmlElm) {
		return function gripMatcher (eventTarget) {
			return grip === eventTarget || isInside(eventTarget, grip);
		};
	}

	// `grip` is an elm selector string
	return function gripMatcher (eventTarget) {
		return eventTarget.matches(grip) || eventTarget.closest(grip) != null;
	};
}

function isInside (child, parent) {
	const actualParentNode = child.parentNode;
	if (actualParentNode === parent) return true;
	if (actualParentNode === document.body || actualParentNode == null) return false;
	return isInside(actualParentNode, parent);
}

