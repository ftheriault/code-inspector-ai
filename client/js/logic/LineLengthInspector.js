/**
	Line Length Inspector

	Checking code line length

	@author 	Frederic Theriault
*/
function LineLengthInspector() {
	BaseInspector.call(this, 
				"",
				"Checks that a line must not exceed 80 characters long",
				["Java", "Ruby"]);
}

LineLengthInspector.prototype = new BaseInspector();
LineLengthInspector.prototype.constructor = LineLengthInspector;

LineLengthInspector.prototype.analyze = function(event) {
	// TODO
	// Check each line from code file and verify its length

	// Use this.notify(event.fileName, "Lorem ...") when a line exceed 80 characters.
};
