var container = null;
var ctx = null;
var serverLocation = 'localhost:8081';

var inspector = null;

window.onload = function () {
	container = document.getElementById("container");
	ctx = document.getElementById("canvas").getContext("2d");
	
	inspector = new InspectorAI();
}