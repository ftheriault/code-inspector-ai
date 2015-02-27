function BaseInspector(author, description) {
	this.author = author;
	this.description = description;

	if (this.author === "") {
		this.author = null;
	}
}

BaseInspector.prototype.analyze = function(event) {
	// redefine in children
};
