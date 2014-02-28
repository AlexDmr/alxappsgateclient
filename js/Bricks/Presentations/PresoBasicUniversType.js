define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers, CategSmartPlug) {
			 // Presentation
			 var PresoBasicUniversType = function() {
				 this.x = 0; this.y = 3;
				 this.w = this.h = 12;
				 this.imgPath = 'images/lego.jpg';
				}
				
			 PresoBasicUniversType.prototype = new PresoTileUnivers();
			 PresoBasicUniversType.prototype.constructor = PresoBasicUniversType;

			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversType;
			}
	  );

	  

	  