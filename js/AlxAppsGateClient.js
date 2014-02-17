define( [ 'Bricks/protoBricks'
		, "Bricks/Presentations/PresoTilesAlxAppsGateRoot"
		, "Bricks/Univers", "Bricks/Presentations/PresoBasicUniversMap", "Bricks/Presentations/PresoBasicUniversType"
		, "Bricks/Palette"
		, 'Bricks/HueLamp'
		, 'Bricks/SmartPlug'
		, 'Bricks/UpnpMediaServer'
		, 'Bricks/UpnpMediaRenderer'
		, 'Bricks/Clock'
		]
	  , function( Brick, Preso
				, Univers, PresoBasicUniversMap, PresoBasicUniversType
	            , Palette
				, HueLamp, SmartPlug
				, UpnpMediaServer, UpnpMediaRenderer
				, Clock
				) {
			 var AlxClient = new Brick(); pipo = AlxClient;
			 AlxClient.init();
			 AlxClient.nbBricks = 0;
			 AlxClient.devices	= {};

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
				 // Plug the universes
				 this.U_map = new Univers( 'U_map', {}
										 , [ ['PresoBasicUniversMap' , PresoBasicUniversMap ] ] );
				 this.U_cat = new Univers( 'U_cat', {}
										 , [ ['PresoBasicUniversType', PresoBasicUniversType] ] );
				 this.appendChild( this.U_map );
				 this.appendChild( this.U_cat );
				 this.Univers = [this.U_map, this.U_cat]
				 
				 // Init the palette for edition mode
				 this.palette = new Palette();
					this.appendChild( this.palette );
					this.palette.addUniverAccess( {id:'map',name:'Plan',classes:'BrickPlace'}, this.U_map);
					this.palette.addUniverAccess( {id:'cat',name:'Briques',classes:'BrickService'}, this.U_cat);
					
				 
				 // Subscribe to socket.io
				 socket.on('newDevice', function(data) {AlxClient.updateBrickList(data);});
				 this.call( 'AlxServer'
						  , {mtd:'getBricks', args:[]}
						  , function(data) {if(data.success) {
												 AlxClient.newBricksList(data.res);
												}
								}
						  );

				 this.presentations = []; this.presentations.push( new Preso() );
				 for(var p=0;p<this.presentations.length;p++) {this.presentations[p].init(this);}
				 document.body.appendChild( this.presentations[0].Render() );
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
						 for(var p=0;p<this.presentations.length;p++) {
							 this.presentations[p].integrateBrick(newBrick);
							}
						 for(var p=0;p<this.Univers.length;p++) {
							 this.Univers[p].integrateBrick(newBrick);
							}
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
