define( [ "Bricks/Presentations/protoPresentation"
		, "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgUtils"
		]
	  , function(Presentation, PresoTile, svgUtils) {
			 var PresoBasicUnivers = function() {
				 this.imgPath = 'images/lego.jpg';
				 this.display = true;
				}
				
			 PresoBasicUnivers.prototype = new PresoTile();
			 PresoBasicUnivers.prototype.constructor = PresoBasicUnivers;
			 PresoBasicUnivers.prototype.init = function(brick, children) {
				 PresoTile.prototype.init.apply(this,[brick,children]); //this.initPresoTile(brick, children);
				 // Image
				 this.svg_image = null;
				 // Plug rooms and spaces
				 this.mapBrickIdToTile = {};
				 this.mapCategIdToTile = {};
				 // this.buildMap(this.brick.getData(), this);
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
					 // console.log("Map", data, parentBrick);
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
			 PresoBasicUnivers.prototype.layoutDescendants = function() {
				 console.log("Univers", this.imgPath);
				 var D = this.getDescendants(this), data, L2clean = [];
				 for(var i=0; i<D.length; i++) {
					 data = this.brick.D_bricks[ D[i].brick.localBrickId ];
					 if(!data) {	// Try the reference to brickId
						 var refs = this.brick.mapBrickIdToTile[ D[i].brick.id ]
						   , parentBrick = D[i].parent.brick;
						 // Look for the ref that does correspond to parent brick of D[i]
						 if(refs) {
							 for(var r=0; r<refs.length; r++) {
								 if(refs[r].parentBrick === parentBrick && !refs[r].used) {
									 data = refs[r].data;
									 refs[r].used = true; L2clean.push(refs[r]);
									 break;
									}
								}
							}
						}
					 if(data) {
						 D[i].x = data.x;
						 D[i].y = data.y;
						 D[i].w = data.w;
						 D[i].h = data.h;
						 D[i].color = data.color || D[i].color;
						 D[i].class = data.class || D[i].class;
						 D[i].forceRender();
						 // console.log("forceRender", D[i]);
						} else {
								console.error('A brick is plugged into univers but not referenced in the description data...');}
					 // console.log("\t", D[i].brick, data);
					}
				 // Cleanup marking...
				 for(var i=0; i<L2clean.length; i++) {
					 delete L2clean[i].used;
					}
				}
			 PresoBasicUnivers.prototype.deletePrimitives = function() {
				 PresoTile.prototype.deletePrimitives.apply(this, []);
				 if(this.svg_image) {
					 if(this.svg_image.parentNode) {this.svg_image.parentNode.removeChild( this.svg_image );}
					 delete this.svg_image;
					}
				}
			 PresoBasicUnivers.prototype.Render = function() {
				 PresoTile.prototype.Render.apply(this,[]);
				 if(!this.svg_image) {
					 this.svgG.removeChild( this.svgFgRect );
					 // Group containing image and clip path
					 this.gImage = document.createElementNS("http://www.w3.org/2000/svg", 'g');
						this.gImage.setAttribute('transform', 'translate(-20,-20)');
						this.gImage.style.display = 'none';

					 // clipPath 
					 this.clipPath = document.createElementNS("http://www.w3.org/2000/svg", 'clipPath');
						var idClip = this.getUniqueId();
						var imgSize = this.getTileSize()*Math.max(this.w,this.h) - 5;
						this.clipPath.setAttribute('id', idClip);
						var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
							circle.setAttribute('cx', imgSize/2);//'100');
							circle.setAttribute('cy', imgSize/2);//'100');
							circle.setAttribute('r', imgSize/2);//'100');
							this.clipPath.appendChild( circle );
					 
					 // Image 
					 this.svg_image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
						 this.svg_image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.imgPath);
						 this.svg_image.setAttribute('width' , imgSize);//'200');
						 this.svg_image.setAttribute('height', imgSize);//'200');
						 this.svg_image.setAttribute('clip-path', 'url(#'+idClip+')');
					 
					 var circleDisplay = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
						circleDisplay.setAttribute('cx', imgSize/2);//'100');
						circleDisplay.setAttribute('cy', imgSize/2);//'100');
						circleDisplay.setAttribute('r', imgSize/2);//'100');
						circleDisplay.style.fill = 'none';
						circleDisplay.style.stroke = 'black';
						circleDisplay.style.strokeWidth = '4';
					 
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
			 PresoBasicUnivers.prototype.appendChild = function(c) {
				 return Presentation.prototype.appendChild.apply(this, [c]);
				}
			 PresoBasicUnivers.prototype.removeChild = function(c) {
				 return Presentation.prototype.removeChild.apply(this, [c]);
				}

			 // Return the reference to the PresoBasicUnivers constructor
			 return PresoBasicUnivers;
			}
	  );
