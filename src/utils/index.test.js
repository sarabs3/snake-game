import {shallowEquals, arrayDiff} from './index';

test('shallowEquals', () => {
	const truthyValue = shallowEquals([0, 1], [0, 1]);
	const falsyValue = shallowEquals([0, 1], [1, 1]);

	expect(truthyValue).toBeTruthy();
	expect(falsyValue).toBeFalsy();
});

test('arrayDiff', () => {
	const value = arrayDiff([0, 1], [1, 2]);

	expect(value).toEqual([-1, -1]);
});
