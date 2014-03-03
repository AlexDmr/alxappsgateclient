var pipoClock;
define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgText"
		, "Bricks/Presentations/utils"
		]
	  , function(Presentation, svgText, utils) {
			 // Presentation
			 var PresoBasicClock = function() {
				}
				
			 PresoBasicClock.prototype = new Presentation();
			 PresoBasicClock.prototype.init = function(brick) {
				 var self = this;
				 Presentation.prototype.init.apply(this, [brick]);
				 this.subscribeId = this.get_a_uid();
				 brick.Subscribe_clockValue( this.subscribeId
										   , function(ms) {self.updateClock(ms);}
										   );
				 brick.Subscribe_flowRate ( this.subscribeId
										  , function(rate) {
												console.log("Clock flowRate :", rate);
											   }
										  );
				 pipoClock = this;
				}
			 PresoBasicClock.prototype.updateClock = function(ms) {
				 if(this.clockText) {
					 var  D = new Date(); D.setTime(ms);
					 var HH = D.getHours() //Math.floor(ms/24*60*1000)%24
					   ; MM = D.getMinutes() //Math.floor(ms/   60*1000)%60;
					 this.clockText.set(utils.FormatNumberLength(HH,2)+':'+utils.FormatNumberLength(MM,2));
					}
				}
			 PresoBasicClock.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;
				 // Text for consumption
				 if(!this.clockText) {
					 this.clockText = new svgText( {style: {fontFamily: 'Consolas', textAnchor: 'middle', stroke: 'none'}} );
					 this.gPreso.appendChild(this.clockText.getRoot());
					 self.updateClock( this.brick.get_clockValue() );
					 var coords = this.getPresoCoords();
					 this.clockText.getRoot().addEventListener(
							  'DOMNodeInsertedIntoDocument'
							, function(e) 	{var prev = self.clockText.get();
											 self.clockText.set('00:00');
											 var bbox = self.clockText.getBBox()
											   ,    s = 0.8 * (coords.x2-coords.x1) / bbox.width;
											 self.clockText.matrixId().translate( (coords.x2+coords.x1)/2
																				, (coords.y2+coords.y1)/2
																				).scale(s,s)
											 /*self.clockText.fillSpace( { x		: coords.x1
																	   , y		: coords.y1
																	   , width	: coords.x2 - coords.x1
																	   , height	: coords.y2 - coords.y1 }
																	 , 0.7);*/
											 self.clockText.set(prev);
											}
							, false );
					}
				 
				 return this.root;
				}
			 PresoBasicClock.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				 if(this.clockText) {if(this.clockText.parentElement) this.clockText.parentElement.removeChild( this.clockText );
									 this.clockText = null;
									}
				}
			 
			 // Return the reference to the PresoBasicClock constructor
			 return PresoBasicClock;
			}
	  );