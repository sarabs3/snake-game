import React from 'react';
import ReactDOM from 'react-dom';

import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';

import StartGame from './index';

let div;

beforeAll(() => {
	div = document.createElement('div');
	document.body.appendChild(div);
});

afterAll(() => {
	ReactDOM.unmountComponentAtNode(div);
	div.remove();
	div = null;
});

const startGame = jest.fn();

it('<StartGame /> renders without crashing', () => {
	const {queryByTestId} = render(<StartGame start={startGame}/>, div);

	expect(queryByTestId('start-game')).toBeTruthy();
});

it('<StartGame /> matches snapshot', () => {
	const tree = renderer.create(<StartGame start={startGame}/>, div);

	expect(tree).toMatchSnapshot();
});

describe('Search button', () => {
	it('<StartGame/> button working properly', () => {
		const {queryByTestId} = render(<StartGame start={startGame} />, div);

		const button = queryByTestId('start-game');

		expect(button.textContent).toBe('Start game!');

		fireEvent.click(button);

		expect(startGame).toHaveBeenCalledTimes(1);

		for (let i = 0; i < 5; i++) {
			fireEvent.click(button);
		}

		expect(startGame).toHaveBeenCalledTimes(6);
	});
});
