import {draggable} from '../src';

const domElm = document.getElementById('drag-target');
const gripHandle = document.getElementById('grips-container');

const jsElm = document.createElement('div');
jsElm.id = 'drag-target';
jsElm.className = 'drag-box';
jsElm.innerHTML = `
	<div id="grips-container">
		<div id="grip-A">A</div>
		<br /><br />
		<div id="grip-B">B</div>
	</div><br />
	draggable
`;

// const drg = draggable(domElm);

const drg = draggable(domElm, {
// const drg = draggable(jsElm, {
	// axis:'x',
	grip: gripHandle,            // for domElm
	// grip: '#grips-container', // for jsElm
});

// document.addEventListener('mousemove', (ev) => {
// 	console.log(ev.x, ev.y);
// })
