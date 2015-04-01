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

    if(keywords.length > 0) {

        url = "https://api.stackexchange.com/2.2/search/advanced?pagesize=5&" +
            "order=desc&sort=votes&accepted=True&answers=1&tagged=" +
            inspector.lang + ";" + keywords.join(";") + "&site=stackoverflow";

        var logic = this;
        restRequest("GET", url, function(stackanswer) {
            stackanswer = JSON.parse(stackanswer)
            if (stackanswer["items"].length > 0) {
                var message = "I have found " + stackanswer["items"].length +
                    " ressources that could help you with your problem.";

                var linkdisplay = "";

                for (item = 0; item < stackanswer["items"].length; ++item) {
                    linkdisplay += "<div style='margin-top:10px;'>";
                    linkdisplay += "	<h4><a href='" + 
                                        stackanswer["items"][item]["link"] + 
                                        "' target='search_result'>" +  
                                        stackanswer["items"][item]["title"] + 
                                        "</a></h4>";
                    linkdisplay += "	<div><small>" + 
                                            stackanswer["items"][item]["tags"].join(", ") + 
                                        "</small></div>";
                    linkdisplay += "</div>";
                }

                linkdisplay += "</div>";
                inspector.prompt(linkdisplay);
            } else {
                var message = "I could not find any post related to your " +
                    "current issue on stackoverflow.";
            }

            logic.notify(null, message);
        });
    }
};

