/**
	Line Length Inspector

	Checking code line length

	@author 	Frederic Theriault
*/
function LineLengthInspector() {
	BaseInspector.call(this, 
				"Clément Contini",
				"Checks that a line must not exceed 80 characters long",
				["Java", "Ruby"]);
}

LineLengthInspector.prototype = new BaseInspector();
LineLengthInspector.prototype.constructor = LineLengthInspector;

LineLengthInspector.prototype.analyze = function(event) {
	var lines = event.content.split('\n');
	var tooLong = [];

	for(var i = 0; i < lines.length; i++){
        if (lines[i].length > 80) {
            tooLong.push(i+1);
        }
    }
    if (tooLong.length > 0) {
        var message = "<strong>Line " + tooLong[0] + "</strong> exceeds 80 characters.";
        if (tooLong.length > 1) {
            message = "<strong>Lines " + tooLong.join() + "</strong> exceed 80 characters.";
        }
	    this.notify(event.fileName, message)
    }
};
