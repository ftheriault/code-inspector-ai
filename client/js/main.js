var ws = null;
var container = null;
var serverLocation = 'localhost:8081';
var connected = false;

window.onload = function () {
	// speak and say "What is the directory of the project you are working on?"
	var directory = prompt("Enter directory");

	if (directory != null) {
		connect(directory);
	}
}

function connect (directory) {
	container = document.getElementById("container");
	ws = new WebSocket('ws://' + serverLocation);

	ws.onopen = function(){
		connected = true;
		sendMessage("directory", directory);
	}

	ws.onmessage = function(e){
		var serverMessage = e.data;
		digestMessage(serverMessage);
	}

	ws.onclose = function(){
		connected = false;
	}

	ws.onerror = function(error){
		alert('Error detected: ' + error);
	}
}

function sendMessage(type, text) {
	if (ws != null) {
		ws.send(JSON.stringify({
			type : type,
			data : text
		}));
	}
}

function digestMessage(serverMessage) {
	console.log(serverMessage);
}
