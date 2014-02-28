define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoTilesAlxAppsGate"
	    ]
	  , function(Brick, PresoTilesAlxAppsGate) {
			 var SpaceBrick = function(id, brick) {
				 brick = brick || {};
				 this.id = id;
				 if(id) socket.on(id, function(data) {self.update(data);});
				 this.isSpace = true;
				 return this;
				};
			 SpaceBrick.prototype = new Brick();
			 SpaceBrick.prototype.constructor = SpaceBrick;
			 SpaceBrick.prototype.init = function(children) {
				 Brick.prototype.init.apply(this, [children]);
				 this.appendPresoFactory( 'PresoTilesAlxAppsGate'
										, PresoTilesAlxAppsGate
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : 0 }
										);
				 return this;
				}
			 SpaceBrick.prototype.update = function(data) {
				 console.log("Update SpaceBrick", this, "with", data);
				}
			
			 return SpaceBrick;
			}
	  );