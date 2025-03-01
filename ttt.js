let div = document.createElement('div');
div.innerHTML = `
<button onclick="play(1)" id="1"></button>
<button onclick="play(2)" id="2"></button>
<button onclick="play(3)" id="3"></button>
<button onclick="play(4)" id="4"></button>
<button onclick="play(5)" id="5"></button>
<button onclick="play(6)" id="6"></button>
<button onclick="play(7)" id="7"></button>
<button onclick="play(8)" id="8"></button>
<button onclick="play(9)" id="9"></button>`;

let styles = `
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
  }
  div {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-gap: 10px;
  }
  button {
    width: 100px;
    height: 100px;
    font-size: 24px;
    cursor: pointer;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 10px;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: #e0e0e0;
  }
  button:disabled {
    cursor: not-allowed;
    background-color: #d0d0d0;
  }
`;

let styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

let arr = Array(9).fill('');
const winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8], // Rows
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8], // Columns
	[0, 4, 8],
	[2, 4, 6], // Diagonals
];

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function play(t) {
	let button = document.getElementById(t);
	button.innerHTML = 'X';
	button.disabled = true;
	arr[t - 1] = 'X';
	await sleep(500);
	await checkWinner();
	aiPlay();
	await checkWinner();
}

function aiPlay() {
	// Vérifier si l'IA peut gagner
	for (let i = 0; i < 9; i++) {
		if (arr[i] === '') {
			arr[i] = 'O';
			if (checkPotentialWinner('O')) {
				document.getElementById(i + 1).innerHTML = 'O';
				document.getElementById(i + 1).disabled = true;
				return;
			}
			arr[i] = '';
		}
	}

	// Vérifier si l'IA peut bloquer le joueur
	for (let i = 0; i < 9; i++) {
		if (arr[i] === '') {
			arr[i] = 'X';
			if (checkPotentialWinner('X')) {
				document.getElementById(i + 1).innerHTML = 'O';
				document.getElementById(i + 1).disabled = true;
				arr[i] = 'O';
				return;
			}
			arr[i] = '';
		}
	}

	// Jouer aléatoirement si aucune des conditions ci-dessus n'est remplie
	let emptyCells = [];
	for (let i = 0; i < 9; i++) {
		if (arr[i] === '') {
			emptyCells.push(i + 1);
		}
	}
	if (emptyCells.length > 0) {
		let randomIndex = Math.floor(Math.random() * emptyCells.length);
		let randomCell = emptyCells[randomIndex];
		document.getElementById(randomCell).innerHTML = 'O';
		document.getElementById(randomCell).disabled = true;
		arr[randomCell - 1] = 'O';
	}
}

function checkPotentialWinner(player) {
	for (let combination of winningCombinations) {
		const [a, b, c] = combination;
		if (arr[a] === player && arr[b] === player && arr[c] === player) {
			return true;
		}
	}
	return false;
}

async function checkWinner() {
	for (let combination of winningCombinations) {
		const [a, b, c] = combination;
		if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
			await highlightWinningCombination(combination);
			resetGame();
			return;
		}
	}

	if (!arr.includes('')) {
		await highlightDraw();
		resetGame();
	}
}

async function highlightWinningCombination(combination) {
	for (let index of combination) {
		document.getElementById(index + 1).style.backgroundColor = 'green';
	}
	await sleep(1000);
	for (let index of combination) {
		document.getElementById(index + 1).style.backgroundColor = '';
	}
	await sleep(100);
}

async function highlightDraw() {
	for (let i = 1; i <= 9; i++) {
		document.getElementById(i).style.backgroundColor = 'orange';
	}
	await sleep(1000);
	for (let i = 1; i <= 9; i++) {
		document.getElementById(i).style.backgroundColor = '';
	}
	await sleep(100);
}

function resetGame() {
	arr.fill('');
	for (let i = 1; i < 10; i++) {
		let button = document.getElementById(i);
		button.innerHTML = '';
		button.disabled = false;
	}
}

document.body.appendChild(div);
