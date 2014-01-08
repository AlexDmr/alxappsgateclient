define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers) {
			 // Presentation
			 var PresoBasicUniversType = function() {
				 this.x = 0; this.y = 3;
				 this.w = this.h = 12;
				 this.imgPath = 'images/lego.jpg';
				 // Define some rooms...
				 this.mapData = {
					  x : 7, y : 3
					, w : 5, h : 5
					, color: 'darkslategray', tile: this, name: 'Catégories'
					, children : [
						  { x:0,y:0,w:3,h:3,color:'blue',name:'Prises pilotable',categId:'6'}
						, { x:3,y:0,w:3,h:3,color:'blue',name:'Thermomètres',categId:'0'}
						, { x:6,y:0,w:3,h:3,color:'blue',name:'Luminomètres',categId:'1'}
						, { x:9,y:0,w:3,h:3,color:'blue',name:'Lampes Hue',categId:'7'}
						, { x:9,y:9,w:3,h:3,color:'blue',name:'Horloge',categId:'21'}
						]
					}
				}
				
			 PresoBasicUniversType.prototype = new PresoTileUnivers();

			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversType;
			}
	  );
