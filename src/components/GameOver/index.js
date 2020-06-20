import React from 'react';

const GameOver = props => {
	return (
		<div className="snake-app__overlay">
			<div className="mb-1" data-testid={'game-over-message'}><b>GAME OVER!</b></div>
			<div className="mb-1" data-testid={'game-over-score'}>Your score: {props.score} </div>
			<button onClick={props.start} data-testid={'start-game-button'}>Start a new game</button>
		</div>
	);
};

export default GameOver;
