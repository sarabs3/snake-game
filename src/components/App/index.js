import React from 'react';

import GridCell from '../GridCell';
import StartGame from '../StartGame';
import GameOver from '../GameOver';
import GameScore from '../GameScore';

import {shallowEquals, arrayDiff} from '../../utils';
import {
	GAME_STATUS_NOT_STARTED,
	GAME_STATUS_IN_PROGRESS,
	GAME_STATUS_FINISHED,
	GAME_KEYCODE_DOWN,
	GAME_KEYCODE_UP,
	GAME_KEYCODE_LEFT,
	GAME_KEYCODE_RIGHT
} from '../../utils/gameConstants';

import './App.scss';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			snake: [],
			food: [],
			status: GAME_STATUS_NOT_STARTED,
			direction: GAME_KEYCODE_LEFT,
			moveInterval: 250
		};

		this.moveFood = this.moveFood.bind(this);
		this.checkIfAteFood = this.checkIfAteFood.bind(this);
		this.startGame = this.startGame.bind(this);
		this.endGame = this.endGame.bind(this);
		this.moveSnake = this.moveSnake.bind(this);
		this.doesntOverlap = this.doesntOverlap.bind(this);
		this.setDirection = this.setDirection.bind(this);
		this.removeTimers = this.removeTimers.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	// randomly place snake food
	moveFood() {
		const x = parseInt(Math.random() * this.numCells);
		const y = parseInt(Math.random() * this.numCells);

		this.setState({food: [x, y]});
	}

	setDirection(keyCode) {
		if (!(keyCode === GAME_KEYCODE_LEFT || keyCode === GAME_KEYCODE_RIGHT || keyCode === GAME_KEYCODE_UP || keyCode === GAME_KEYCODE_DOWN)) {
			return;
		}
		let changeDirection = true;
		[[GAME_KEYCODE_UP, GAME_KEYCODE_DOWN], [GAME_KEYCODE_LEFT, GAME_KEYCODE_RIGHT]].forEach(dir => {
			if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
				changeDirection = false;
			}
		});
		if (changeDirection) {
			this.setState({direction: keyCode});
		}
	}

	moveSnake() {
		const newSnake = [];
		// set in the new "head" of the snake
		switch (this.state.direction) {
			case GAME_KEYCODE_DOWN:
				newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
				break;

			case GAME_KEYCODE_UP:
				newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
				break;

			case GAME_KEYCODE_RIGHT:
				newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
				break;

			case GAME_KEYCODE_LEFT:
				newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
				break;

			default:
				break;
		}
		// now shift each "body" segment to the previous segment's position
		[].push.apply(
			newSnake,
			this.state.snake.slice(1).map((s, i) => {
				// since we're starting from the second item in the list,
				// just use the index, which will refer to the previous item
				// in the original list
				return this.state.snake[i];
			})
		);

		this.setState({snake: newSnake});

		this.checkIfAteFood(newSnake);
		if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake)) {
			// end the game
			this.endGame()
		}
	}

	checkIfAteFood(newSnake) {
		if (!shallowEquals(newSnake[0], this.state.food)) {
			return
		}
		// snake gets longer
		let newSnakeSegment;
		const lastSegment = newSnake[newSnake.length - 1];

		// where should we position the new snake segment?
		// here are some potential positions, we can choose the best looking one
		let lastPositionOptions = [[-1, 0], [0, -1], [1, 0], [0, 1]];

		// the snake is moving along the y-axis, so try that instead
		if (newSnake.length > 1) {
			lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
		}

		for (var i = 0; i < lastPositionOptions.length; i++) {
			newSnakeSegment = [
				lastSegment[0] + lastPositionOptions[i][0],
				lastSegment[1] + lastPositionOptions[i][1]
			];
			if (this.isValid(newSnakeSegment)) {
				break;
			}
		}

		newSnake = newSnake.concat([newSnakeSegment]);

		this.setState(state => ({
			snake: newSnake,
			food: [],
			moveInterval: (state.moveInterval > 100 && newSnake.length % 2 === 0) ? state.moveInterval - 10 : state.moveInterval
		}), () => {
			if (this.state.snake.length % 2 === 0) {
				this.removeTimers();

				this.moveSnakeInterval = setInterval(this.moveSnake, this.state.moveInterval);
			}

			this.moveFood();
		});
	}

	// is the cell's position inside the grid?
	isValid(cell) {
		return (
			cell[0] > -1 &&
			cell[1] > -1 &&
			cell[0] < this.numCells &&
			cell[1] < this.numCells
		);
	}

	doesntOverlap(snake) {
		return (
			snake.slice(1).filter(c => {
				return shallowEquals(snake[0], c);
			}).length === 0
		);
	}

	startGame() {
		this.removeTimers();
		this.moveSnakeInterval = setInterval(this.moveSnake, this.state.moveInterval);
		this.moveFood();

		this.setState({
			status: GAME_STATUS_IN_PROGRESS,
			snake: [[5, 5], [6,5]],
			food: [10, 10]
		});
		//need to focus so keydown listener will work!
		this.el.focus();
	}

	endGame() {
		this.removeTimers();
		this.setState({
			status: GAME_STATUS_FINISHED,
			moveInterval: 250
		})
	}

	removeTimers() {
		if (this.moveSnakeInterval) {
			clearInterval(this.moveSnakeInterval);
		}
	}

	componentWillUnmount() {
		this.removeTimers();
	}

	handleKeyDown({keyCode}) {
		if (this.props.changeDirection !== undefined) {
			this.props.changeDirection(keyCode);
		} else {
			this.setDirection(keyCode)
		}
	}

	render() {
		// each cell should be approximately 15px wide, so calculate how many we need
		this.numCells = Math.floor(this.props.size / 15);

		const cellSize = this.props.size / this.numCells;
		const cellIndexes = Array.from(Array(this.numCells).keys());
		const cells = cellIndexes.map(y => {
			return cellIndexes.map(x => {
				const foodCell = this.state.food[0] === x && this.state.food[1] === y;
				let snakeCell = this.state.snake.filter(c => c[0] === x && c[1] === y);
				snakeCell = snakeCell.length && snakeCell[0];

				return (
					<GridCell
						foodCell={foodCell}
						snakeCell={snakeCell}
						size={cellSize}
						key={x + " " + y}
					/>
				);
			});
		});

		let score = this.state.snake.length - 2;

		let overlay;
		let scoreDisplay;

		if (this.state.status === GAME_STATUS_NOT_STARTED) {
			overlay = (
				<StartGame start={this.startGame}/>
			);
		} else if (this.state.status === GAME_STATUS_FINISHED) {
			overlay = (
				<GameOver start={this.startGame} score={score}/>
			);
		} else if (this.state.status === GAME_STATUS_IN_PROGRESS) {
			scoreDisplay = <GameScore score={score}/>
		}

		return (
			<div
				className="snake-app"
				onKeyDown={this.handleKeyDown}
				ref={el => (this.el = el)}
				tabIndex={-1}
				data-testid={'snake-app'}
			>
				<div className={'game-info'}>
					<div className={'game-name'} data-testid={'snake-game-title'}><b>Snake game</b></div>
					{scoreDisplay}
				</div>
				{overlay}
				<div
					className="grid"
					style={{
						width: this.props.size + "px",
						height: this.props.size + "px"
					}}
					data-testid={'snake-game-grid'}
				>
					{cells}
				</div>
			</div>
		);
	}
}

App.defaultProps = {
	size: 350
};

export default App;
