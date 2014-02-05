define( [ 'Bricks/protoBricks'
		, "Bricks/Presentations/PresoTilesAlxAppsGateRoot"
		, 'Bricks/HueLamp'
		, 'Bricks/SmartPlug'
		, 'Bricks/UpnpMediaServer'
		, 'Bricks/UpnpMediaRenderer'
		, 'Bricks/Clock'
		]
	  , function( Brick, Preso
	            , HueLamp
				, SmartPlug
				, UpnpMediaServer, UpnpMediaRenderer
				, Clock
				) { 
			 var AlxClient = { nbBricks	: 0
							 , devices	: {}
							 };
			 AlxClient.__proto__ = new Brick();
			 AlxClient.devices = {};
			 AlxClient.bricksMap = {
				  0		: null // Temperature
				, 1		: null // Luminosité
				, 2		: null // ???
				, 3		: null // Capteur de contact
				, 6		: SmartPlug
				, 7		: null // HueLamp
				, 20	: null // ???
				, 21	: Clock // Horloge
				, 'urn:schemas-upnp-org:device:MediaRenderer:1' : UpnpMediaRenderer
				, 'urn:schemas-upnp-org:device:MediaServer:1'	: UpnpMediaServer
				}
			 
			 AlxClient.init = function() {
				 this.presentations = []; this.presentations.push( new Preso() );
				 // console.log('1');
				 for(var p=0;p<this.presentations.length;p++) {this.presentations[p].init(this);}
				 // console.log('2');
				 document.body.appendChild( this.presentations[0].Render() );
				 
				 // Subscribe to socket.io
				 socket.on('newDevice', function(data) {AlxClient.updateBrickList(data);});
				 this.call( 'AlxServer'
						  , {mtd:'getBricks', args:[]}
						  , function(data) {
								 // console.log("Received", data);
								 if(data.success) {
									 AlxClient.newBricksList(data.res);
									}
								}
						  );
				}
			 AlxClient.newBricksList = function(bricks) {
				 // Re-init the device list
				 var brick, type, id;
				 for(var i in bricks) {
					 brick	= bricks[i];
					 if(!brick.type) {console.log('WARNING : brick with no type :', brick); continue;}
					 type	= brick.type[0].val;
					 if(!brick.type) {console.log('WARNING : brick with no id :', brick); continue;}
					 id		= brick.id[0].val;
					 // console.log("New brick", brick);
					 if(this.bricksMap[type]) {
						 var Constr	  = this.bricksMap[type];
						 var newBrick = new Constr(id, brick);
						 newBrick.type = type;
						 // console.log(this.presentations.length,"New brick", brick);
						 for(var p=0;p<this.presentations.length;p++) {this.presentations[p].integrateBrick(newBrick);}
						} else {/*console.log("Unsupported brick type :", type, " for", brick);*/}
					}
				}
			 AlxClient.updateBrickList = function(data) {
				 console.log("AlxClient updateBrickList");
				 // Update the device list
				 this.newBricksList([data]);
				}
			
			 // Return the singleton
			 return AlxClient;
			}
	  );
