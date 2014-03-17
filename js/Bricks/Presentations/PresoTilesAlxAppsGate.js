define( [ "Bricks/Presentations/protoPresentation"
		, "utils/svgUtils"
		, "utils/svgGroup"
		, "utils/svgLine"
		, "utils/svgRect"
		, "utils/svgText"
		]
	  , function( Presentation, svgUtils
	            , svgGroup, svgLine, svgRect, svgText) {
			 var dt = 0.1, size = 32, svg_point = null, uid = 0
			   , L_toUnplugged = [], L_dragged = []
			   , titleHeight = 11;
			 
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
				 while(node.parentElement || node.parentNode) {obj.L_nodes.push(node); node=node.parentElement||node.parentNode;}
				 L_dragged.push(obj);
				}
			 PresoTilesAlxAppsGate.prototype.removeDragged = function( idPtr ) {
				 for(var i=0; i<L_dragged.length; i++) {
					 if(L_dragged[i].id === idPtr) {
						 L_dragged.splice(i,1);
						 break;
						}
					}
				}
			 PresoTilesAlxAppsGate.prototype.isDragging = function( node ) {
				 for(var i=0; i<L_dragged.length; i++) {
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
				 this.DropZone = true;
				 this.x		= this.y = 0;
				 this.w		= this.h = 1;
				 this.color	= 'cyan';
				 // this.innerMagnitude = 12;
				 this.scaleFactor = 2; // How many times do we divide parent tile size...
				 this.display = true;
				 this.edited  = (typeof(this.edited) === 'undefined')?false:this.edited;
				 this.setEdited( this.edited );
				 this.scaleToDisplayChildren = 0.5;
				 this.displayFgRect = (typeof(this.edited) === 'undefined')?false:this.displayFgRect;
				 this.validity = { pixelsMinDensity : 0
								 , pixelsMaxDensity : 999999999
								 , pixelsRatio		 : {w:0,h:0} /*this.w / this.h*/ };
				 if(this.root) this.forceRender();
				}
			 PresoTilesAlxAppsGate.prototype.copy = function( preso ) {
				 Presentation.prototype.init.apply(this,[preso.brick]);
				 this.DropZone = preso.DropZone;
				 this.x = preso.x; this.y = preso.y;
				 this.w = preso.w; this.h = preso.h;
				 this.color = preso.color; this.scaleFactor = preso.scaleFactor;
				 this.display = preso.display;
				 this.edited = preso.edited;
				 this.setEdited( this.edited );
				 this.scaleToDisplayChildren = preso.scaleToDisplayChildren;
				 this.validity = { pixelsMinDensity	: preso.validity.pixelsMinDensity
								 , pixelsMaxDensity	: preso.validity.pixelsMaxDensity
								 , pixelsRatio		: { w : preso.validity.pixelsRatio.w
													  , h : preso.validity.pixelsRatio.h
													  } };
				}
			 PresoTilesAlxAppsGate.prototype.canBeResizedTo = function(w, h) {
				 if(w<=0 || h<=0) {return false;}
				 console.log("canBeResizedTo", w, h);
				 // Enough place for the children?
				 // XXX take care that we are talking of the internal magnitudes...
				 if(this.children.length) {
					 var minW = this.children[0].x + this.children[0].w
					   , minH = this.children[0].y + this.children[0].h;
					 for(var i=1; i<this.children.length; i++) {
						 minW = Math.max(minW, this.children[i].x + this.children[i].w);
						 minH = Math.max(minH, this.children[i].y + this.children[i].h);
						}
					 // Ask for innerWidth and innerHeight...
					 var inner = this.getInnerDimensions(w,h);
					 if( inner.w<minW || inner.h<minH ) {
						 console.log("\tChildren limit", w, h, inner, minW, minH);
						 return false;
						} else {console.log("\tChildren OK", w, h, inner, minW, minH);}
					}
				 
				 // Enough place with sibling and inside parent?
				 if(this.parent) {
					 // Fit inside parent?
					 var Pinner = this.parent.getInnerDimensions();
					 if( Pinner.w < this.x+w
					   ||Pinner.h < this.y+h ) {console.log("\tDo not fit into parent",Pinner, this.x+w, this.y+h); return false;}
					 // Do not collide with sibling?
					 var child;
					 for(var i=0; i<this.parent.children.length; i++) {
						 child = this.parent.children[i];
						 if(child === this) {continue;}
						 if(svgUtils.intersectionRect( this.x , this.y , this.x+w, this.y+h
													 , child.x, child.y, child.x+child.w, child.y+child.h )) {console.log("\tSibling limit, collision with", child); return false;}
						}
					}
				 
				 return true;
				}
			 PresoTilesAlxAppsGate.prototype.getPresoCoords = function() {
				 return { x1 : 0.5*dt*size
						, y1 : 0.5*dt*size
						, x2 : 0.5*dt*size + size*(this.w-dt)
						, y2 : 0.5*dt*size + size*(this.h-dt) };
				}
			 PresoTilesAlxAppsGate.prototype.getFreeSpaceCoordsFor = function(x,y,w,h) {
				 var intersect, child;
				 // Try to place the rectangle so that bottom right corner does correspond to <x;y>
				 var H = Math.floor((h+0)/2)
				   , W = Math.floor((w+0)/2)
				   , dims = this.getInnerDimensions() ;
				   
				 for(var j=H;j>=-H;j--) { 	// Line
					 for(var i=W;i>=-W;i--) {// Column
						 // coords : <x-i;y-j>
						 // Intersection with a child?
						 intersect = false;
						 for(var c=0;c<this.children.length;c++) {
							 child = this.children[c];
							 if( svgUtils.intersectionRect	( child.x, child.y, child.x+child.w, child.y+child.h
															, x-i    , y-j    , x-i+w          , y-j+h              )
							   && x-i >= 0 && x-i+w <= dims.w//this.scaleFactor*this.w//Math.floor(this.innerMagnitude*this.w/Math.max(this.w,this.h))
						       && y-j >= 0 && y-j+h <= dims.h//this.scaleFactor*this.h//Math.floor(this.innerMagnitude*this.h/Math.max(this.w,this.h))
							   ) {
								  intersect = true;
								  break;
								 }
							}
						 if(  !intersect 
						   && x-i >= 0 && x-i+w <= dims.w//this.scaleFactor*this.w//Math.floor(this.innerMagnitude*this.w/Math.max(this.w,this.h))
						   && y-j >= 0 && y-j+h <= dims.h//this.scaleFactor*this.h//Math.floor(this.innerMagnitude*this.h/Math.max(this.w,this.h))
						   ) {return {x:x-i,y:y-j};}
						}
					}
				 // console.log("No space");
				 return null;
				}
			 PresoTilesAlxAppsGate.prototype.appendChild = function(c) {
				 Presentation.prototype.appendChild.apply(this, [c]);
				 if(this.svgG) {
					 this.svgG.appendChild( this.svgFgRect );
					 this.svgFgRect.getRoot().style.display = this.displayFgRect?'inherit':'none';
					}
				 return this;
				}
			 PresoTilesAlxAppsGate.prototype.removeChild = function(c) {
				 Presentation.prototype.removeChild.apply(this, [c]);
				 if(this.svgG && this.children.length === 0) this.svgG.removeChild( this.svgFgRect );
				 return this;
				}
			 PresoTilesAlxAppsGate.prototype.setName = function(name) {
				 if(this.svgName) {this.svgName.set(name);}
				}
			 PresoTilesAlxAppsGate.prototype.getInnerDimensions = function(w,h) {
				 w = (typeof w === 'undefined')?this.w:w;
				 h = (typeof h === 'undefined')?this.h:h;
				 return { w: this.scaleFactor*w
						, h: Math.floor((this.scaleFactor*h*size - titleHeight)/size) }
				}
			 PresoTilesAlxAppsGate.prototype.Render = function() {
				 var self = this;
				 if(!this.root) {
					if( isNaN(this.x)
					  ||isNaN(this.y)
					  ||isNaN(this.w)
					  ||isNaN(this.h) ) {
						 console.error("Problem with magnitudes for", this);
						}
					
					// The root
					 this.svgG = new svgGroup( {class: (this.brick&&this.brick.tile)?this.brick.tile.class:''}
											 ).translate(this.x*size, this.y*(0/*11*/+size));
						var g = this.svgG.getRoot();
					 // var scale = (Math.max(this.w,this.h)-2*dt)/this.innerMagnitude
					 var scale = (this.w-2*dt)/(this.scaleFactor*this.w);
					// The space for children
					 this.svgGR = new svgGroup( {class : 'rootInternal'} ).translate(dt*size, titleHeight+dt*size).scale(scale,scale);
						var gr = this.svgGR.getRoot();
					 this.svgGPreso = new svgGroup( {class: 'bgPreso'} );
						this.gPreso = this.svgGPreso.getRoot();
					 this.svgBgRect = new svgRect( { x:0.5*dt*size, y:0.5*dt*size, rx:6, ry:6
												   , width:size*(this.w-dt), height:size*(this.h-dt)//(titleHeight+size)*(this.h-dt)
												   , class:'tile' } );
					 this.svgBgRectShadow = new svgRect( { x:0.5*dt*size, y:0.5*dt*size, rx:6, ry:6
												   , width:size*(this.w-dt), height:size*(this.h-dt)//(titleHeight+size)*(this.h-dt)
												   , class:'shadow' } ).translate(dt*size, dt*size);
					 this.svgFgRect = new svgRect( { x:1.5*dt*size, y:titleHeight+1.5*dt*size
												   , width:size*(this.w-3*dt), height:size*(this.h-0.5-3*dt)//(titleHeight+size)*(this.h-0.5-dt)
												   , class:'fgRect' } );
						var r = this.svgBgRect.getRoot();
					 this.gPreso.appendChild(this.svgBgRectShadow.getRoot()); this.gPreso.appendChild(r); g.appendChild(this.gPreso); g.appendChild(gr);
					 if(this.brick.isSpace) {
						 this.svgName = new svgText({class:'title'}).translate(3,titleHeight).set( this.brick?this.brick.getName():'' );
						 this.svgGPreso.appendChild( this.svgName );
						 if(this.children.length) {
							 this.svgG.appendChild( this.svgFgRect );
							 this.svgFgRect.getRoot().style.display = this.displayFgRect?'inherit':'none';
							}
						}
					 this.rect = this.bgRect = r;
					 this.root  = g; g.classList.add('TileRoot'); g.TileRoot = this;
					 this.groot = gr;
					 for(var i=0;i<this.children.length;i++) {this.primitivePlug(this.children[i]);}
					
					// Edition ?
					 this.setEdited( this.edited );
					 
					// Deal with drag and drop
					 if(this.DropZone && this.brick.isSpace)
						this.addDropZone();
					}
				 return this.root;
				}
			 PresoTilesAlxAppsGate.prototype.removeDropZone = function() {
				 svgUtils.DD.removeDropZone( this.root );
				}
			 PresoTilesAlxAppsGate.prototype.addDropZone = function() {
				 var self = this;
				 svgUtils.DD.DropZone( this.root //this.bgRect
									 , { tags		: ['brick']
									   , enter		: function(evt) {
														 self.bgRect.classList.add('selected');
														 var brick = evt.config.brick
														   , preso = evt.config.presentation;
														 // Plug the brick
														 if(self.brick !== brick && self.brick.ancestors().indexOf(brick) === -1) {
															 self.appendChild( preso );
															 svg_point.x = evt.xCanvas; svg_point.y = evt.yCanvas;
															 svg_point = svg_point.matrixTransform( self.groot.getCTM().inverse() );
															 preso.w = evt.config.size.w;
															 preso.h = evt.config.size.h;
															 preso.x = 100000; preso.y = 100000;
															 var coords = evt.config.coords || self.getFreeSpaceCoordsFor( Math.floor(svg_point.x/self.getTileSize())
																									, Math.floor(svg_point.y/self.getTileSize())
																									, preso.w
																									, preso.h );
															 // console.log( svg_point, coords );
															 preso.DropZone = false;
															 if(coords) {
																 preso.x = coords.x;
																 preso.y = coords.y;
																}
															 preso.forceRender();
															 console.log(preso);
															 if(!coords) {preso.Render().style.display = 'none';}
															} else {console.error('Ancestors violation');}
														}
									   , leave		: function(evt) {
														 self.bgRect.classList.remove('selected');
														 var brick = evt.config.brick
														   , preso = evt.config.presentation;
														 // Unplug the brick
														 self.removeChild( preso );
														}
									   , dragOver	: function(evt) {
														 // Resize the rectangle so that it fit into the cases
														 // console.log("Place brick", brick, "at", evt.x, evt.y);
														 var brick = evt.config.brick
														   , preso = evt.config.presentation;
														 // Change presentation coordinates
														 svg_point.x = evt.xCanvas; svg_point.y = evt.yCanvas;
														 svg_point = svg_point.matrixTransform( self.groot.getCTM().inverse() );
														 var X = preso.x, Y = preso.y;
														 preso.x = 100000; preso.y = 100000;
														 var coords = self.getFreeSpaceCoordsFor( Math.floor(svg_point.x/( 0+self.getTileSize()))
																								, Math.floor(svg_point.y/(0/*11*/+self.getTileSize()))
																								, preso.w
																								, preso.h );
														 preso.x = X; preso.y = Y;
														 // if(!coords) {console.log("No place...");}
														 if(  coords 
														   && ( preso.x !== coords.x || preso.y !== coords.y) ) {
															 preso.x = coords.x;
															 preso.y = coords.y;
															 preso.Render().style.display = 'inherit';
															 preso.Render().setAttribute ( 'transform'
																						 , 'translate(' + preso.x*size
																								 + ', ' + preso.y*(0/*11*/+size) + ')' 
																						 );
															}
														}
									   , drop		: function(evt) {
														 var brick = evt.config.brick
														   , preso = evt.config.presentation;
														 self.bgRect.classList.remove('selected');
														 if(preso.Render().style.display === 'none') {
															 console.log('Not really inserted...abort!');
															 return;
															}
														 var objData = {x:preso.x,y:preso.y,w:preso.w,h:preso.h,color:preso.color,class:preso.class};
														 preso.AlxGrosDebug = true;
														 if(self.brick.containsChild(brick) === 0) {
															 console.log("Plug", brick, "under", self.brick);
															 if(preso.parent) preso.parent.removeChild( preso );
															 brick.unPlugPresentation( preso );
															 self.brick.appendChild( brick );
															 var preso2 = self.getPresoBrickFromDescendant( brick );
															 if(preso2 !== preso) {
																 console.log("Ca sent le déplacement...");
																}
															 brick.configPresoHavingParentBrick	( self.brick
																								, function() {
																									 this.x = objData.x;
																									 this.y = objData.y;
																									 this.w = objData.w;
																									 this.h = objData.h;
																									 this.class = objData.class;
																									 this.color = objData.color;
																									 this.forceRender();
																									}
																								 );
															} else	{console.error("Ca sent la vue multiple...");
																	 self.brick.appendChild(brick, preso);
																	}
														 /*console.log("List of parent brick for", brick);
														 for(var parent=0; parent<brick.parents.length; parent++) {
															 console.log("\t",parent,':',brick.parents[parent]);
															}*/
														 // preso.DropZone = true;
														 // preso.forceRender();
														}
									   } 
									 );
			}
			 PresoTilesAlxAppsGate.prototype.setEdited = function(edited) {
				 this.edited = edited;
				 if(this.root) {
					 if(edited) this.root.classList.add   ('selected');
					       else this.root.classList.remove('selected');
					}
				}
			 PresoTilesAlxAppsGate.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGate.prototype.primitivePlug = function(c) {
				 var P = this.Render()
				   , N = c.Render();
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
				 return {pixelsDensity:scale,pixelsRatio:{w:w,h:h}};
				}
			 PresoTilesAlxAppsGate.prototype.ComputeSemanticZoom = function(MT, L_CB/*L_toAppear, L_toDisappear*/) {
				var displayed = this.groot.style.display;
				this.groot.style.display = 'inherit';
				var scale = this.getChildrenContext(this.w, this.h, MT);
				scale = scale.pixelsDensity;
				// console.log(scale);
				if(this.adaptRender(scale,L_CB/*L_toAppear,L_toDisappear*/)) {
					// Recursing across semantic zoom structure
					for(var i=0;i<this.children.length;i++) {
						 this.children[i].ComputeSemanticZoom(MT, L_CB/*L_toAppear, L_toDisappear*/);
						}
					}
				 this.groot.style.display = displayed;
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
										{ pixelsRatio	: {w:this.w,h:this.h}
										, pixelsDensity	: scale }
										);
					 if(newPreso) {
						 this.isGoingToDisappear = true;
						 newPreso.x = this.x; newPreso.y = this.y
						 newPreso.w = this.w; newPreso.h = this.h;
						 newPreso.forceRender();
						 this.parent.appendChild( newPreso );
						 L_CB.push( function(v) {
										 self.CB_Fade(v,1,0,self.root);
										 newPreso.CB_Fade(v,0,1,newPreso.root);
										 if(v>=1) {
											 if(self.isDragging(self.root) != null) {
												 // console.log("Do not unplugged", self);
												 self.pushTileToUnplug( self );
												} else {//console.log("Unplug", self);
														self.brick.unPlugPresentation( self );
													   }
											}
										}
								  );
						} else {console.log("Alert, no other compatible presentations...");}
					}
				if(scale < this.scaleToDisplayChildren) {
					 if(this.display) {this.display = false;
									   L_CB.push( function(v) {if( self.svgFgRect.root.parentElement
																 ||self.svgFgRect.root.parentNode   ) PresoTilesAlxAppsGate.prototype.CB_Fade.apply(self, [v,0,1,self.svgFgRect.root]);
															   self.displayFgRect = true;
															   self.CB_Fade(v,1,0);} );
									   res = true;
									  } else {res = false;}
					} else 	{if(!this.display) {this.display = true;
												L_CB.push( function(v) {if( self.svgFgRect.root.parentElement
																		  ||self.svgFgRect.root.parentNode   ) PresoTilesAlxAppsGate.prototype.CB_Fade.apply(self, [v,1,0,self.svgFgRect.root]);
																		self.displayFgRect = false;
																		self.CB_Fade(v,0,1);} );
											   }
							 res = true;
							}
				 return res;
				}
			 PresoTilesAlxAppsGate.prototype.CB_Fade = function(dt, v0, v1, node) {
				 node = node || this.getInnerRoot();
				 if(v0 === 0 && dt === 0) {
					 node.style.display = 'inherit';
					}
				 node.style.opacity = Math.easeInOutQuad(dt, v0, v1-v0, 1);
				 if(v1 === 0 && dt >= 1) {
					 if(/*!this.display*/node.style.display !== 'none') node.style.display = 'none';
					}
				}
			 PresoTilesAlxAppsGate.prototype.deletePrimitives = function() {
				 // console.log("PresoTilesAlxAppsGate::deletePrimitives", this);
				 if(this.root) {
					 var parent;
					 if(typeof this.root.parentElement === 'undefined') {parent = this.root.parentNode;} else {parent = this.root.parentElement;}
					 if(parent) parent.removeChild(this.root); this.root  = null;
					 /* if(this.rect && this.rect.parentElement  ) this.rect.parentElement.removeChild  (this.rect)  ;  */this.rect  = null;
					 /* if(this.gPreso && this.gPreso.parentElement) this.gPreso.parentElement.removeChild(this.gPreso);*/this.gPreso= null;
					 /* if(this.groot && this.groot.parentElement ) this.groot.parentElement.removeChild (this.groot) ; */this.groot = null;
					 
					 if(this.DropZone)
						svgUtils.DD.removeDropZone( this.root );
					}
				}

			 // Return the reference to the PresoTilesAlxAppsGate constructor
			 return PresoTilesAlxAppsGate;
			}
	  );