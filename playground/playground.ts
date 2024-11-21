import {draggable} from '../src';

const drgElm = document.getElementById('drag-target')!;
const toggleBtn = document.getElementById('toggle-btn')!;

toggleBtn.addEventListener('click', () => {
	d.isDraggable
		? d.disable()
		: d.enable();
}, false);

// const gripHandle = document.getElementById('grips-container')!;
const gripHandle = document.getElementById('grip-A')!;

const d = draggable(drgElm, {
	axis:'x',
	// grip: '#grips-container',
	grip: gripHandle,
});


// document.addEventListener('mousemove', (ev) => {
// 	console.log(ev.x, ev.y);
// })
