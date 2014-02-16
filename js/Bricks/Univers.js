define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoTilesAlxAppsGate"
	    ]
	  , function(Brick, PresoTilesAlxAppsGate) {
			 var UniversBrick = function(id, brick, L_presoFactories) {
				 var TF;
				 brick = brick || {};
				 this.init();
				 for(var fDescr in L_presoFactories) {
					 TF = L_presoFactories[fDescr];
					 this.appendPresoFactory(TF[0], TF[1], TF[2]);
					}
				 this.id = id;
				 if(id) socket.on(id, function(data) {self.update(data);});
				 
				 this.x = brick.x || this.x;
				 this.x = brick.y || this.x;
				 this.x = brick.w || this.y;
				 this.x = brick.h || this.h;
				 
				 return this;
				};
			 UniversBrick.prototype = new Brick();
			 UniversBrick.prototype.constructor = UniversBrick;
			 UniversBrick.prototype.update = function(data) {
				 console.log("Update UniversBrick", this, "with", data);
				}
			 UniversBrick.prototype.integrateBrick = function(brick) {
				 for(var p=0;p<this.presentations.length;p++) {
					 this.presentations[p].integrateBrick(brick);
					}
				}
			
			 return UniversBrick;
			}
	  );