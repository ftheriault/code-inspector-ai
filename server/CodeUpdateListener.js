/**
	Code file listener

	This file constantly checks for any code update from the wanted directory (and below).
	Upon code changes, the listener notifies the client (wsClient) with the changes.

	@author 	Frederic Theriault
*/

var path = require('path')
var fs = require("fs");

module.exports = CodeUpdateListener = function (directory, lang, fileExtensions, wsClient) {
	var self = this;
	this.maxLookupDepth = 4;
	this.directory = directory;
	this.lang = lang;
	this.fileExtensions = fileExtensions;
	this.wsClient = wsClient;
	this.knownFiles = {};

	console.log("- New listener on : " + directory + " (" + lang + ")");
	this.wsClient.send({
		type : "info",
		info : "Ok, I'm ready!"
	});
	 
	this.tick = function () {
		this.scanDirectory(this.directory, 0);
	}

	this.scanDirectory = function(dir, depth) {
		var files = fs.readdirSync(dir); 

		for (var i in files) {
			var file = files[i];
			var fullPath = dir + "/" + file;
			var stats = fs.statSync(fullPath);

			if (stats.isFile() && this.fileExtensions.indexOf(path.extname(file)) >= 0) {
				this.verifyFile(fullPath, file, stats);
			}
			else if (stats.isDirectory() && depth <= this.maxLookupDepth) {
				this.scanDirectory(fullPath, depth + 1);
			}
		}
	}

	this.verifyFile = function(fullPath, file, stats) {	

		if (stats.size > 5) { // more than five bytes or skip file			
			if (self.knownFiles[fullPath] != null && self.knownFiles[fullPath] != stats.mtime + "") {
				self.fileModified(fullPath, file); 
			}
        }

		self.knownFiles[fullPath] = stats.mtime + "";
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
