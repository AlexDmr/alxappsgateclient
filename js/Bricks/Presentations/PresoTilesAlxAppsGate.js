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
				 // console.log("PresoTilesAlxAppsGate Init");
				 if(brick && brick.tile) {
					 // console.log("Affecting data", this);
					 this.x		= brick.tile.x;
					 this.y		= brick.tile.y;
					 this.w		= brick.tile.w;
					 this.h		= brick.tile.h;
					 this.color	= brick.tile.color;
					} else {this.x		= this.y = 0;
							this.w		= this.h = 12;
							this.color	= 'cyan';}
				 this.innerMagnitude = 12;
				 this.display = true;
				 this.scaleToDisplayChildren = 0.5;
				 this.validity = { pixelsMinDensity : 0
								 , pixelsMaxDensity : 999999999
								 , pixelsRatio		 : this.w / this.h };
				 if(this.root) this.forceRender();
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
				 for(var j=H;j>=-H;j--) { 	// Line
					 for(var i=W;i>=-W;i--) {// Column
						 // coords : <x-i;y-j>
						 // Intersection with a child?
						 intersect = false;
						 for(var c=0;c<this.children.length;c++) {
							 child = this.children[c];
							 if( svgUtils.intersectionRect	( child.x, child.y, child.x+child.w, child.y+child.h
															, x-i    , y-j    , x-i+w          , y-j+h              )
							   && x-i >= 0 && x-i+w <= Math.floor(this.innerMagnitude*this.w/Math.max(this.w,this.h))
						       && y-j >= 0 && y-j+h <= Math.floor(this.innerMagnitude*this.h/Math.max(this.w,this.h))
							   ) {
								  intersect = true;
								  break;
								 }
							}
						 if(  !intersect 
						   && x-i >= 0 && x-i+w <= Math.floor(this.innerMagnitude*this.w/Math.max(this.w,this.h))
						   && y-j >= 0 && y-j+h <= Math.floor(this.innerMagnitude*this.h/Math.max(this.w,this.h))
						   ) {return {x:x-i,y:y-j};}
						}
					}
				 console.log("No space");
				 return null;
				}
			 PresoTilesAlxAppsGate.prototype.appendChild = function(c) {
				 Presentation.prototype.appendChild.apply(this, [c]);
				 if(this.svgG) this.svgG.appendChild( this.svgFgRect );
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
			 PresoTilesAlxAppsGate.prototype.Render = function() {
				 var self = this;
				 if(!this.root) {
					 this.svgG = new svgGroup( {class: (this.brick&&this.brick.tile)?this.brick.tile.class:''}
											 ).translate(this.x*size, this.y*(11+size));
					 var g = this.svgG.getRoot();
					 var scale = (Math.max(this.w,this.h)-2*dt)/this.innerMagnitude
					   , titleHeight;
					 if(!(this.brick.tile && this.brick.tile.brickId)) {titleHeight = 11;} else {titleHeight = 0;}
					 this.svgGR = new svgGroup( {class : 'rootInternal'} ).translate(dt*size, titleHeight+dt*size).scale(scale,scale);
					 var gr = this.svgGR.getRoot();
					 this.svgGPreso = new svgGroup( {class: 'bgPreso'} );
					 this.gPreso = this.svgGPreso.getRoot();
					 this.x = this.x || 1;
					 this.x = this.y || 1;
					 this.w = this.w || 1;
					 this.h = this.h || 1;
					 this.svgBgRect = new svgRect( { x:0.5*dt*size, y:0.5*dt*size, rx:6, ry:6
												   , width:size*(this.w-dt), height:(titleHeight+size)*(this.h-dt)
												   , class:'tile' } );
					 this.svgFgRect = new svgRect( { x:1.5*dt*size, y:titleHeight+1.5*dt*size
												   , width:size*(this.w-3*dt), height:(titleHeight+size)*(this.h-0.5-dt)
												   , class:'fgRect' } );
					 var r = this.svgBgRect.getRoot();
					/* XXX OLD STYLE
					 var g  = document.createElementNS("http://www.w3.org/2000/svg", 'g');
						 g.setAttribute('class', (this.brick&&this.brick.tile)?this.brick.tile.class:'');
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
					 this.gPreso.classList.add('bgPreso');
					 var r  = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
						 r.setAttribute('x', 0.5*dt*size)          ; r.setAttribute('y', 0.5*dt*size);
						 r.setAttribute('rx', 6)          ; r.setAttribute('ry', 6);
						 r.setAttribute('width' , size*(this.w-dt)); r.setAttribute('height', size*(this.h-dt));
						 r.classList.add('tile');
						 // r.style.fill = this.color; r.style.stroke = "black";
						 this.bgRect = r;
					 */
					 this.gPreso.appendChild(r); g.appendChild(this.gPreso); g.appendChild(gr);
					 if(!(this.brick.tile && this.brick.tile.brickId)) {
						 this.svgName = new svgText({class:'title'}).translate(3,titleHeight).set( this.brick?this.brick.getName():'' );
						 this.svgGPreso.appendChild( this.svgName );
						 if(this.children.length) this.svgG.appendChild( this.svgFgRect );
						}
					 this.rect = this.bgRect = r;
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
					 if(this.DropZone)
					 svgUtils.DD.DropZone( this.root //this.bgRect
										 , { tags		: ['brick']
										   , enter		: function(evt) {
															 //self.displayGrid(true );
															 self.bgRect.classList.add('selected');
															 var brick = evt.config.brick
															   , preso = evt.config.presentation;
															 // Plug the brick
															 // if(self.brick !== brick)
															 if(self.brick !== brick && self.brick.ancestors().indexOf(brick) === -1) {
																 self.appendChild( preso );
																 svg_point.x = evt.xCanvas; svg_point.y = evt.yCanvas;
																 svg_point = svg_point.matrixTransform( self.groot.getCTM().inverse() );
																 preso.w = evt.config.size.w;
																 preso.h = evt.config.size.h;
																 var coords = self.getFreeSpaceCoordsFor( Math.floor(svg_point.x/self.getTileSize())
																										, Math.floor(svg_point.y/self.getTileSize())
																										, preso.w
																										, preso.h );
																 // console.log( svg_point, coords );
																 preso.DropZone = false;
																 if(coords) {
																	 preso.x = coords.x;
																	 preso.y = coords.y;
																	 preso.forceRender();
																	} else {preso.Render().style.display = 'none';}
																}
															}
										   , leave		: function(evt) {
															 // self.displayGrid(false);
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
																									, Math.floor(svg_point.y/(11+self.getTileSize()))
																									, preso.w
																									, preso.h );
															 preso.x = X; preso.y = Y;
															 if(!coords) {console.log("No place...");}
															 if(  coords 
															   && ( preso.x !== coords.x || preso.y !== coords.y) ) {
																 preso.x = coords.x;
																 preso.y = coords.y;
																 preso.Render().style.display = 'inherit';
																 preso.Render().setAttribute ( 'transform'
																							 , 'translate(' + preso.x*size
																									 + ', ' + preso.y*(11+size) + ')' 
																							 );
																}
															}
										   , drop		: function(evt) {
															 var brick = evt.config.brick
															   , preso = evt.config.presentation;
															 self.bgRect.classList.remove('selected');
															 preso.AlxGrosDebug = true;
															 brick.tile = { x : preso.x, y : preso.y
																		  , w : preso.w, h : preso.h
																		  , color : preso.color};
															 if(self.brick.children.indexOf(brick) === -1) {
																 console.log("Plug", brick, "under", self.brick);
																 if(preso.parent) preso.parent.removeChild( preso );
																 brick.unPlugPresentation( preso );
																 self.brick.appendChild( brick );
																 preso = self.getPresoBrickFromDescendant( brick );
																} else	{
																		}
															 // preso.DropZone = true;
															 // preso.forceRender();
															}
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
									   L_CB.push( function(v) {if(self.svgFgRect.root.parentNode) PresoTilesAlxAppsGate.prototype.CB_Fade.apply(self, [v,0,1,self.svgFgRect.root]);
															   self.CB_Fade(v,1,0);} );
									   res = true;
									  } else {res = false;}
					} else 	{if(!this.display) {this.display = true;
												L_CB.push( function(v) {if(self.svgFgRect.root.parentNode) PresoTilesAlxAppsGate.prototype.CB_Fade.apply(self, [v,1,0,self.svgFgRect.root]);
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
					 if(this.root.parentNode  ) this.root.parentNode.removeChild  (this.root)  ;this.root  = null;
					 if(this.rect && this.rect.parentNode  ) this.rect.parentNode.removeChild  (this.rect)  ;this.rect  = null;
					 if(this.gPreso && this.gPreso.parentNode) this.gPreso.parentNode.removeChild(this.gPreso);this.gPreso= null;
					 if(this.groot && this.groot.parentNode ) this.groot.parentNode.removeChild (this.groot) ;this.groot = null;
					 
					 if(this.DropZone)
						svgUtils.DD.removeDropZone( this.root );
					}
				}

			 // Return the reference to the PresoTilesAlxAppsGate constructor
			 return PresoTilesAlxAppsGate;
			}
	  );