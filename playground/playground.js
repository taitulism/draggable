/* eslint-disable */

const newDraggable = document.getElementById('drag-target');
const gripHandle = document.getElementById('grips-container');

// const drg = draggable(newDraggable);
const drg = draggable(newDraggable, {
	// axis:'x',
	grip: gripHandle,
});
