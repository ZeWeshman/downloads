let div = document.createElement('div');
div.innerHTML = `
<h1>Machine à café</h1>
<div class="coffee-machine">
    <div class="display">Sélectionnez votre café</div>
    <div class="buttons">
        <button onclick="selectCoffee('court')">Court</button>
        <button onclick="selectCoffee('long')">Long</button>
        <button onclick="selectCoffee('cappuccino')">Cappuccino</button>
        <button onclick="confirmCoffee()">Confirmer</button>
    </div>
    <div class="price-display">Prix : 0€</div>
</div>`;
document.body.appendChild(div);
let price = 0;
let coffeeType = '';
let milk = false;
let sugar = 0;
let paymentMethod = '';
const styles = `
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #ecf0f1;
}
.coffee-machine {
    width: 500px;
    height: 500px;
    border: 2px solid #333;
    border-radius: 10px;
    background-color: #2c3e50;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #ecf0f1;
    font-family: 'Roboto', sans-serif;
    text-align: center;
    position: relative;
}
.display {
    height: 50px;
    background-color: #34495e;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: background-color 0.3s;
}
.buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}
.options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}
.price-display {
    font-size: 1.2em;
    margin-top: 20px;
}
button {
    padding: 10px;
    background-color: #3498db;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    transition: background-color 0.3s;
    height: 40px;
}
button:hover {
    background-color: #2980b9;
}
button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectCoffee(type) {
	coffeeType = type;
	switch (type) {
		case 'court':
			price = 0.2;
			break;
		case 'long':
			price = 0.5;
			break;
		case 'cappuccino':
			price = 0.7;
			break;
	}
	document.querySelector('.display').textContent =
		`Sélectionnez votre café (${type}).`;
	updatePriceDisplay();
}

function confirmCoffee() {
	document.querySelector('.display').textContent = 'Voulez-vous du lait ?';
	updateButtonsForMilk();
}

function updateButtonsForMilk() {
	const buttons = document.querySelector('.buttons');
	buttons.innerHTML = `
        <button onclick="selectMilk(true)">Oui</button>
        <button onclick="selectMilk(false)">Non</button>
        <button onclick="confirmMilk()">Confirmer</button>
        <button disabled> </button>
    `;
}

function selectMilk(choice) {
	milk = choice;
	document.querySelector('.display').textContent =
		`Voulez-vous du lait ? (${choice ? 'avec' : 'sans'})`;
	updatePriceDisplay();
}

function confirmMilk() {
	document.querySelector('.display').textContent =
		`Combien de sucres ? (${sugar})`;
	updateButtonsForSugar();
}

function updateButtonsForSugar() {
	const buttons = document.querySelector('.buttons');
	buttons.innerHTML = `
        <button onclick="adjustSugar(1)">+</button>
        <button onclick="adjustSugar(-1)">-</button>
        <button onclick="confirmSugar()">Confirmer</button>
        <button onclick="promptSugar()">Entrer le nombre de sucres</button>
    `;
}

function promptSugar() {
	const userInput = prompt('Entrez le nombre de sucres souhaité :');
	const sugarAmount = parseInt(userInput, 10);
	if (!Number.isNaN(sugarAmount) && sugarAmount >= 0) {
		sugar = sugarAmount;
		document.querySelector('.display').textContent =
			`Combien de sucres ? (${sugar})`;
		updatePriceDisplay();
	} else {
		alert('Veuillez entrer un nombre valide.');
	}
}

function adjustSugar(amount) {
	sugar = Math.max(0, sugar + amount);
	document.querySelector('.display').textContent =
		`Combien de sucres ? (${sugar})`;
	updatePriceDisplay();
}

function confirmSugar() {
	document.querySelector('.display').textContent =
		'Comment souhaitez-vous payer ?';
	updateButtonsForPayment();
}

function updateButtonsForPayment() {
	const buttons = document.querySelector('.buttons');
	buttons.innerHTML = `
        <button onclick="selectPayment('carte')">Carte</button>
        <button onclick="selectPayment('especes')">Espèces</button>
        <button onclick="confirmPayment()">Confirmer</button>
        <button disabled> </button>
    `;
}

function selectPayment(method) {
	paymentMethod = method;
	document.querySelector('.display').textContent =
		`Comment souhaitez-vous payer ? (${method})`;
}

async function confirmPayment() {
	document.querySelector('.display').textContent =
		'Veuillez patienter pendant la vérification du paiement...';
	disableButtons();
	let verificationTime = 0; // 2 seconds base verification time
	const currentPrice = price + (milk ? 0.5 : 0) + sugar * 0.1;
	if (currentPrice >= 10) {
		const multiplesOfTen = Math.floor(currentPrice / 10);
		verificationTime += multiplesOfTen * 2000; // Add 2 seconds for each multiple of 10
	}
	if (paymentMethod === 'carte') {
		verificationTime += 500; // Add 0.5 seconds if paying by card
	}
	await sleep(verificationTime);
	document.querySelector('.display').textContent =
		'Veuillez patienter pendant le traitement du paiement...';
	await sleep(2000);
	document.querySelector('.display').textContent =
		'Préparation de votre café...';
	const delay = calculateDelay();
	await sleep(delay);
	document.querySelector('.display').textContent = 'Votre café est prêt!';
}

function updatePriceDisplay() {
	const currentPrice = price + (milk ? 0.5 : 0) + sugar * 0.1;
	document.querySelector('.price-display').textContent =
		`Prix : ${currentPrice}€`;
}

function disableButtons() {
	const buttons = document.querySelectorAll('.buttons button');
	for (const button of buttons) {
		button.disabled = true;
		button.textContent = '';
	}
}

function calculateDelay() {
	const baseTime = 2000; // 2 seconds
	const milkTime = milk ? 1000 : 0; // 1 second if milk is selected
	const sugarTime = sugar * 500; // 0.5 second per sugar
	let coffeeTime = 0;
	switch (coffeeType) {
		case 'court':
			coffeeTime = 1000; // 1 second for court
			break;
		case 'long':
			coffeeTime = 2000; // 2 seconds for long
			break;
		case 'cappuccino':
			coffeeTime = 3000; // 3 seconds for cappuccino
			break;
	}
	return baseTime + milkTime + sugarTime + coffeeTime;
}
