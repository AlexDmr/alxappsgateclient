define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoBasicAlxHueLamp"
	    ]
	  , function(Brick, PresoBasicAlxHueLamp) {
			 var AlxHueLamp = function(id, brick) {
				 var self = this;
				 this.id = id;
				 this.data = brick;
				 console.log('Init Hue lamp', brick);
				 if(brick.HueLocation) {
					 this.HueLocation 	= brick.HueLocation[0].val;
					 this.HueUser		= brick.HueUser[0].val;
					 this.HueId			= brick.HueId[0].val;
					 this.IsOn			= brick.on[brick.on.length-1].val;
					 this.IsReachable	= brick.reachable[brick.reachable.length-1].val;
					} else	{this.HueLocation = this.HueUser = this.HueId = '';
							 this.IsOn = this.IsReachable = false;
							}
				 // console.log("HueLamp",id,"at URL",this.HueLocation,'is',this.IsOn?'on':'off');
				 socket.on(id, function(data) {self.update(data);});
				 return this;
				};
			 AlxHueLamp.prototype = new Brick();
			 AlxHueLamp.prototype.init = function(children) {
				 Brick.prototype.init.apply(this, [children]);
				 this.appendPresoFactory( 'PresoBasicAlxHueLamp'
										, PresoBasicAlxHueLamp
										, { pixelsMinDensity : 0
										  , pixelsMaxDensity : 999999999
										  , pixelsRatio		 : {w:1,h:1} }
										);
				 return this;
				}
			 AlxHueLamp.prototype.constructor = AlxHueLamp;
			 AlxHueLamp.prototype.update = function(data) {
				 console.log("Hue lamp updated :", data);
				 if(typeof data.on !== 'undefined') {
					 this.IsOn = data.on;
					 for(var p=0; p<this.presentations.length; p++) {this.presentations[p].IsOn(this.IsOn);}
					}
				}
			 AlxHueLamp.prototype.setState = function(state) {
				 this.call( 'Hue'
						  , { method: 'PUT'
						    , url	: this.HueLocation + '/api/' + this.HueUser + '/lights/' + this.HueId + '/state'
							, body	: state
							, id	: this.id
							}
						  , function(res) {console.log("Hue::setState =>", res);}
						  );
				}
			 AlxHueLamp.prototype.toggle = function() {
				 this.IsOn = !this.IsOn;
				 this.setState( {on: this.IsOn, hue:Math.floor(Math.random()*65535)} );
				}
				
			 return AlxHueLamp;
			}
	  );