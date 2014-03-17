define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoCategSmartPlug"
	    ]
	  , function(Brick, PresoCategSmartPlug) {
			 var CategSmartPlug = function() {
				 var self = this;
				 this.init();
				 this.isSpace = true;
				 // this.appendPresentations([new PresoBasicSmartPlug()]);
				 // for(var p in this.presentations) {this.presentations[p].init(this);}
				 return this;
				};
			 CategSmartPlug.prototype = new Brick();
			 CategSmartPlug.prototype.constructor = CategSmartPlug;
			 CategSmartPlug.prototype.init = function(children) {
				 Brick.prototype.init.apply(this,[children]);
				 this.consumption	= [];
				 this.appendPresoFactory( 'PresoCategSmartPlug'
										, PresoCategSmartPlug
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : {w:1,h:1} }
										);				 
				}
			 CategSmartPlug.prototype.getLastConsumption = function() {
				 if(this.consumption.length) {return parseInt(this.consumption[ this.consumption.length-1 ].val);}
				 return 0;
				}
			 CategSmartPlug.prototype.update = function(id, data) {
				 // console.log("CategSmartPlug::update from", id, "with", data);
				 var conso = 0, c;
				 for(var i=0; i<this.children.length; i++) {
					 c = parseInt(this.children[i].getLastConsumption().val);
					 // console.log(i,":", this.children[i].getLastConsumption());
					 conso += Math.max(0, c || 0 );
					}
				 this.consumption.push(conso);
				 for(var p in this.presentations) {this.presentations[p].updateConsumption(conso);}
				}
			 CategSmartPlug.prototype.appendChild = function(c) {
				 Brick.prototype.appendChild.apply(this, [c]);
				 var self = this;
				 c.SubscribeToData( function(id, data) {self.update(id, data);} );
				}
				
			 return CategSmartPlug;
			}
	  );