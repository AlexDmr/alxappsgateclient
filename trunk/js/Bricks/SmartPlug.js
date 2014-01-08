define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoBasicSmartPlug"
	    ]
	  , function(Brick, PresoBasicSmartPlug) {
			 var SmartPlug = function(id, brick) {
				 this.init();
				 this.OnOff 		= [];
					for(var i=0;i<brick.plugState.length;i++) {
						 this.OnOff.push({ms:brick.plugState[i].ms,val:brick.plugState[i].val === 'true'})
						}
				 this.consumption	= brick.consumption;
				 var self = this;
				 this.id = id;
				 socket.on(id, function(data) {self.update(data);});
				 this.appendPresoFactory('PresoBasicSmartPlug', PresoBasicSmartPlug);
				 // this.appendPresentations([new PresoBasicSmartPlug()]);
				 // for(var p in this.presentations) {this.presentations[p].init(this);}
				 return this;
				};
			 SmartPlug.prototype = new Brick();
			 SmartPlug.prototype.constructor = SmartPlug;
			 SmartPlug.prototype.init = Brick.prototype.init;
			 SmartPlug.prototype.isOn = function() {return this.OnOff[this.OnOff.length-1].val}
			 SmartPlug.prototype.update = function(data) {
				 // console.log("Updating", data);
				 if(data.consumption) {
					 this.consumption.push(data.consumption);
					 for(var p in this.presentations) {this.presentations[p].updateConsumption(data.consumption);}
					}
				 if(data.plugState) {
					 this.OnOff.push({ms:data.ms,val:data.plugState === "true"});
					 for(var p in this.presentations) {this.presentations[p].updateOnOff(this.isOn());}
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