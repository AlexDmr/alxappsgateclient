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

			 AlxClient.D_bricks = {};
			 
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
									, brick: this.U_map, name: 'Habitat spatial', class:'BrickPlace', image:'images/LogoSpatial.png'
									, children : [
										  { x:4,y:0,w:4,h:3,name:"Salle de bain"
										  , children : [{x:3,y:2,w:2,h:2,brickId:'L_sdb',type:AlxHueLamp}] }
										, { x:0,y:0,w:4,h:3,name:"Chambre de Paul"
										  , children : [{x:3,y:2,w:2,h:2,brickId:'L_paul',type:AlxHueLamp}]}
										, { x:8,y:0,w:4,h:8,name:"Coin des enfants"
										  , children : [
											  {x:1,y:1,w:6,h:4,name:"Chambre Pauline",children:[{x:5,y:3,w:2,h:2,brickId:'L_pauline',type:AlxHueLamp}]}
											, {x:1,y:6,w:6,h:4,name:"Chambre Arthur",children:[{x:5,y:3,w:2,h:2,brickId:'L_arthur',type:AlxHueLamp}]}
											, {x:1,y:11,w:6,h:4,name:"Salle de jeux",children:[{x:5,y:3,w:2,h:2,brickId:'L_jeux',type:AlxHueLamp}]}
											] }
										, { x:0,y:3,w:8,h:2,name:"Couloir"
										  , children : [{x:7,y:0,w:2,h:2,brickId:'L_couloir',type:AlxHueLamp}] }
										, { x:0,y:5,w:8,h:3,name:"Pièce à vivre"
										  , children : [{x:7,y:1,w:2,h:2,brickId:'L_vivre',type:AlxHueLamp}] }
										, { x:0,y:8,w:4,h:3,name:"Cuisine"
										  , children : [{x:3,y:1,w:2,h:2,brickId:'L_cuisine',type:AlxHueLamp}] }
										, { x:4,y:8,w:8,h:3,name:"Térasse"
										  , children : [{x:7,y:1,w:2,h:2,brickId:'L_terasse',type:AlxHueLamp}] }
										]
									/*, children : [
										  { x:7,y:0,w:5,h:5,color:'blue',name:'Cuisine'
										  , children : [
												  {x:0,y:8,w:2,h:2,brickId:'capteurContact1',name:'pipo capteur de contact'}
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
										, { x:0,y:8,w:3,h:3,color:'yellow',name:'Horloge',brickId:'21106637055'} // Horloge
										] */
									} );
				 this.U_cat = new Univers( 'U_cat'
										 , [ ['PresoBasicUniversType', PresoBasicUniversType]
  										   , ['PresoListUnivers'     , PresoListUnivers     , {tags:['orthozoom']}]
										   ] );
				 this.U_cat.setData({ x : 5, y : 8
									, w : 4, h : 4
									, brick: this.U_cat, name: 'Equipements', class:'BrickDevice'
									, image:'images/LogoEquipement.png'
									, children : [
										  { x:0,y:0,w:4,h:3,color:'blue',name:'Capteurs de contacts',categId:'3'/*,brick:categ_SP*/}
										, { x:4,y:0,w:4,h:3,color:'blue',name:'Ampoules Hue',categId:'AlxHueLamp'/*,brick:categ_SP*/}
										, { x:8,y:0,w:4,h:3,color:'blue',name:'Prises pilotables',categId:'6'/*,brick:categ_SP*/}
										]
									/*, children : [
										  { x:0,y:0,w:3,h:2,color:'blue',name:'Prises pilotable',categId:'6',brick:categ_SP}
										, { x:3,y:0,w:3,h:2,color:'blue',name:'Thermomètres',categId:'0'}
										, { x:6,y:0,w:3,h:3,color:'blue',name:'Luminomètres',categId:'1'}
										, { x:9,y:0,w:3,h:3,color:'blue',name:'Lampes Hue',categId:'7'}
										, { x:0,y:2,w:3,h:2,color:'blue',name:'Serveurs de médias',categId:'urn:schemas-upnp-org:device:MediaServer:1'}
										, { x:3,y:2,w:3,h:2,color:'blue',name:'Lecteurs de média',categId:'urn:schemas-upnp-org:device:MediaRenderer:1'}
										, { x:6,y:3,w:3,h:3,color:'green',name:'Alx Hue Lamps',categId:'AlxHueLamp'}
										// , { x:9,y:9,w:3,h:3,color:'yellow',name:'Horloge',brickId:'21106637055'} // Horloge
										]*/
									} );
				 this.U_service = new Univers( 'U_service'
										 , [ ['PresoBasicUniversType', PresoBasicUniversType]
  										   , ['PresoListUnivers'     , PresoListUnivers     , {tags:['orthozoom']}]
										   ] );
				 this.U_service.setData({ x : 10, y : 8
									, w : 4, h : 4
									, brick: this.U_service, name: 'Services', class:'BrickService'
									, image:'images/LogoService.png'
									, children : [
										  { x:0,y:0,w:4,h:3,color:'blue',name:'Serveurs de média',categId:'urn:schemas-upnp-org:device:MediaRenderer:1'}
										, { x:4,y:0,w:4,h:3,color:'blue',name:'Lecteurs de média',categId:'urn:schemas-upnp-org:device:MediaRenderer:1'}
										]
									} );

				 this.appendChild( this.U_map );
				 this.appendChild( this.U_cat );
				 this.appendChild( this.U_service );
				 this.Univers = [this.U_map, this.U_cat, this.U_service]
				    // this.Univers = [];
				 
				 // Init the palette for edition mode
				 this.palette = new Palette();
					this.palette.init();
					this.appendChild( this.palette );
					this.palette.addUniverAccess( {id:'map',name:'Habitat spatial',classes:'BrickPlace'}	  , this.U_map);
					this.palette.addUniverAccess( {id:'cat',name:'Equipements',classes:'BrickDevice'}, this.U_cat);
					this.palette.addUniverAccess( {id:'srv',name:'Services',classes:'BrickService'}, this.U_service);
				 
				 // Subscribe to socket.io
				 socket.on('newDevice', function(data) {AlxClient.updateBrickList(data);});

				 this.presentations = []; this.presentations.push( new Preso() );
				 for(var p=0;p<this.presentations.length;p++) {this.presentations[p].init(this);}
				 document.body.appendChild( this.presentations[0].Render() );
				 // this.presentations[0].appendDescendants();
				 // Change presentations for palette
				 this.palette.changePresentationsWithContext( {tags:['orthozoom']}, this.U_map);
				 this.palette.changePresentationsWithContext( {tags:['orthozoom']}, this.U_cat);
				 this.palette.changePresentationsWithContext( {tags:['orthozoom']}, this.U_service);
				 for(var i=0; i<this.Univers.length; i++) {
					 this.Univers[i].layoutDescendants();
					}
				 
				 // Call the server for the tree structure
				 // setTimeout(function() {
				 for(var p=0;p<self.presentations.length;p++) {self.presentations[p].initSemanticZoom();}
				 self.call( 'AppsGate'
						  , {method:'getTreeDescription', args:[]}
						  , function(data) {
								 // console.log(data);
								 var json = JSON.parse(data.value), root = json
								   , id, newUnivers, Udata;
								 // console.log("getTreeDescription <=", json);
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
											 var D = 5, S = 4;
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
											   , Utype = { 'SERVICE_ROOT' : 'BrickService'
														 , 'SPATIAL_ROOT' : 'BrickPlace'
														 , 'PROGRAM_ROOT' : 'BrickPrograms'
														 , 'DEVICE_ROOT'  : 'BrickDevice'
														 };
											 if(!Uname[json[id][Udata].type]) {Uname[json[id][Udata].type] = json[id][Udata].type;}
											 self.palette.addUniverAccess( {id:'U_'+u,name:Uname[json[id][Udata].type],classes:Utype[json[id][Udata].type] || ''}, newUnivers);
											 self.palette.changePresentationsWithContext( {tags:['orthozoom']}, newUnivers);
											 newUnivers.layoutDescendants();
											 for(var preso=0; preso<newUnivers.presentations.length; preso++) {
												 if(Utype[json[id][Udata].type]) {
													 newUnivers.presentations[preso].Render().classList.add( Utype[json[id][Udata].type] );
													}
												}
											}
										 self.call( 'AlxServer'
												  , {mtd:'getBricks', args:[]}
												  , function(data) {if(data.success) {
																		 AlxClient.newBricksList(data.res);
																		 for(var p=0;p<self.presentations.length;p++) {self.presentations[p].initSemanticZoom();}
																		}
														}
												  );
										}
									}
								}
						  )
						// }, 5000); // End setTimeout
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
					 
					 // Check if this brick does still exist
					 if(typeof this.D_bricks[id] === 'undefined') {
						 // console.log("New brick", brick);
						 if(this.bricksMap[type]) {
							 var Constr	  = this.bricksMap[type];
							 var newBrick = new Constr(id, brick);
							 newBrick.isBrick = true;
							 newBrick.type = type;
							 newBrick.name = name;
							 newBrick.init();
							 this.D_bricks[id] = newBrick;
							 for(var p=0;p<this.Univers.length;p++) {
								 this.Univers[p].integrateBrick(newBrick);
								}
							} //else {console.log("Unsupported brick type :", type, " for", brick);}
						} else {console.log("Brick with id", id, "has still been integrated...");}
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
