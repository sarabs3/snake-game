import React from 'react';
import ReactDOM from 'react-dom';

import {render, fireEvent} from '@testing-library/react';
import renderer from 'react-test-renderer';

import App from './index';

import {
	GAME_KEYCODE_DOWN,
	GAME_KEYCODE_UP,
	GAME_KEYCODE_LEFT,
	GAME_KEYCODE_RIGHT
} from '../../utils/gameConstants';

let div;
let currentDirection = GAME_KEYCODE_LEFT;

beforeAll(() => {
	div = document.createElement('div');
	document.body.appendChild(div);
});

afterAll(() => {
	ReactDOM.unmountComponentAtNode(div);
	div.remove();
	div = null;
	currentDirection = GAME_KEYCODE_LEFT;
});

it('<App /> renders without crashing', () => {
	const {queryByTestId} = render(<App size={350}/>, div);

	expect(queryByTestId('snake-app')).toBeTruthy();

	expect(queryByTestId('snake-game-title')).toBeTruthy();
	expect(queryByTestId('snake-game-title').textContent).toBe('Snake game');

	expect(queryByTestId('snake-game-grid')).toBeTruthy();
});

describe('<App /> snapshots', () => {
	it('<App /> snapshot with size = 350', () => {
		const tree = renderer.create(<App size={350} />, div);

		expect(tree).toMatchSnapshot();
	});

	it('<App /> snapshot with size = 150', () => {
		const tree = renderer.create(<App size={150} />, div);

		expect(tree).toMatchSnapshot();
	});
});

const setDirection = jest.fn(keyCode => {
	let changeDirection = true;
	// If any key other than direction keys are pressed
	if (!(keyCode === GAME_KEYCODE_LEFT || keyCode === GAME_KEYCODE_RIGHT || keyCode === GAME_KEYCODE_UP || keyCode === GAME_KEYCODE_DOWN)) {
		changeDirection = false;
	}

	// If the same direction key is pressed as current or opposite direction
	[[GAME_KEYCODE_UP, GAME_KEYCODE_DOWN], [GAME_KEYCODE_LEFT, GAME_KEYCODE_RIGHT]].forEach(dir => {
		if (dir.indexOf(currentDirection) > -1 && dir.indexOf(keyCode) > -1) {
			changeDirection = false;
		}
	});

	if (changeDirection) {
		currentDirection = keyCode;
	}
});

describe('Snake direction changes', () => {
	it('Snake changes direction', () => {
		const {queryByTestId} = render(<App changeDirection={setDirection} />, div);

		const snakeApp = queryByTestId('snake-app');

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_UP});

		expect(setDirection).toHaveBeenCalledTimes(1);
		expect(currentDirection).toBe(GAME_KEYCODE_UP);

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_RIGHT});

		expect(setDirection).toHaveBeenCalledTimes(2);
		expect(currentDirection).toBe(GAME_KEYCODE_RIGHT);

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_DOWN});

		expect(setDirection).toHaveBeenCalledTimes(3);
		expect(currentDirection).toBe(GAME_KEYCODE_DOWN);

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_LEFT});

		expect(setDirection).toHaveBeenCalledTimes(4);
		expect(currentDirection).toBe(GAME_KEYCODE_LEFT);
	});

	it('Snake does not change direction', () => {
		const {queryByTestId} = render(<App changeDirection={setDirection} />, div);

		const snakeApp = queryByTestId('snake-app');

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_RIGHT});

		expect(setDirection).toHaveBeenCalledTimes(5);
		expect(currentDirection).toBe(GAME_KEYCODE_LEFT);

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_LEFT});

		expect(setDirection).toHaveBeenCalledTimes(6);
		expect(currentDirection).toBe(GAME_KEYCODE_LEFT);

		currentDirection = GAME_KEYCODE_UP;

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_DOWN});

		expect(setDirection).toHaveBeenCalledTimes(7);
		expect(currentDirection).toBe(GAME_KEYCODE_UP);

		fireEvent.keyDown(snakeApp, {keyCode: GAME_KEYCODE_UP});

		expect(setDirection).toHaveBeenCalledTimes(8);
		expect(currentDirection).toBe(GAME_KEYCODE_UP);

		// Any key other than direction keys are pressed
		fireEvent.keyDown(snakeApp, {keyCode: 13});

		expect(setDirection).toHaveBeenCalledTimes(9);
		expect(currentDirection).toBe(GAME_KEYCODE_UP);
	})
});
