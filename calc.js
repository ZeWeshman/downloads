const container = document.createElement('div');
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.style.alignItems = 'flex-start';

const div = document.createElement('div');
let previousValue = '';
let currentValue = '';
let operator = '';
let history = [];

div.innerHTML = `
    <h1>Calculatrice</h1>
    <br>
    <p>0</p>
    <button onclick="storeValue('1')">1</button>
    <button onclick="storeValue('2')">2</button>
    <button onclick="storeValue('3')">3</button>
    <button onclick="storeOperator('+')" disabled=true>+</button>
    <button onclick="storeOperator('-')" disabled=true>-</button>
    <br>
    <button onclick="storeValue('4')">4</button>
    <button onclick="storeValue('5')">5</button>
    <button onclick="storeValue('6')">6</button>
    <button onclick="storeOperator('*')" disabled=true>*</button>
    <button onclick="storeOperator('/')" disabled=true>/</button>
    <br>
    <button onclick="storeValue('7')">7</button>
    <button onclick="storeValue('8')">8</button>
    <button onclick="storeValue('9')">9</button>
    <button onclick="storeOperator('^')" disabled=true>^</button>
    <button onclick="storeOperator('√')" disabled=true>√</button>
    <br>
    <button onclick="toggleSign()">±</button>
    <button onclick="storeValue('0')">0</button>
    <button onclick="storeValue('.')">.</button>
    <button onclick="calculate()" disabled=true style="width: 114px">=</button>
    <br>
    <button onclick="backspace()" style="width: 82px">←</button>
    <button onclick="clearAll()" style="width: 82px">C</button>
    <button onclick="toggleAdvancedFunctions()">Adv</button>
    <br>
`;

const advancedFunctionsDiv = document.createElement('div');
advancedFunctionsDiv.id = 'advanced-functions';
advancedFunctionsDiv.style.display = 'none';
advancedFunctionsDiv.style.marginLeft = '20px';
advancedFunctionsDiv.innerHTML = `
    <button onclick="storeOperator('sin')">sin</button>
    <button onclick="storeOperator('arcsin')">arcsin</button>
    <br>
    <button onclick="storeOperator('cos')">cos</button>
    <button onclick="storeOperator('arccos')">arccos</button>
    <br>
    <button onclick="storeOperator('tan')">tan</button>
    <button onclick="storeOperator('arctan')">arctan</button>
    <br>
    <button onclick="storeOperator('log')">log</button>
    <button onclick="storeOperator('abs')">abs</button>
    <br>
    <button onclick="storeValue(Math.PI.toString())">π</button>
    <button onclick="storeValue(Math.E.toString())">e</button>
`;

const historyDiv = document.createElement('div');
historyDiv.innerHTML = `
    <h2>Historique</h2>
    <ul id="history"></ul>
`;
historyDiv.style.marginLeft = '20px';

container.appendChild(div);
container.appendChild(advancedFunctionsDiv);
container.appendChild(historyDiv);
document.body.appendChild(container);

function storeValue(value) {
	if (previousValue === '' && operator === '' && currentValue === '') {
		document.querySelector('p').textContent = '0';
	}
	if (value === '.' && currentValue === '') {
		currentValue = '0';
	}
	if (value === '.' && currentValue.includes('.')) return;
	currentValue += value;
	console.log(currentValue);
	document.querySelector('p').textContent =
		`${previousValue} ${operator} ${currentValue}`;
	toggleButtons('number', true);
	toggleButtons('operator', false);
}

function storeOperator(op) {
	operator = op;
	console.log(operator);
	previousValue = currentValue;
	currentValue = '';
	toggleButtons('number', false);
	toggleButtons('operator', true);
	document.querySelector('button[onclick="calculate()"]').disabled = false;
	document.querySelector('p').textContent =
		`${previousValue} ${operator} ${currentValue}`;
}

function calculate() {
	console.log('Calculating:', previousValue, operator, currentValue);
	let result;
	switch (operator) {
		case '+':
			result = parseFloat(previousValue) + parseFloat(currentValue);
			break;
		case '-':
			result = parseFloat(previousValue) - parseFloat(currentValue);
			break;
		case '*':
			result = parseFloat(previousValue) * parseFloat(currentValue);
			break;
		case '/':
			result = parseFloat(previousValue) / parseFloat(currentValue);
			break;
		case '^':
			result = parseFloat(previousValue) ** parseFloat(currentValue);
			break;
		case '√':
			result = parseFloat(currentValue) ** (1 / parseFloat(previousValue));
			break;
		case 'sin':
			result = Math.sin(parseFloat(previousValue)).toString();
			break;
		case 'cos':
			result = Math.cos(parseFloat(previousValue)).toString();
			break;
		case 'tan':
			result = Math.tan(parseFloat(previousValue)).toString();
			break;
		case 'arcsin':
			result = Math.asin(parseFloat(previousValue)).toString();
			break;
		case 'arccos':
			result = Math.acos(parseFloat(previousValue)).toString();
			break;
		case 'arctan':
			result = Math.atan(parseFloat(previousValue)).toString();
			break;
		case 'log':
			result = (
				Math.log(parseFloat(currentValue)) / Math.log(parseFloat(previousValue))
			).toString();
			break;
		case 'abs':
			result = Math.abs(parseFloat(previousValue)).toString();
			break;
		default:
			alert('Opérateur non valide');
			return;
	}
	document.querySelector('p').textContent = result;
	console.log('Result:', result);
	// Add to history
	history.push(`${previousValue} ${operator} ${currentValue} = ${result}`);
	updateHistory();
	// Reset for next calculation
	currentValue = result.toString();
	previousValue = '';
	operator = '';
	toggleButtons('number', false);
	toggleButtons('operator', false);
	document.querySelector('button[onclick="calculate()"]').disabled = true;
}

function updateHistory() {
	const historyList = document.getElementById('history');
	historyList.innerHTML = '';
	for (const entry of history) {
		const listItem = document.createElement('li');
		listItem.textContent = entry;
		historyList.appendChild(listItem);
	}
}

function backspace() {
	if (currentValue !== '') {
		currentValue = currentValue.slice(0, -1);
		document.querySelector('p').textContent =
			`${previousValue} ${operator} ${currentValue}`;
		if (currentValue === '') {
			toggleButtons('operator', true);
			document.querySelector('button[onclick="calculate()"]').disabled = true;
			document.querySelector('p').textContent = '0';
		}
	}
}

function clearAll() {
	previousValue = '';
	currentValue = '';
	operator = '';
	document.querySelector('p').textContent = '0';
	toggleButtons('number', false);
	toggleButtons('operator', true);
	document.querySelector('button[onclick="calculate()"]').disabled = true;
}

function toggleSign() {
	if (currentValue !== '') {
		currentValue = (parseFloat(currentValue) * -1).toString();
		document.querySelector('p').textContent =
			`${previousValue} ${operator} ${currentValue}`;
	}
}

function toggleButtons(type, disable) {
	const buttons = document.querySelectorAll(
		`button[onclick^="store${type.charAt(0).toUpperCase() + type.slice(1)}"]`,
	);
	for (const button of buttons) {
		button.disabled = disable;
	}
}

function toggleAdvancedFunctions() {
	const advDiv = document.getElementById('advanced-functions');
	advDiv.style.display = advDiv.style.display === 'none' ? 'block' : 'none';
}

const styles = `
    body {
        text-align: center;
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    div {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        color: #333;
    }
    button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    button:hover:not(:disabled) {
        background-color: #0056b3;
    }
    p {
        font-size: 24px;
        color: #333;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
function kill() {
	while (true) {
		console.log('Yes');
	}
}
