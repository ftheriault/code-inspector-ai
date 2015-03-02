function FileNamingInspector() {
	BaseInspector.call(this, 
				"Frederic Theriault",
				"Check that the file name is valid and follows convention",
				["Java", "Ruby"]);
}

FileNamingInspector.prototype = new BaseInspector();
FileNamingInspector.prototype.constructor = FileNamingInspector;

FileNamingInspector.prototype.analyze = function(event) {

	if (event.fileName.charAt(0).toUpperCase() != event.fileName.charAt(0)) {
		this.notify(event.fileName, "Since the language is <strong>object oriented</strong>, the first letter of a class file should be capitalized.");	
	}
};
