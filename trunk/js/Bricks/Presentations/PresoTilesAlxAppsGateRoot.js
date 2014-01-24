define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Presentations/PresoBasicUniversMap"
		, "Bricks/Presentations/PresoBasicUniversType"
		, "Bricks/Presentations/utils"
		, "utils/svg"
		]
	  , function( PresoTile, PresoBasicUniversMap, PresoBasicUniversType, AlxUtils
				, DragManager
				) {
			 // Presentation
			 var PresoTilesAlxAppsGateRoot = function() {
				 this.x = 0; this.y = 0;
				 this.w = this.h = 12;
				 
				 // Universe
				 this.UniversTiles = [];
				 this.mapTile  = new PresoBasicUniversMap (); this.UniversTiles.push(this.mapTile);
				 this.typeTile = new PresoBasicUniversType(); this.UniversTiles.push(this.typeTile);
				 for(var i=0;i<this.UniversTiles.length;i++) {this.UniversTiles[i].init(null,[]);}
				 
				 // Interaction
				 var self = this;
				 this.CB_clic = function(e) {
									 // console.log("Click!", e);
									 var M1 = self.groot.getCTM();
									 var r = e.target;
									 while(r && !r.classList.contains('TileRoot')) {r = r.parentNode;}
									 r = r.TileRoot.getInnerRoot();
									 var M2 = r.getCTM().inverse().translate(50,5).multiply(M1);
									 
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
			 // PresoTilesAlxAppsGateRoot.prototype.initPresoTile = PresoTilesAlxAppsGateRoot.prototype.init;
			 PresoTilesAlxAppsGateRoot.prototype.init = function(brick, children) {
				 PresoTile.prototype.init.apply(this,[brick, children]); //this.initPresoTile(brick, children);
				 for(var i=0;i<this.UniversTiles.length;i++) {this.appendChild(this.UniversTiles[i]);}
				}
			 PresoTilesAlxAppsGateRoot.prototype.integrateBrick = function(brick) {
				 console.log('PresoTilesAlxAppsGateRoot -> integrateBrick ->', brick.id);
				 for(var i=0;i<this.UniversTiles.length;i++) {this.UniversTiles[i].integrateBrick(brick);}
				}
			 PresoTilesAlxAppsGateRoot.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGateRoot.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 this.root  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						this.root.classList.add('TileRoot');
						this.root.TileRoot = this;
						this.idMatrix = this.root.createSVGMatrix();
						// this.root.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
						this.root.setAttributeNS('http://www.w3.org/2000/svg','xlink','http://www.w3.org/1999/xlink');
						this.root.setAttributeNS('http://www.w3.org/2000/svg', 'width' , '100%');
						this.root.setAttributeNS('http://www.w3.org/2000/svg', 'height', '100%');

					 this.pipoRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
					 this.groot = document.createElementNS("http://www.w3.org/2000/svg", "g");
						this.groot.classList.add('rootInternal');
					 
					 //this.root.appendChild(this.groot);
					 this.pipoRoot.appendChild(this.groot);
					 this.root.appendChild(this.pipoRoot);
					 
					 var svg = this.root;
					 this.svg_point = svg.createSVGPoint();
					 this.mapTile.set_svg_point( this.svg_point );
					 
					 svg.addEventListener( 'dblclick'
										 , this.CB_clic
										 , false);
					 window.requestAnimFrame( function() {self.CB_clic( {target: svg} );} );
					 // DragManager
					 DragManager.init(this.root);
					 DragManager.addDraggable( this.groot
											 , { eventNode	: this.root
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
