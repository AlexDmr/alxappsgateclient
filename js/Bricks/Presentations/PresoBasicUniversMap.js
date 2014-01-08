define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers) {
			 // Presentation
			 var PresoBasicUniversMap = function() {
				 this.x = this.y = 0;
				 this.w = this.h = 12;
				 this.imgPath = 'images/carte.jpg';
				 // Define some rooms...
				 this.mapData = {
					  x : 0, y : 3
					, w : 5, h : 5
					, color: 'cyan', tile: this, name: 'Plan'
					, children : [
						  { x:7,y:0,w:5,h:5,color:'blue',name:'Cuisine'
						  , children : [
								{x:0,y:10,w:2,h:2,brickId:'capteurContact1'}
								]
						  }
						, { x:3,y:5,w:9,h:7,color:'chocolate',name:'Salon'
						  , children : [
								  {x:10,y:6,w:2,h:2,brickId:'ENO87cdd8'} // Porte fenêtre
								, {x:6,y:7,w:2,h:2,brickId:'ENO878052'}	// Spöka
								]
						  }
						]
					}
				}
				
			 PresoBasicUniversMap.prototype = new PresoTileUnivers();
			 /*PresoBasicUniversMap.prototype.buildMap = function(data, tile) {
				 // console.log(data.name || data.brickId);
				 if(!tile) {
					 tile = new PresoTile();
					 tile.init(null, []);
					 if(data.brickId) {
						 this.mapBrickIdToTile[data.brickId] = {data: data, tile: tile};
						}
					}
				 tile.x = data.x; tile.y = data.y; tile.w = data.w; tile.h = data.h; tile.color = data.color || 'white';
				 tile.name = data.name;
				 if(data.children) {
					 for(var i=0; i<data.children.length; i++) {
						 var tileChild = this.buildMap(data.children[i], null);
						 tile.appendChild( tileChild );
						}
					}
				 return tile;
				}*/
			 /*PresoBasicUniversMap.prototype.integrateBrick = function(brick) {
				 // Find where to place the brick if it can be...
				 console.log("Integrating brick", brick.id);
				 if(this.mapBrickIdToTile[brick.id]) {
					 // Unplug the previous brick and plug the new one
					 var prevTile = this.mapBrickIdToTile[brick.id].tile,
					     data     = this.mapBrickIdToTile[brick.id].data;
					 var parentTile = prevTile.parent;
					 parentTile.removeChild( prevTile );
					 var tile = parentTile.appendChildFromBrick	( brick
					 											, function() {
																	 this.x = data.x; 
																	 this.y = data.y; 
																	 this.w = data.w; 
																	 this.h = data.h; 
																	 this.color = data.color || 'white';
																	} 
																);
					 this.mapBrickIdToTile[brick.id].tile = tile;
					 // tile.forceRender();
					}
				}*/
				
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversMap;
			}
	  );
