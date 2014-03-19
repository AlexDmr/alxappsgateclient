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
					 // this.bgRect.style.fill = b?'yellow':'grey';
					 var conf = {};
					 if(b) {
						 conf = {rx:5, ry:5, y:0, height:10, style:{fill:'#FF5'}};
						} else	{conf = {rx:0, ry:0, y:4, height:4, style:{fill:'#000'}};
								}
					 this.rectState.configure(conf);
					}
				}
			 PresoBasicAlxHueLamp.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 PresoTile.prototype.Render.apply(this, []);
					 this.root.classList.add('PresoBasicSmartPlug');
					 this.root.classList.add('Brick'); 
					 this.root.classList.add('BrickDevice');
					 // this.root.classList.add('dropShadowFilter');
					 // this.root.setAttribute('filter', 'url(#dropShadow)');
					 var coords = this.getPresoCoords();
					 this.img = new svgImage( { width  : coords.x2-coords.x1-10
											  , height : coords.y2-coords.y1-10 }
											).translate(coords.x1+5,coords.y1+7).load('images/mini/HueLamp.png');
						this.root.appendChild( this.img.getRoot() );
					
					 var scale = this.w / 2;
					 this.rectState = new svgRect( { width  : 10
												   , height : 10
												   , rx:5, ry:5
												   , style  : {stroke:'none'}
												   }
												 ).translate(5,5).scale(scale,scale);;
					 this.root.appendChild( this.rectState.getRoot() );
					 
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
