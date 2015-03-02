console.log("=================================");

// Creating HTTP server
var HttpServerWrapper = require('./HttpServerWrapper');
var webServer = new HttpServerWrapper(8080);
console.log("- Http Server ready");

// Creating WebSocket server
var WsServerWrapper = require('./WsServerWrapper');
var wsServer = new WsServerWrapper(8081);
console.log("- WebSocket Server ready");


console.log("---------------------------------");
console.log("        Server loaded");
console.log("---------------------------------");


var CodeUpdateListener = require('./CodeUpdateListener');
global.codeUpdateListeners = [];

function tick() {
	for (var i = 0; i < global.codeUpdateListeners.length; i++) {
		global.codeUpdateListeners[i].tick();
	}

	setTimeout(tick, 1000);
}

tick();
