define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgRect"
		, "utils/svgText"
		, "Bricks/Presentations/utils"
		]
	  , function( PresoTile
				, svgAlx, svgUtils
				, svgRect, svgText
				, utils) {
			 // Presentation
			 var PresoBasicPalette = function() {
				 
				}
				
			 PresoBasicPalette.prototype = new PresoTile();
			 PresoBasicPalette.prototype.init = function() {
				 PresoTile.prototype.init.apply(this, []);
				 this.displayPalette = false;
				 this.x = 0; this.y = 0;
				 this.w = this.h = 12;
				}
			 PresoBasicPalette.prototype.Render = function() {
				 var self = this;
				 this.root = PresoTile.prototype.Render.apply(this, []);
				 this.bgRect.setAttribute('rx', this.bgRect.getAttribute('width' )/2);
				 this.bgRect.setAttribute('ry', this.bgRect.getAttribute('height')/2);
				 
				 this.groot.setAttribute( 'transform'
										, 'translate('+(this.bgRect.getAttribute('width' )/2)
												  +','+(this.bgRect.getAttribute('height')/2)
												  +')' );
				 this.space = new svgRect( {transform: 'translate('+10+','+30+')'} );
				 svgUtils.DD.DragAndDroppable( this.space.getRoot()
											 , {tags : ['brick']}
											 );
				 this.groot.appendChild( this.space.getRoot() );
				 
				 // Render as a small "button" on the top right corner of the screen
				 this.bgRect.addEventListener( 'dblclick'
											 , function(e) {
												 e.stopPropagation();
												 e.preventDefault();
												}
											, false );
				 this.bgRect.addEventListener( 'click'
											 , function(e) {self.togglePalette();}
											 , false );
				 
				 // Plug interaction so that it can display the full size
				 
				 // Full size palette
				 
				 return this.root;
				}
				
			 // Callback to deploy the palette
			 PresoBasicPalette.prototype.togglePalette = function() {
				 var self = this;
				 var b = this.displayPalette = !this.displayPalette;
				 // Animate the rectangle
				 var rx = this.bgRect.getAttribute('width' )/2
				   , ry = this.bgRect.getAttribute('height')/2
				   ,  x = 0 //window.innerWidth  - this.getTileSize()*this.w/2
				   ,  y = 0 //- this.getTileSize()*this.h/2
				   , xp = -this.getTileSize()*this.w/2
				   , yp =  this.getTileSize()*this.h/2
				   ,  h =  this.getTileSize()*this.h
				   , hp =  window.innerHeight*1000/window.innerWidth;
				 utils.animate( 1000
							  , function(obj) {
									 var rxp = Math.easeInOutQuad(obj.dt,b?rx:0,b?-rx:rx,1)
									   , ryp = Math.easeInOutQuad(obj.dt,b?rx:0,b?-rx:rx,1);
									 self.bgRect.setAttribute('rx', rxp);
									 self.bgRect.setAttribute('ry', ryp);
									 self.bgRect.setAttribute('x', Math.easeInOutQuad(obj.dt,b?x:xp,b?xp-x:x-xp,1) );
									 self.bgRect.setAttribute('y', Math.easeInOutQuad(obj.dt,b?y:yp,b?yp-y:y-yp,1) );
									 self.bgRect.setAttribute('height', Math.easeInOutQuad(obj.dt,b?h:hp,b?hp-h:h-hp,1) );
									 self.CB_Fade(obj.dt, b?0:1, b?1:0, this.groot);
									 self.groot.setAttribute( 'transform'
															, 'translate('
																+Math.easeInOutQuad(obj.dt,(b?0:-xp),(b?xp:-xp),1) + ','
																+ yp 
															    +')' );																
									}
							  );
				}
				
			 // Return the reference to the PresoBasicPalette constructor
			 return PresoBasicPalette;
			}
	  );
