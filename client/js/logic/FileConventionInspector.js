function FileConventionInspector() {
	BaseInspector.call(this, 
				"Frederic Theriault",
				"Check that the file name is valid and follows convention");
}

FileConventionInspector.prototype = new BaseInspector();
FileConventionInspector.prototype.constructor = FileConventionInspector;

FileConventionInspector.prototype.analyze = function(event) {
	if (event.fileName.charAt(0).toUpperCase() != event.fileName) {
		this.notify(event.fileName, "Since Java is object oriented, the first letter of a class file should be capitalized.");
	}
};
