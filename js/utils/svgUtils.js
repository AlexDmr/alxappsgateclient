define( [ "utils/svg"
		, "Bricks/Presentations/utils"
		, "utils/svgLine"
		, "utils/svgRect"
		]
	  , function(DragManager, utils, svgLine, svgRect) {
			 var OsvgRect = null, lineH = null, lineV = null, OsvgPoint = null;
			 
			 // Define a singleton
			 var svgUtils = {
				   onDOMNodeInsertedIntoDocument : function(node, CB) {
					 var mutObs = new MutationObserver(
										 function(mutations) {
											 var L = svgUtils.ancestors(node);
											 if(L.indexOf(document.body) >= 0) {
												 CB.apply(mutations, []);
												 this.disconnect();
												}
											}
										);
					 mutObs.observe( document, {subtree: true, childList:true});
					}
				 , ancestors : function(node) {
					 var L = [];
					 while(node.parentElement || node.parentNode) {
						 L.push( node.parentElement || node.parentNode );
						 node = node.parentElement || node.parentNode;
						}
					 return L;
					}
				, getSvgCanvas : function(node) {
					 while(node && node.tagName !== 'svg') {
						 node = node.parentElement || node.parentNode;
						}
					 return node
					}
				, isDisplayed : function(root, n) {
					 while(n && n !== root) {
						 if(n.style.display === 'none') {return false;}
						 n = n.parentElement || n.parentNode;
						}
					 return true;
					}
				, intersectionRect : function(R1x1,R1y1,R1x2,R1y2
											 ,R2x1,R2y1,R2x2,R2y2) {
					 return !( (R1x1 >= R2x2) || (R2x1 >= R1x2)
					         ||(R1y1 >= R2y2) || (R2y1 >= R1y2) );
					}
				, DD : {
					  L_dragged			: []
					, L_dropZones		: []
					, D_draggingPtr		: {}
					, getDropZoneUnder	: function(n) {
						 while(n && !n.AlxDropZone) {n = n.parentElement || n.parentNode;}
						 return n?n.AlxDropZone:null;
						}
					, removeDropZone : function(node) {
						 var i = 0;
						 while(i < this.L_dropZones.length) {
							 if(this.L_dropZones[i].node === node) {
								 var config = this.L_dropZones[i].config;
								 node.removeEventListener('AlxDD_enter'		, config.enter		, false);
								 node.removeEventListener('AlxDD_leave'		, config.leave		, false);
								 node.removeEventListener('AlxDD_drop' 		, config.drop 		, false);
								 node.removeEventListener('AlxDD_dragOver'	, config.dragOver	, false);
								 this.L_dropZones.splice(i,1);
								 break;
								}
							 i++;
							}
						 return this.L_dropZones;
						}
					, DropZone			: function(node, config) {
						 // config contains possible attributes :
						 //		- tags	   : an array of string
						 //		- drop	   : a callback
						 //		- enter	   : a callback
						 //		- leave	   : a callback
						 //		- dragOver : a callback
						 config			= config			|| {};
						 config.tags	= config.tags		|| [];
						 config.dragOver= config.dragOver	|| null;
						 config.drop	= config.drop		|| null;
						 config.enter	= config.enter		|| null;
						 config.leave	= config.leave		|| null;
						 config.cancel	= config.cancel		|| null;
						 
						 var dz = {node:node,config:config};
						 this.L_dropZones.push( dz );
						 node.AlxDropZone = dz;
						 
						 node.addEventListener('AlxDD_enter'	, config.enter		, false);
						 node.addEventListener('AlxDD_leave'	, config.leave		, false);
						 node.addEventListener('AlxDD_drop' 	, config.drop 		, false);
						 node.addEventListener('AlxDD_dragOver'	, config.dragOver	, false);
						}
					, removeDragAndDroppable : function(node) {
						 var pos = -1;
						 for(var i=0; i<this.L_configs.length; i++) {
							 if(this.L_configs[i].node === node) {
								 pos = i;
								 break;
								}
							}
						 if(pos) {
							 var config = this.L_configs[pos];
							 config.node.removeEventListener( 'mousedown' , config.mousedown , false);
							 config.node.removeEventListener( 'touchstart', config.touchstart, false);
							 this.L_configs.splice(pos, 1);
							 // console.log("Removing DD for", config);
							}
						}
					, DragAndDroppable	: function(node, config) {
						 // config contains possible attributes :
						 //		- tags  : an array of string
						 //		- start : a callback
						 //		- end	: a callback
						 //		- cancel: a callback
						 config 		= config		|| {};
						 config.tags	= config.tags	|| [];
						 config.start	= config.start	|| null;
						 config.end		= config.end	|| null;
						 config.cancel	= config.cancel	|| null;
						 config.nodeFeedBack = config.nodeFeedBack || node;
						 config.node	= node;
						 
						 this.L_configs = this.L_configs || [];
						 this.L_configs.push( config );
						 
						 // Body
						 var self = this;
						 config.mousedown = function(e) {
													 var svg = svgUtils.getSvgCanvas(node);
													 var clone = self.start_DragAndDroppable(svg, config.nodeFeedBack, e, config);
													 DragManager.startDragMouse(e, clone);
													};
						 config.touchstart = function(e) {
													 var svg = svgUtils.getSvgCanvas(node);
													 var clone = self.start_DragAndDroppable(svg, config.nodeFeedBack, e.changedTouches.item(0), config);
													 DragManager.startDragTouch(e, clone);
													};
						 node.addEventListener	( 'mousedown'
												, config.mousedown
												, false );
						 node.addEventListener	( 'touchstart'
												, config.touchstart
												, false );
												
						 return config;
						}
					, enrichConfigForEvent : function(config, event, x, y, n, clone) {
						 OsvgPoint.x = x; OsvgPoint.y = y;
						 var nPoint
						   , dPoint = OsvgPoint.matrixTransform( clone.getCTM().inverse() );
						 if(n) {
							 nPoint	 = OsvgPoint.matrixTransform( n.getCTM().inverse() );
							 event.x = nPoint.x;
							 event.y = nPoint.y;
							}
						 event.xDrag  = dPoint.x;
						 event.yDrag  = dPoint.y;
						 event.xCanvas  = x;
						 event.yCanvas  = y;
						 event.config = config;
						}
					, start_DragAndDroppable : function(svg, node, e, config) {
						 var self = this;
						 
						 // Create SVG rectangle if not already done
						 if(OsvgRect  === null) {OsvgRect  = svg.createSVGRect (); OsvgRect.width = OsvgRect.height = 1;}
						 if(OsvgPoint === null) {OsvgPoint = svg.createSVGPoint();}
						 
						 // Clone and drag
						 var clone = node.cloneNode(true)
						   , M = node.getCTM();
						 clone.setAttribute	( 'transform'
											, 'matrix('+M.a+','+M.b+','+M.c+','+M.d+','+M.e+','+M.f+')' );
						 svg.appendChild(clone);
						 DragManager.addDraggable(clone);
						 this.L_dragged.push( clone );
						 config.cloneNode = clone;
						 
						 var idPtr = e.identifier===undefined?'mouse':e.identifier;
						 this.D_draggingPtr[idPtr] = {nodeUnder:node,config:config};
						 // console.log('start_DragAndDroppable:', e, 'Pointer', idPtr, ':', this.D_draggingPtr[idPtr]);
						 
						 // Callbacks
						 if(config.start) {config.start.apply(node, [config]);}
						 
						 // Consider drop zones
						 var dz, nb = 0;
						 for(var i=0; i<this.L_dropZones.length; i++) {
							 dz = this.L_dropZones[i]
							 if( utils.intersect(dz.config.tags, config.tags).length ) {
								 // Turn this drop zone active
								 if(dz.config.accept) {dz.config.accept.apply(dz.node, [config]);}
								 nb++;
								}
							}
						 if(nb > 0) { // Now look at the movement of pointers
							 DragManager.Subscribe_Drag	( 'svgUtils.DD'
														, function(idPtr, x, y) {
															 // Who is under the pointer ?
															 OsvgRect.x = x ;//* window.devicePixelRatio;
															 OsvgRect.y = y ;//* window.devicePixelRatio;
															 var NL = svg.getIntersectionList(OsvgRect, null);
															 var i;
															 // if(NL.length>=2) {
																// console.log("getIntersectionList");
																// for(var z=0;z<NL.length;z++) {console.log(NL.item(z));} }
															 for(i=NL.length-1; i>=0; i--) {
																 if(NL.item(i) !== clone && svgUtils.isDisplayed(svg, NL.item(i))) {
																	 // Create and propagate custom over event
																	 var dropZone = self.getDropZoneUnder( NL.item(i) )
																	   , n = dropZone?dropZone.node:null;
																	 if(self.D_draggingPtr[idPtr].nodeUnder !== n) {
																		 if(self.D_draggingPtr[idPtr].nodeUnder) {
																			 var event;
																			 if(typeof CustomEvent === 'function') {
																				 event = new CustomEvent('AlxDD_leave', {bubbles:false,cancelable:false});
																				} else {event = document.createEvent('CustomEvent');
																					    event.initCustomEvent('AlxDD_leave', false, false, {});
																					   }
																			 self.enrichConfigForEvent(config,event,x,y,n,clone);
																			 self.D_draggingPtr[idPtr].nodeUnder.dispatchEvent(event);
																			}
																		 if (  n 
																		    && utils.intersect	( self.D_draggingPtr[idPtr].config.tags
																								, dropZone.config.tags
																								).length
																			) {
																			 var event; // = new CustomEvent('AlxDD_enter', {bubbles:false,cancelable:false});
																			 if(typeof CustomEvent === 'function') {
																				 event = new CustomEvent('AlxDD_enter', {bubbles:false,cancelable:false});
																				} else {event = document.createEvent('CustomEvent');
																					    event.initCustomEvent('AlxDD_enter', false, false, {});
																					   }
																			 self.enrichConfigForEvent(config,event,x,y,n,clone);
																			 n.dispatchEvent(event);
																			 // console.log('Enter', x, y, n);
																			} else{n = null;}
																			
																		 self.D_draggingPtr[idPtr].nodeUnder = n;
																		 // console.log('nodeUnder', n);
																		} else {// Trigger a AlxDD_dragOver event if there is a node
																				if(n) {
																					 var event;// = new CustomEvent( 'AlxDD_dragOver', { bubbles: false, cancelable: false } );
																					 if(typeof CustomEvent === 'function') {
																						 event = new CustomEvent('AlxDD_dragOver', {bubbles:false,cancelable:false});
																						} else {event = document.createEvent('CustomEvent');
																								event.initCustomEvent('AlxDD_dragOver', false, false, {});
																							   }
																					 self.enrichConfigForEvent(config,event,x,y,n,clone);
																					 n.dispatchEvent(event);
																					}
																			   }
																	 break;
																	}
																}
															 if(i === -1 && self.D_draggingPtr[idPtr].nodeUnder) {
																 var event;// = new CustomEvent('AlxDD_leave', {bubbles:false,cancelable:false});
																 if(typeof CustomEvent === 'function') {
																	 event = new CustomEvent('AlxDD_leave', {bubbles:false,cancelable:false});
																	} else {event = document.createEvent('CustomEvent');
																			event.initCustomEvent('AlxDD_leave', false, false, {});
																		   }
																 self.enrichConfigForEvent(config,event,x,y,n,clone);
																 self.D_draggingPtr[idPtr].nodeUnder.dispatchEvent(event);
																 self.D_draggingPtr[idPtr].nodeUnder = null;
																} 
															}
														);
							}
						 
						 return clone;
						}
					, stop_DragAndDroppable : function(idPtr, node) {
						 var pos = this.L_dragged.indexOf(node);
						 if(pos>=0) {
							// Trigger a drop event ?
							 var dropZone = this.getDropZoneUnder( this.D_draggingPtr[idPtr].nodeUnder );
							 if(  dropZone
							   && utils.intersect	( this.D_draggingPtr[idPtr].config.tags
													, dropZone.config.tags
													).length
							   ) {var event;
								  if(typeof CustomEvent === 'function') {
									 event = new CustomEvent('AlxDD_drop', {bubbles:false,cancelable:false,draggedNode:node,draggedObject:this.D_draggingPtr[idPtr]});
									} else {event = document.createEvent('CustomEvent');
											event.initCustomEvent('AlxDD_drop', false, false, {draggedNode:node,draggedObject:this.D_draggingPtr[idPtr]});
											event.draggedNode	= node;
											event.draggedObject = this.D_draggingPtr[idPtr]
										   }
									  event.config = this.D_draggingPtr[idPtr].config;
									  this.D_draggingPtr[idPtr].nodeUnder.dispatchEvent(event);
								 }
							// CallBack for the end
							 var endCB = this.D_draggingPtr[idPtr].config.end;
							 if(endCB) {endCB.apply(this, [this.D_draggingPtr[idPtr].config]);}
							 delete this.D_draggingPtr[idPtr];
							 
							// Stop drag subscribers
							 this.L_dragged.splice(pos,1);
							 if(node.parentElement) {
								 node.parentElement.removeChild( node );
								} else {node.parentNode.removeChild( node );}
							 DragManager.removeDraggable(node);
							 if(this.L_dragged.length === 0) {
								 DragManager.UnSubscribe_Drag('svgUtils.DD');
								}
							}
						 // console.log('Release D&D (', pos, ')', node, 'now L_dragged = ', this.L_dragged);
						}
					}
				};
			 
			 DragManager.Subscribe_StopDrag	( 'DD'
											, function(idPtr, node) {
												 svgUtils.DD.stop_DragAndDroppable(idPtr, node);
												}
											);
			 
			 // Debug getIntersectionList
			 window.AlxDebug = function() {
				 var svg = document.querySelector('svg');
				 if(OsvgRect === null) {OsvgRect = svg.createSVGRect(); OsvgRect.width = OsvgRect.height = 1;}
				 var debugRect = new svgRect( {x:0,y:0,width:0,height:0,style:{opacity:0.5,fill:'yellow',stroke:'yellow'}} );
				 svg.appendChild( debugRect.getRoot() );
				 if(lineH === null) {
					 lineH = new svgLine( {stroke:'red'} ); svg.appendChild(lineH.getRoot());
					 lineV = new svgLine( {stroke:'red'} ); svg.appendChild(lineV.getRoot());
					}
				 document.addEventListener	( 'mousemove'
											, function(e) {
												 var x = e.clientX
												   , y = e.clientY;
												 lineH.configure( {x1:0,y1:y,x2:10000,y2:y} );
												 lineV.configure( {x1:x,y1:0,x2:x,y2:10000} );
												 OsvgRect.x = x; OsvgRect.y = y;
												 var NL = svg.getIntersectionList(OsvgRect, null);
												 for(i=0; i<NL.length; i++) {
													 var n = NL.item(i);
													 if(n.AlxDropZone && n.style.display !== 'none' && n !== lineH && n !== lineV && n !== debugRect.getRoot()) {
														 var bb = NL.item(i).getBBox();
														 var M = NL.item(i).getCTM();
														 debugRect.configure( {x:bb.x,y:bb.y,width:bb.width,height:bb.height} );
														 debugRect.matrix(M);
														 break;
														}
													}
												 if(i === NL.length) {
													 debugRect.configure( {x:10000,y:10000} );
													}
												}
											, false );
				}

			 // ---
			 
			 return svgUtils;
			}
	  );