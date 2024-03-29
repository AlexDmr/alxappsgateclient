define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgUtils"
		, "utils/svgText"
		]
	  , function(Presentation, svgUtils, svgText) {
			 // Presentation
			 var PresoCategSmartPlug = function() {
				 this.isSpace = true;
				}
				
			 PresoCategSmartPlug.prototype = new Presentation();
			 PresoCategSmartPlug.prototype.Render = function() {
				 var self = this;
				 Presentation.prototype.Render.apply(this, []) ;
				 // this.bgRect.style.fill = 'red';
				 // Text for consumption
				 if(!this.consoText) {
					var coords = this.getPresoCoords();
					this.consoText = new svgText({ x	: coords.x2-2
												 , y	: coords.y2-2
												 , style: {textAnchor: 'end'}
												 }).set(this.brick.getLastConsumption() + 'W');
					this.gPreso.appendChild(this.consoText.getRoot());
					/*this.consoText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
					var coords = this.getPresoCoords();
					this.consoText.setAttribute('x', coords.x2);
					this.consoText.setAttribute('y', coords.y1);
					this.consoText.style.textAnchor    = 'end';
					// this.consoText.style.baselineShift = '-1em';
					this.consoText.textContent = this.brick.getLastConsumption() + 'W';
					this.gPreso.appendChild(this.consoText);*/
					}
				 
				 return this.root;
				}
			 PresoCategSmartPlug.prototype.deletePrimitives = function() {
				 Presentation.prototype.deletePrimitives.apply(this, []);
				 if(this.consoText) {var parent;
									 if(typeof this.consoText.getRoot().parentElement === 'undefined') {parent = this.consoText.getRoot().parentNode;} else {parent = this.consoText.getRoot().parentElement;}
									 parent.removeChild( this.consoText.getRoot() );
									 delete this.consoText;
									 this.consoText = null;
									}
				}
			 PresoCategSmartPlug.prototype.updateConsumption = function(v) {
				 if(this.consoText) {this.consoText.set(v + 'W');}
				}
			 // Return the reference to the PresoCategSmartPlug constructor
			 return PresoCategSmartPlug;
			}
	  );
