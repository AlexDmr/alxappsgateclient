define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgGroup"
		, "utils/svgText"
		, "utils/svgOval"
		, "utils/svgUtils"
		]
	  , function(Presentation, svgGroup, svgText, svgOval, svgUtils) {
			 // Presentation
			 var PresoBasicSmartPlug = function() {
				}
				
			 PresoBasicSmartPlug.prototype = new Presentation();
			 // PresoBasicSmartPlug.prototype.RenderPresoTile = PresoBasicSmartPlug.prototype.Render;
			 PresoBasicSmartPlug.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;//this.RenderPresoTile();
				 // Text for consumption
				 if(!this.consoText) {
					this.root.classList.add('PresoBasicSmartPlug');
					this.root.classList.add('Brick'); this.root.classList.add('BrickDevice');
					this.root.classList.add('dropShadowFilter');
					// this.root.setAttribute('filter', 'url(#dropShadow)');
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
					svgUtils.onDOMNodeInsertedIntoDocument(
						  this.consoText
						, function(coords) {return function() {
							 self.svgAlxConsoText.set( '9999W' )
							 var bbox = self.svgAlxConsoText.getBBox()
							   ,    s = 0.8 * (coords.x2-coords.x1) / bbox.width;
							 self.svgAlxConsoText.matrixId().translate( (coords.x2+coords.x1)/2
																	  , coords.y2 - 10*s
																	  ).scale(s,s);
							 self.svgAlxConsoText.set( self.brick.consumption[self.brick.consumption.length-1].val + 'W');
							 self.updateOnOff(self.brick.isOn()); };
							}(coords)
						);
					/*this.consoText.addEventListener	( 'DOMNodeInsertedIntoDocument'
													, function(coords) {return function(e) {
														 self.svgAlxConsoText.set( '9999W' )
														 var bbox = self.svgAlxConsoText.getBBox()
														   ,    s = 0.8 * (coords.x2-coords.x1) / bbox.width;
														 self.svgAlxConsoText.matrixId().translate( (coords.x2+coords.x1)/2
																								  , coords.y2 - 10*s
																								  ).scale(s,s);
														 self.svgAlxConsoText.set( self.brick.consumption[self.brick.consumption.length-1].val + 'W');
														 self.updateOnOff(self.brick.isOn()); };
														}(coords)
													, false );*/
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
				 if(this.consoText) {var parent;
									 if(typeof this.consoText.parentElement === 'undefined') {parent = this.consoText.parentNode;} else {parent = this.consoText.parentElement;}
									 parent.removeChild( this.consoText );
									 this.consoText = null;
									}
				}
			 PresoBasicSmartPlug.prototype.updateConsumption = function(v) {
				 // if(this.Consumption) {this.Consumption.innerText = v;}
				 if(this.consoText) {this.consoText.textContent = v + 'W';}
				}
			 PresoBasicSmartPlug.prototype.updateOnOff = function(v) {
				 // console.log('PresoBasicSmartPlug->updateOnOff->',v);
				 if(this.consoText) {
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