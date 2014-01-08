define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(Presentation) {
			 // Presentation
			 var PresoBasicSmartPlug = function() {
				 this.init();
				 this.x = this.y = 0;
				 this.w = this.h = 1;
				}
				
			 PresoBasicSmartPlug.prototype = new Presentation();
			 // PresoBasicSmartPlug.prototype.RenderPresoTile = PresoBasicSmartPlug.prototype.Render;
			 PresoBasicSmartPlug.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;//this.RenderPresoTile();
				 // Text for consumption
				 this.consoText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
					var coords = this.getPresoCoords();
					this.consoText.setAttribute('x', coords.x2);
					this.consoText.setAttribute('y', coords.y1);
					this.consoText.style.textAnchor    = 'end';
					this.consoText.style.baselineShift = '-1em';
					this.consoText.textContent = this.brick.consumption[this.brick.consumption.length-1].val + 'W';
					this.updateOnOff(this.brick.isOn());
					this.rect.addEventListener( 'dblclick'
											  , function(e) {self.toggle();
															 e.preventDefault();
															 e.stopPropagation();
															}
											  , false);
				 this.gPreso.appendChild(this.consoText);
				 
				 return this.root;
				}
			 PresoBasicSmartPlug.prototype.deletePrimitivesPresoTile = PresoBasicSmartPlug.prototype.deletePrimitives;
			 PresoBasicSmartPlug.prototype.deletePrimitives = function() {
				 this.deletePrimitivesPresoTile();
				 if(this.consoText) {this.consoText.parentNode.removeChild( this.consoText );}
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