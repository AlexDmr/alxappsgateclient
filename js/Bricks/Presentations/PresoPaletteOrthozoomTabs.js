define( [ "Bricks/Presentations/PresoTilesAlxAppsGate"
		, "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgRect"
		, "utils/svgPoly"
		, "utils/svgText"
		, "utils/svgImage"
		, "utils/svgGroup"
		, "utils/svgButton", "utils/svgEntry"
		, "utils/svgUtils"
		, "Bricks/Presentations/utils"
		, "Bricks/Space"
		]
	  , function( PresoTile
				, svgAlx, svgUtils
				, svgRect, svgPoly, svgText, svgImage, svgGroup
				, svgButton, svgEntry
				, svgUtils
				, utils
				, SpaceBrick ) {
			 // Presentation
			 var PresoPaletteOrthozoomTabs = function() {
				 // Init tabs
				 this.tabsList = [];
				 this.displayPalette = this.displayTileEdition = this.feedBackEdition = false;
				}
				
			 PresoPaletteOrthozoomTabs.prototype = new PresoTile();
			 PresoPaletteOrthozoomTabs.prototype.init = function(brick) {
				 PresoTile.prototype.init.apply(this, [brick]);
				 this.displayPalette = false;
				 this.DropZone = false;
				}
			 PresoPaletteOrthozoomTabs.prototype.isEditing = function() {
				 return this.displayPalette || this.displayTileEdition;
				}
			 PresoPaletteOrthozoomTabs.prototype.FeedBackEdition = function(OnOff) {
				 if(this.feedBackEdition === OnOff) {return}
				 this.feedBackEdition = OnOff;
				 if(OnOff) {
					 document.addEventListener('click', this.blocClick, true);
					 var L = this.L_bricks_dropShadowFilter = document.querySelectorAll('.Brick.dropShadowFilter');
					 for(var i=0; i<L.length; i++) {
						 L.item(i).removeAttribute('filter');
						}
					} else  {document.removeEventListener('click', this.blocClick, true);
							 var L = this.L_bricks_dropShadowFilter;
							 for(var i=0; i<L.length; i++) {
								 L.item(i).setAttribute('filter', 'url(#dropShadow)');
								}
							}
				}
			 PresoPaletteOrthozoomTabs.prototype.toggleTileEdition = function(b) {
				 var self = this;
				 if(b) {this.editedTile.root.classList.add('selected');
					   } else {this.editedTile.root.classList.remove('selected');}
				 if(b === this.displayTileEdition) {return}
				 var b = b || (this.displayTileEdition = !this.displayTileEdition);
				 this.displayTileEdition = b;
				 this.FeedBackEdition(this.isEditing());
				 
				 // Animate the top and right menus...
				 var X1 = b?50:-200
				   , X2 = -150 - X1;
				 utils.animate( 1000
							  , function(obj) {
									 var X = Math.easeInOutQuad(obj.dt,X1,X2-X1,1);
									 self.panelTile.Edition.matrixScalars(1,0,0,1,X,55);
									 if(obj.dt === 0) {self.panelTile.Edition.getRoot().style.display = 'inherit';}
									 if(!b && obj.dt >= 1) {self.panelTile.Edition.getRoot().style.display = 'none';}
									}
							  );
				}
			 PresoPaletteOrthozoomTabs.prototype.toggle = function() {
				 var self = this;
				 var b = this.displayPalette = !this.displayPalette;
				 this.FeedBackEdition(this.isEditing());
				 // Animate the top and right menus...
				 var X1 = b?70:-150
				   , X2 = -80 - X1
				   , Y1 = b?0:60
				   , Y2 = 60 - Y1;
				 utils.animate( 1000
							  , function(obj) {
									 var X = Math.easeInOutQuad(obj.dt,X1,X2-X1,1)
									   , Y = Math.easeInOutQuad(obj.dt,Y1,Y2-Y1,1);
									 self.svgAlxgroot.matrixScalars(1,0,0,1,X,55);
									 self.svgAlxTopMenu.matrixScalars(1,0,0,1,0,Y);
									 if(obj.dt === 0) {
										 self.svgAlxgroot.getRoot().style.display = self.svgAlxTopMenu.getRoot().style.display = 'inherit';
										}
									 if(!b && obj.dt >= 1) {
										 self.svgAlxgroot.getRoot().style.display = self.svgAlxTopMenu.getRoot().style.display = 'none';
										}
									}
							  );
				}
			 PresoPaletteOrthozoomTabs.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
					 // Feedback for clic interuption
					 if(this.blocClick) {
						 document.removeEventListener('click', this.blocClick, true);
						}
					 this.blocClick = function(e) {
						 if(svgUtils.ancestors(e.target).indexOf(self.root) === -1)
							e.stopPropagation();
						}

					 // SVG structure
					 this.svgAlxRoot = new svgGroup( {class: 'paletteRoot'} );
						// Internal structure for top menu
						 this.svgAlxTopMenu = new svgGroup();
							this.svgAlxTopMenu.appendChild( new svgRect( {x:-950,y:-60,width:1000,height:60,style:{fill:'lightgrey',stroke:'black'}} ) );
							this.space = new svgRect( {style:{fill:'grey',stroke:'black'}} ).translate(-150,-55);
							this.svgAlxTopMenu.appendChild( this.space ); //this.root.appendChild( this.space.getRoot() );
							this.svgAlxRoot.appendChild( this.svgAlxTopMenu );
						// Internal structure for right tabs
						 this.root = this.svgAlxRoot.getRoot();
						 this.svgAlxgroot = new svgGroup().translate(70,55);
							this.groot = this.svgAlxgroot.getRoot();
							this.svgAlxRoot.appendChild( this.svgAlxgroot );
						 this.svgAlxRoot.translate(950,0);
					 
					 this.btSave = new svgButton({bg	  : {style: {fill: 'lightgreen', stroke: 'black'}}, 
												  content : {value:'Sauver les traces',style:{fontFamily: 'Consolas'}}
												 }).command( function() {
																 self.brick.call( 'AlxServer'
																				, {mtd:'saveBricksToFile',args:[Date.now()+'.log']}
																				, function(data) {console.log("Save :", data);}
																				);
																} );
					 this.svgAlxTopMenu.appendChild(this.btSave.translate(-900,-20));
					 
					 svgUtils.DD.DragAndDroppable( this.space.getRoot()
												 , { tags : ['brick']
												   , size : {w:4,h:3}
												   , start: function(config) {
														 // Create a new Tile and register it so that it can be manipulated by drop zones
														 var space = new SpaceBrick().init()
														   , preso = space.getNewPresentation();
														 preso.Render();
														 config.brick = space;
														 config.presentation = preso;
														}
												   }
												 );
					 var UA = this.brick.UniversAccess;
					 for(var i in UA) {this.addUniverAccess(UA[i].descr, UA[i].brick);}
					 
					// Polygon for the button
					 this.polyButton = new svgRect( { x:-30,y:-60,width:150,height:150,rx:75,ry:75
													, style: {fill:'lightyellow',stroke:'black'} } );
					 this.svgAlxRoot.appendChild( this.polyButton );
					// Image for the button
					 this.imageButton = new svgImage( {width:75,height:75,transform:'translate(-25,0)'} ).load('images/parameters.png');
					 this.svgAlxRoot.appendChild( this.imageButton );
					 this.imageButton.getRoot().addEventListener( 'click'
						, function() {self.toggle();}
						, false );
						
					 this.root.addEventListener('longPress', function(e) {e.stopPropagation();}, false);
					 this.root.addEventListener('dblclick' , function(e) {e.stopPropagation();}, false);
					}
				 
				 return this.root;
				}
			 PresoPaletteOrthozoomTabs.prototype.selectTab = function(root) {
				 var p = root.parentNode
				 p.removeChild(root);
				 p.appendChild(root);
				}
			 PresoPaletteOrthozoomTabs.prototype.addTab = function(name, classes) {
				 var L      = 1000
				   , H      = window.innerHeight * L / window.innerWidth
				   , tabNum = this.tabsList.length
				   , W      = 200
				   , self	= this;
				 
				 var text    = new svgText( {} ).set( name );
				 var poly    = new svgPoly( {class: classes
											} ); poly.getRoot().classList.add('AlxTab');
				 
				 var tabRoot = new svgGroup( {} );
				 
				 tabRoot.root.addEventListener( 'click', function(e) {self.selectTab(tabRoot.root);}, false);
				 tabRoot.appendChild( poly );
				 tabRoot.appendChild( text );
				
				 var objTab = { tabRoot : tabRoot
							  , poly    : poly
							  , text    : text
							  , Y2      : 0
							  };
				 self.tabsList.push	( objTab );
				 
				 tabRoot.getRoot().addEventListener( 'DOMNodeInsertedIntoDocument'
					, function(e) 	{var bbox = text.getBBox();
									 // console.log( bbox );
									 var Y1 = tabNum?self.tabsList[tabNum-1].Y2:10
									   , Y2 = Y1 + bbox.width + 6;
									 self.tabsList[tabNum].Y2 = Y2 + 5;
									 poly.configure( {points: '0 0 '+W+' 0 '+W+' '+H+' 0 '+H+' 0 '+(Y2+10)+' -20 '+Y2+' -20 '+Y1+' 0 '+(Y1-10)} );
									 text.matrixId().rotate(-90).translate(-Y2+3, -3);
									}
					, false );
				 this.svgAlxgroot.appendChild( tabRoot );
					
				 return objTab;
				}
			 PresoPaletteOrthozoomTabs.prototype.addUniverAccess = function(objDescr, univers) {
				 var objTab = this.addTab(objDescr.name, objDescr.classes);
				 objTab.objDescr = objDescr;
				 objTab.brick	 = univers;
				 return objTab;
				}
			 PresoPaletteOrthozoomTabs.prototype.adaptRender = function(scale, L_CB) {}
			 PresoPaletteOrthozoomTabs.prototype.primitiveUnPlug = function(child) {
				 for(var i=0; i<this.tabsList.length; i++) {
					 if(this.tabsList[i].brick === child.brick) {
						 if(child.root)
							this.tabsList[i].tabRoot.root.removeChild( child.root );
						 break;
						}
					}
				}
			 PresoPaletteOrthozoomTabs.prototype.primitivePlug = function(child) {
				 this.Render();
				 for(var i=0; i<this.tabsList.length; i++) {
					 if(this.tabsList[i].brick === child.brick) {
						 this.tabsList[i].tabRoot.root.appendChild( child.Render() );
						 child.Render().setAttribute('transform', '');
						 break;
						}
					}
				}
			 PresoPaletteOrthozoomTabs.prototype.editTile = function(tile) {
				 var self = this;
				 // Feedback for the selected tile
				 if(this.editedTile) {
					 this.editedTile.root.classList.remove('selected');
					}
				 this.editedTile = tile;
				 // Creation of the edition palette if required
				 if(this.root) {
					 if(!this.panelTile) {
						 this.panelTile = {};
						 this.panelTile.Edition = new svgGroup( { transform: 'translate(50,0)'
																, class: 'TileEdition' } );
						 this.panelTile.bgRect  = new svgRect(	{ x:0 , y:0, width:250, height:window.innerHeight * 1000 / window.innerWidth
																, class: 'background'
																} );
						 this.panelTile.labelName = new svgText ().set( 'Nom : ' ).translate(3,30);
						 this.panelTile.entryName = new svgEntry().set( tile.brick.tile.name );
						 this.panelTile.Edition.appendChild( this.panelTile.bgRect );
						 this.panelTile.Edition.appendChild( this.panelTile.labelName );
						 this.panelTile.Edition.appendChild( this.panelTile.entryName );
						 this.svgAlxRoot.appendChild( this.panelTile.Edition );
						 this.panelTile.entryName.rightTo(this.panelTile.labelName);
						 
						 // Buttons
						 this.btOK = new svgButton( { bg	  : {style: {fill: 'lightgreen', stroke: 'black'}}
												    , content : {value:'Valider',style:{fontFamily: 'Consolas'}}
												    }
												  ).command( function() {
																 console.log("Valider");
																 self.editedTile.brick.tile.name = self.panelTile.entryName.get();
																 self.editedTile.brick.setName( self.editedTile.brick.tile.name );
																 self.toggleTileEdition(false);
																 self.editedTile.root.classList.remove('selected');
																 self.editedTile = null;
																} );
						 this.btCA = new svgButton( { bg	  : {style: {fill: '#F99', stroke: 'black'}}
												    , content : {value:'Annuler',style:{fontFamily: 'Consolas'}}
												    }
												  ).command( function() {
																 console.log("Annuler");
																 self.editedTile.root.classList.remove('selected');
																 self.toggleTileEdition(false);
																 self.editedTile.root.classList.remove('selected');
																 self.editedTile = null;
																} );
						 this.panelTile.Edition.appendChild( this.btOK.translate(50, 300) );
						 this.panelTile.Edition.appendChild( this.btCA.translate(150, 300) );
						 
						 
						}
					 // set up the edition panel
					 // Name
					 this.panelTile.entryName.set( tile.brick.tile.name );
					 // size (depend wether it is a brick or a group)
					 if(tile.brick.isSpace) {
						 console.log("A space is under edition, we can change width and height");
						}
					 if(tile.brick.isBrick) {
						 console.log("A space is under edition, we can change width and height");
						}
					 
					 this.toggleTileEdition(true);
					}
				}
				
			 // Return the reference to the PresoPaletteOrthozoomTabs constructor
			 return PresoPaletteOrthozoomTabs;
			}
	  );
