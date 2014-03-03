var socket = io.connect();
var AlxClient = null;

require( [ "AlxAppsGateClient"
		 , "domReady"
		 , "classList"
		 ]
	   , function(apps, domReady) {
			 console.log("Now AppsGate is loaded");
			 
			 function toggleFullScreen() {
				  var doc = window.document;
				  var docEl = doc.documentElement;

				  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
				  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;

				  if(!doc.IsFullScreen && !doc.mozIsFullScreen && !doc.webkitIsFullScreen) {
					console.log('gogoFS');
					// document.documentElement.webkitRequestFullScreen();
					if(requestFullScreen) requestFullScreen.call(docEl);
				  }
				  else {
					if(cancelFullScreen) cancelFullScreen.call(doc);
				  }
				}

			 domReady( function() {
				 // console.log('DOM is ready');
				 // console.log("A = require('AlxAppsGateClient')")
				 // console.log("A.call('UPnP', {UDN:'d99cd038-deac-35ec-43f3-ac6d79348169',serviceType:'urn:schemas-upnp-org:service:ContentDirectory:1',action:'Browse',args:{ObjectID:'0',BrowseFlag:'BrowseMetadata',Filter:'*',StartingIndex:0,RequestedCount:0,SortCriteria:''}}, function(data) {console.log('Received :', data);})");
				 // console.log("A.call('Hue', {method:'PUT',url:'',body:{}}, function(data) {console.log(\"Received from Hue:\n\",data);})");
				 //A.call('Hue', {method:'POST',url:'/api',body:'{"devicetype":"AlxAppsGate","username":"AlxAppsGate"}'}, function(data) {console.log("Received from Hue:",data);})
				 // A.call('AlxServer', {mtd:'saveBricksToFile',args:['last.log']}, function(data) {console.log('Received :', data);})
				 // toggleFullScreen();
				 var FS = function() {toggleFullScreen();
									  endFS();
									 }
				  , endFS = function() {document.body.removeEventListener('touchstart', FS, false);}
				 document.body.addEventListener	('touchstart', FS, false);
				 
				 document.body.addEventListener( 'mousedown'
											   , function(e) {
													 e.preventDefault();
													 return false;
													}
											   );
				 
				 AlxClient = apps;
				 AlxClient.init();
				});
			}
);
