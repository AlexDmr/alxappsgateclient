define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoMediaRenderer"
	    ]
	  , function(Brick, PresoMediaRenderer) {
			 var UpnpMediaRenderer = function(id, brick) {
				 this.init();
				 this.appendPresoFactory('PresoMediaRenderer', PresoMediaRenderer);
				 return this;
				};
			 UpnpMediaRenderer.prototype = new Brick();
			 UpnpMediaRenderer.prototype.constructor = UpnpMediaRenderer;
				
			 return UpnpMediaRenderer;
			}
	  );