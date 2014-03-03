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
			 var PresoBasicAlxHueLamp = function() {
				}
				
			 PresoBasicAlxHueLamp.prototype = new PresoTile();
			 PresoBasicAlxHueLamp.prototype.constructor = PresoBasicAlxHueLamp;
			 PresoBasicAlxHueLamp.prototype.init = function(brick) {
				 PresoTile.prototype.init.apply(this, [brick]);
				}
			 PresoBasicAlxHueLamp.prototype.toggle = function() {
				 this.brick.toggle();
				}
			 PresoBasicAlxHueLamp.prototype.IsOn = function(b) {
				 if(this.root) {
					 this.bgRect.style.fill = b?'yellow':'grey';
					}
				}
			 PresoBasicAlxHueLamp.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 PresoTile.prototype.Render.apply(this, []);
					 this.root.classList.add('PresoBasicSmartPlug');
					 this.root.classList.add('Brick'); this.root.classList.add('dropShadowFilter');
					 // this.root.setAttribute('filter', 'url(#dropShadow)');
					 this.IsOn( this.brick.IsOn );
					 this.root.addEventListener( 'click'
						, function() {self.toggle();}
						, false );
					}
				 
				 return this.root;
				}

			// Return the reference to the PresoBasicAlxHueLamp constructor
			 return PresoBasicAlxHueLamp;
			}
	  );
