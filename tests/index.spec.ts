import {describe, it, expect} from 'vitest';
import {draggable} from '../src';

describe('draggable', () => {
	it('is a function', () => expect(draggable).to.be.a('function'));

	it('returns a `Draggable` instance', () => {
		const draggableInstance = draggable();
		const ctor = Object.getPrototypeOf(draggableInstance).constructor;

		expect(ctor.name).to.equal('DraggingLayer');
	});
});
