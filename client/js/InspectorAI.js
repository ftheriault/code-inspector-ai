function InspectorAI() {
	this.ws = null;
	this.voice = null;
	this.currentlySaying = [];
	this.profile = null;

	this.drawCounter = 0;
	this.drawOpacity = 0;
	this.drawWantedOpacity = 0.3;

	this.drawGreenLevel = 30;
	this.drawRedLevel = 30;
	this.drawBlueLevel = 200;

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

		var strippedString = text.replace(/(<([^>]+)>)/ig,"");
		msg.text = strippedString;

		msg.onend = function (event) {
			var divs = inspector.currentlySaying.splice(0, 1);
			document.getElementById("container").removeChild(divs[0]);

			if (endCallback != undefined) {
				endCallback();				
			}
		};	

		setTimeout(function() {
			var div = document.createElement("div");
			div.className = "spoken-item";
			div.innerHTML = text;
			document.getElementById("container").appendChild(div);

			speechSynthesis.speak(msg);
			inspector.currentlySaying.push(div);
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
				inspector.connect(localStorage["inspectorDirectory"], localStorage["inspectorLang"], localStorage["inspectorFileExtensions"]);
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

		if (directory != null && directory.trim().length > 0) {
			inspector.speak("I also need to know which language you will be using", function () {
				var profileStr = "";

				for (var i = 0; i < profileList.length; i++) {
					profileStr += (i+1) + " - " + profileList[i].language + "\n";
				}

				var lang = prompt("Choose language (enter number) :\n" + profileStr);				
				var profile = profileList[lang - 1];

				if (profile != null) {
					inspector.connect(directory, profile.language, profile.fileExtensions);
				}
				else {
					inspector.speak("Oh, well, too bad. I won't be able to help you");
				}
			});
		}
		else {
			inspector.speak("Oh, so I guess there is nothing to be done here...");
		}
	});
}

InspectorAI.prototype.connect = function(directory, lang, fileExtensions) {	
	this.lang = lang;
	localStorage.setItem("inspectorDirectory", directory);
	localStorage.setItem("inspectorLang", lang);
	localStorage.setItem("inspectorFileExtensions", fileExtensions);

	this.ws = new WebSocket('ws://' + serverLocation);

	this.ws.onopen = function(){
		inspector.sendMessage("setup", {
						directory : directory,
						lang : lang,
						fileExtensions : fileExtensions
					});
	}

	this.ws.onmessage = function(e){
		var serverMessage = e.data;
		inspector.digestMessage(serverMessage);
	}

	this.ws.onclose = function(){
		inspector.speak("Sir, I have lost sight to your code (the server has shutdown...)");
		inspector.drawRedLevel = 255;
		inspector.drawBlueLevel = 30;
	}

	this.ws.onerror = function(error){
		inspector.speak("Sir, the connection was broken, for some reason...");
		console.log('Error detected: ' + error);
		inspector.drawRedLevel = 255;
		inspector.drawBlueLevel = 30;
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
		this.drawBlueLevel = 30;
		this.drawRedLevel = 255;
		this.speak("Sir, the server has just thrown an error, I have written it to you : ");
		this.prompt(serverMessage);
	}
	else if (serverMessage.type == "info") {
		this.speak(serverMessage.info);
	}
	else {
		this.drawBlueLevel = 30;
		this.drawGreenLevel = 255;

		for (var i = 0; i < logicList.length; i++) {
			if (logicList[i].supportedProfiles.indexOf(this.lang) >= 0) {
				logicList[i].analyze(serverMessage);
			}
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
		this.drawWantedOpacity = 0.8;
		this.drawCounter += 0.01;
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

	if (this.drawRedLevel > 30) {
		this.drawRedLevel -= 1;
	}

	if (this.drawGreenLevel > 30) {
		this.drawGreenLevel -= 1;
	}

	if (this.drawBlueLevel < 200) {
		this.drawBlueLevel += 1;
	}

	ctx.translate(450, 200);
	ctx.rotate(this.drawCounter);

	ctx.fillStyle = "rgba(" + this.drawRedLevel + ", " + this.drawGreenLevel + ", " + this.drawBlueLevel + ", " + this.drawOpacity + ")";
	ctx.fillRect(-100, -100, 200, 200);
	ctx.restore();
}