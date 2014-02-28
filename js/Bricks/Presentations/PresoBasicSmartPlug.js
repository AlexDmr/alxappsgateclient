define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgGroup"
		, "utils/svgText"
		, "utils/svgOval"
		]
	  , function(Presentation, svgGroup, svgText, svgOval) {
			 // Presentation
			 var PresoBasicSmartPlug = function() {
				 //XXX this.init();
				 this.x = this.y = 0;
				 this.w = this.h = 1;
				}
				
			 PresoBasicSmartPlug.prototype = new Presentation();
			 // PresoBasicSmartPlug.prototype.RenderPresoTile = PresoBasicSmartPlug.prototype.Render;
			 PresoBasicSmartPlug.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;//this.RenderPresoTile();
				 // Text for consumption
				 if(!this.consoText) {
					this.root.classList.add('PresoBasicSmartPlug');
					this.root.classList.add('Brick'); this.root.classList.add('dropShadowFilter');
					this.root.setAttribute('filter', 'url(#dropShadow)');
					var coords = this.getPresoCoords();
					// Create the ovals
					var WIDTH	= this.w*this.getTileSize()
					  , radius	= 0.23*WIDTH;
					var gOv = new svgGroup().translate(WIDTH/2, radius + coords.y1);
					var Ov  = new svgOval( {rx:radius, ry:radius, style:{fill:'none', stroke:'maroon'} } );
					var ov1 = new svgOval( {cx:-radius/2, rx:radius/5, ry:radius/5, style:{fill:'none', stroke:'maroon'} } );
					var ov2 = new svgOval( {cx: radius/2, rx:radius/5, ry:radius/5, style:{fill:'none', stroke:'maroon'} } );
					gOv.appendChild(ov1); gOv.appendChild(ov2);
					gOv.appendChild(Ov);
					this.gPreso.appendChild( gOv.getRoot() );
					
					// Create the text
					this.consoText = this.svgAlxConsoText = new svgText( {style:{textAnchor: 'middle', stroke: 'none'}} );
					this.gPreso.appendChild( this.consoText.getRoot() );
					this.consoText = this.consoText.getRoot();
					this.consoText.addEventListener	( 'DOMNodeInsertedIntoDocument'
													, function(e)	{self.svgAlxConsoText.set( '9999W' ).fillSpace( {x:coords.x1,y:(coords.y1+coords.y2)/2,width:coords.x2-coords.x1,height:(coords.y2-coords.y1)/2}, 0.9 );
																	 self.svgAlxConsoText.set( self.brick.consumption[self.brick.consumption.length-1].val + 'W');
																	 self.updateOnOff(self.brick.isOn());
																	}
													, false );
					this.root.addEventListener( 'click'
											  , function(e) {self.toggle();
															 e.preventDefault();
															 e.stopPropagation();
															}
											  , false);
					}
				 
				 return this.root;
				}
			 PresoBasicSmartPlug.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				 if(this.consoText) {this.consoText.parentNode.removeChild( this.consoText );
									 this.consoText = null;
									}
				}
			 PresoBasicSmartPlug.prototype.updateConsumption = function(v) {
				 // if(this.Consumption) {this.Consumption.innerText = v;}
				 if(this.consoText) {this.consoText.textContent = v + 'W';}
				}
			 PresoBasicSmartPlug.prototype.updateOnOff = function(v) {
				 // console.log('PresoBasicSmartPlug->updateOnOff->',v);
				 if(this.rect) {
					 // var color;
					 // if(v) {color = "yellow";} else {color = "grey";}
					 // this.rect.style.fill = color;
					 this.consoText.style.display = v?'inherit':'none';
					} else {console.log("Unknown rect ???");}
				}
			 PresoBasicSmartPlug.prototype.toggle = function() {
				 console.log('PresoBasicSmartPlug->toggle');
				 this.brick.toggle();
				}
			 // Return the reference to the PresoBasicSmartPlug constructor
			 return PresoBasicSmartPlug;
			}
	  );