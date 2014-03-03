define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgRect"
		, "utils/svgPoly"
		, "utils/svgText"
		, "utils/svgImage"
		, "utils/svgGroup"
		, "utils/svgButton"
		, "Bricks/Presentations/utils"
		, "Bricks/Space"
		]
	  , function( PresoTile
				, svgAlx, svgUtils
				, svgRect, svgPoly, svgText, svgImage, svgGroup
				, svgButton
				, utils
				, SpaceBrick ) {
			 // Presentation
			 var PresoListUnivers = function() {
				 this.mapBrickIdToBrick = {};
				}
				
			 PresoListUnivers.prototype = new PresoTile();
			 PresoListUnivers.prototype.constructor = PresoListUnivers;
			 PresoListUnivers.prototype.init = function(brick) {
				 PresoTile.prototype.init.apply(this, [brick]);
				}
			 PresoListUnivers.prototype.layoutDescendants = function() {}
			 PresoListUnivers.prototype.integrateBrick = function(brick) {
				 // console.log("PresoListUnivers::integrateBrick",this.brick);
				 // Place the brick presentations at the right places
				 // For categories
				 var parentBrick, data
				   , preso, presoParent
				   , pos, width, x, y, w, h, color = "red"
				   , L, self = this;
				 if(this.mapCategIdToTile[brick.type]) {L=this.mapCategIdToTile[brick.type].length;} else {L=0;}
				 for(var i=0;i<L;i++) {
					 this.mapBrickIdToBrick[ brick.id ] = brick;
					 dataList = this.mapCategIdToTile[brick.type][i];
					 var g   = new svgGroup();
					 var txt = new svgText( { style: {} } ).set(brick.name || brick.id);
					 g.appendChild(txt);
					 dataList.g.appendChild( g );
					 // console.log(this.groot);
					 if(this.groot) this.RecursiveListRePlacement( this.groot );
					 // console.log("yeahh");
					 svgUtils.DD.DragAndDroppable( txt.getRoot()
								 , { tags : ['brick']
								   , size : {w:1,h:1}
								   , start: function(brickId) {return function(config) {
										 // Create a new Tile and register it so that it can be manipulated by drop zones
										 var brick = self.mapBrickIdToBrick[brickId]
										   , preso = brick.getNewPresentation();
										 preso.Render();
										 config.brick = brick;
										 config.presentation = preso;
										};}(brick.id)
								   }
								 );
					}
				 // For direct references
				 if(this.brick.mapBrickIdToTile[brick.id]) {
					 L=this.brick.mapBrickIdToTile[brick.id].length;
					 this.mapBrickIdToBrick[brick.id] = brick; // Change the reference to the actual brick
					} else {L=0;}
				 for(var i=0;i<L;i++) {
					 dataList = this.mapBrickIdToTile[brick.id][i];
					 // console.log('Color in white', brick.id, dataList);
					 dataList.txt.configure( {style: {fill:'white'}} );
					}
				}
			 PresoListUnivers.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 // PresoTile.prototype.Render.apply(this, []);
					 // Change the presentations of descendant spaces
					 this.root  = (this.AlxRoot = new svgGroup()).getRoot();
					 this.groot = (this.AlxGroup = new svgGroup()).getRoot();
					 this.root.appendChild( this.groot );
					 // console.log("PresoListUnivers::Render", this);
					 this.mapCategIdToTile = {};
					 this.mapBrickIdToTile = {};
					 this.RecursiveListPlacement(this.brick, {indent:10,nb:1,root:this.AlxGroup} );
					}
				 return this.root;
				}
			 PresoListUnivers.prototype.RecursiveListRePlacement = function(root) {
				 var L = root.childNodes, c, dec = 10, pos = 1;
				 for(var i=0; i<L.length; i++) {
					 c = L.item(i);
					 if(c.tagName !== 'g') continue;
					 c.setAttribute('transform', 'translate('+dec+','+20*pos+')');
					 pos += this.RecursiveListRePlacement(c);
					 // pos++;
					}
				 return pos;
				}
			 PresoListUnivers.prototype.RecursiveListPlacement = function(brick, infos, dec) {
				 dec = dec || '';
				 var self = this, brickId = brick.id; this.mapBrickIdToBrick[brickId] = brick;
				 // Get the names...
				 // console.log(indent, brick.tile.name); //(indent,preso.brick?preso.brick.name:'NONAME',preso);
				 var nb = infos.nb++
				   , root = infos.root
				   , indent = infos.indent;
				 var g   = new svgGroup( {transform : 'translate('+indent+','+(20*nb)+')'} );
				 var txt = new svgText().set( brick.getName());
				// Is this brick a root for a category ?
				 for(var i in this.brick.mapCategIdToTile) {
					 for(var j=0; j<this.brick.mapCategIdToTile[i].length; j++) {
						 if(this.brick.mapCategIdToTile[i][j].brick === brick) {
							 this.mapCategIdToTile[i] = this.mapCategIdToTile[i] || [];
							 this.mapCategIdToTile[i].push( {g:g,txt:txt,brick:brick} );
							 break;
							}
						}
					}
				// Is this brick the representant of another brick?
				 if(this.brick.mapBrickIdToTile[brick.id]) {
					 this.mapBrickIdToTile[brick.id] = this.mapBrickIdToTile[brick.id] || [];
					 this.mapBrickIdToTile[brick.id].push( {g:g,txt:txt} );
					 this.mapBrickIdToBrick[brick.id] = brick;
					 txt.configure( {style:{fill:'yellow'}} );
					 // console.log('Color in yellow', brick.tile.brickId);
					}
				 svgUtils.DD.DragAndDroppable( txt.getRoot()
							 , { tags : ['brick']
							   , size : {w:1,h:1}
							   , start: function(brickId) {return function(config) {
									 // Create a new Tile and register it so that it can be manipulated by drop zones
									 var brick = self.mapBrickIdToBrick[brickId]
									   , preso = brick.getNewPresentation();
									 preso.Render();
									 config.brick = brick;
									 config.presentation = preso;
									};}(brickId)
							   }
							 );
				 
				 g.appendChild( txt );
				 root.appendChild( g );
				 if(this.brick.mapCategIdToTile[brick.type]) {
					 this.mapCategIdToTile[brick.type].push( g );
					}
				 var infosChildren = {root:g,nb:1,indent:indent}
				 for(var i=0; i<brick.children.length; i++) {
					 this.RecursiveListPlacement(brick.children[i], infosChildren, dec + "\t");
					}
				 if(brick.children) {infos.nb += infosChildren.nb-1;}
				}
			 PresoListUnivers.prototype.primitivePlug = function(c) {}

			 // Return the reference to the PresoBasicAlxHueLamp constructor
			 return PresoListUnivers;
			}
	  );
