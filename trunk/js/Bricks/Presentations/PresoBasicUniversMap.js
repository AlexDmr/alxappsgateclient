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
				
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversMap;
			}
	  );
