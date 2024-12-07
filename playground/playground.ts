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

// d.on('start', ({ev, relPos}) => {
// console.log(ev.target);
// console.log(ev.clientX, ev.clientY);
// console.log(document.elementFromPoint(ev.clientX, ev.clientY));
// });

// document.addEventListener('mousemove', (ev) => {
// 	console.log(ev.x, ev.y);
// })

// staticElm.addEventListener('mouseenter', () => {
// 	console.log('enter');
// }, false);
