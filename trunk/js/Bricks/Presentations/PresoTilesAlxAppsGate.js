define( [ "Bricks/Presentations/protoPresentation"
		, "utils/svgUtils"
		, "utils/svgLine"
		]
	  , function(Presentation, svgUtils, svgLine) {
			 var dt = 0.1, size = 32, svg_point = null, uid = 0
			   , L_toUnplugged = [], L_dragged = [];
			 
			 // Presentation
			 var PresoTilesAlxAppsGate = function() {
				}
			 PresoTilesAlxAppsGate.prototype = new Presentation();
			 PresoTilesAlxAppsGate.prototype.constructor = PresoTilesAlxAppsGate;
			 PresoTilesAlxAppsGate.prototype.get_a_uid = function() {return 'UID_' + (uid++);}
			 // Taking care of dragged node (to avoid unplugging them while dragging)
			 PresoTilesAlxAppsGate.prototype.pushDragged = function( obj ) {
				 var node = obj.target;
				 obj.L_nodes = [];
				 while(node.parentNode) {obj.L_nodes.push(node); node=node.parentNode;}
				 L_dragged.push(obj);
				 // console.log("added to L_dragged :");
				 // console.log(obj);
				}
			 PresoTilesAlxAppsGate.prototype.removeDragged = function( idPtr ) {
				 for(var i=0; i<L_dragged.length; i++) {
					 if(L_dragged[i].id === idPtr) {
						 L_dragged.splice(i,1);
						 // console.log("Removing dragged element, now :", L_dragged);
						 break;
						}
					}
				}
			 PresoTilesAlxAppsGate.prototype.isDragging = function( node ) {
				 // console.log("Is dragging", node);
				 for(var i=0; i<L_dragged.length; i++) {
					 // console.log( i, ":", L_dragged[i].L_nodes.indexOf(node), ':', L_dragged[i].L_nodes );
					 if(L_dragged[i].L_nodes.indexOf(node) >= 0) {return L_dragged[i].id;}
					}
				 return null;
				}
			 PresoTilesAlxAppsGate.prototype.pushTileToUnplug = function(tile) {
				 L_toUnplugged.push( tile );
				}
			 PresoTilesAlxAppsGate.prototype.UnplugTilesNoMoreDragged = function(idPtr) {
				 // Unplug only if the tile is no more related to any pointer
				 var L = [];
				 for(var i=0; i<L_toUnplugged.length; i++) {
					 if(this.isDragging(L_toUnplugged[i].root) === null) {
						 // console.log('UnplugTilesNoMoreDragged', L_toUnplugged[i]);
						 L_toUnplugged[i].brick.unPlugPresentation( L_toUnplugged[i] );
						} else {L.push( L_toUnplugged[i] );}
					}
				 L_toUnplugged = L;
				}
			 // Access to SVG point and some shared data
			 PresoTilesAlxAppsGate.prototype.set_svg_point = function(p) {svg_point = p;}
			 PresoTilesAlxAppsGate.prototype.get_svg_point = function( ) {return svg_point;}
			 PresoTilesAlxAppsGate.prototype.getTileSize   = function() {return size;}
			 // Init & co
			 PresoTilesAlxAppsGate.prototype.init = function(brick) {
				 Presentation.prototype.init.apply(this,[brick]);
				 // console.log("PresoTilesAlxAppsGate Init");
				 this.x = this.y = 0;
				 this.w = this.h = 12;
				 this.innerMagnitude = 12;
				 this.color = 'cyan';
				 this.display = true;
				 this.scaleToDisplayChildren = 0.5;
				 this.validity = { pixelsMinDensity : 0
								 , pixelsMaxDensity : 999999999
								 , pixelsRatio		 : this.w / this.h };
				}
			 PresoTilesAlxAppsGate.prototype.getPresoCoords = function() {
				 return { x1 : 0.5*dt*size
						, y1 : 0.5*dt*size
						, x2 : 0.5*dt*size + size*(this.w-dt)
						, y2 : 0.5*dt*size + size*(this.h-dt) };
				}
			 PresoTilesAlxAppsGate.prototype.Render = function() {
				 var self = this;
				 if(!this.root) {
					 var g  = document.createElementNS("http://www.w3.org/2000/svg", 'g');
						 g.setAttribute('transform', 'translate(' + this.x*size
														   + ', ' + this.y*size + ')');
					 var gr = document.createElementNS("http://www.w3.org/2000/svg", 'g');
						 var scale = (Math.max(this.w,this.h)-2*dt)/this.innerMagnitude;//12;//
						 // console.log(scale, 'with', this.innerMagnitude);
						 gr.classList.add('rootInternal');
						 gr.setAttribute('transform', 'translate('+ dt*size
															+', '+ dt*size
															+') scale('+scale+','+scale+')');
					 this.gPreso = document.createElementNS("http://www.w3.org/2000/svg", 'g');
					 var r  = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
						 r.setAttribute('x', 0.5*dt*size)          ; r.setAttribute('y', 0.5*dt*size);
						 r.setAttribute('width' , size*(this.w-dt)); r.setAttribute('height', size*(this.h-dt));
						 r.classList.add('tile');
						 r.style.fill = this.color; r.style.stroke = "black";
						 this.bgRect = r;
					 this.gPreso.appendChild(r); g.appendChild(this.gPreso); g.appendChild(gr);
					 this.rect = r;
					 this.root  = g; g.classList.add('TileRoot'); g.TileRoot = this;
					 this.groot = gr;
					 for(var i=0;i<this.children.length;i++) {this.primitivePlug(this.children[i]);}
					 
					 this.grid = document.createElementNS("http://www.w3.org/2000/svg", 'g');
					 for(var i=0;i<=this.w*12/Math.max(this.w,this.h);i++) {// Create lines
						 var line = new svgLine( {x1:i*size,y1:0,x2:i*size,y2:this.h*size*12/Math.max(this.w,this.h)} );
						 this.grid.appendChild( line.getRoot() );
						}
					 for(var i=0;i<=this.h*12/Math.max(this.w,this.h);i++) {// Create lines
						 var line = new svgLine( {x1:0,y1:i*size,x2:this.w*size*12/Math.max(this.w,this.h),y2:i*size} );
						 this.grid.appendChild( line.getRoot() );
						}
					 // this.displayGrid(true);
					 
					 // Deal with drag and drop
					 svgUtils.DD.DropZone( this.bgRect
										 , { tags	: ['brick']
										   , enter	: function(evt) {self.displayGrid(true );}
										   , leave	: function(evt) {self.displayGrid(false);}
										   , accept	: function(config) {/*console.log('Possible drop on', this);*/}
										   , drop	: function(evt) {}
										   } 
										 );
					}
				 return this.root;
				}
			 PresoTilesAlxAppsGate.prototype.displayGrid = function(b) {
				 if( b && this.grid.parentNode === null      ) {this.groot.appendChild( this.grid );}
				 if(!b && this.grid.parentNode === this.groot) {this.groot.removeChild( this.grid );}
				}
			 PresoTilesAlxAppsGate.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGate.prototype.primitivePlug = function(c) {
				 var P = this.Render(),
				     N = c.Render(); pipo = c;
				 // console.log(P, "\n", c, "\n", N);
				 this.groot.appendChild( N );
				}
			 PresoTilesAlxAppsGate.prototype.getChildrenContext = function(w, h, MT) {
				var root = this.groot;
				if(root) {
						var M = null;
						if(MT) {M = MT.multiply( root.getCTM() );} else {M = root.getCTM();}
						svg_point.x = 0; svg_point.y = 0;
						var P0 = svg_point.matrixTransform( M );
						svg_point.x = 1; svg_point.y = 0;
						var P1 = svg_point.matrixTransform( M );
						var dx = P1.x - P0.x,
							dy = P1.y - P0.y,
							scale = Math.sqrt( dx*dx + dy*dy );
						} else {scale = 0;}
				 return {pixelsDensity:scale,pixelsRatio:w/h};
				}
			 PresoTilesAlxAppsGate.prototype.ComputeSemanticZoom = function(MT, L_CB/*L_toAppear, L_toDisappear*/) {
				var scale = this.getChildrenContext(this.w, this.h, MT);
				scale = scale.pixelsDensity;
				// console.log(scale);
				if(this.adaptRender(scale,L_CB/*L_toAppear,L_toDisappear*/)) {
					// Recursing across semantic zoom structure
					for(var i=0;i<this.children.length;i++) {
						 this.children[i].ComputeSemanticZoom(MT, L_CB/*L_toAppear, L_toDisappear*/);
						}
					}
				}
			 PresoTilesAlxAppsGate.prototype.adaptRender = function(scale, L_CB) {
				var res;
				var self = this;
				
				if(  !this.isGoingToDisappear
				  && (  scale < this.validity.pixelsMinDensity
					 || scale > this.validity.pixelsMaxDensity )
				  ) {
					 // console.log("Presentation outside its plasticity domain :");
					 var newPreso = this.brick.getNewPresentationWithContext( 
										{ pixelsRatio	: this.w / this.h
										, pixelsDensity	: scale }
										);
					 if(newPreso) {
						 this.isGoingToDisappear = true;
						 newPreso.x = this.x; newPreso.y = this.y
						 newPreso.w = this.w; newPreso.h = this.h;
						 this.parent.appendChild( newPreso );
						 L_CB.push( function(v) {
										 self.CB_Fade(v,1,0,self.root);
										 newPreso.CB_Fade(v,0,1,newPreso.root);
										 if(v>=1) {
											 if(self.isDragging(self.root) != null) {
												 console.log("Do not unplugged", self);
												 self.pushTileToUnplug( self );
												} else {console.log("Unplug", self);
														self.brick.unPlugPresentation( self );
													   }
											}
										}
								  );
						} else {console.log("Alert, no other compatible presentations...");}
					}
				if(scale < this.scaleToDisplayChildren) {
					 if(this.display) {this.display = false;
									   L_CB.push( function(v) {self.CB_Fade(v,1,0);} );
									   res = true;
									  } else {res = false;}
					} else 	{if(!this.display) {this.display = true;
												L_CB.push( function(v) {self.CB_Fade(v,0,1);} );
											   }
							 res = true;
							}
				 return res;
				}
			 PresoTilesAlxAppsGate.prototype.CB_Fade = function(dt, v0, v1, node) {
				 if(!node) {node = this.getInnerRoot();}
				 if(v0 === 0 && dt === 0) {
					 // console.log('display', this);
					 node.style.display = 'inherit';
					}
				 node.style.opacity = Math.easeInOutQuad(dt, v0, v1-v0, 1);
				 if(v1 === 0 && dt >= 1) {
					 // console.log('Hide', this);
					 if(!this.display) node.style.display = 'none';
					}
				}
			 PresoTilesAlxAppsGate.prototype.deletePrimitives = function() {
				 console.log("PresoTilesAlxAppsGate::deletePrimitives", this);
				 if(this.root) {
					 this.root.parentNode.removeChild(this.root);this.root=null;
					 this.rect.parentNode.removeChild(this.rect);this.rect=null;
					 this.gPreso.parentNode.removeChild(this.gPreso);this.gPreso=null;
					 this.groot.parentNode.removeChild(this.groot);this.groot=null;
					}
				}

			 // Return the reference to the PresoTilesAlxAppsGate constructor
			 return PresoTilesAlxAppsGate;
			}
	  );