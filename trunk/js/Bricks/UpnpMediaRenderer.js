define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoMediaRenderer"
	    , "Bricks/Presentations/PresoMediaRenderer2"
	    ]
	  , function(Brick, PresoMediaRenderer, PresoMediaRenderer2) {
			 var UpnpMediaRenderer = function(id, brick) {
				 return this;
				};
			 UpnpMediaRenderer.prototype = new Brick();
			 UpnpMediaRenderer.prototype.constructor = UpnpMediaRenderer;
			 UpnpMediaRenderer.prototype.init = function(children) {
				 Brick.prototype.init.apply(this, [children]);
				 this.appendPresoFactory( 'PresoMediaRenderer'
										, PresoMediaRenderer
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 0.5
										  , pixelsRatio		 : 1 }
										);
				 this.appendPresoFactory( 'PresoMediaRenderer2'
										, PresoMediaRenderer2
										, { pixelsMinDensity : 0.5
										  , pixelsMaxDensity : 2
										  , pixelsRatio		 : 1 }
										);
				}
			 return UpnpMediaRenderer;
			}
	  );