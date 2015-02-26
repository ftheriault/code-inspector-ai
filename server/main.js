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

function tick() {
	if (Math.random() < 0.01) {
		for (var i = 0; i < wsServer.clients.length; i++) {
			wsServer.clients[i].send("Hello client!");
		}
	}

	setTimeout(tick, 1000);
}

tick();