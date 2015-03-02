/**
	WebSocket Client

	Client socket, triggering wanted actions upon web socket events.

	@author 	Frederic Theriault
*/

var CodeUpdateListener = require('./CodeUpdateListener');

module.exports = WsClient = function(ws) {
	this.ws = ws;
	this.listener = null;

	this.messageRecieved = function (message) {
		var msg = JSON.parse(message);

		if (msg.type == "setup") {
			this.listener = new CodeUpdateListener(msg.data.directory, msg.data.lang, msg.data.fileExtensions, this);
			global.codeUpdateListeners.push(this.listener);
		}
	}

	this.connectionClosed = function () {
		this.listener.close();
	}

	this.send = function (message) {
		this.ws.send(JSON.stringify(message));
	}
}
