function VariableConventionInspector() {
	BaseInspector.call(this, 
				"",
				"Check that variables follow the camel case convention",
				["Java"]);
}

VariableConventionInspector.prototype = new BaseInspector();
VariableConventionInspector.prototype.constructor = VariableConventionInspector;

VariableConventionInspector.prototype.analyze = function(event) {
	// TODO
	// parse text (from event parameter) and find variables. for each variable, check naming : 
		// myVariable = ok
		// my_variable = notify user

		// Use this.notify(event.fileName, "Lorem ...") when a problem is detected
};
