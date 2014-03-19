define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoMediaRenderer2 = function() {
				 this.scale
				}
				
			 PresoMediaRenderer2.prototype = new Presentation();
			 PresoMediaRenderer2.prototype.init = function(brick) {
				 var rep = Presentation.prototype.init.apply(this,[brick]);
				 this.scaleFactor = 12;//4;
				 return rep;
				}
			 PresoMediaRenderer2.prototype.Render = function() {
				 this.root = Presentation.prototype.Render.apply(this,[]);
				 var self = this;
				 if(!this.svgImg) {
					 this.svgImg = document.createElementNS("http://www.w3.org/2000/svg", 'image');
						 this.svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', "images/MediaPlayer/pipoMediaPlayer.png");
						 var size = this.getTileSize();
						 this.svgImg.setAttribute('width' , this.w*size);
						 this.svgImg.setAttribute('height', this.h*size);
					 var parent;
					 if(typeof this.bgRect.parentElement === 'undefined') {parent = this.bgRect.parentNode;} else {parent = this.bgRect.parentElement;}
					 parent.removeChild( this.bgRect );
					 parent.appendChild( this.svgImg );
					 
					 var outR = this.svgOutRect.getRoot();
					 outR.parentNode.removeChild( outR );
					}
				 return this.root;
				}
			 PresoMediaRenderer2.prototype.deletePrimitives = function() {
				 console.log("Deleting primitives of PresoMediaRenderer2", this);
				 Presentation.prototype.deletePrimitives.apply(this,[]);
				 if(this.svgImg) {
					 var parent;
					 if(typeof this.svgImg.parentElement === 'undefined') {parent = this.svgImg.parentNode;} else {parent = this.svgImg.parentElement;}
					 if(parent) {parent.removeChild(this.svgImg);}
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