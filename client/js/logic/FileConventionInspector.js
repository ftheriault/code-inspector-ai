function FileConventionInspector() {
	BaseInspector.call(this, 
				"Frederic Theriault",
				"Check that the file name is valid and follows convention");
}

FileConventionInspector.prototype = new BaseInspector();
FileConventionInspector.prototype.constructor = FileConventionInspector;

FileConventionInspector.prototype.analyze = function(event) {
	console.log(event);
};
