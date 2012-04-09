function onLoad() {

	document.addEventListener("deviceready", onDeviceReady, true);
	//ReadRSS();
	
}

function onDeviceReady(){

	navigator.notification.alert("PhoneGap is working");

}

function gotoReadRss() {
	
	window.parent.location.href="readRss.html";
	
}