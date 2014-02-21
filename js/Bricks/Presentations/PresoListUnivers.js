define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgRect"
		, "utils/svgPoly"
		, "utils/svgText"
		, "utils/svgImage"
		, "utils/svgGroup"
		, "utils/svgButton"
		, "Bricks/Presentations/utils"
		, "Bricks/Space"
		]
	  , function( PresoTile
				, svgAlx, svgUtils
				, svgRect, svgPoly, svgText, svgImage, svgGroup
				, svgButton
				, utils
				, SpaceBrick ) {
			 // Presentation
			 var PresoListUnivers = function() {
				}
				
			 PresoListUnivers.prototype = new PresoTile();
			 PresoListUnivers.prototype.constructor = PresoListUnivers;
			 PresoListUnivers.prototype.init = function(brick) {
				 PresoTile.prototype.init.apply(this, [brick]);
				}
			 PresoListUnivers.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 PresoTile.prototype.Render.apply(this, []);
					 // Change the presentations of descendant spaces
					 this.RecursiveListPlacement();
					}
				 return this.root;
				}
			 PresoListUnivers.prototype.RecursiveListPlacement = function() {
				 
				}

			// Return the reference to the PresoBasicAlxHueLamp constructor
			 return PresoListUnivers;
			}
	  );
