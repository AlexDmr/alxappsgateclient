define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		/*, "Bricks/Presentations/PresoBasicPalette"*/
		, "Bricks/Presentations/utils"
		, "utils/svg"
		, "utils/svgUtils"
		, "utils/svgAlx"
		, "utils/svgText"
		]
	  , function( PresoTile
				/*, PresoBasicPalette*/
				, AlxUtils
				, DragManager
				, svgUtils, svgAlx, svgText
				) {
			 // Presentation
			 var PresoTilesAlxAppsGateRoot = function() {
				 this.x = 0; this.y = 0;
				 this.w = this.h = 24;
				 
				 // Touches for intertaction
				 // this.L_touches = []; this.D_touchClick = {};
				 this.L_pointers = []
				 // this.touchClickTimer = null;
				 this.msClick = 130; this.msDblClick = 300;
				 this.msLongPress = 600;
				 this.A_longPress = {};
				 
				 // Palette
				 // this.palette = new PresoBasicPalette();
				 
				 /*/ Universe
				 this.UniversTiles = [];
				 this.mapTile  = new PresoBasicUniversMap (); this.UniversTiles.push(this.mapTile);
				 this.typeTile = new PresoBasicUniversType(); this.UniversTiles.push(this.typeTile);
				 for(var i=0;i<this.UniversTiles.length;i++) {this.UniversTiles[i].init(null,[]);}
				 */
				 // Interaction
				 var self = this;
				 this.CB_clic = function(e) {
									 var s = window.getComputedStyle(self.root)
									 var w = 1000 //window.innerWidth  //parseFloat(s.width)
									   , h = window.innerHeight * 1000 / window.innerWidth //parseFloat(s.height);
									 // console.log("Inner magnitude :", w, ";", h);
									 
									 // Mire
									 if(false && !self.lineW) {
										 self.lineW = document.createElementNS("http://www.w3.org/2000/svg", "line");
											 self.lineW.setAttribute('x1', w/2); self.lineW.setAttribute('x2', w/2);
											 self.lineW.setAttribute('y1', 0  ); self.lineW.setAttribute('y2', h);
											 self.lineW.setAttribute('style', "stroke:rgb(255,0,0);stroke-width:1");
											 self.root.appendChild(self.lineW);
										 self.lineH = document.createElementNS("http://www.w3.org/2000/svg", "line");
											 self.lineH.setAttribute('x1', 0  ); self.lineH.setAttribute('x2', w);
											 self.lineH.setAttribute('y1', h/2); self.lineH.setAttribute('y2', h/2);
											 self.lineH.setAttribute('style', "stroke:rgb(255,0,0);stroke-width:1");
											 self.root.appendChild(self.lineH);
										 // <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
										}
									 
									 // console.log("Click!", e);
									 var M1 = (self.groot.parentElement || self.groot.parentNode).getCTM().inverse().multiply(self.groot.getCTM());
									 var r = e.target;
									 while(r && !r.classList.contains('TileRoot')) {r = r.parentElement || r.parentNode;}
									 var bbox = r.TileRoot.getPresoCoords();
									 // console.log( bbox );
									 self.svg_point.x = (bbox.x2-bbox.x1)/2;
									 self.svg_point.y = (bbox.y2-bbox.y1)/2;
									 self.svg_point = self.svg_point.matrixTransform(self.groot.getCTM());
									 var dx = self.svg_point.x, dy = self.svg_point.y;
									 dx = dy = self.getTileSize()*6;
									 
									 r = r.TileRoot.getInnerRoot();
									 
									 // var M2 = r.getCTM().inverse().multiply(M1);
									 // var M2 = r.getCTM().translate(dx-w/2,dy-h/2).inverse().multiply(M1);
									 var displayed = r.style.display;
									 r.style.display = 'inherit';
									 var M2 = r.getCTM().translate(dx-w/2,dy-h/2).inverse().multiply(self.groot.getCTM());
									 r.style.display = displayed;
									 // var M2 = r.parentElement.getCTM().inverse().multiply(r.getCTM()).translate(dx-w/2,dy-h/2).inverse().multiply(self.groot.getCTM());
									 
									 var ms = Date.now(); //(new Date()).getTime();
									 window.requestAnimFrame( function(time) {
										var L_CB = [];
										self.ComputeSemanticZoom( M1.inverse().multiply(M2)
																, L_CB );
										for(var i=0;i<L_CB.length;i++) {L_CB[i](0);} // Start
										self.CB_zoom(ms, ms+1000, M1, M2, self.groot, L_CB);
										});
									}
				}
				
			 PresoTilesAlxAppsGateRoot.prototype = new PresoTile();
			 PresoTilesAlxAppsGateRoot.prototype.getSvgCanvas = function() {return this.root;}
			 // PresoTilesAlxAppsGateRoot.prototype.initPresoTile = PresoTilesAlxAppsGateRoot.prototype.init;
			 PresoTilesAlxAppsGateRoot.prototype.init = function(brick, children) {
				 PresoTile.prototype.init.apply(this,[brick, children]); //this.initPresoTile(brick, children);
				 this.w = this.h = 24;
				 // for(var i=0;i<this.UniversTiles.length;i++) {this.appendChild(this.UniversTiles[i]);}
				}
			 PresoTilesAlxAppsGateRoot.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGateRoot.prototype.mouseup    = function(e) {
				 e.identifier = 'mouse';
				 this.pointerUp( e );
				}
			 PresoTilesAlxAppsGateRoot.prototype.mousedown  = function(e) {
				 e.identifier = 'mouse';
				 this.pointerDown( e );
				}
			 PresoTilesAlxAppsGateRoot.prototype.touchend	= function(e) {
				 if(e.touches.length) return;
				 this.pointerUp( e.changedTouches.item(0) );
				}
			 PresoTilesAlxAppsGateRoot.prototype.touchstart = function(e) {
				 if(e.touches.length > 1) {return}
				 this.pointerDown( e.changedTouches.item(0) );
				}
			 PresoTilesAlxAppsGateRoot.prototype.pointerUp   = function(e) {
				 if(this.L_pointers.length) { // Pour toujours avoir un down avant...
					 var self  = this, ms = Date.now()
					   , log   = {state:0,target:e.target,id:e.identifier,x:e.clientX,y:e.clientY,ms:ms};
					 this.L_pointers.push( log );
					 if(this.L_pointers.length >= 4) {/*console.log('direct'); */this.processPointersLog();}
					}
				}
			 PresoTilesAlxAppsGateRoot.prototype.pointerDown = function(e) {
				 var self  = this, ms  = Date.now()
				   , timer = setTimeout(function() {/*console.log('timeout'); */self.processPointersLog();}, 10+this.msDblClick)
				   , log   = {state:1,target:e.target,id:e.identifier,x:e.clientX,y:e.clientY,ms:ms,timer:timer};
				 this.L_pointers.push( log );
				}
			 PresoTilesAlxAppsGateRoot.prototype.processPointersLog = function() {
				 var ms = Date.now();
				 // Go through pointers and trigger click, dblclick or just remove the logs
				 if(this.L_pointers.length >= 2 && (this.L_pointers.length >= 4 || this.L_pointers[0].ms <= ms - this.msDblClick)) {
					 // Do we have a click ?
					 // console.log("\tclick?");
					 var dx = Math.abs(this.L_pointers[1].x - this.L_pointers[0].x)
					   , dy = Math.abs(this.L_pointers[1].y - this.L_pointers[0].y)
					   , ds = this.L_pointers[1].ms - this.L_pointers[0].ms ;
					 if(dx < 5 && dy < 5 && ds < this.msClick) {
						 // We can trigger a click, but do we have to trigger a dblclick ?
						 var triggerDblClick = false;
						 // console.log("\tdblclick?");
						 if(this.L_pointers.length >= 4) {
							 dx += Math.abs(this.L_pointers[2].x - this.L_pointers[1].x) + Math.abs(this.L_pointers[3].x - this.L_pointers[2].x);
							 dy += Math.abs(this.L_pointers[2].y - this.L_pointers[1].y) + Math.abs(this.L_pointers[3].y - this.L_pointers[2].y);
							 ds  = this.L_pointers[3].ms - this.L_pointers[2].ms;
							 if(dx < 15 && dy < 15 && ds < this.msClick) {
								 // Trigger a dblclick
								 triggerDblClick = true;
								 var evt
							       , ptr = this.L_pointers[0];
								 try {evt = new MouseEvent('dblclick')
									 } catch(err) {evt = document.createEvent('MouseEvent');}
								 evt.initMouseEvent	( 'dblclick', true, true, window, 0
													, ptr.clientX, ptr.clientY
													, ptr.clientX, ptr.clientY
													, false, false, false, false // Ctrl, Alt, Shift, MetaKey
													, 0, null // button, related target
													);
								 // evt.clientX = ptr.clientX; evt.clientY = ptr.clientY;
								 evt.AlxGenerated = true;
								 // console.log('Generate dblclick');
								 ptr.target.dispatchEvent(evt);
								 this.L_pointers[0].ms -= this.msDblClick;	// To make sure that it will be erased
								 this.L_pointers[2].ms -= this.msDblClick;	// To make sure that it will be erased
								}
							}
						 if(!triggerDblClick) {
							 var evt
							   , ptr = this.L_pointers[0];
							 try {evt = new MouseEvent('click');
								 } catch(err) {evt = document.createEvent('MouseEvent');
											  }
							 evt.initMouseEvent	( 'click', true, true, window, 0
												, ptr.clientX, ptr.clientY
												, ptr.clientX, ptr.clientY
												, false, false, false, false // Ctrl, Alt, Shift, MetaKey
												, 0, null // button, related target
												);
							 // evt.clientX = ptr.clientX; evt.clientY = ptr.clientY;
							 evt.AlxGenerated = true;
							 // console.log('Generate click');
							 ptr.target.dispatchEvent(evt);
							 ptr.ms -= this.msDblClick;	// To make sure that it will be erased
							}
						}
					}
				 
				 // Remove old pointers event by pair (Down and Up)
				 while( this.L_pointers.length
				      &&( this.L_pointers[0].ms < ms - this.msDblClick 
					    ||this.L_pointers[0].state === 0
						)
					  ) {var L = this.L_pointers.splice(0,1);
						 if(L[0].timer) {clearTimeout(L[0].timer);}
						}
				}
			 PresoTilesAlxAppsGateRoot.prototype.primitivePlug = function(c) {
				 var P = this.Render()
				   , N = c.Render();
				 if(c.brick === this.brick.palette) {
					 this.pipoRoot.appendChild( N )
					} else {this.groot.appendChild( N );}
				}
			 PresoTilesAlxAppsGateRoot.prototype.initSemanticZoom = function() {
				 var self = this;
				 window.requestAnimFrame( function() {self.CB_clic( {target: self.root} );} );			 
				}
			 PresoTilesAlxAppsGateRoot.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 this.root  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						svgAlx.prototype.init( this.root );
						this.root.classList.add('TileRoot');
						this.root.TileRoot = this;
						this.idMatrix = this.root.createSVGMatrix();
						this.root.setAttributeNS('http://www.w3.org/2000/svg', 'xlink' , 'http://www.w3.org/1999/xlink');

					 // Filter
					 var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
					 filter.setAttribute('id', 'dropShadow');
						var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
							feGaussianBlur.setAttribute('in', "SourceAlpha");
							feGaussianBlur.setAttribute('stdDeviation', "2");
							filter.appendChild( feGaussianBlur );
						var feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
							feOffset.setAttribute('dx', 5); feOffset.setAttribute('dy', 5); feOffset.setAttribute('result', 'offsetblur');
							filter.appendChild( feOffset );
						var feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
							feFlood.setAttribute('flood-color', 'black'/*'offsetblur'*/);
							filter.appendChild( feFlood );
						var feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
							feComposite.setAttribute('in2', 'offsetblur'); feComposite.setAttribute('operator', 'in');
							filter.appendChild( feComposite );
						var feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
							filter.appendChild( feMerge );
							var feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
							feMerge.appendChild( feMergeNode1 );
							var feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
							feMergeNode2.setAttribute('in', 'SourceGraphic');
							feMerge.appendChild( feMergeNode2 );
						this.root.appendChild( filter );
					 
					 // Scene graph
					 this.pipoRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
					 this.groot = document.createElementNS("http://www.w3.org/2000/svg", "g");
						this.groot.classList.add('rootInternal');
					 
					 //this.root.appendChild(this.groot);
					 this.pipoRoot.appendChild(this.groot);
					 this.root.appendChild(this.pipoRoot);
					 var scale = window.innerWidth / 1000;
					 this.pipoRoot.setAttribute('transform', 'scale('+scale+','+scale+')');
					 
					 // Init some SVG...
					 var svg = this.root;
					 this.svg_point = svg.createSVGPoint();
					 this.set_svg_point( this.svg_point );
					 
					 svg.addEventListener('dblclick', this.CB_clic, false);
					 
					 // DragManager
					 DragManager.init(this.root);
					 DragManager.Subscribe_AddPtr( 'AlxClient'
												 , function(id, node, target) {
													 // console.log('Adding a pointer', id);
													 self.pushDragged( {id:id,target:target} );
													}
												 );
					 DragManager.Subscribe_SubPtr( 'AlxClient'
												 , function(id, target) {
													 // console.log('Removing a pointer', id);
													 self.removeDragged(id);
													 self.UnplugTilesNoMoreDragged(id);
													}
												 );
												 
					// Render children
					 this.appendDescendants();
					 
					// Manage the long press event
					 this.root.addEventListener( 'longPress' , function(e) {
																 var node = e.target;
																 // console.log('longPress on', node);
																 while(node && !node.TileRoot) {
																	 // console.log(node, node.parentElement);
																	 node = node.parentElement || node.parentNode;
																	}
																 // console.log("\tnode <-", node);
																 if(node) {// Edit node
																	 var tile   = node.TileRoot
																	   , config = self.editTile( tile, e.clientX, e.clientY );
																	 // Stop drag of the scene
																	 DragManager.stopDragNode(self.groot);
																	 // Generate mousedown or touchstart event to start dragging the tile
																	 if(e.identifier === 'mouse') {
																		 var evt;
																		 try {evt = new MouseEvent('mousedown')
																			 } catch(err) {evt = document.createEvent('MouseEvent');}
																		 evt.initMouseEvent	( 'mousedown', true, true, window, 0
																						, e.clientX, e.clientY
																						, e.clientX, e.clientY
																						, false, false, false, false // Ctrl, Alt, Shift, MetaKey
																						, 0, null // button, related target																						
																						);
																		 evt.target = tile.root;
																		 tile.root.dispatchEvent(evt);
																		} else  {console.log('Have to generate a touchstart event with id', e.identifier);
																				 // document.addEventListener('touchmove', function(e) {console.log(e);}, false);
																				 var pipoEvt =	{ target		 : tile.root
																								, preventDefault : function() {}
																								, stopPropagation: function() {}
																								, changedTouches : {
																									  L		: [{ target:tile.root
																											   , clientX : e.clientX
																											   , clientY : e.clientY
																											   , pageX	 : e.clientX
																											   , pageY	 : e.clientY
																											   , identifier	: e.identifier
																											   } ]
																									, length: 1
																									, item	: function(i) {return this.L[i];}
																									}
																								}
																				 config.touchstart( pipoEvt );
																				}
																	}
																}
															 , false);
					 this.root.addEventListener( 'mousedown' , function(e) {self.longPressStart('mouse',e.clientX,e.clientY,e.target);}, false);
					 this.root.addEventListener( 'mousemove' , function(e) {self.longPressMove('mouse',e.clientX,e.clientY);}, false);
					 this.root.addEventListener( 'mouseup'   , function(e) {self.longPressStop('mouse');}, false);
					 this.root.addEventListener( 'touchstart', function(e) {for(var i=0; i<e.changedTouches.length; i++) {
																				var ptr = e.changedTouches.item(i);
																				self.longPressStart(ptr.identifier, ptr.clientX, ptr.clientY, ptr.target); }
																		   }, false);
					 this.root.addEventListener( 'touchmove' , function(e) {for(var i=0; i<e.changedTouches.length; i++) {
																				var ptr = e.changedTouches.item(i);
																				self.longPressMove(ptr.identifier, ptr.clientX, ptr.clientY); }
																		   }, false);
					 this.root.addEventListener( 'touchend'  , function(e) {for(var i=0; i<e.changedTouches.length; i++) {
																				var ptr = e.changedTouches.item(i);
																				self.longPressStop(ptr.identifier); }
																		   }, false);
					
					// Manage user interaction
					 this.root.addEventListener	( 'touchstart', function(e) {self.touchstart(e)}, false);
					 this.root.addEventListener	( 'touchend'  , function(e) {self.touchend(e);} , false);
					 this.root.addEventListener	( 'mousedown' , function(e) {self.mousedown(e)}, false);
					 this.root.addEventListener	( 'mouseup'   , function(e) {self.mouseup(e);} , false);
					 
					// Manage D&D 
					 DragManager.addDraggable( this.groot
											 , { eventNode	: this.root
											   , pathNodes	: [ { node : this.getPresoBrickFromDescendant( this.brick.palette ).Render()
																, goThrough : false } ]
											   , inter2pt	: 'OrthoZoom'
											   , CB_zoom	: function() {
													 var L_CB = [];
													 self.ComputeSemanticZoom( self.idMatrix, L_CB);
													 if(L_CB.length)
													 AlxUtils.animate( 300
																	 , function(pos) {
																		 for(var i=0;i<L_CB.length;i++) {
																			try {
																				L_CB[i](pos.dt);
																				} catch(e) {alert('error on CB : ' + e);}
																			}
																		}
																	 );
													}
											   }
											 );
											 
					 // Debug log for user events
					 document.addEventListener('click'   , function(e) {if(!e.AlxGenerated) {e.stopPropagation();e.preventDefault();/*console.log("System click intercepted !");*/}}, true);
					 document.addEventListener('dblclick', function(e) {if(!e.AlxGenerated) {e.stopPropagation();e.preventDefault();/*console.log("System dblclick intercepted !");*/}}, true);
					 // document.addEventListener('click'   , function(e) {console.log('click'   , e);}, false);
					 // document.addEventListener('dblclick', function(e) {console.log('dblclick', e);}, false);
					}
				 return this.root;
				}
			 PresoTilesAlxAppsGateRoot.prototype.CB_zoom = function(ms1,ms2,M1,M2,node,L_CB) {
				var self = this;
				var ms = Date.now();
				if(ms < ms2) {
					 window.requestAnimFrame( function(time) {self.CB_zoom(ms1,ms2,M1,M2,node,L_CB/*L_toAppear,L_toDisappear*/);}
											);
					} else {ms=ms2;}
				var v = (ms-ms1)/(ms2-ms1);
				for(var i=0;i<L_CB.length;i++) {L_CB[i](v);} // Start
				node.setAttribute( 'transform'
								 , 'matrix(' + Math.easeInOutQuad(ms-ms1,M1.a,M2.a-M1.a,ms2-ms1) //(M1.a+(M2.a-M1.a)*dt)
									   + ',' + Math.easeInOutQuad(ms-ms1,M1.b,M2.b-M1.b,ms2-ms1) //(M1.b+(M2.b-M1.b)*dt)
									   + ',' + Math.easeInOutQuad(ms-ms1,M1.c,M2.c-M1.c,ms2-ms1) //(M1.c+(M2.c-M1.c)*dt)
									   + ',' + Math.easeInOutQuad(ms-ms1,M1.d,M2.d-M1.d,ms2-ms1) //(M1.d+(M2.d-M1.d)*dt)
									   + ',' + Math.easeInOutQuad(ms-ms1,M1.e,M2.e-M1.e,ms2-ms1) //(M1.e+(M2.e-M1.e)*dt)
									   + ',' + Math.easeInOutQuad(ms-ms1,M1.f,M2.f-M1.f,ms2-ms1) //(M1.f+(M2.f-M1.f)*dt)
									   + ')'
								 );
				}
			 
			 // Long press
			 PresoTilesAlxAppsGateRoot.prototype.longPressStart = function(id, x, y, target) {
				 var self = this;
				 timeout = setTimeout( function() {var evt;
												   try {evt = new MouseEvent('longPress')
													   } catch(err) {evt = document.createEvent('MouseEvent');}
												   evt.initMouseEvent( 'longPress', true, true, window, 0
																	, x, y
																	, x, y
																	, false, false, false, false // Ctrl, Alt, Shift, MetaKey
																	, 0, null // button, related target
																	);
												   /*evt = new MouseEvent('longPress');
												   evt.initMouseEvent( 'longPress'
																	 , true		// Bubbling
																	 , true		// Cancelable
																	 , window	// view
																	 , 0		// detail
																	 , x		// screenX
																	 , y		// screenY
																	 , x		// clientX
																	 , y		// clientY
																	 );*/
												   // evt.clientX = x; evt.clientY = y;
												   evt.identifier = id; evt.target = target;
												   target.dispatchEvent(evt);
												   self.longPressStop(id, x, y);
												  }
									 , this.msLongPress);
				 this.A_longPress[id] = {x:x,y:y,timeout:timeout};
				}
			 PresoTilesAlxAppsGateRoot.prototype.longPressMove = function(id, x, y) {
				 if( this.A_longPress[id] ) {
					 var P  = this.A_longPress[id]
					   , dx = x - P.x
					   , dy = y - P.y
					   , d2 = dx*dx+dy*dy;
					 if(d2 > 30) {
						 clearTimeout(P.timeout);
						 delete this.A_longPress[id];
						}
					}
				}
			 PresoTilesAlxAppsGateRoot.prototype.longPressStop = function(id) {
				 if( this.A_longPress[id] ) {clearTimeout(this.A_longPress[id].timeout);
											 delete this.A_longPress[id];}
				}
			 PresoTilesAlxAppsGateRoot.prototype.editTile = function(tile, x, y) {
				 console.log('Edit node', tile.brick.name, tile);
				 this.brick.editTile( tile );
				 tile.setEdited(true);
				// Turn the tile DragAndDroppable
				 var nodeFeedBack = new svgText({style:{textAnchor:'middle'}}).translate(x, y).set( tile.brick.name );
				 var svg = document.querySelector('svg');
				 svg.appendChild( nodeFeedBack.getRoot() );
				 var DropZone = tile.DropZone && tile.brick.isSpace;
				 if(DropZone) {tile.removeDropZone();}
				 
				 var config = 
				 svgUtils.DD.DragAndDroppable( tile.Render()
											 , { tags : ['brick']
											   , size : {w:tile.w,h:tile.h}
											   , nodeFeedBack : nodeFeedBack.getRoot()
											   , start: function(config) {
													 // Create a new Tile and register it so that it can be manipulated by drop zones
													 // console.log('svgUtils.DD.start');
													 config.brick 		 = tile.brick;
													 config.presentation = new tile.constructor();
													 config.presentation.copy( tile );
													 config.coords = { x : tile.x
																	 , y : tile.y };
													 tile.x = tile.y = 10000; // Put that away before removing it
													}
											   , end  : function(config) {
													 svgUtils.DD.removeDragAndDroppable(config.node);
													 if(DropZone) {
														 console.log('We activate the dropzone again for', config.presentation);
														 tile.addDropZone();
														}
													 // config.presentation.setEdited(false);
													 // console.log(config.brick);
													 // console.log(config.presentation);
													 
													 // Have to remove the brick from its original parent
													 // and take care to only remove the corresponding presentation
													 tile.x = config.presentation.x;
													 tile.y = config.presentation.y;
													 if(config.presentation.parent) {
														 config.presentation.parent.brick.removeChild(config.brick, config.presentation);
														}
													 config.brick.unPlugPresentation( config.presentation );
													 tile.forceRender();
													 
													 console.log("End", config);
													 if(config.tileUnder !== tile.parent) {
														 tile.parent.brick.removeChild(tile.brick, tile);
														 if(!config.tileUnder) {tile.brick.unPlugPresentation( tile );}
														}
													 /*
													 // Clean the original tile
													 
													 */
													 console.log("Presentations:", config.brick.presentations );
													}
											   }
											 );
				 svg.removeChild( nodeFeedBack.getRoot() );
				 delete nodeFeedBack;
				 return config;
				}
				
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoTilesAlxAppsGateRoot;
			}
	  );
