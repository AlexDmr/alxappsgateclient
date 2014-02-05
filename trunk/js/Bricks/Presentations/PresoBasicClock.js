define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgText"
		]
	  , function(Presentation, svgText) {
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
										   , function(ms) {
												console.log("Clock :", ms);
											   }
										   );
				 brick.Subscribe_flowRate ( this.subscribeId
										  , function(rate) {
												console.log("Clock flowRate :", rate);
											   }
										  );
				}
			 PresoBasicClock.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;
				 // Text for consumption
				 if(!this.clockText) {
					this.clockText = new svgText();
					this.gPreso.appendChild(this.clockText.getRoot());
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