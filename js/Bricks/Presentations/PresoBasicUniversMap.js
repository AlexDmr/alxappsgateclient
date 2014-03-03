define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers) {
			 // Presentation
			 var PresoBasicUniversMap = function() {
				 PresoTileUnivers.prototype.constructor.apply(this,[]);
				 this.imgPath = 'images/carte.jpg';
				}
				
			 PresoBasicUniversMap.prototype = new PresoTileUnivers();
				
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversMap;
			}
	  );
