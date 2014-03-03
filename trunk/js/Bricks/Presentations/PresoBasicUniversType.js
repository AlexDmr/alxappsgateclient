define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUnivers"
		]
	  , function(PresoTile, PresoTileUnivers, CategSmartPlug) {
			 // Presentation
			 var PresoBasicUniversType = function() {
				 PresoTileUnivers.prototype.constructor.apply(this,[]);
				 this.imgPath = 'images/lego.jpg';
				}
				
			 PresoBasicUniversType.prototype = new PresoTileUnivers();
			 PresoBasicUniversType.prototype.constructor = PresoBasicUniversType;

			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoBasicUniversType;
			}
	  );

	  

	  