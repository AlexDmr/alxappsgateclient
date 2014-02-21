define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers) {
			 // Presentation
			 var PresoBasicUniversMap = function() {
				 this.x = this.y = 0;
				 this.w = this.h = 12;
				 this.imgPath = 'images/carte.jpg';
				}
				
			 PresoBasicUniversMap.prototype = new PresoTileUnivers();
				
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversMap;
			}
	  );
