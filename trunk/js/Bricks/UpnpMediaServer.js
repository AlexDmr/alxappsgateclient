define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoMediaServer"
	    ]
	  , function(Brick, PresoMediaServer) {
			 var UpnpMediaServer = function(id, brick) {
				 return this;
				};
			 UpnpMediaServer.prototype = new Brick();
			 UpnpMediaServer.prototype.constructor = UpnpMediaServer;
			 UpnpMediaServer.prototype.init = function(children) {
				 Brick.prototype.init.apply(this, [children]);
				 this.appendPresoFactory( 'PresoMediaServer'
										, PresoMediaServer
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : {w:1,h:1} }
										);
				}
				
			 return UpnpMediaServer;
			}
	  );