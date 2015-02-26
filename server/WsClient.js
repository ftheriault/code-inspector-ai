module.exports = WsClient = function(ws) {
	this.ws = ws;

	console.log("- New client connected");

	this.messageRecieved = function (message) {
		console.log("- Recieved from client : " + message);
	}

	this.connectionClosed = function () {
		console.log("- Client WebSocket closed");
	}

	this.send = function (message) {
		this.ws.send(message);
	}
}