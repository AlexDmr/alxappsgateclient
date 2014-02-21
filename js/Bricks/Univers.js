define( [ "Bricks/protoBricks"
	    , "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "Bricks/Space"
	    ]
	  , function(Brick, PresoTilesAlxAppsGate, SpaceBrick) {
			 var UniversBrick = function(id, brick, L_presoFactories) {
				 var TF;
				 brick = brick || {};
				 this.init();
				 for(var fDescr in L_presoFactories) {
					 TF = L_presoFactories[fDescr];
					 this.appendPresoFactory(TF[0], TF[1], TF[2]);
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
				 // console.log("Integrating", brick);
				 // Find where to place the brick if it can be...
				 var L; if(this.mapCategIdToTile[brick.type]) {L=this.mapCategIdToTile[brick.type].length;} else {L=0;}
				// Process categories
				 for(var i=0;i<L;i++) {
					 var parentBrick = this.mapCategIdToTile[brick.type][i].brick;
					 if(parentBrick) {parentBrick.appendChild(brick);}
					}
				// Process bricks id
				 if(this.mapBrickIdToTile[brick.id]) {L=this.mapBrickIdToTile[brick.id].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 var prevBrick = this.mapBrickIdToTile[brick.id][i].brick,
					     data      = this.mapBrickIdToTile[brick.id][i].data;
					 var parentsBrick = prevBrick.parents.slice();
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
				 if(data.children) {
					 for(var i=0; i<data.children.length; i++) {
						 var brickChild = this.buildMap(data.children[i], null, brick);
						 brick.appendChild( brickChild );
						}
					}
				 return brick;
				}
			
			 return UniversBrick;
			}
	  );