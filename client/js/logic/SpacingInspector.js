/**
	Spacing Inspector

	Checking empty lines in code files

	@author 	Frederic Theriault
*/
function SpacingInspector() {
	BaseInspector.call(this, 
				"Frederic Theriault",
				"Checks the number succeeding of returns (newlines) in code",
				["Java", "Ruby"]);
}

SpacingInspector.prototype = new BaseInspector();
SpacingInspector.prototype.constructor = SpacingInspector;

SpacingInspector.prototype.analyze = function(event) {
	var lines = event.content.split('\n');
	var returnCount = 0;

	for(var i = 0;i < lines.length; i++){
	    if (lines[i].match(/^[(\s|\t)]*$/)) {
	    	returnCount++;

	    	if (returnCount == 2) {
	    		this.notify(event.fileName, "<strong>At line " + i + "</strong>, it is not necessary to put multiple blank lines. One is enough.")
	    		break;
	    	}
	    }
	    else {
	    	returnCount = 0;
	    }
	}
};
