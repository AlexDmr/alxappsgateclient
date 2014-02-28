define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Space"
	    ]
	  , function(Brick, PresoTilesAlxAppsGate, SpaceBrick) {
			 var UniversBrick = function(id, brick, L_presoFactories) {
				 var TF, context;
				 brick = brick || {};
				 this.init();
				 for(var fDescr in L_presoFactories) {
					 TF = L_presoFactories[fDescr];
					 context = TF[2] || {};
					 context.pixelsMinDensity = context.pixelsMinDensity || 0;
					 context.pixelsMaxDensity = context.pixelsMaxDensity || 999999999;
					 context.pixelsRatio	  = context.pixelsRatio		 || 0;
					 context.tags			  = context.tags			 || [];
					 this.appendPresoFactory(TF[0], TF[1], context);
					}
				 this.id = id;
				 if(id) socket.on(id, function(data) {self.update(data);});
				 
				 this.x = brick.x || this.x;
				 this.x = brick.y || this.x;
				 this.x = brick.w || this.y;
				 this.x = brick.h || this.h;
				 
				 this.mapBrickIdToTile = {};
				 this.mapCategIdToTile = {};

				 this.dataMap = { x : 7, y : 3
								, w : 5, h : 5
								, color: 'darkslategray', brick: this, name: 'Univers'
								, children : []
								};
				 
				 return this;
				};
			 UniversBrick.prototype = new Brick();
			 UniversBrick.prototype.constructor = UniversBrick;
			 UniversBrick.prototype.update = function(data) {
				 console.log("Update UniversBrick", this, "with", data);
				}
			 UniversBrick.prototype.integrateBrick = function(brick) {
				 // Find where to place the brick if it can be...
				 var L; if(this.mapCategIdToTile[brick.type]) {L=this.mapCategIdToTile[brick.type].length;} else {L=0;}
				// Process categories
				 for(var i=0;i<L;i++) {
					 var parentBrick = this.mapCategIdToTile[brick.type][i].brick;
					 if(parentBrick) {parentBrick.appendChild(brick);}
					 brick.tile = {brickId:brick.id}
					}
				// Process bricks id
				 if(this.mapBrickIdToTile[brick.id]) {L=this.mapBrickIdToTile[brick.id].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 var prevBrick = this.mapBrickIdToTile[brick.id][i].brick,
					     data      = this.mapBrickIdToTile[brick.id][i].data;
					 var parentsBrick = prevBrick.parents.slice();
					 brick.tile = prevBrick.tile;
					 for(var p=0; p<parentsBrick.length; p++) {
						 parentsBrick[p].removeChild( prevBrick );
						 parentsBrick[p].appendChild( brick );
						}
					 this.mapBrickIdToTile[brick.id][i].brick = brick;
					}
				// Update the presentations
				 for(var i=0; i<this.presentations.length; i++) {
					 this.presentations[i].integrateBrick(brick);
					}
				}
			 UniversBrick.prototype.getData	= function() {return this.dataMap;}
			 UniversBrick.prototype.setData	= function(data) {
				 this.dataMap = data;
				 this.buildMap( data, this );
				}
			 UniversBrick.prototype.buildMap = function(data, brick, parentBrick) {
				 if(!brick) {
					 var brick = null;
					 if (data.categId && data.brick) {
						 brick = data.brick;
						} else {brick = new SpaceBrick();
								brick.init([]);
							   }
					 data.brick = brick;
					 if(data.categId) {
						 if(!this.mapCategIdToTile[data.categId]) {this.mapCategIdToTile[data.categId] = [];}
						 this.mapCategIdToTile[data.categId].push( {data: data, brick: data.brick} );
						}
					 if(data.brickId) {
						 if(!this.mapBrickIdToTile[data.brickId]) {this.mapBrickIdToTile[data.brickId] = [];}
						 this.mapBrickIdToTile[data.brickId].push( {data: data, brick: brick, parentBrick: parentBrick} );
						}
					}
				 brick.tile = {};
				 brick.tile.x = data.x; brick.tile.y = data.y; 
				 brick.tile.w = data.w; brick.tile.h = data.h; 
				 brick.tile.color = data.color || 'white';
				 brick.tile.name = data.name;
				 brick.tile.categId = data.categId;
				 brick.tile.brickId = data.brickId;
				 brick.tile.class   = data.class || ''
				 brick.setName( data.name || 'NONAME' );
				 
				 if(data.children) {
					 for(var i=0; i<data.children.length; i++) {
						 var brickChild = this.buildMap(data.children[i], null, brick);
						 brick.appendChild( brickChild );
						}
					}
				 return brick;
				}
			 UniversBrick.prototype.parseDataFromServer = function(json, properties) {
				 // Special case for the root
				 var properties = properties || {}, obj = {};
				 for(var i in properties) json.properties.push( {key:i, value:properties[i]} );				 
				 var dataMap = this.RecursiveParseDataFromServer( json );
				 console.log("New univers", json.type);
				 switch(json.type) {
					 case 'SERVICE_ROOT': dataMap.class = 'BrickService'; dataMap.name = 'Services'; break;
					 case 'SPATIAL_ROOT': dataMap.class = 'BrickPlace'  ; dataMap.name = 'Plan'; break;
					 case 'PROGRAM_ROOT': dataMap.class = 'BrickProgram'; dataMap.name = 'Programmes'; break;
					 case 'DEVICE_ROOT' : dataMap.class = 'BrickDevice' ; dataMap.name = 'Appareils'; break;
					}
				 this.buildMap(dataMap, this);
				}
			 UniversBrick.prototype.RecursiveParseDataFromServer = function(json) {
				 var properties = {}, obj = {};
				 for(var i=0; i<json.properties.length; i++) {
					 properties[json.properties[i].key] = json.properties[i].value;
					}
				 
				 // If inChildren, then possibly place automatically the space if nothing is specified
				 // Are place and size specified ?
				 var obj = {};
					obj.x		= properties.x || 0
				    obj.y		= properties.y || 0
				    obj.color	= properties.color //|| 'orange'
				    obj.name	= properties.name  || ''
				    obj.children	= [];
				 
				 // Other attributes
				 if(json.type === "CATEGORY") {
					 obj.categId = properties.deviceType || properties.serviceType;
					 if(!obj.categId) {
						 console.error("OUCH, pas de type pour ce service ou ce device...", json);
						}
					 if( obj.categId === '-532540516'
					   ||obj.categId === '2052964255'
					   ||obj.categId === '415992004'
					   ||obj.categId === '-164696113'
					   ||obj.categId === '794225618'
					   ||obj.categId === '-1943939940'
					   ) {//console.error('Abort for category', obj.categId);
					      return null;
						 } else {console.log("\tNew category", obj.categId);}
					 obj.class   = 'CATEGORY CATEGORY_' + obj.categId;
				     obj.w		 = properties.w || 3
				     obj.h		 = properties.h || 2
					}
				 if(json.type === "DEVICE"  ) {
					 obj.brickId = properties.ref;
					 obj.class	 = 'BRICK DEVICE BRICK_' + obj.brickId;
				     obj.w		 = properties.w || 1
				     obj.h		 = properties.h || 1
					}
				 if(json.type === "SERVICE"  ) {
					 obj.brickId = properties.ref;
					 if(obj.brickId === "player:uuid:20eeece7-abe9-c176-3e1d-c89b021c4d19") {
						 console.log('coucou');
						}
					 obj.class	 = 'BRICK SERVICE BRICK_' + obj.brickId;
				     obj.w		 = properties.w || 1
				     obj.h		 = properties.h || 1
					}
					
				 obj.w = obj.w || properties.w || 1;
				 obj.h = obj.h || properties.h || 1;
				 
				 // Recursive call for children
				 var child, lastX = 0, lastY = 0, H=0;;
				 for(var c=0; c<json.children.length; c++) {
					 child = json[ json.children[c] ];
					 child = this.RecursiveParseDataFromServer(child)
					 if(child) {
						 obj.children.push( child );
						 H = H>child.h?H:child.h;
						 if(lastX + child.w <= 12) {child.x = lastX;} else {child.x = 0; child.y = lastY + H; H = child.h;}
						 lastX = child.x + child.w;
						 lastY = child.y;
						}
					}
				 
				 // Return resulting object
				 return obj;
				}
				
			 return UniversBrick;
			}
	  );