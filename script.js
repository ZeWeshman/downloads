// Code ci-dessous:
function loadScript(url) {
	home.remove();
	const script = document.createElement('script');
	script.src = url;
	script.type = 'text/javascript';
	document.head.appendChild(script);
}

let home = document.createElement('div');
home.innerHTML = `
    <h1>Choose a script to load:</h1>
    <button onclick="updateURLAndLoadScript('calc.js')">Calculator</button>
    <button onclick="updateURLAndLoadScript('coffee.js')">Coffee Machine</button>
    <button onclick="updateURLAndLoadScript('ttt.js')">Tic Tac Toe</button>
    <button onclick="updateURLAndLoadScript('hm.js')">Hangman</button>
    <button onclick="loadHTMLPage('turtle/index.html')">Turtle</button>
`;

function updateURLAndLoadScript(scriptName) {
	const url = new URL(window.location);
	url.searchParams.set('script', scriptName);
	url.searchParams.delete('page');
	window.history.pushState({}, '', url);
	loadScript(scriptName);
}

function loadHTMLPage(page) {
	const url = new URL(window.location);
	url.searchParams.delete('script');
	window.location.href = page;
}

document.body.appendChild(home);
const urlParams = new URLSearchParams(window.location.search);
const scriptToLoad = urlParams.get('script');
const pageToLoad = urlParams.get('page');
if (scriptToLoad) {
	loadScript(scriptToLoad);
} else if (pageToLoad) {
	loadHTMLPage(pageToLoad);
}
