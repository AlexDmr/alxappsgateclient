define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		]
	  , function(PresoTile, PresoCategSmartPlug) {
			 // Presentation
			 var PresoBasicUnivers = function() {
				 this.x = this.y = 0;
				 this.w = this.h = 12;
				 this.imgPath = 'images/lego.jpg';
				 this.display = true;
				}
				
			 PresoBasicUnivers.prototype = new PresoTile();
			 PresoBasicUnivers.prototype.constructor = PresoBasicUnivers;
			 PresoBasicUnivers.prototype.init = function(brick, children) {
				 // console.log("PresoBasicUnivers init", this);
				 PresoTile.prototype.init.apply(this,[brick,children]); //this.initPresoTile(brick, children);
				 // console.log(PresoTile.prototype.init);
				 // Image
				 this.svg_image = null;
				 // Plug rooms and spaces
				 this.mapBrickIdToTile = {};
				 this.mapCategIdToTile = {};
				 // this.buildMap(this.brick.getData(), this);
				}
			 PresoBasicUnivers.prototype.buildMap_OLD = function(data, tile) {
				 // console.log(data.name || data.categId);
				 if(!tile) {
					 var tile = null;
					 if (data.categId && data.brick) {
						 tile = data.brick.getNewPresentation();
						} else {tile = new PresoTile();
								tile.init(null, []);
							   }
					 data.tile = tile;
					 if(data.categId) {
						 if(!this.mapCategIdToTile[data.categId]) {this.mapCategIdToTile[data.categId] = [];}
						 this.mapCategIdToTile[data.categId].push( {data: data, tile: tile, brick: data.brick} );
						}
					 if(data.brickId) {
						 if(!this.mapBrickIdToTile[data.brickId]) {this.mapBrickIdToTile[data.brickId] = [];}
						 this.mapBrickIdToTile[data.brickId].push( {data: data, tile: tile} );
						}
					}
				 tile.x = data.x; tile.y = data.y; tile.w = data.w; tile.h = data.h; tile.color = data.color || 'white';
				 tile.name = data.name;
				 if(data.children) {
					 for(var i=0; i<data.children.length; i++) {
						 var tileChild = this.buildMap(data.children[i], null);
						 tile.appendChild( tileChild );
						}
					}
				 return tile;
				}
			 PresoBasicUnivers.prototype.integrateBrick = function(brick) {
				 // console.log("PresoBasicUnivers::integrateBrick",this.brick);
				 // Place the brick presentations at the right places
				 // For categories
				 var f_config = function() {this.x = x; this.y = y; this.w = w; this.h = h; this.color = color;}
				   , parentBrick, data
				   , preso, presoParent
				   , pos, width, x, y, w, h, color = "red"
				   , L;
				 if(this.brick.mapCategIdToTile[brick.type]) {L=this.brick.mapCategIdToTile[brick.type].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 parentBrick = this.brick.mapCategIdToTile[brick.type][i].brick;
					 // console.log("\tCateg",brick.type);
					 for(var p=0; p<parentBrick.presentations.length; p++) {
						 presoParent = parentBrick.presentations[p];
						 preso		 = presoParent.getPresoBrickFromDescendant(brick);
						 if(preso === null) {
							 console.error('Categ preso is null for', brick, "under", presoParent);
							 continue;
							}
						 width = Math.floor( presoParent.innerMagnitude*presoParent.w / Math.max(presoParent.w, presoParent.h) );
						 pos   = presoParent.children.indexOf(preso);
						 x 	   = pos % width;
						 y     = Math.floor(pos / width);
						 w = h = 1; color = preso.color;
						 f_config.apply(preso,[]);
						 preso.forceRender();
						}
					}
				 // For direct references
				 if(this.brick.mapBrickIdToTile[brick.id]) {L=this.brick.mapBrickIdToTile[brick.id].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 data		 = this.brick.mapBrickIdToTile[brick.id][i].data;
						x = data.x; y = data.y; w = data.w; h = data.h; color = data.color;
					 parentBrick = this.brick.mapBrickIdToTile[brick.id][i].parentBrick;
					 console.log("Map", data, parentBrick);
					 for(var p=0; p<parentBrick.presentations.length; p++) {
						 presoParent = parentBrick.presentations[p];
						 preso		 = presoParent.getPresoBrickFromDescendant(brick);
						 if(preso === null) {
							 console.error('Individual preso is null for', brick, "under", presoParent);
							 continue;
							}
						 f_config.apply(preso,[]);
						 preso.forceRender();
						}
					}
				}
			 PresoBasicUnivers.prototype.integrateBrick_OLD = function(brick) {
				 // console.log("Integrating", brick);
				 // Find where to place the brick if it can be...
				 var L; if(this.mapCategIdToTile[brick.type]) {L=this.mapCategIdToTile[brick.type].length;} else {L=0;}
				 // console.log('New brick typed ', brick.type, 'mapped to ', L);
				// Process categories
				 for(var i=0;i<L;i++) {
					 var parentTile  = this.mapCategIdToTile[brick.type][i].tile
					   , parentBrick = this.mapCategIdToTile[brick.type][i].brick;
					 var width = Math.floor( this.innerMagnitude*parentTile.w / Math.max(parentTile.w, parentTile.h) );
					 var x = parentTile.children.length % width;
					 var y = Math.floor(parentTile.children.length / width);
					 var f_config = function() {this.x = x; this.y = y; this.w = 1; this.h = 1;};
					 if(parentBrick) {
						 parentBrick.appendChild(brick);
						 var tile = this.getPresoBrickFromDescendant(brick);
						 f_config.apply(tile,[]);
						 tile.forceRender();
						} else {
								 var tile = parentTile.appendChildFromBrick	( brick
																			, f_config
																			, undefined
																			// , this.getChildrenContext(1, 1)
																			); 
								}
					}
				// Process bricks id
				 if(this.mapBrickIdToTile[brick.id]) {L=this.mapBrickIdToTile[brick.id].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 var prevTile = this.mapBrickIdToTile[brick.id][i].tile,
					     data     = this.mapBrickIdToTile[brick.id][i].data;
					 var parentTile = prevTile.parent;
					 parentTile.removeChild( prevTile );
					 var tile = parentTile.appendChildFromBrick	( brick
					 											, function() {this.x = data.x; this.y = data.y; this.w = data.w; this.h = data.h; this.color = data.color || 'white';}
																, undefined
																// , this.getChildrenContext(1, 1)
																);
					 this.mapBrickIdToTile[brick.id][i].tile = tile;
					}
				}
			 PresoBasicUnivers.prototype.Render = function() {
				 PresoTile.prototype.Render.apply(this,[]);
				 if(!this.svg_image) {
					 // Group containing image and clip path
					 this.gImage = document.createElementNS("http://www.w3.org/2000/svg", 'g');
						this.gImage.setAttribute('transform', 'translate(-20,-20)');
						this.gImage.style.display = 'none';

					 // clipPath 
					 this.clipPath = document.createElementNS("http://www.w3.org/2000/svg", 'clipPath');
						var idClip = this.getUniqueId();
						this.clipPath.setAttribute('id', idClip);
						var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
							circle.setAttribute('cx', '100');
							circle.setAttribute('cy', '100');
							circle.setAttribute('r', '100');
							this.clipPath.appendChild( circle );
					 
					 // Image 
					 this.svg_image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
						 this.svg_image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.imgPath);
						 this.svg_image.setAttribute('width' , '200');
						 this.svg_image.setAttribute('height', '200');
						 this.svg_image.setAttribute('clip-path', 'url(#'+idClip+')');
					 
					 var circleDisplay = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
						circleDisplay.setAttribute('cx', '100');
						circleDisplay.setAttribute('cy', '100');
						circleDisplay.setAttribute('r', '100');
						circleDisplay.style.fill = 'none';
						circleDisplay.style.stroke = 'black';
						circleDisplay.style.strokeWidth = '10';
					 
					 this.root.appendChild( this.gImage );
					 this.gImage.appendChild( this.clipPath );
					 this.gImage.appendChild( this.svg_image );
					 this.gImage.appendChild( circleDisplay );
					}
				 return this.root;
				}
			 PresoBasicUnivers.prototype.CB_Fade = function(dt, v0, v1) {
				 if(v0 === 1 && dt === 0) {this.gImage.style.display = 'inherit';}
				 if(v0 === 0 && dt === 0) {this.rect.style.display = 'inherit';}
				 this.gImage.style.opacity = Math.easeInOutQuad(dt, v1, v0-v1, 1);
				 this.rect.style.opacity = Math.easeInOutQuad(dt, v0, v1-v0, 1);
				 PresoTile.prototype.CB_Fade.apply(this,[dt,v0,v1]);;
				 if(v1 === 1 && dt >= 1 && this.display) {this.gImage.style.display = 'none';}
				 if(v1 === 0 && dt >= 1 && !this.display) {this.rect.style.display = 'none';}
				}
			 PresoBasicUnivers.prototype.adaptRender = function(scale, L_CB) {
				 // console.log('PresoBasicUnivers::adaptRender',scale);
				 return PresoTile.prototype.adaptRender.apply(this, [scale, L_CB]);
				}

			 // Return the reference to the PresoBasicUnivers constructor
			 return PresoBasicUnivers;
			}
	  );
