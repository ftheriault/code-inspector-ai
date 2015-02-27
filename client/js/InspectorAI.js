function InspectorAI() {
	this.ws = null;
	this.voice = null;
	this.currentlySaying = [];

	this.drawCounter = 0;
	this.drawOpacity = 0;
	this.drawWantedOpacity = 0.3;

	if (window.speechSynthesis != null) {
		window.speechSynthesis.onvoiceschanged = function() {
			voices = window.speechSynthesis.getVoices();
			voice = voices[0];		

			if (inspector.voice == null) {
				setTimeout(function () {
					inspector.voice = voice;
					inspector.initialize();
				}, 2000);
			}
		}
	}	
	else {
		alert("Speech synthesis is not supported (try using Chrome)");
		this.initialize();
	}
}

InspectorAI.prototype.speak = function(text, endCallback) {	
	if (this.voice != null) {
		var msg = new SpeechSynthesisUtterance();
		msg.voice = this.voice; 
		msg.voiceURI = 'native';
		msg.volume = 1; 	// 0 to 1
		msg.rate = 1;		// 0.1 to 10
		msg.pitch = 0; 		//0 to 2
		msg.lang = 'en-US';

		msg.text = text;

		msg.onend = function (event) {
			inspector.currentlySaying.splice(0, 1);

			if (endCallback != undefined) {
				endCallback();				
			}
		};	

		setTimeout(function() {
			speechSynthesis.speak(msg);
			inspector.currentlySaying.push(text);
		}, 100);
		
	}
	else {
		console.log(text);
		endCallback();
	}
}

InspectorAI.prototype.initialize = function() {	
	if (localStorage["inspectorDirectory"] != null) {
		this.speak("Welcome back sir, do you wish to continue where you were?", function () {
			if (confirm("Continue working in : " + localStorage["inspectorDirectory"])) {
				inspector.connect(localStorage["inspectorDirectory"]);
			}
			else {
				inspector.needDirectory();
			}
		});
	}
	else {
		this.needDirectory();
	}
}

InspectorAI.prototype.needDirectory = function() {	
	this.speak("Sir, I'll need to know where you code before we start", function () {
		var directory = prompt("Enter directory");

		if (directory != null) {
			inspector.connect(directory);
		}
		else {
			inspector.speak("Oh, so I guess there is nothing to be done here...");
		}
	});
}

InspectorAI.prototype.connect = function(directory) {	
	localStorage.setItem("inspectorDirectory", directory);

	this.ws = new WebSocket('ws://' + serverLocation);

	this.ws.onopen = function(){
		inspector.sendMessage("directory", directory);
	}

	this.ws.onmessage = function(e){
		var serverMessage = e.data;
		inspector.digestMessage(serverMessage);
	}

	this.ws.onclose = function(){
		inspector.speak("Sir, I have lost sight to your code (the server has shutdown...)");
	}

	this.ws.onerror = function(error){
		inspector.speak("Sir, the connection was broken, for some reason...");
		console.log('Error detected: ' + error);
	}
}

InspectorAI.prototype.sendMessage = function(type, text) {
	if (this.ws != null) {
		this.ws.send(JSON.stringify({
			type : type,
			data : text
		}));
	}
}

InspectorAI.prototype.digestMessage = function(serverMessage) {
	serverMessage = JSON.parse(serverMessage);

	if (serverMessage.type == "err") {
		this.speak("Sir, the server has just thrown an error, I have written it to you : ");
		this.prompt(serverMessage);
	}
	else if (serverMessage.type == "info") {
		this.speak("I need to tell you that " + serverMessage.info);
	}
	else {
		for (var i = 0; i < logicList.length; i++) {
			logicList[i].analyze(serverMessage);
		}
	}	
}

InspectorAI.prototype.prompt = function(msg) {
	var element = document.createElement("div");
	element.className = "prompt";
	element.innerHTML = msg;

	element.onclick = function () {
		document.body.removeChild(element);
	}
	
	document.body.appendChild(element);
}

InspectorAI.prototype.tick = function() {
	ctx.save();

	if (this.currentlySaying.length != 0) {
		ctx.font = "16px Arial";	
		ctx.fillStyle = "white";	

		for (var i = 0; i < this.currentlySaying.length; i++) {
			ctx.fillText(this.currentlySaying[i], 20, 20 + i * 20);
		}

		this.drawCounter += 0.01;
		this.drawWantedOpacity = 0.8;
	}
	else {
		this.drawWantedOpacity = 0.3;
	}

	if (this.drawOpacity < this.drawWantedOpacity) {
		this.drawOpacity += 0.01;
	}
	else if (this.drawOpacity > this.drawWantedOpacity) {
		this.drawOpacity -= 0.01;	
	}

	ctx.translate(450, 200);
	ctx.rotate(this.drawCounter);

	ctx.fillStyle = "rgba(30, 30, 200, " + this.drawOpacity + ")";
	ctx.fillRect(-100, -100, 200, 200);
	ctx.restore();
}