import {draggable} from '../src';

const drgElm = document.getElementById('drag-target')!;

// const gripHandle = document.getElementById('grips-container')!;
const gripHandle = document.getElementById('grip-A')!;

draggable(drgElm, {
	// axis:'x',
	// grip: '#grips-container',
	grip: gripHandle,
});


// document.addEventListener('mousemove', (ev) => {
// 	console.log(ev.x, ev.y);
// })
