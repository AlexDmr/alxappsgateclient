define( [ "Bricks/Presentations/protoPresentation"
		]
	  , function(Presentation) {
			 var dt = 0.1, size = 32;
			 
			 // Presentation
			 var PresoTilesAlxAppsGate = function() {
				}
			
			 PresoTilesAlxAppsGate.prototype.getTileSize = function() {return size;}
			 PresoTilesAlxAppsGate.prototype = new Presentation();
			 PresoTilesAlxAppsGate.prototype.constructor = PresoTilesAlxAppsGate;
			 PresoTilesAlxAppsGate.prototype.init = function() {
				 Presentation.prototype.init.apply(this,[]);
				 // console.log("PresoTilesAlxAppsGate Init");
				 this.x = this.y = 0;
				 this.w = this.h = 12;
				 this.innerMagnitude = 12;
				 this.color = 'cyan';
				 this.display = true;			 
				}
			 PresoTilesAlxAppsGate.prototype.getPresoCoords = function() {
				 return { x1 : 0.5*dt*size
						, y1 : 0.5*dt*size
						, x2 : 0.5*dt*size + size*(this.w-dt)
						, y2 : 0.5*dt*size + size*(this.h-dt) };
				}
			 PresoTilesAlxAppsGate.prototype.Render = function() {
				 var self = this;
				 if(this.root === null) {
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
					 this.gPreso.appendChild(r); g.appendChild(this.gPreso); g.appendChild(gr);
					 this.rect = r;
					 this.root  = g; g.classList.add('TileRoot'); g.TileRoot = this;
					 this.groot = gr;
					 for(var i=0;i<this.children.length;i++) {this.primitivePlug(this.children[i]);}
					 }
				 return this.root;
				}
			 PresoTilesAlxAppsGate.prototype.getInnerRoot = function() {return this.groot;}
			 PresoTilesAlxAppsGate.prototype.primitivePlug = function(c) {
				 var P = this.Render(),
				     N = c.Render(); pipo = c;
				 // console.log(P, "\n", c, "\n", N);
				 this.groot.appendChild( N );
				}
			 PresoTilesAlxAppsGate.prototype.ComputeSemanticZoom = function(svg_point, MT, L_toAppear, L_toDisappear) {
				var root = this.groot;
				var M = MT.multiply( root.getCTM() );
				svg_point.x = 0; svg_point.y = 0;
				var P0 = svg_point.matrixTransform( M );
				svg_point.x = 1; svg_point.y = 0;
				var P1 = svg_point.matrixTransform( M );
				var dx = P1.x - P0.x,
					dy = P1.y - P0.y,
					scale = Math.sqrt( dx*dx + dy*dy );
				// console.log(scale);
				if(this.adaptRender(scale,L_toAppear,L_toDisappear)) {
					// Recursing across semantic zoom structure
					for(var i=0;i<this.children.length;i++) {
						 this.children[i].ComputeSemanticZoom(svg_point, MT, L_toAppear, L_toDisappear);
						}
					}
				}
			 PresoTilesAlxAppsGate.prototype.adaptRender = function(scale, L_CB/*L_toAppear, L_toDisappear*/) {
				var res;
				var self = this;
				if(scale < 0.5) {
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
			 PresoTilesAlxAppsGate.prototype.CB_Fade = function(dt, v0, v1) {
				 if(v0 === 0 && dt === 0) {
					 // console.log('display', this);
					 this.getInnerRoot().style.display = 'inherit';
					}
				 this.getInnerRoot().style.opacity = Math.easeInOutQuad(dt, v0, v1-v0, 1);
				 if(v1 === 0 && dt >= 1) {
					 // console.log('Hide', this);
					 if(!this.display) this.getInnerRoot().style.display = 'none';
					}
				}
			 PresoTilesAlxAppsGate.prototype.deletePrimitives = function() {
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