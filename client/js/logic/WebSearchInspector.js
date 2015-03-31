/**
	Web Search Inspector

	Look on the web for keywords that are written before the "???" characters

	@author 	Clément Contini
*/
function WebSearchInspector() {
	BaseInspector.call(this, 
				"Clément Contini",
				"Look up the web to find useful links about the current line \
                finishing by ???",
				["Java", "Ruby"]);
}

WebSearchInspector.prototype = new BaseInspector();
WebSearchInspector.prototype.constructor = WebSearchInspector;

WebSearchInspector.prototype.analyze = function(event) {
	var lines = event.content.split('\n');
	var keywords = [];

	for(var i = 0; i < lines.length; i++){
        if(lines[i].match(/\?\?\?/)) { // Look for the "???" string
            keywords = lines[i].split(/\W/).filter(function(el) { 
                return el.length > 0; // filter empty results
            });
            break;
        }
    }

    url = "https://api.stackexchange.com/2.2/search/advanced?pagesize=5&" +
        "order=desc&sort=votes&accepted=True&answers=1&tagged=" +
        inspector.lang + ";" + keywords.join(";") + "&site=stackoverflow";

    var stackanswer = restRequest("GET", url);
    stackanswer = JSON.parse(stackanswer[0])

    if (stackanswer["items"].length > 0) {
        var message = "I have found " + stackanswer["items"].length +
            " ressources that could help you with your problem.";
        var linkdisplay = "<table>";
        for (item = 0; item < stackanswer["items"].length; ++item) {
            linkdisplay += "<tr><td>Title</td><td>" + 
                stackanswer["items"][item]["title"] + "</td></tr>";
            linkdisplay += "<tr><td>Tags</td><td>" +
                stackanswer["items"][item]["tags"].join(", ") + "</td></tr>";
            linkdisplay += "<tr><td>Link</td><td><a href='" +
                stackanswer["items"][item]["link"] + "'>Here</a></td></tr>";
        }
        linkdisplay += "</table>";
        inspector.prompt(linkdisplay);
    } else {
        var message = "I could not find any post related to your " +
            "current issue on stackoverflow.";
    }
	this.notify(event.fileName, message);
};

