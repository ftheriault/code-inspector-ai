/**
	main file

	Responsible for loading appropriate files and starting the AI. 

	@author 	Frederic Theriault
*/
var container = null;
var ctx = null;
var serverLocation = 'localhost:8081';

var inspector = null;
var profileFileList = [];
var profileList = [];
var logicFileList = [];
var logicList = [];

profileFileList.push("ProfileJava");
profileFileList.push("ProfileRuby");

logicFileList.push("FileNamingInspector");
logicFileList.push("SpacingInspector");
logicFileList.push("VariableConventionInspector");
logicFileList.push("IndentationInspector");
logicFileList.push("LineLengthInspector");

for (var i = 0; i < logicFileList.length; i++) {
	loadLogicFile(logicFileList[i]);
};

function loadLogicFile(name) {
	$.getScript("js/logic/" + name + ".js", function () {
		logicList.push(eval("new " + name + "()"));
	});
}

for (var i = 0; i < profileFileList.length; i++) {
	loadProfileFile(profileFileList[i]);
};

function loadProfileFile(name) {
	$.getScript("js/profile/" + name + ".js", function () {
		profileList.push(eval("new " + name + "()"));
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
