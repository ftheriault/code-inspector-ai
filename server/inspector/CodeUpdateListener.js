var path = require('path')
var fs = require("fs");

module.exports = CodeUpdateListener = function (directory, wsClient) {
	var self = this;
	this.directory = directory;
	this.wsClient = wsClient;
	this.knownFiles = {};

	console.log("- New listener on : " + directory);
	this.wsClient.send({
		type : "info",
		info : "I can only understand Java. Otherwise I'm ready!"
	});
 
	this.tick = function () {
		var files = fs.readdirSync(this.directory); 

		for (var i in files) {
			var file = this.directory + "/" + files[i];  
			
			var stats = fs.statSync(file);

			if (stats.size > 5) { // more than five bytes or skip file
				if (self.knownFiles[file] != null && self.knownFiles[file] != stats.mtime + "") {
					self.fileModified(file, files[i]); 
				}

				self.knownFiles[file] = stats.mtime + "";
			}		    
		}
	}

	this.fileModified = function(filePath, fileName) {
		console.log("- File modified : " + fileName);

		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err){
				self.wsClient.send({
					type : "file_modified",
					filePath : filePath,
					fileName : fileName,
					extension : path.extname(fileName),
					content : data
				}); 
			}else{
				console.log(err);
			}
		});
	}

	this.close = function () {
		console.log("- Ended listener on : " + directory);
		global.codeUpdateListeners.splice(global.codeUpdateListeners.indexOf(this), 1);	
	}
}
