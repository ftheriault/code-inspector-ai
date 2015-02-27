function SpacingInspector() {
	BaseInspector.call(this, 
				"Frederic Theriault",
				"Check the number succeeding of returns (newlines) in code");
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
	    		this.notify(event.fileName, "I strongly suggest never multiple returns to separate code. One is enough")
	    		break;
	    	}
	    }
	    else {
	    	returnCount = 0;
	    }
	}
};
