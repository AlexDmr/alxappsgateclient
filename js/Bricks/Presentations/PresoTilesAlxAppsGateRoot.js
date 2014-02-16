define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		/*, "Bricks/Presentations/PresoBasicPalette"*/
		, "Bricks/Presentations/utils"
		, "utils/svg"
		]
	  , function( PresoTile
				/*, PresoBasicPalette*/
				, AlxUtils
				, DragManager
				) {
			 // Presentation
			 var PresoTilesAlxAppsGateRoot = function() {
				 this.x = 0; this.y = 0;
				 this.w = this.h = 12;
				 
				 // Touches for intertaction
				 this.L_touches = []; this.D_touchClick = {};
				 this.touchClickTimer = null;
				 this.msClick = 100; this.msDblClick = 250;
				 
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
									 var M1 = self.groot.parentNode.getCTM().inverse().multiply(self.groot.getCTM());
									 var r = e.target;
									 while(r && !r.classList.contains('TileRoot')) {r = r.parentNode;}
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
									 var M2 = r.getCTM().translate(dx-w/2,dy-h/2).inverse().multiply(self.groot.getCTM());
									 // var M2 = r.parentNode.getCTM().inverse().multiply(r.getCTM()).translate(dx-w/2,dy-h/2).inverse().multiply(self.groot.getCTM());
									 
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
				 // for(var i=0;i<this.UniversTiles.length;i++) {this.appendChild(this.UniversTiles[i]);}
				}
			 PresoTilesAlxAppsGateRoot.prototype.integrateBrick = function(brick) {
				 // console.log('PresoTilesAlxAppsGateRoot -> integrateBrick ->', brick.id);
				 // for(var i=0;i<this.UniversTiles.length;i++) {this.UniversTiles[i].integrateBrick(brick);}
				}
			 PresoTilesAlxAppsGateRoot.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGateRoot.prototype.processL_touches = function(ms) {
				 this.L_touches = this.L_touches.splice(this.L_touches.length-4,4);
				 if( this.L_touches.length === 4
				   &&this.L_touches[0].ms > (ms-this.msDblClick)
				   &&this.L_touches[0].evt === 1
				   &&this.L_touches[1].evt === 0
				   &&this.L_touches[2].evt === 1
				   &&this.L_touches[3].evt === 0
				   ) {var dx = 0, dy = 0
				      for(var i=1;i<4;i++) {
						 dx += this.L_touches[i].x - this.L_touches[i-1].x;
						 dy += this.L_touches[i].y - this.L_touches[i-1].y;
						}
					  if(Math.abs(dx) < 10 && Math.abs(dy) < 10) {
						 // console.log('DblClick', this.L_touches[0].target);
						 // Clean up the touchClick structure
						 delete this.D_touchClick[ this.L_touches[0].id ]
						 delete this.D_touchClick[ this.L_touches[1].id ]
						 
						 // Callback
						 // this.CB_clic( {target: this.L_touches[0].target} );
						 var evt = new MouseEvent('dblclick');
						 evt.initMouseEvent('dblclick', true, true);
						 var ptr = this.L_touches[3];
						 evt.clientX = ptr.clientX; evt.clientY = ptr.clientY;
						 ptr.target.dispatchEvent(evt);
						}
					 }
				}
			 PresoTilesAlxAppsGateRoot.prototype.processClick = function() {
				 var ms = Date.now(), D = {}, ptr;
				 for(var i in this.D_touchClick) {
					 ptr = this.D_touchClick[i];
					 if(ptr.click) {
						 var evt = new MouseEvent('click');
						 evt.initMouseEvent('click', true, true);
						 evt.clientX = ptr.clientX; evt.clientY = ptr.clientY;
						 ptr.target.dispatchEvent(evt);
						} else {if(ptr.ms > ms-this.msDblClick) {D[i] = this.D_touchClick[i];}
							   }
					}
				 this.D_touchClick = D;
				}
			 PresoTilesAlxAppsGateRoot.prototype.touchend	= function(e) {
				 var ms  = Date.now(), ptr;
				 // Manage click
				 for(var i=0; i<e.changedTouches.length; i++) {
					 ptr = e.changedTouches.item(i);
					 if(  this.D_touchClick[ ptr.identifier ]
					   && Math.abs(this.D_touchClick[ ptr.identifier ].x - ptr.clientX) < 5
					   && Math.abs(this.D_touchClick[ ptr.identifier ].y - ptr.clientY) < 5
					   && this.D_touchClick[ ptr.identifier ].ms > ms-this.msClick
					   ) {this.D_touchClick[ ptr.identifier ].click = true;}
					}
				 // Manage double click
				 if(e.touches.length === 0) {
					 ptr = e.changedTouches.item(0);
					 var obj = {ms:ms,evt:0,id:ptr.identifier,x:ptr.clientX,y:ptr.clientY,target:ptr.target};
					 this.L_touches.push(obj);
					 // console.log( this.L_touches );
					 this.processL_touches(ms);
					}
				}
			 PresoTilesAlxAppsGateRoot.prototype.touchstart = function(e) {
				 // console.log( e.touches );
				 var self = this, ptr, ms  = Date.now()
				   , timer = setTimeout(function() {self.processClick();}, 10+this.msDblClick);
				 for(var i=0; i<e.changedTouches.length; i++) {
					 ptr = e.changedTouches.item(i);
					 this.D_touchClick[ ptr.identifier ] = {target:ptr.target,id:ptr.identifier,x:ptr.clientX,y:ptr.clientY,ms:ms,timer:timer}
					}
				 if(this.touchClickTimer) {clearTimeout(this.touchClickTimer); this.touchClickTimer = null;}
				 
				 if(e.touches.length === 1) {
					 ptr = e.touches.item(0);
					 var obj = {ms:ms,evt:1,id:ptr.identifier,x:ptr.clientX,y:ptr.clientY,target:e.touches.item(0).target};
					 this.L_touches.push(obj);
					 // console.log( this.L_touches );
					}
				}
			 PresoTilesAlxAppsGateRoot.prototype.primitivePlug = function(c) {
				 var P = this.Render()
				   , N = c.Render();
				 if(c.brick === this.brick.palette) {
					 this.pipoRoot.appendChild( N )
					} else {this.groot.appendChild( N );}
				}
			 PresoTilesAlxAppsGateRoot.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 this.root  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						this.root.classList.add('TileRoot');
						this.root.TileRoot = this;
						this.idMatrix = this.root.createSVGMatrix();
						this.root.setAttributeNS('http://www.w3.org/2000/svg', 'xlink' , 'http://www.w3.org/1999/xlink');
						// this.root.setAttribute('width' , '1000');
						// this.root.setAttribute('height', '500');
						// this.root.setAttribute('viewBox', '0 0 1000 500');

					 this.pipoRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
					 this.groot = document.createElementNS("http://www.w3.org/2000/svg", "g");
						this.groot.classList.add('rootInternal');
					 
					 //this.root.appendChild(this.groot);
					 this.pipoRoot.appendChild(this.groot);
					 this.root.appendChild(this.pipoRoot);
					 var scale = window.innerWidth / 1000;
					 this.pipoRoot.setAttribute('transform', 'scale('+scale+','+scale+')');
					 
					 // Plug the palette under the pipoRoot node
					 
					 
					 /*this.palette.init();
						 var pRoot = this.palette.Render();
						 this.pipoRoot.appendChild( pRoot );
						 pRoot.setAttribute( 'transform'
										   , 'translate('+ (1000  - this.getTileSize()*this.palette.w/2) + 
													  ','+ (- this.getTileSize()*this.palette.h/2) +
													  ')');
					 */
					 
					 // Plug the universes
					 var svg = this.root;
					 this.svg_point = svg.createSVGPoint();
					 this.set_svg_point( this.svg_point );
					 // this.mapTile.set_svg_point( this.svg_point );
					 
					 svg.addEventListener('dblclick', this.CB_clic, false);
					 window.requestAnimFrame( function() {self.CB_clic( {target: svg} );} );
					 
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
					 
					// Manage D&D 
					 this.root.addEventListener	( 'touchstart', function(e) {self.touchstart(e)}, false);
					 this.root.addEventListener	( 'touchend'  , function(e) {self.touchend(e);} , false);
					 console.log("Avoid dragging", this.getPresoBrickFromDescendant( this.brick.palette ).Render());
					 DragManager.addDraggable( this.groot
											 , { eventNode	: this.root
											   , pathNodes	: [ { node : this.getPresoBrickFromDescendant( this.brick.palette ).Render()
																, goThrough : false } ]
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
			 // Return the reference to the PresoTilesAlxAppsGateRoot constructor
			 return PresoTilesAlxAppsGateRoot;
			}
	  );
