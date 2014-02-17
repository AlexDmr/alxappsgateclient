define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgText"
		]
	  , function(Presentation, svgText) {
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
					var coords = this.getPresoCoords();
					this.consoText = this.svgAlxConsoText = new svgText( {style:{textAnchor: 'middle'}} );
					// this.consoText.fillSpace( {x:coords.x1,y:coords.y1,width:coords.x2-coords.x1,height:coords.y2-coords.y1}, 0.9 );
					// this.consoText.set( this.brick.consumption[this.brick.consumption.length-1].val + 'W' );
					this.gPreso.appendChild( this.consoText.getRoot() );
					this.consoText = this.consoText.getRoot();
					this.updateOnOff(this.brick.isOn());
					this.consoText.addEventListener	( 'DOMNodeInsertedIntoDocument'
													, function(e)	{self.svgAlxConsoText.set( '9999W' ).fillSpace( {x:coords.x1,y:coords.y1,width:coords.x2-coords.x1,height:coords.y2-coords.y1}, 0.9 );
																	 self.svgAlxConsoText.set( self.brick.consumption[self.brick.consumption.length-1].val + 'W');
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
					 var color;
					 if(v) {color = "yellow";} else {color = "grey";}
					 this.rect.style.fill = color;
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