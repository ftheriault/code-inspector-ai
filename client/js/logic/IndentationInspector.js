/**
	Indentation Inspector

	Checking code indentation

	@author 	Frederic Theriault
*/
function IndentationInspector() {
	BaseInspector.call(this, 
				"",
				"Check indentation of code",
				["Java"]);
}

IndentationInspector.prototype = new BaseInspector();
IndentationInspector.prototype.constructor = IndentationInspector;

IndentationInspector.prototype.analyze = function(event) {
	// TODO
	// parse text (from event parameter) check for indentation. Each "{" should add a level of incrementation,
	// whereas "}" should remove a level of incrementation

	// Use this.notify(event.fileName, "Lorem ...") when a wrong level of incrementation is detected
};
