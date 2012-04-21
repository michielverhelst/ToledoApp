var entries;
var xmlDoc;
var rssBody;
var aantalEntries = 20;



function setRSStemplate(dname, Body) {
	
	rssBody = document.getElementById(Body);
	
	xmlDoc=loadXMLDoc(dname);
	
	
	//get all the entry nodes in the 'entries' object
	entries = xmlDoc.getElementsByTagName('entry');
	
	var buffer = "";
	
	//iterate through all the entries
	for (var i = 0; i < entries.length; i++) {
		
		//we zetten er een limiet op: max :aantalEntries: what's recent items!
		if (i >= aantalEntries) break;
		
		//fill in the titles
		var titleNode = getNode('title', i);
		var output = Replace(rssBody.innerHTML, "(::Title::)", titleNode[0].childNodes[0].nodeValue);
		
		//fill in the link attribute
		var linkNode = getNode('link', i);
		var x = linkNode[1].attributes;
		var attribute = x.getNamedItem("href");
		output = Replace(output, "(::Link::)", attribute.value);
		
		//fill in the author attribute
		var authorNode = getNode('name', i);
		var a = authorNode[0].childNodes[0].nodeValue;
		output = Replace(output, "(::Author::)", a);
		
		//fill in the course
		var pNode = getNode('content', i)
		var course = pNode[3].childNodes[0].nodeValue; // aan deze regel klopt iets niet, daardoor geeft course null en kan cleanCourse(course) niet uitgevoerd worden. Timon Riemslagh 21/04
		//course = cleanCourse(course); //remove unwanted symbols
		output = Replace(output, "(::Course::)", course);
		
		//fill in the publish-date
		var publishedNode = getNode('published', i);
		var publishedUTC = publishedNode[0].childNodes[0].nodeValue;
		var published = getPublishDateTime(publishedUTC);
		output = Replace(output, "(::Published::)", published);
		
		
		buffer += output;
	}
	
	rssBody.innerHTML = buffer;

}


function loadXMLDoc(url) {
	
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", url, false);
	xhttp.send();
	return xhttp.responseXML;
	
	/*if (window.DOMParser)
	  {
	  parser=new DOMParser();
	  xmlDoc=parser.parseFromString(txt,"text/xml");
	  }
	else // Internet Explorer
	  {
	  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  xmlDoc.async=false;
	  xmlDoc.loadXML(txt);
	  }
	return xmlDoc; */
	
}

/**
 * returns a new string with the oldValue replaced by newValue
 * @param totalValue the string on which the operation must be executed
 * @param oldValue the value to be replaced
 * @param newValue the new value
 * @returns the new string with replaced values
 */
function Replace(totalValue, oldValue, newValue) {
	while(totalValue.indexOf(oldValue) > -1) //check if the oldValue is in the totalValue
		totalValue = totalValue.replace(oldValue, newValue);

	return totalValue;
	
}

function getNode(tagname, node) {
	var currentNode;
	
	if (node == null) {
		currentNode = xmlDoc.getElementsByTagName(tagname);
		
	} else {
		currentNode = entries[node].getElementsByTagName(tagname);
	}
	
	
	if (currentNode.length > 0) return currentNode;

}

/**
 * removes unwanted symbols of a course(string) and (if necessary) the code (e.g. "[JWLX09]")of the course
 * @param oldCourse the course to be cleaned
 * @returns the new Course 
 */
function cleanCourse(oldCourse) {
	//don't use string.substr() here, because the string is much longer as expected (xml nodeValue??)
	//remove the ":"
	var array = oldCourse.split(":");
	
	//if it is a course (not a community subject..) remove the code of the course
	if(array[1].indexOf("[") > 0) {
		array = array[1].split("[");
		return array[0];
	} else {
		return array[1];
		
	}
		
}

/**
 * Verander de datum uit de xml (utc) naar een meer leesbaar formaat
 * @param datetime de utc waarde van de publish-time
 * @returns {String} het leesbare formaat van de publish-time
 */
function getPublishDateTime(datetime) {
	
	/***
	 * Waarden uit string(utc) halen
	 */
			//var datum = "2012-04-13T01:52:00Z";
			
			var array = datetime.split("-");
			
			var jaar = parseInt(array[0]);
			
			//!!!month index begins with 0
			var maand = parseInt(array[1]) - 1;
			var rest = array[2];
			
			var array2 = rest.split("T");
			var dag = parseInt(array2[0]);
			
			var rest2 = array2[1];
			rest2 = rest2.substr(0, rest2.length - 1);
				
			array3 = rest2.split(":");
			var uur = parseInt(array3[0]);
			var minuten = parseInt(array3[1]);
			var seconden = parseInt(array3[2]);
			
	/***
	 * Maak nieuw Date object aan van meegegeven datum
	 */				
			var d = new Date();
			
			d.setFullYear(jaar);
			d.setMonth(maand);
			d.setDate(dag);
			
			d.setHours(uur);
			d.setMinutes(minuten);
			d.setSeconds(seconden);
	
	/***
	 * Maak nieuw Date object van de tijd nu
	 */
			var now = new Date();
	
	/***
	 * Controleer op datum en uur, return aantal uren geleden of datum
	 */
			//als de dag van vandaag (of gisteren) werd gepost, output dan het uur, anders de datum
			//if(d.getDay() == now.getDay() && d.getMonth() == now.getMonth()) {
			if(d.getMonth() == now.getMonth() && (d.getDay() == now.getDay() || (d.getDay() == now.getDay() - 1))) {
			
				
				/*//milliSecs = number of milliseconds since the date
				var milliSecs = (now.getTime() - d.getTime());
				var interval = new Date(milliSecs);
				alert(interval.toLocaleTimeString() + " geleden");*/
				
				//zonder de seconden (zie substr())
				//alert("Om " + d.toLocaleTimeString().substr(0,4));
				
				var voorVoegsel = "Vandaag";
				if(d.getDay() == now.getDay() - 1) voorVoegsel = "Gisteren";
				
				var minuten = d.getMinutes().toString();
				if(minuten.length <= 1) {
					minuten = "0" + minuten;
					
				}
				
				var uren = d.getHours();
				
				
				return voorVoegsel + " om " + uren + ":" + minuten;
			
			} else {
				//alert("Op " + d.toLocaleDateString());
				return "Op " + d.toLocaleDateString();
			}
}



