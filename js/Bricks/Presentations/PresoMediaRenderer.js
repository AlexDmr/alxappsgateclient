define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoMediaRenderer = function() {
				}
				
			 PresoMediaRenderer.prototype = new Presentation();
			 PresoMediaRenderer.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;//this.RenderPresoTile();
				 
				 return this.root;
				}
			 PresoMediaRenderer.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				}
			 PresoMediaRenderer.prototype.adaptRender = function(scale, L_CB) {
				 var res = Presentation.prototype.adaptRender.apply(this, [scale, L_CB]);
				 // console.log("PresoMediaRenderer scaling at", scale, " / [",this.validity.pixelsMinDensity,";",this.validity.pixelsMaxDensity,"]");
				 return res;
				}
				
			// Return the reference to the PresoMediaRenderer constructor
			 return PresoMediaRenderer;
			}
	  );