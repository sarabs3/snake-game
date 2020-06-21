import React from 'react';

const StartGame = props => {
	return (
		<div className="snake-app__overlay">
			<button onClick={props.start} data-testid={'start-game'}>Start game!</button>
		</div>
	);
};

export default StartGame;
