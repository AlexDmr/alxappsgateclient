define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgText"
		, "Bricks/Presentations/utils"
		]
	  , function(Presentation, svgText, utils) {
			 // Presentation
			 var PresoBasicClock = function() {
				 this.x = this.y = 0;
				 this.w = this.h = 1;
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
					 this.clockText = new svgText( {style: {fontFamily: 'Consolas'}} );
					 this.gPreso.appendChild(this.clockText.getRoot());
					 self.updateClock( this.brick.get_clockValue() );
					 var coords = this.getPresoCoords();
					 this.clockText.getRoot().addEventListener(
							  'DOMNodeInsertedIntoDocument'
							, function(e) 	{self.clockText.fillSpace( { x		: coords.x1
																	   , y		: coords.y1
																	   , width	: coords.x2 - coords.x1
																	   , height	: coords.y2 - coords.y1 }
																	 , 0.9); }
							, false );
					}
				 
				 return this.root;
				}
			 PresoBasicClock.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				 if(this.consoText) {this.consoText.parentNode.removeChild( this.consoText );
									 this.consoText = null;
									}
				}
			 // PresoBasicClock.prototype.
			 
			 // Return the reference to the PresoBasicClock constructor
			 return PresoBasicClock;
			}
	  );