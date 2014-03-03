define( [ 'Bricks/protoBricks'
		, "Bricks/Presentations/PresoTilesAlxAppsGateRoot"
		, "Bricks/Univers", "Bricks/Presentations/PresoBasicUniversMap", "Bricks/Presentations/PresoBasicUniversType", "Bricks/Presentations/PresoListUnivers"
		, "Bricks/Palette"
		, 'Bricks/HueLamp'
		, 'Bricks/SmartPlug'
		, 'Bricks/UpnpMediaServer', 'Bricks/UpnpMediaRenderer'
		, 'Bricks/AlxHueLamp'
		, 'Bricks/Clock'
		, 'Bricks/CategSmartPlug'
		]
	  , function( Brick, Preso
				, Univers, PresoBasicUniversMap, PresoBasicUniversType, PresoListUnivers
	            , Palette
				, HueLamp, SmartPlug
				, UpnpMediaServer, UpnpMediaRenderer
				, AlxHueLamp
				, Clock
				, CategSmartPlug
				) {
			 var AlxClient = new Brick(); pipo = AlxClient;
			 AlxClient.init();
			 AlxClient.nbBricks = 0;
			 AlxClient.devices	= {};

			 AlxClient.bricksMap = {
				  0		: null	// Temperature
				, 1		: null	// Luminosité
				, 2		: null	// Interupteur
				, 3		: null	// Capteur de contact
				, 4		: null	// Lecteur de carte
				, 6		: SmartPlug
				, 7		: null	// HueLamp
				, 8		: null	// Actionneur On/Off... obsolète...
				, 9		: null	// Capteur de CO2
				, 20	: null	// ???
				, 21	: Clock // Horloge
				, 31	: UpnpMediaRenderer	// MediaPlayer
				, 36	: null	// MediaServeur
				, 101	: null	// Google calendar
				, 102	: null	// GMail
				, 103	: null	// Météo
				, 'urn:schemas-upnp-org:device:MediaRenderer:1' : UpnpMediaRenderer
				, 'urn:schemas-upnp-org:device:MediaServer:1'	: UpnpMediaServer
				, 'AlxHueLamp'	: AlxHueLamp
				}
			 
			 AlxClient.init = function() {
				 var self = this;
				 // Categories
				 this.brickCategories = [];
				 var categ_SP = new CategSmartPlug(); this.brickCategories.push(categ_SP);
				 for(var i=0;i<this.brickCategories.length;i++) {this.brickCategories[i].init(null,[]);}

				 // Plug the universes
				 this.U_map = new Univers( 'U_map'
										 , [ ['PresoBasicUniversMap' , PresoBasicUniversMap]
  										   , ['PresoListUnivers'     , PresoListUnivers    , {tags:['orthozoom']} ] 
										   ] );
				 this.U_map.setData({ x : 0, y : 8
									, w : 4, h : 4
									, color: 'cyan', brick: this.U_map, name: 'Plan'
									, children : [
										  { x:7,y:0,w:5,h:5,color:'blue',name:'Cuisine'
										  , children : [
												  {x:0,y:10,w:2,h:2,brickId:'capteurContact1',name:'pipo capteur de contact'}
												, {x:6,y:5,w:2,h:2,brickId:'ENO878052',name:'petit fantôme Spöka'}	// Spöka
												]
										  }
										, { x:3,y:5,w:9,h:6,color:'chocolate',name:'Salon'
										  , children : [
												  {x:10,y:5,w:1,h:1,brickId:'ENO87cdd8',name:'prise porte fenêtre'} // Porte fenêtre
												, {x:6,y:6,w:2,h:2,brickId:'ENO878052',name:'petit fantôme Spöka'}	// Spöka
												, {x:6,y:0,w:2,h:2,brickId:'ENO878052',name:'petit fantôme Spöka'}	// Spöka
												]
										  }
										, { x:0,y:9,w:3,h:3,color:'yellow',name:'Horloge',brickId:'21106637055'} // Horloge
										] 
									} );
				 this.U_cat = new Univers( 'U_cat'
										 , [ ['PresoBasicUniversType', PresoBasicUniversType]
  										   , ['PresoListUnivers'     , PresoListUnivers     , {tags:['orthozoom']}]
										   ] );
				 this.U_cat.setData({ x : 4, y : 8
									, w : 4, h : 4
									, color: 'darkslategray', brick: this.U_cat, name: 'Catégories'
									, children : [
										  { x:0,y:0,w:3,h:2,color:'blue',name:'Prises pilotable',categId:'6',brick:categ_SP}
										, { x:3,y:0,w:3,h:2,color:'blue',name:'Thermomètres',categId:'0'}
										, { x:6,y:0,w:3,h:3,color:'blue',name:'Luminomètres',categId:'1'}
										, { x:9,y:0,w:3,h:3,color:'blue',name:'Lampes Hue',categId:'7'}
										, { x:0,y:2,w:3,h:2,color:'blue',name:'Serveurs de médias',categId:'urn:schemas-upnp-org:device:MediaServer:1'}
										, { x:3,y:2,w:3,h:2,color:'blue',name:'Lecteurs de média',categId:'urn:schemas-upnp-org:device:MediaRenderer:1'}
										, { x:6,y:3,w:3,h:3,color:'green',name:'Alx Hue Lamps',categId:'AlxHueLamp'}
										// , { x:9,y:9,w:3,h:3,color:'yellow',name:'Horloge',brickId:'21106637055'} // Horloge
										]
									} );

				 this.appendChild( this.U_map );
				 this.appendChild( this.U_cat );
				 this.Univers = [this.U_map, this.U_cat]
				    // this.Univers = [];
				 
				 // Init the palette for edition mode
				 this.palette = new Palette();
					this.palette.init();
					this.appendChild( this.palette );
					this.palette.addUniverAccess( {id:'map',name:'Plan',classes:'BrickPlace'}	  , this.U_map);
					this.palette.addUniverAccess( {id:'cat',name:'Briques',classes:'BrickService'}, this.U_cat);
				 
				 // Subscribe to socket.io
				 socket.on('newDevice', function(data) {AlxClient.updateBrickList(data);});

				 this.presentations = []; this.presentations.push( new Preso() );
				 for(var p=0;p<this.presentations.length;p++) {this.presentations[p].init(this);}
				 document.body.appendChild( this.presentations[0].Render() );
				 // this.presentations[0].appendDescendants();
				 // Change presentations for palette
				 this.palette.changePresentationsWithContext( {tags:['orthozoom']}, this.U_map);
				 this.palette.changePresentationsWithContext( {tags:['orthozoom']}, this.U_cat);
				 for(var i=0; i<this.Univers.length; i++) {
					 this.Univers[i].layoutDescendants();
					}
				 
				 // Call the server for the tree structure
				 setTimeout(function() {
				 self.call( 'AppsGate'
						  , {method:'getTreeDescription', args:[]}
						  , function(data) {
								 console.log(data);
								 var json = JSON.parse(data.value), root = json
								   , id, newUnivers, Udata;
								 console.log("getTreeDescription <=", json);
								 for(var i=0; i<json.children.length; i++) {
									 id = json.children[i];
									 if(json[id].type === 'HABITAT_CURRENT') {
										 for(var u=0; u<json[id].children.length; u++) {
											 Udata = json[id].children[u];
											 // Children are the universes
											 newUnivers = new Univers( Udata.type
													  , [ ['PresoBasicUniversMap', PresoBasicUniversType]
													    , ['PresoListUnivers'    , PresoListUnivers     , {tags:['orthozoom']}]
														] );
											 self.Univers.push( newUnivers );
											 var nbU = self.Univers.length-3;
											 // console.log("Create univers", json[id][Udata]);
											 var D = 3, S = 4;
											 newUnivers.parseDataFromServer	( json[id][Udata]
																			, { x: S*(nbU%D)
																			  , y: S*Math.floor(nbU/D)
																			  , w:S, h:S
																			  }
																			);
											 self.appendChild( newUnivers );
											 // console.log("New univers", newUnivers, json[id][Udata]);
											 var Uname = { 'SERVICE_ROOT' : 'Services'
														 , 'SPATIAL_ROOT' : 'Plan'
														 , 'PROGRAM_ROOT' : 'Programmes'
														 , 'DEVICE_ROOT'  : 'Appareils'
														 }
											 if(!Uname[json[id][Udata].type]) {Uname[json[id][Udata].type] = json[id][Udata].type;}
											 self.palette.addUniverAccess( {id:'U_'+u,name:Uname[json[id][Udata].type],classes:json[id][Udata].type}, newUnivers);
											 self.palette.changePresentationsWithContext( {tags:['orthozoom']}, newUnivers);
											 newUnivers.layoutDescendants();
											}
										 self.call( 'AlxServer'
												  , {mtd:'getBricks', args:[]}
												  , function(data) {if(data.success) {
																		 AlxClient.newBricksList(data.res);
																		 // for(var p=0;p<self.presentations.length;p++) {self.presentations[p].initSemanticZoom();}
																		}
														}
												  );
										}
									}
								}
						  )
						}, 5000); // End setTimeout
				}
			 AlxClient.newBricksList = function(bricks) {
				 // Re-init the device list
				 var brick, type, id, name;
				 for(var i in bricks) {
					 brick	= bricks[i];
					 if(!brick.type) {console.error('WARNING : brick with no type :', brick); continue;}
					 type	= brick.type[0].val;
					 if(!brick.type) {console.error('WARNING : brick with no id :', brick); continue;}
					 id		= brick.id[0].val;
					 if(!brick.name) {name = id;} else {name = brick.name[0].val;}
					 // console.log("New brick", brick);
					 if(this.bricksMap[type]) {
						 var Constr	  = this.bricksMap[type];
						 var newBrick = new Constr(id, brick);
						 newBrick.isBrick = true;
						 newBrick.type = type;
						 newBrick.name = name;
						 newBrick.init();
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
			 AlxClient.editTile = function(tile) {
				 this.palette.editTile( tile );
				}
			
			 // Return the singleton
			 return AlxClient;
			}
	  );
