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
			 var PresoPaletteOrthozoomTabs = function() {
				 // Init tabs
				 this.tabsList = [];
				 this.displayPalette = false;
				}
				
			 PresoPaletteOrthozoomTabs.prototype = new PresoTile();
			 PresoPaletteOrthozoomTabs.prototype.init = function(brick) {
				 PresoTile.prototype.init.apply(this, [brick]);
				 this.displayPalette = false;
				 this.DropZone = false;
				}
			 PresoPaletteOrthozoomTabs.prototype.toggle = function() {
				 var self = this;
				 var b = this.displayPalette = !this.displayPalette;
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
									}
							  );
				}
			 PresoPaletteOrthozoomTabs.prototype.Render = function() {
				 if(!this.root) {
					 var self = this;
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
														 var space = new SpaceBrick()
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
					 this.polyButton = new svgRect( { x:-5,y:-45,width:100,height:100,rx:50,ry:50
													, style: {fill:'lightyellow',stroke:'black'} } );
					 this.svgAlxRoot.appendChild( this.polyButton );
					// Image for the button
					 this.imageButton = new svgImage( {width:50,height:50} ).load('images/parameters.png');
					 this.svgAlxRoot.appendChild( this.imageButton );
					 this.imageButton.getRoot().addEventListener( 'click'
						, function() {self.toggle();}
						, false );
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
				 tabRoot.getRoot().addEventListener( 'DOMNodeInsertedIntoDocument'
					, function(e) 	{var bbox = text.getBBox();
									 console.log( bbox );
									 var Y1 = tabNum?self.tabsList[tabNum-1].Y2:10
									   , Y2 = Y1 + bbox.width + 6;
									 self.tabsList[tabNum].Y2 = Y2 + 5;
									 poly.configure( {points: '0 0 '+W+' 0 '+W+' '+H+' 0 '+H+' 0 '+(Y2+10)+' -20 '+Y2+' -20 '+Y1+' 0 '+(Y1-10)} );
									 text.matrixId().rotate(-90).translate(-Y2+3, -3);
									}
					, false );
				 
				 tabRoot.root.addEventListener( 'click', function(e) {self.selectTab(tabRoot.root);}, false);
				 tabRoot.appendChild( poly );
				 tabRoot.appendChild( text );
				 this.svgAlxgroot.appendChild( tabRoot );
				
				 self.tabsList.push	( { tabRoot : tabRoot
									  , poly    : poly
									  , text    : text
									  , Y2      : 0
									  } );
				 
				 return tabRoot;
				}
			 PresoPaletteOrthozoomTabs.prototype.addUniverAccess = function(objDescr, univers) {
				 var svgG = this.addTab(objDescr.name, objDescr.classes);
				 return svgG;
				}
			 PresoPaletteOrthozoomTabs.prototype.adaptRender = function(scale, L_CB) {}
			 // Return the reference to the PresoPaletteOrthozoomTabs constructor
			 return PresoPaletteOrthozoomTabs;
			}
	  );
