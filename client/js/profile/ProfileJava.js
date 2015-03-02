function ProfileJava() {
	BaseProfile.call(this, 
					"Java",
					[".java"]);
}

ProfileJava.prototype = new BaseProfile();
ProfileJava.prototype.constructor = ProfileJava;