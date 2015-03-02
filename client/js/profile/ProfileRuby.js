function ProfileRuby() {
	BaseProfile.call(this, 
					"Ruby",
					[".rb"]);
}

ProfileRuby.prototype = new BaseProfile();
ProfileRuby.prototype.constructor = ProfileRuby;