function BaseInspector(author, description) {
	this.author = author;
	this.description = description;

	if (this.author === "") {
		this.author = null;
	}
}

BaseInspector.prototype.analyze = function(event, text) {
	// redefine in children
};
