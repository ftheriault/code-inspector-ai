/**
	Base Inspector

	Base class (parent) for all inspector

	@author 	Frederic Theriault
*/
function BaseInspector(author, description, supportedProfiles) {
	this.author = author;
	this.description = description;
	this.supportedProfiles = supportedProfiles;
	this.alreadyNotifiedEvents = {};
}

BaseInspector.prototype.alreadyNotified = function(key) {
	return this.alreadyNotifiedEvents[key] != null;
};

BaseInspector.prototype.notify = function(key, speech) {
	if (!this.alreadyNotified(key)) {
		inspector.speak(speech);
		this.alreadyNotifiedEvents[key] = "1";
	}
};

BaseInspector.prototype.analyze = function(event) {
	// redefine in children
};
