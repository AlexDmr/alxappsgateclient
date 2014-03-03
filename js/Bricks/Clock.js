define( [ "Bricks/protoBricks"
		, "Bricks/Presentations/utils"
	    , "Bricks/Presentations/PresoBasicClock"
	    ]
	  , function(Brick, utils, PresoBasicClock) {
			 var Clock = function(id, brick) {
				 var self = this;
				 this.id = id;
				 this.clockValue = parseInt( brick.clockValue[brick.clockValue.length-1].val );
				 this.localClock = Date.now();
				 this.flowRate   = parseFloat( brick.flowRate[brick.flowRate.length-1].val );
				 this.resetTimer();
				 
				 this.call	( 'AppsGate'
							, {method:"getDevice",args:[{value:'21106637055',type:'String'}]}
							, function(data) {
								  // console.log("Clock received", data)
								  var obj = JSON.parse( data.value );
								  self.clockValue = parseInt  ( obj.clockValue );
								  self.localClock = Date.now();
								  self.flowRate   = parseFloat( obj.flowRate );
								  self.resetTimer();
								 }
								);

				 // console.log('New Clock');
				 
				 socket.on(id, function(data) {self.update(data);});
				 return this;
				};
			 Clock.prototype = new Brick();
			 Clock.prototype.constructor = Clock;
			 Clock.prototype.init = function() {
				 Brick.prototype.init.apply(this, []);
				 this.initSubscribers_clockValue();
				 this.initSubscribers_flowRate();
				 this.appendPresoFactory( 'PresoBasicClock'
										, PresoBasicClock
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : 1 }
										);
				}
			 Clock.prototype.resetTimer = function() {
				 if(this.timer) {clearTimeout(this.timer);}
				 this.updateClock();
				}
			 Clock.prototype.updateClock = function() {
				 var now = Date.now(), self = this;
				 this.CallSubscribers_clockValue( this.get_clockValue() );
				 var mn = 60*1000 / this.flowRate;
				 ms = Math.floor((now+mn)/mn)*mn - now;
				 // console.log("update in", ms, "ms");
				 this.timer = setTimeout( function() {self.updateClock();}
										, ms + 5 );
				}
			 Clock.prototype.update = function(data) {
				 console.log( "Clock update :", data );
				 switch(data.varName) {
					 case 'ClockSet': // Arf... un coup ClockSet, un coup clockValue ...
						this.clockValue = data.value;
						this.localClock = Date.now();
						this.resetTimer();
						this.CallSubscribers_clockValue( this.get_clockValue() );
					 break;
					 case 'flowRate':
						this.clockValue = this.get_clockValue();
						this.localClock = Date.now();
						this.flowRate   = data.value;
						this.resetTimer();
						this.CallSubscribers_flowRate( this.flowRate );
					 break;
					}
				}
			 Clock.prototype.get_clockValue = function() {
				 // Do some computation...
				 var msEllapsed = (Date.now() - this.localClock) * this.flowRate;
				 return this.clockValue + msEllapsed;
				}
				
			 // Generate subscribers
			 utils.generateSubscribers(Clock.prototype, 'clockValue');
			 utils.generateSubscribers(Clock.prototype, 'flowRate');
			 
			 // Return constructor
			 return Clock;
			}
	  );


/*
{"varName":"flowRate","objectId":"21106637055","value":"2.0"} 
{"varName":"ClockSet","objectId":"21106637055","value":"Mon Jan 27 18:01:30 CET 2014"}

	  { id         : "21106637055"
	  , ClockSet   : "Mon Jan 27 17:13:19 CET 2014"
	  , placeId    : "-1"
	  , status     : "2"
	  , name       : "Horloge"
	  , sysName    : "SystemClock"
	  , type       : "21"
	  , flowRate   : "1.0"
	  , clockValue : "1390839199200"
	  }
*/