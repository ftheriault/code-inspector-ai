var CodeUpdateListener = require('./inspector/CodeUpdateListener');

module.exports = WsClient = function(ws) {
	this.ws = ws;
	this.listener = null;

	this.messageRecieved = function (message) {
		var msg = JSON.parse(message);

		if (msg.type == "directory") {
			this.listener = new CodeUpdateListener(msg.data, this);
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
