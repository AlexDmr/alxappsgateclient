define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoTilesAlxAppsGate"
	    ]
	  , function(Brick, PresoTilesAlxAppsGate) {
			 var SpaceBrick = function(id, brick) {
				 brick = brick || {};
				 this.init();
				 this.appendPresoFactory( 'PresoTilesAlxAppsGate'
										, PresoTilesAlxAppsGate
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : 0 }
										);
				 this.id = id;
				 if(id) socket.on(id, function(data) {self.update(data);});
				 
				 this.x = brick.x || this.x;
				 this.x = brick.y || this.x;
				 this.x = brick.w || this.y;
				 this.x = brick.h || this.h;
				 
				 return this;
				};
			 SpaceBrick.prototype = new Brick();
			 SpaceBrick.prototype.constructor = SpaceBrick;
			 SpaceBrick.prototype.update = function(data) {
				 console.log("Update SpaceBrick", this, "with", data);
				}
			
			 return SpaceBrick;
			}
	  );