define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoCategSmartPlug = function() {
				 //XXX this.init();
				 this.x = this.y = 0;
				 this.w = this.h = 1;
				}
				
			 PresoCategSmartPlug.prototype = new Presentation();
			 PresoCategSmartPlug.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;
				 this.bgRect.style.fill = 'red';
				 // Text for consumption
				 if(!this.consoText) {
					this.consoText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
					var coords = this.getPresoCoords();
					this.consoText.setAttribute('x', coords.x2);
					this.consoText.setAttribute('y', coords.y1);
					this.consoText.style.textAnchor    = 'end';
					this.consoText.style.baselineShift = '-1em';
					this.consoText.textContent = this.brick.getLastConsumption() + 'W';
					this.gPreso.appendChild(this.consoText);
					}
				 
				 return this.root;
				}
			 PresoCategSmartPlug.prototype.deletePrimitives = function() {
				 PresoCategSmartPlug.prototype.deletePrimitives.apply(this, []);
				 if(this.consoText) {this.consoText.parentNode.removeChild( this.consoText );
									 this.consoText = null;
									}
				}
			 PresoCategSmartPlug.prototype.updateConsumption = function(v) {
				 if(this.consoText) {this.consoText.textContent = v + 'W';}
				}
			 // Return the reference to the PresoCategSmartPlug constructor
			 return PresoCategSmartPlug;
			}
	  );
