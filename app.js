/*  TETRIS 
    TODO farbliche Unterscheidung der Tetrominos
    TODO jl und sz Paarung in Randomisierung berücksichtigen
    TODO Steuerung erweitern: Rotation in beide Richtungen


 */
document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')

	//Array.from() creates an ARRAY
	//document.querySelectorAll() grabs all <div> in CLASS "grid" into that ARRAY
	let squares = Array.from(document.querySelectorAll('.grid div'))
	const scoreDisplay = document.querySelector('#score') /* # = id */
	const startBtn = document.querySelector('#start-button')
	const width = 10
	let nextRandom = 0
	let timerId
	let score = 0

	//Test for DIV grabbing into array
	/* console.log(squares); */
	// watch at console in browser: it shows an array with 200 divs

	//The Tetrominoes
	const jTetromino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	]

	const lTetromino = [
		[0, 1, width + 1, width * 2 + 1],
		[width, width + 1, width + 2, 2],
		[1, width + 1, width * 2 + 1, width * 2 + 2],
		[width, width + 1, width + 2, width * 2],
	]

	const sTetromino = [
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
	]

	const zTetromino = [
		[width, width + 1, width * 2 + 1, width * 2 + 2],
		[1, width + 1, width, width * 2],
		[width, width + 1, width * 2 + 1, width * 2 + 2],
		[1, width + 1, width, width * 2],
	]

	const tTetromino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1],
	]

	const oTetromino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
	]

	const iTetromino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
	]

	const theTetrominoes = [
		jTetromino,
		lTetromino,
		sTetromino,
		zTetromino,
		tTetromino,
		oTetromino,
		iTetromino,
	]

	let currentPosition = 4
	let currentRotation = 0

	//randomly select a Tetromino and its first rotation
	let random = Math.floor(Math.random() * theTetrominoes.length)

	//Array[i][j] with i=Form and j=Orientation
	let current = theTetrominoes[random][currentRotation]

	//draws current tetromino on ARRAY squares
	//current.forEach() runs through the ARRAY squares[]
	//ELEMENT.classList reads the DOM element and returns the element
	//by classList.add the tetromino is "saved" in squares
	function draw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.add('tetromino')
		})
	}

	//undraws the tetromino
	function undraw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.remove('tetromino')
		})
	}

	//make the tetromino move down every second
	/* let timeInterval = 500;
  timerID = setInterval(moveDown, timeInterval); */

	//assign functions to keycode
	function control(e) {
		if (e.keyCode === 37) {
			moveLeft()
		} else if (e.keyCode === 38) {
			rotate()
		} else if (e.keyCode === 39) {
			moveRight()
		} else if (e.keyCode === 40) {
			//FIXME add counter clockwise rotation
			rotate()
		} else if (e.keyCode === 32) {
			moveDown()
		}
	}
	document.addEventListener('keyup', control)

	//Before Tetromino touches 'taken' in the next line, it freezes in the current position
	//'taken' status is handed over to squares (squares.classList.add()) at current position
	function freeze() {
		if (
			current.some(index =>
				squares[currentPosition + index + width].classList.contains('taken')
			)
		) {
			current.forEach(index =>
				squares[currentPosition + index].classList.add('taken')
			)
			//start a new tetromino falling
			random = nextRandom
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			current = theTetrominoes[random][currentRotation]
			currentPosition = 4
			draw()
			displayShape()
			addScore()
			gameOver()
		}
	}

	//move down function
	function moveDown() {
		freeze()
		undraw()
		currentPosition += width
		draw()
	}

	//move the tetromino left, unless is at the edge or there is a blockage
	function moveLeft() {
		undraw()
		const isAtLeftEdge = current.some(
			index => (currentPosition + index) % width === 0
		)

		if (!isAtLeftEdge) currentPosition -= 1
		//1 to the right, if out of bound
		if (
			current.some(index =>
				squares[currentPosition + index].classList.contains('taken')
			)
		) {
			currentPosition += 1
		}
		draw()
	}

	//move the tetromino right, unless is at the edge or there is a blockage
	function moveRight() {
		undraw()
		const isAtRightEdge = current.some(
			index => (currentPosition + index) % width === 9
		)

		if (!isAtRightEdge) currentPosition += 1
		//1 to the left, if out of bound
		if (
			current.some(index =>
				squares[currentPosition + index].classList.contains('taken')
			)
		) {
			currentPosition -= 1
		}
		draw()
	}

	//rotate the tetromino
	function rotate() {
		undraw()
		currentRotation++
		if (currentRotation === current.length) {
			currentRotation = 0
		}
		current = theTetrominoes[random][currentRotation]
		draw()
	}

	//show up-next tetromino in mini-grid
	const displaySquares = document.querySelectorAll('.mini-grid div')
	const displayWidth = 4
	let displayIndex = 0

	//the Tetrominos without rotations
	// TODO L und J Orientation einbauen
	const upNextTetrominoes = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2], //jTetromino
		[0, 1, displayWidth + 1, displayWidth * 2 + 1], //lTetromino
		[
			displayWidth + 1,
			displayWidth + 2,
			displayWidth * 2,
			displayWidth * 2 + 1,
		], //sTetromino
		[
			displayWidth,
			displayWidth + 1,
			displayWidth * 2 + 1,
			displayWidth * 2 + 2,
		], //zTetromino
		[1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetrmomino
		[0, 1, displayWidth, displayWidth + 1], //oTetromino
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
	]

	//display the shape in the mini-gripd display
	function displayShape() {
		//remove any trace of a tetromino from the entire grid
		displaySquares.forEach(square => {
			square.classList.remove('tetromino')
		})
		upNextTetrominoes[nextRandom].forEach(index => {
			displaySquares[displayIndex + index].classList.add('tetromino')
		})
	}

	//add functionality to the button
	startBtn.addEventListener('click', () => {
		if (timerId) {
			clearInterval(timerId)
			timerId = null
		} else {
			draw()
			timerId = setInterval(moveDown, 1000)
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			displayShape()
		}
	})

	//add score
	function addScore() {
		for (let i = 0; i < 199; i += width) {
			const row = [
				i,
				i + 1,
				i + 2,
				i + 3,
				i + 4,
				i + 5,
				i + 6,
				i + 7,
				i + 8,
				i + 9,
			]

			if (row.every(index => squares[index].classList.contains('taken'))) {
				score += 10
				scoreDisplay.innerHTML = score
				row.forEach(index => {
					squares[index].classList.remove('taken')
					squares[index].classList.remove('tetromino')
				})
				//1. untere Reihe von squares[] abschneiden
				//2. abgeschnitte Reihe an squares[] anfügen
				//3. neues squares[] an grid im HTML verknüpfen
				const squaresRemoved = squares.splice(i, width)
				squares = squaresRemoved.concat(squares)
				squares.forEach(cell => grid.appendChild(cell))
			}
		}
	}

	//game-over function
	function gameOver() {
		if (
			current.some(index =>
				squares[currentPosition + index].classList.contains('taken')
			)
		) {
			scoreDisplay.innerHTML = 'end'
			clearInterval(timerId)
		}
	}
})

//different display methods for messages in the browser
function toDisplay() {
	text = 'Hello World'
	alert(text)
	prompt(text)
	confirm(text)
}
/* toDisplay() */
