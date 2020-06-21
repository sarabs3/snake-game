import React from 'react';
import ReactDOM from 'react-dom';

import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';

import GameOver from './index';

let div;

beforeEach(() => {
	div = document.createElement('div');
	document.body.appendChild(div);
});

afterEach(() => {
	ReactDOM.unmountComponentAtNode(div);
	div.remove();
	div = null;
});

const startGame = jest.fn();

it('<GameOver /> renders without crashing', () => {
	const {queryByTestId} = render(<GameOver score={10} start={startGame} />, div);

	expect(queryByTestId('game-over-message')).toBeTruthy();
	expect(queryByTestId('game-over-score')).toBeTruthy();
	expect(queryByTestId('start-game-button')).toBeTruthy();
});

it ('<GameOver /> snapshot matched', () => {
	const tree = renderer.create(<GameOver score={10} start={startGame} />, div).toJSON();

	expect(tree).toMatchSnapshot();
});

it('<GameOver /> start game button working', () => {
	const {queryByTestId} = render(<GameOver score={10} start={startGame} />, div);

	const button = queryByTestId('start-game-button');

	expect(button.textContent).toBe('Start a new game');

	fireEvent.click(button);

	expect(startGame).toHaveBeenCalledTimes(1);

	for (let i = 0; i < 5; i ++) {
		fireEvent.click(button);
	}

	expect(startGame).toHaveBeenCalledTimes(6);
});
