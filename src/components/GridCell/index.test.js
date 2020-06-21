import React from 'react';
import ReactDOM from 'react-dom';

import {render} from '@testing-library/react';
import renderer from 'react-test-renderer';

import GridCell from './index';

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

it('<GridCell /> renders without crashing', () => {
	const {queryByTestId} = render(<GridCell foodCell={true} snakeCell={false} size={15}/>, div);

	expect(queryByTestId('grid-cell')).toBeTruthy();
});

describe('Grid cell snapshots', () => {
	it('<GridCell /> food cell matches snapshot', () => {
		const tree = renderer.create(<GridCell foodCell={true} snakeCell={false} size={15} />, div);

		expect(tree).toMatchSnapshot();
	});

	it('<GridCell /> snake cell matches snapshot', () => {
		const tree = renderer.create(<GridCell foodCell={false} snakeCell={true} size={15} />, div);

		expect(tree).toMatchSnapshot();
	});
});
