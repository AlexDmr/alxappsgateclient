var socket = io.connect();
var AlxClient = null;
require( [ "AlxAppsGateClient"
		 , "domReady"
		 ]
	   , function(apps, domReady) {
			 console.log("Now AppsGate is loaded");
			 domReady( function() {
				 console.log('DOM is ready');
				 console.log("A = require('AlxAppsGateClient')")
				 console.log("A.call('UPnP', {UDN:'d99cd038-deac-35ec-43f3-ac6d79348169',serviceType:'urn:schemas-upnp-org:service:ContentDirectory:1',action:'Browse',args:{ObjectID:'0',BrowseFlag:'BrowseMetadata',Filter:'*',StartingIndex:0,RequestedCount:0,SortCriteria:''}}, function(data) {console.log('Received :', data);})");
				 console.log("A.call('Hue', {method:'PUT',url:'',body:{}}, function(data) {console.log(\"Received from Hue:\n\",data);})");
				 //A.call('Hue', {method:'POST',url:'/api',body:'{"devicetype":"AlxAppsGate","username":"AlxAppsGate"}'}, function(data) {console.log("Received from Hue:",data);})
				 // A.call('AlxServer', {mtd:'saveBricksToFile',args:['last.log']}, function(data) {console.log('Received :', data);})
				 AlxClient = apps;
				 AlxClient.init();
				});
			}
);
