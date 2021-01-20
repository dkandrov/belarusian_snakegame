'use strict';

/*
let ctx;
// chceck if canvas is supported by browser

function checkSupported() {
	canvas = document.querySelector('canvas');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		// Canvas is supported
	}
	else {
		// Canvas is not supported
		alert(
			'Парабачце, але ў гэтую гульню немагчыма пагуляць у браўзэры Internet Explorer. Калі ласка, запусціце гэтую гульню ў любым іншым браўзэры.'
		);
	}
}

window.onload = checkSupported();
*/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const groundImg = new Image();
groundImg.src = './img/background.png';
const flagImg = new Image();
flagImg.src = './img/flag.png';
const boyImg = new Image();
boyImg.src = './img/boy.png';
const girlImg = new Image();
girlImg.src = './img/girl.png';
const policeImg = new Image();
policeImg.src = './img/amap.png';

const cellSize = 32;
const nCols = 18,
	nRows = 15;
const offset = {
	x: 1,
	y: 3
};
const startPos = {
	x: 8,
	y: 7
};

let score = 0;

// create an object with random x and y
function randomPos() {
	return {
		x: Math.floor(Math.random() * nCols),
		y: Math.floor(Math.random() * nRows)
	};
}

// context binding
function copy(pos) {
	return {
		x: pos.x,
		y: pos.y
	};
}

// coordinates to pixels
function pos2pixel(pos) {
	return {
		x: (pos.x + offset.x) * cellSize,
		y: (pos.y + offset.y) * cellSize
	};
}

// check if 2 objects are generated at the same position
function samePos(pos1, pos2) {
	return pos1.x == pos2.x && pos1.y == pos2.y;
}

let policeBoy = randomPos();
let policeBoy2 = randomPos();
let policeBoy3 = randomPos();
let flag = randomPos();
let snake = [ copy(startPos) ];

let snakeDir;

// button events
function move(event) {
	if (event.keyCode == 37 && snakeDir != 'right') snakeDir = 'left';
	if (event.keyCode == 38 && snakeDir != 'down') snakeDir = 'up';
	if (event.keyCode == 39 && snakeDir != 'left') snakeDir = 'right';
	if (event.keyCode == 40 && snakeDir != 'up') snakeDir = 'down';
}
document.addEventListener('keydown', move);

//game over when the snake eats its own tail
function eatTail(head, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (samePos(head, arr[i])) {
			confirm(
				'Вы прайгралі, бо сутыкнуліся ілбамі са сваімі паплечнікамі (выбачайце, такія правілы "змейкі" :)). Паспрабуеце яшчэ раз? '
			);
			clearInterval(game);
			window.location.reload(true);
		}
	}
}

// game start
function drawGame() {
	//draw background
	ctx.drawImage(groundImg, 0, 0);

	let pix;
	let pos;

	// draw flag
	pix = pos2pixel(flag);
	ctx.drawImage(flagImg, pix.x, pix.y);

	// check if the cell is not occupied by policeman
	if (samePos(flag, policeBoy) || samePos(flag, policeBoy2) || samePos(flag, policeBoy3)) return (flag = randomPos());

	// draw policemen
	pix = pos2pixel(policeBoy);
	ctx.drawImage(policeImg, pix.x, pix.y);

	pix = pos2pixel(policeBoy2);
	ctx.drawImage(policeImg, pix.x, pix.y);

	pix = pos2pixel(policeBoy3);
	ctx.drawImage(policeImg, pix.x, pix.y);

	// check if the cell is not occupied by snake at the start of the game
	if (samePos(policeBoy, startPos) || samePos(policeBoy2, startPos) || samePos(policeBoy3, startPos)) {
		policeBoy = randomPos();
		policeBoy2 = randomPos();
		policeBoy3 = randomPos();
	}

	// girl or boy draw
	for (let i = 0; i < snake.length; i++) {
		pix = pos2pixel(snake[i]);
		ctx.drawImage(i % 2 == 0 ? girlImg : boyImg, pix.x, pix.y, cellSize, cellSize);
	}

	//score style/
	ctx.fillStyle = 'white';
	ctx.font = '35px Arial';
	ctx.fillText(score, cellSize * 1.3, cellSize * 1.3);

	let newHead = copy(snake[0]);

	//collecting flag
	if (samePos(newHead, flag)) {
		score++;
		flag = randomPos();
		for (let i = 0; i < snake.length; i++) {
			if (samePos(flag, snake[i])) return (flag = randomPos());
		}
	}
	else {
		snake.pop();
	}

	// win
	if (score === 25) {
		confirm('Вы перамаглі! Паспрабуеце яшчэ раз?');
		clearInterval(game);
		window.location.reload(true);
	}

	// gameover when the snake is caught by police
	if (samePos(newHead, policeBoy)) {
		confirm('Вы прайгралі: вас схапіў АМАП! Паспрабуеце яшчэ раз?');
		clearInterval(game);
		window.location.reload(true);
	}

	if (samePos(newHead, policeBoy2)) {
		confirm('Вы прайгралі: вас схапіў АМАП! Паспрабуеце яшчэ раз?');
		clearInterval(game);
		window.location.reload(true);
	}

	if (samePos(newHead, policeBoy3)) {
		confirm('Вы прайгралі: вас схапіў АМАП! Паспрабуеце яшчэ раз?');
		clearInterval(game);
		window.location.reload(true);
	}

	// gameover when the snake went out of canva
	if (newHead.x < 0 || newHead.x >= nCols || newHead.y < 0 || newHead.y >= nRows) {
		confirm('Вы прайгралі, бо выйшлі па-за межы поля! Паспрабуеце яшчэ раз?');
		clearInterval(game);
		window.location.reload(true);
	}

	//snake movement //
	if (snakeDir == 'left') newHead.x--;
	if (snakeDir == 'right') newHead.x++;
	if (snakeDir == 'up') newHead.y--;
	if (snakeDir == 'down') newHead.y++;

	eatTail(newHead, snake);
	snake.unshift(newHead);
}

let game = setInterval(drawGame, 300);
