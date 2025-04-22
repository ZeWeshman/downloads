// Create and append the main game container
let div = document.createElement('div');
div.innerHTML = `
    <input type="text" id="input" placeholder="Type word here">
    <button id="startButton">Start Game</button>
    <br>
    <p id="display" style="display: none;"></p>
    <pre id="stateDisplay" style="display: none;"></pre>
    <br>
    <div id="letterButtons" style="display: none;"></div>
`;

// Define CSS styles
let styles = `
    body {
        font-family: Arial, sans-serif;
        text-align: center;
        background-color: #f0f0f0;
    }
    #input {
        padding: 10px;
        font-size: 16px;
        margin-bottom: 10px;
    }
    button {
        padding: 10px 15px;
        margin: 5px;
        font-size: 16px;
        cursor: pointer;
        border: none;
        background-color: #007BFF;
        color: white;
        border-radius: 5px;
    }
    button:hover {
        background-color: #0056b3;
    }
    button:disabled {
        background-color: #d3d3d3; /* Grey color for disabled buttons */
        cursor: not-allowed;
    }
    #display, #stateDisplay {
        font-size: 24px;
        margin: 20px 0;
    }
    #stateDisplay {
        display: inline-block;
        margin: 0 auto; /* Center the box containing the text */
        text-align: left; /* Ensure the text inside is not centered */
        /* THIS SHOULD NOT BE CHANGED THIS IS VERY IMPORTANT */
    }
`;

// Append styles to the document
let styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Define letters and states
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const states = [
	`




- - - - -`,
	`
  |
  |
  |
  |
  |
- - - - -`,
	`
- + - - -
  |
  |
  |
  |
- - - - -`,
	`
- + - - -
  |     |
  |
  |
  |
- - - - -`,
	`
- + - - -
  |     |
  |     O
  |
  |
- - - - -`,
	`
- + - - -
  |     |
  |     O
  |     |
  |
- - - - -`,
	`
- + - - -
  |     |
  |     O
  |    /|
  |    /
- - - - -`,
	`
- + - - -
  |     |
  |     O
  |    /|\\ 
  |    / \\ 
- - - - -`,
];

let chosenLetters = [];
let currentWord = '';
let currentState = 0;

// Function to create letter buttons
function createLetterButtons() {
	let letterButtonsDiv = document.getElementById('letterButtons');
	for (const letter of letters) {
		const button = document.createElement('button');
		button.textContent = letter;
		button.id = `letter-${letter}`;
		button.onclick = () => chooseLetter(letter);
		letterButtonsDiv.appendChild(button);
	}
}

// Function to handle letter choice
function chooseLetter(letter) {
	if (!chosenLetters.includes(letter)) {
		chosenLetters.push(letter.toLowerCase());
		let display = document.getElementById('display');
		let word = document.getElementById('input').value;
		currentWord = word;
		let displayWord = makeDisplayWord(word, chosenLetters);
		display.textContent = displayWord;
		document.getElementById(`letter-${letter}`).disabled = true; // Disable the button
		if (!word.toLowerCase().includes(letter.toLowerCase())) {
			currentState++;
			setHMState(currentState);
		}
		if (currentState >= states.length - 1) {
			alert('Game Over! The word was: ' + word);
		}
		if (displayWord === word) {
			alert('Congratulations! You guessed the word: ' + word);
		}
	}
}

// Function to create the display word
function makeDisplayWord(word, guessedLetters) {
	return word
		.split('')
		.map((letter) =>
			letters.includes(letter.toLowerCase()) &&
			!guessedLetters.includes(letter.toLowerCase())
				? '_'
				: letter,
		)
		.join('');
}

// Function to start the game
function startGame() {
	let word = document.getElementById('input').value;
	let display = document.getElementById('display');
	display.textContent = makeDisplayWord(word, []);
	chosenLetters = [];
	currentState = 0;
	setHMState(currentState);
	document.getElementById('input').style.display = 'none'; // Hide the input field
	document.getElementById('startButton').style.display = 'none'; // Hide the start button
	document.getElementById('display').style.display = 'block'; // Show the display
	document.getElementById('stateDisplay').style.display = 'inline-block'; // Show the state display
	document.getElementById('letterButtons').style.display = 'block'; // Show the letter buttons
}

// Function to set the hangman state
function setHMState(state) {
	let display = document.getElementById('stateDisplay');
	display.textContent = states[state];
}

// Initialize the game
document.body.appendChild(div);
createLetterButtons();
document.getElementById('startButton').onclick = startGame;
