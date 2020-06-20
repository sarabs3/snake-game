import React from 'react';
import ReactDOM from 'react-dom';

import {render} from '@testing-library/react';
import renderer from 'react-test-renderer'

import GameScore from './index'

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

it('<GameScore /> renders without crashing', () => {
	const {queryByTestId} = render(<GameScore/>, div);

	expect(queryByTestId('game-score')).toBeTruthy();
});

it('<GameScore /> renders correctly', () => {
	const {queryByTestId} = render(<GameScore score={10}/>, div);

	expect(queryByTestId('game-score').textContent).toBe('Score: 10');
});

it('<GameScore /> snapshot matched', () => {
	const tree = renderer.create(<GameScore score={10} />, div).toJSON();

	expect(tree).toMatchSnapshot();
});
