define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoMediaServer"
	    ]
	  , function(Brick, PresoMediaServer) {
			 var UpnpMediaServer = function(id, brick) {
				 this.init();
				 this.appendPresoFactory('PresoMediaServer', PresoMediaServer);
				 return this;
				};
			 UpnpMediaServer.prototype = new Brick();
			 UpnpMediaServer.prototype.constructor = UpnpMediaServer;
				
			 return UpnpMediaServer;
			}
	  );