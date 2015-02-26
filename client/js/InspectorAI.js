function InspectorAI() {
	this.ws = null;
	this.voice = null;

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

		if (endCallback != undefined) {
			msg.onend = endCallback;	
		}

		speechSynthesis.speak(msg);
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
	console.log(serverMessage);
}

