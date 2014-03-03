define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoMediaServer = function() {
				}
				
			 PresoMediaServer.prototype = new Presentation();
			 // PresoBasicSmartPlug.prototype.RenderPresoTile = PresoBasicSmartPlug.prototype.Render;
			 PresoMediaServer.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;//this.RenderPresoTile();
				 
				 return this.root;
				}
			 PresoMediaServer.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				}

			// Return the reference to the PresoMediaServer constructor
			 return PresoMediaServer;
			}
	  );