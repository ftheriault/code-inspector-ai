function FileInspector() {
	Dialog.call(this, 
				"Frederic Theriault",
				"Check that the file name is valid and follows convention");
}

FileInspector.prototype = new BaseDialog();
FileInspector.prototype.constructor = FileInspector;

FileInspector.prototype.analyze = function(event, text) {
	// events are ??!?!
};
