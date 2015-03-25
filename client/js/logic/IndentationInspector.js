/**
	Indentation Inspector

	Checking code indentation

	@author 	Frederic Theriault, Fafali Agbokou
*/
function IndentationInspector() {
	BaseInspector.call(this, 
				"Fafali Agbokou",
				"Check indentation of code",
				["Java"]);
}


IndentationInspector.prototype = new BaseInspector();
IndentationInspector.prototype.constructor = IndentationInspector;

IndentationInspector.prototype.analyze = function(event) {
	var lines = event.content.split('\n');
        var stack = 0;
	var message = "Test";
	
	for(var i = 0; i < lines.length; i++){
		for(var j = 0; j < lines[i].length && j < stack; j++) {
			if (lines[i].charAt(j) != '\t') {
				message = "<strong>Line " + i + "</strong> is wrongly indented.";
			}
		}
		if (lines[i].indexOf("{") != -1 && lines[i].indexOf("}") != -1) message = "<strong>Line " + i + "</strong> is wrongly indented.";
		if (lines[i].indexOf("{") != -1) stack++;
		if (lines[i].indexOf("}") != -1) stack--;
	}
	if (stack != 0){
		message = "Indentation problem with file <strong>" + event.fileName + "</strong>.";
	}
	if (message != ""){
		this.notify(event.fileName, message);
	}

};
