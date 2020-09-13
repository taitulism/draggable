/* eslint-disable */

const draggable = require('../draggable');
const draggableNDroppable = require('./drag-n-drop');
require('./old-drag');

const newDraggable = document.getElementById('new-draggable');
const gripHandle = document.getElementById('grips-container');

const drapNdropable = document.getElementById('drag-n-drop');
draggableNDroppable(drapNdropable);


// const drg = draggable(newDraggable);
const drg = draggable(newDraggable, {
	// axis:'x',
	grip: gripHandle,
});

console.log(drg);
