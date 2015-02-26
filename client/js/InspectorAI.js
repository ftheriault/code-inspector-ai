function InspectorAI() {
	this.ws = null;
	this.voice = null;
	this.currentlySaying = null;

	if (window.speechSynthesis != null) {
		window.speechSynthesis.onvoiceschanged = function() {
			voices = window.speechSynthesis.getVoices();
			voice = voices[0];		

			if (inspector.voice == null) {
				inspector.voice = voice;
				inspector.connect();
			}
		}
	}	
	else {
		alert("Speech synthesis is not supported (try using Chrome)");
		this.connect();
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
			inspector.currentlySaying = null;

			if (endCallback != undefined) {
				endCallback();				
			}
		};	

		setTimeout(function() {
			speechSynthesis.speak(msg);
			inspector.currentlySaying = text;
		}, 100);
		
	}
	else {
		console.log(text);
		endCallback();
	}
}

InspectorAI.prototype.connect = function() {	

	this.speak("Sir, I'll need to know where you code before we start", function () {
		var directory = prompt("Enter directory");

		if (directory != null) {
			inspector.ws = new WebSocket('ws://' + serverLocation);

			inspector.ws.onopen = function(){
				inspector.sendMessage("directory", directory);
			}

			inspector.ws.onmessage = function(e){
				var serverMessage = e.data;
				inspector.digestMessage(serverMessage);
			}

			inspector.ws.onclose = function(){
				inspector.speak("Sir, the server has shutdown...");
			}

			inspector.ws.onerror = function(error){
				inspector.speak("Sir, the connection was broken, for some reason...");
				console.log('Error detected: ' + error);
			}
		}
		else {
			inspector.speak("Oh, so I guess there is nothing to be done here...");
		}
	});
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
	else {
		for (var i = 0; i < logicList.length; i++) {
			logicList[i].analyze(serverMessage.type, serverMessage.data);
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
	if (this.currentlySaying != null) {
		ctx.font = "14px ";	
		ctx.fillStyle = "white";	
		ctx.fillText(this.currentlySaying, 20, 20);
	}
}