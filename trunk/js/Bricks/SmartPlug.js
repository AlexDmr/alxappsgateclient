define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoBasicSmartPlug"
	    ]
	  , function(Brick, PresoBasicSmartPlug) {
			 var SmartPlug = function(id, brick) {
				 this.init();
				 this.DataSubscribers = [];
				 this.OnOff 		= [];
					for(var i=0;i<brick.plugState.length;i++) {
						 this.OnOff.push({ms:brick.plugState[i].ms,val:brick.plugState[i].val === 'true'})
						}
				 this.consumption	= brick.consumption;
				 var self = this;
				 this.id = id;
				 socket.on(id, function(data) {self.update(data);});
				 this.appendPresoFactory( 'PresoBasicSmartPlug'
										, PresoBasicSmartPlug
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : 1 }
										);
				 return this;
				};
			 SmartPlug.prototype = new Brick();
			 SmartPlug.prototype.constructor = SmartPlug;
			 SmartPlug.prototype.isOn = function() {return this.OnOff[this.OnOff.length-1].val}
			 SmartPlug.prototype.UnSubscribeToData = function(CB) {
				 var pos = this.DataSubscribers.indexOf(CB);
				 if(pos >= 0) {this.DataSubscribers.splice(pos,1);}
				}
			 SmartPlug.prototype.SubscribeToData = function(CB) {
				 var pos = this.DataSubscribers.indexOf(CB);
				 if(pos < 0) {this.DataSubscribers.push(CB);}
				}
			 SmartPlug.prototype.getLastConsumption = function() {
				 if(this.consumption.length) 
					return this.consumption[ this.consumption.length - 1 ];
				 return {val:null};
				}
			 SmartPlug.prototype.update = function(data) {
				 // console.log("Updating", data);
				 if(data.consumption) {
					 this.consumption.push({ms:data.ms,val:data.consumption});
					 for(var p in this.presentations) {this.presentations[p].updateConsumption(data.consumption);}
					}
				 if(data.plugState) {
					 this.OnOff.push({ms:data.ms,val:data.plugState === "true"});
					 for(var p in this.presentations) {this.presentations[p].updateOnOff(this.isOn());}
					}
				 for(var i=0; i<this.DataSubscribers.length; i++) {
					 this.DataSubscribers[i](this.id, data);
					}
				}
			 SmartPlug.prototype.toggle = function() {
				 // {"targetType":"1","objectId":"ENO878052","method":"on","args":[]}
				 // ending {"targetType":"1","objectId":"ENO878052","method":"off","args":[]}
				 var mtd;
				 if(this.isOn()) {mtd = 'off';} else {mtd = 'on';}
				 this.call( 'AppsGate'
						  , {targetType:'1',objectId:this.id,method:mtd,args:[]}
						  , null );
				}
				
			 return SmartPlug;
			}
	  );