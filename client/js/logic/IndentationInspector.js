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
	var message = "";
    // '{' and '}' in comments are also taken into account 
	for(var i = 0; i < lines.length; i++){
        if (lines[i].indexOf("}") != -1) stack--;
		if (lines[i].indexOf("{") != -1 && lines[i].indexOf("}") != -1) message = "Code in line <strong>" + parseInt(i+1) + "</strong> is wrongly delimited in file <strong>" + event.fileName + "</strong>.";
		var j = 0;
        while( j < lines[i].length - 1 && j < stack) {
			if (lines[i].charAt(j) != '\t') {
				message = "<strong>Line " + parseInt(i+1) + "</strong> is wrongly indented in file <strong>" + event.fileName + "</strong>.";
			}
            j++;
		}
        if (lines[i].charAt(j) == '\t') message = "<strong>Line " + parseInt(i+1) + "</strong> is wrongly indented in file <strong>" + event.fileName + "</strong>.";
        if (lines[i].indexOf("{") != -1) stack++;
	}
	if (stack != 0){
		message = "Indentation problem with file <strong>" + event.fileName + "</strong>.";
	}
	if (message != ""){
		this.notify(event.fileName, message);
	}

};
