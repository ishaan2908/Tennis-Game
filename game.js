var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedHorizontal = 10;
var ballSpeedVertical = 4;

var playerScore = 0;
var computerScore = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var playerPaddleY = 250;
var computerPaddleY = 250;
const paddleWidth = 10;
const paddleHeight = 100;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x : mouseX,
		y : mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		playerScore = 0;
		computerScore = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			move();
			draw();	
		}, 1000 / framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			playerPaddleY = mousePos.y - (paddleHeight / 2);
		});
}

function ballReset() {
	if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedHorizontal = -ballSpeedHorizontal;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function computerMovement() {
	var computerPaddleYCenter = computerPaddleY + (paddleHeight / 2);
	if(computerPaddleYCenter < ballY - 35) {
		computerPaddleY = computerPaddleY + 6;
	} else if(computerPaddleYCenter > ballY + 35) {
		computerPaddleY = computerPaddleY - 6;
	}
}

function move() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();

	ballX += ballSpeedHorizontal;
	ballY += ballSpeedVertical;
	
	if(ballX < paddleWidth) {
		if(ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
			ballSpeedHorizontal = -ballSpeedHorizontal;
			var deltaY = ballY - (playerPaddleY + paddleHeight / 2);
			ballSpeedVertical = deltaY * 0.35;
		} else {
			computerScore++;
			ballReset();
		}
	}
	if(ballX > canvas.width - paddleWidth) {
		if(ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
			ballSpeedHorizontal = -ballSpeedHorizontal;

			var deltaY = ballY - (computerPaddleY + paddleHeight / 2);
			ballSpeedVertical = deltaY * 0.35;
		} else {
			playerScore++;
			ballReset();	
		}
	}
	if(ballY < 0) {
		ballSpeedVertical = -ballSpeedVertical;
	}
	if(ballY > canvas.height) {
		ballSpeedVertical = -ballSpeedVertical;
	}
}

function drawNetLine() {
	for(var i = 0; i < canvas.height; i += 40) {
		colorRect((canvas.width / 2) -1, i, 2, 20, 'white');
	}
}

function draw() {
	// next line blanks out the screen with black
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'yellow';

		if(playerScore >= WINNING_SCORE) {
			canvasContext.fillText("You Won!", canvas.width / 2, 200);
		} else if(computerScore >= WINNING_SCORE) {
			canvasContext.fillText("Computer Won!", canvas.width / 2, 200);
		}

		canvasContext.fillText("Click to Play Again", canvas.width / 2, 500);
		return;
	}

	drawNetLine();

	// this is Player A paddle
	colorRect(0, playerPaddleY, paddleWidth, paddleHeight, 'white');

	// this is computer paddle
	colorRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight, 'white');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillStyle = 'yellow';
	canvasContext.fillText("Your Score  " + playerScore, canvas.width / 4, 100);
	canvasContext.fillText("Computer's Score  " + computerScore, 3 * canvas.width / 4, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
