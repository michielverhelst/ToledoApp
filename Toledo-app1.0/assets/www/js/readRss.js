//variables
var store;
var rssFeed;


function saveRssFeed() {
	
	rssFeed.save({key:'feed', value:document.getElementById("rssfeed").value})

}

function gotoHome() {
	
	window.parent.location.href="index.html";
	
}

function getRssFeed() {
	
	rssFeed.get('feed', function(obj) {
		
		navigator.notification.alert(obj.value);
		
	})
	
}

function onLoad() {
	
	rssFeed = Lawnchair({name:'rssFeed'},function(e) {
		
		console.log('storage open');
		
	});
	
}




