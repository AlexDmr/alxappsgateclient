define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoPaletteOrthozoomTabs"
	    ]
	  , function(Brick, PresoPaletteOrthozoomTabs) {
			 var Palette = function(id, brick) {
				 brick = brick || {};
				 this.init();
				 this.appendPresoFactory( 'PresoPaletteOrthozoomTabs'
										, PresoPaletteOrthozoomTabs
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
				 
				 this.UniversAccess = {};
				 
				 return this;
				};
			 Palette.prototype = new Brick();
			 Palette.prototype.constructor = Palette;
			 Palette.prototype.update = function(data) {
				 console.log("Update Palette", this, "with", data);
				}
			 Palette.prototype.addUniverAccess = function(objDescr, brickUnivers) {
				 this.UniversAccess[objDescr.id] = {descr:objDescr, brick:brickUnivers};
				 for(var i=0; i<this.presentations.length; i++) {
					 this.presentations[i].addUniverAccess(objDescr, brickUnivers);
					}
				 this.appendChild( brickUnivers );
				}
			 
			 return Palette;
			}
	  );
	  