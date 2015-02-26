
module.exports = CodeUpdateListener = function (directory, wsClient) {
	this.directory = directory;
	this.wsClient = wsClient;


	console.log("- New listener on : " + directory);

	this.tick = function () {

	}

	this.close = function () {
		console.log("- Ended listener on : " + directory);
		global.codeUpdateListeners.splice(global.codeUpdateListeners.indexOf(this), 1);	
	}
}
