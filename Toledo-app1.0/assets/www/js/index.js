function onLoad() {

	document.addEventListener("deviceready", onDeviceReady, true);
	setRSStemplate('https://cygnus.cc.kuleuven.be/webapps/tol-data-rs-events-bb_bb60/rs/events/s/e-q0428490/cd70742b-dd32-43ab-94aa-58ed6a2b5e47?type=*&s=OclxxdlfGc6sA9lhLkIJ5gj%2FwZI%3D&view=atom', 'rssBody');
	
}

function onDeviceReady(){

	navigator.notification.alert("PhoneGap is not working");

}

function gotoReadRss() {
	
	window.parent.location.href="readRss.html";
	
}