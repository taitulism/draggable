import {draggables} from '../src';

// const wrapper = document.getElementById('the-container')!;
// const drgElm = document.getElementById('drag-me')!;
const toggleBtn = document.getElementById('toggle-btn')!;
// const staticElm = document.getElementById('static')!;

toggleBtn.addEventListener('click', () => {
	d.isEnabled
		? d.disable()
		: d.enable();
}, false);


// const gripHandle = document.getElementById('grips-container')!;
// const gripHandle = document.getElementById('grip-a')!;

const d = draggables();

d.on('grab', () => console.log('grabbed'))
	.on('dragStart', () => console.log('dragStart'))
	.on('dragging', () => console.log('dragging'))
	.on('dragEnd', () => console.log('droped'));

// document.addEventListener('mousemove', (ev) => {
// 	console.log(ev.x, ev.y);
// })

// staticElm.addEventListener('mouseenter', () => {
// 	console.log('enter');
// }, false);
