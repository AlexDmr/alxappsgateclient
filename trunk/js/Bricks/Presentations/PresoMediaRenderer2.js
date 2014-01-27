define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoMediaRenderer2 = function() {
				 //XXX this.init();
				 this.x = this.y = 0;
				 this.w = this.h = 1;
				}
				
			 PresoMediaRenderer2.prototype = new Presentation();
			 PresoMediaRenderer2.prototype.Render = function() {
				 this.root = Presentation.prototype.Render.apply(this,[]);
				 var self = this;
				 if(!this.svgImg) {
					 this.svgImg = document.createElementNS("http://www.w3.org/2000/svg", 'image');
						 this.svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', "images/MediaPlayer/pipoMediaPlayer.png");
						 var size = this.getTileSize();
						 this.svgImg.setAttribute('width' , this.w*size);
						 this.svgImg.setAttribute('height', this.h*size);
					 var parent = this.bgRect.parentNode;
					 parent.removeChild( this.bgRect );
					 parent.appendChild( this.svgImg );
					}
				 return this.root;
				}
			 PresoMediaRenderer2.prototype.deletePrimitives = function() {
				 console.log("Deleting primitives of", this);
				 Presentation.prototype.deletePrimitives.apply(this,[]);
				 if(this.svgImg) {
					 if(this.svgImg.parentNode) {this.svgImg.parentNode.removeChild(this.svgImg);}
					 this.svgImg = null;
					}
				}
			 PresoMediaRenderer2.prototype.adaptRender = function(scale, L_CB) {
				 var res = Presentation.prototype.adaptRender.apply(this, [scale, L_CB]);
				 // console.log("PresoMediaRenderer2 scaling at", scale, " / [",this.validity.pixelsMinDensity,";",this.validity.pixelsMaxDensity,"]");
				 return res;
				}
				
			// Return the reference to the PresoMediaRenderer2 constructor
			 return PresoMediaRenderer2;
			}
	  );