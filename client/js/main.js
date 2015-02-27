var container = null;
var ctx = null;
var serverLocation = 'localhost:8081';

var inspector = null;
var logicFileList = [];
var logicList = [];

logicFileList.push("FileNamingInspector");
logicFileList.push("SpacingInspector");

for (var i = 0; i < logicFileList.length; i++) {
	loadFile(logicFileList[i]);
};

function loadFile(name) {
	$.getScript("js/logic/" + name + ".js", function () {
		logicList.push(eval("new " + name + "()"));
	});
}

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
