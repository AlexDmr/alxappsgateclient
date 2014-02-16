define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		// , "Bricks/Presentations/PresoCategSmartPlug"
		, "Bricks/CategSmartPlug"
		]
	  , function(PresoTile, PresoTileUnivers, CategSmartPlug) {
			 // Presentation
			 var PresoBasicUniversType = function() {
				 this.x = 0; this.y = 3;
				 this.w = this.h = 12;
				 this.imgPath = 'images/lego.jpg';

				 // Categories
				 this.brickCategories = [];
				 var categ_SP = new CategSmartPlug(); this.brickCategories.push(categ_SP);
				 for(var i=0;i<this.brickCategories.length;i++) {this.brickCategories[i].init(null,[]);}
				 
				 // Define some rooms...
				 this.mapData = {
					  x : 7, y : 3
					, w : 5, h : 5
					, color: 'darkslategray', tile: this, name: 'Catégories'
					, children : [
						  { x:0,y:0,w:3,h:3,color:'blue',name:'Prises pilotable',categId:'6',brick:categ_SP}
						, { x:3,y:0,w:3,h:3,color:'blue',name:'Thermomètres',categId:'0'}
						, { x:6,y:0,w:3,h:3,color:'blue',name:'Luminomètres',categId:'1'}
						, { x:9,y:0,w:3,h:3,color:'blue',name:'Lampes Hue',categId:'7'}
						, { x:0,y:3,w:3,h:3,color:'blue',name:'Prises pilotable',categId:'urn:schemas-upnp-org:device:MediaServer:1'}
						, { x:3,y:3,w:3,h:3,color:'blue',name:'Prises pilotable',categId:'urn:schemas-upnp-org:device:MediaRenderer:1'}
						, { x:9,y:9,w:3,h:3,color:'yellow',name:'Horloge',brickId:'21106637055'} // Horloge
						]
					}
				}
				
			 PresoBasicUniversType.prototype = new PresoTileUnivers();

			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversType;
			}
	  );

	  

	  