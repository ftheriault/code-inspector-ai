var ws = null;
var container = null;
var serverLocation = 'localhost:8081';
var connected = false;

window.onload = function () {
	container = document.getElementById("container");
	ws = new WebSocket('ws://' + serverLocation);

	ws.onopen = function(){
		connected = true;
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

function digestMessage(serverMessage) {
	console.log(serverMessage);
}
