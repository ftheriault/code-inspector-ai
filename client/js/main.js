var container = null;
var ctx = null;
var serverLocation = 'localhost:8081';

var inspector = null;
var logicList = [];

logicList.push("FileInspector");

for (var i = 0; i < logicList.length; i++) {
	$.getScript("js/logic/" + logicList[i] + ".js");
};

window.onload = function () {
	container = document.getElementById("container");
	ctx = document.getElementById("canvas").getContext("2d");

	inspector = new InspectorAI();

	tick();
}

function tick() {
	ctx.clearRect(0, 0, 900, 400);
	inspector.tick();

	window.requestAnimationFrame(tick);
}
