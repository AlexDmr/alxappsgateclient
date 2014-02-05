define( [ "utils/svg"
		, "Bricks/Presentations/utils"
		, "utils/svgLine"
		, "utils/svgRect"
		]
	  , function(DragManager, utils, svgLine, svgRect) {
			 var NsvgRect = null, lineH = null, lineV = null;
			 
			 // Define a singleton
			 var svgUtils = {
				  bbox : function(node) {
					 
					}
				, ancestors : function(node) {
					 var L = [];
					 while(node.parentNode) {
						 L.push( node.parentNode );
						 node = node.parentNode;
						}
					 return L;
					}
				, getSvgCanvas : function(node) {
					 while(node && node.tagName !== 'svg') {
						 node = node.parentNode;
						}
					 return node
					}
				, DD : {
					  L_dragged			: []
					, L_dropZones		: []
					, D_draggingPtr		: {}
					, DropZone			: function(node, config) {
						 // config contains possible attributes :
						 //		- tags	 : an array of string
						 //		- drop	 : a callback
						 //		- enter	 : a callback
						 //		- leave	 : a callback
						 //		- accept : a callback
						 config			= config		|| {};
						 config.tags	= config.tags	|| [];
						 config.accept	= config.accept	|| null;
						 config.drop	= config.drop	|| null;
						 config.enter	= config.enter	|| null;
						 config.leave	= config.leave	|| null;
						 config.cancel	= config.cancel	|| null;
						 
						 this.L_dropZones.push( {node:node,config:config} );
						 
						 node.AlxDropZone = true;
						 node.addEventListener('AlxDD_enter', config.enter, false);
						 node.addEventListener('AlxDD_leave', config.leave, false);
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
						 
						 // Body
						 var self = this;
						 node.addEventListener	( 'mousedown'
												, function(e) {
													 var svg = svgUtils.getSvgCanvas(node);
													 var clone = self.start_DragAndDroppable(svg, node, e, config);
													 DragManager.startDragMouse(e, clone);
													}
												, false );
						 node.addEventListener	( 'touchstart'
												, function(e) {
													 var svg = svgUtils.getSvgCanvas(node);
													 var clone = self.start_DragAndDroppable(svg, node, e.changedTouches.item(0), config);
													 DragManager.startDragTouch(e, clone);
													}
												, false );
						}
					, start_DragAndDroppable : function(svg, node, e, config) {
						 var self = this;
						 
						 // Create SVG rectangle if not already done
						 if(NsvgRect === null) {NsvgRect = svg.createSVGRect(); NsvgRect.width = NsvgRect.height = 1;}
						 
						 // Clone and drag
						 var clone = node.cloneNode(true)
						   , M = node.getCTM();
						 clone.setAttribute	( 'transform'
											, 'matrix('+M.a+','+M.b+','+M.c+','+M.d+','+M.e+','+M.f+')' );
						 svg.appendChild(clone);
						 DragManager.addDraggable(clone);
						 this.L_dragged.push( clone );
						 
						 var idPtr = e.identifier===undefined?'mouse':e.identifier;
						 this.D_draggingPtr[idPtr] = {nodeUnder:node};
						 console.log(e, 'Pointer', idPtr, ':', this.D_draggingPtr[idPtr]);
						 
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
															 NsvgRect.x = x ;//* window.devicePixelRatio;
															 NsvgRect.y = y ;//* window.devicePixelRatio;
															 var NL = svg.getIntersectionList(NsvgRect, null);
															 var i;
															 for(i=NL.length-1; i>=0; i--) {
																 if(NL.item(i) !== clone && NL.item(i).style.display !== 'none') {
																	 // Create and propagate custom over event
																	 var n = NL.item(i);
																	 while(n && !n.AlxDropZone) {n = n.parentNode;}
																	 if(self.D_draggingPtr[idPtr].nodeUnder !== n) {
																		 if(self.D_draggingPtr[idPtr].nodeUnder) {
																			 var event = new CustomEvent('AlxDD_leave', {bubbles:false,cancelable:false});
																			 self.D_draggingPtr[idPtr].nodeUnder.dispatchEvent(event);
																			 // console.log('Leave', n);
																			}
																		 if(n) {
																			 var event = new CustomEvent('AlxDD_enter', {bubbles:false,cancelable:false});
																			 n.dispatchEvent(event);
																			 console.log('Enter', x, y, n);
																			 
																			}
																		 self.D_draggingPtr[idPtr].nodeUnder = n;
																		 // console.log('nodeUnder', n);
																		}
																	 break;
																	}
																}
															 if(i === -1 && self.D_draggingPtr[idPtr].nodeUnder) {
																 var event = new CustomEvent('AlxDD_leave', {bubbles:false,cancelable:false});
																 self.D_draggingPtr[idPtr].nodeUnder.dispatchEvent(event);
																 self.D_draggingPtr[idPtr].nodeUnder = null;
																} 
															}
														);
							}
						 
						 return clone;
						}
					, stop_DragAndDroppable : function(node) {
						 var pos = this.L_dragged.indexOf(node);
						 if(pos>=0) {
							 this.L_dragged.splice(pos,1);
							 node.parentNode.removeChild( node );
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
											, function(id, node) {
												 svgUtils.DD.stop_DragAndDroppable(node);
												}
											);
			 
			 // Debug getIntersectionList
			 window.AlxDebug = function() {
				 var svg = document.querySelector('svg');
				 if(NsvgRect === null) {NsvgRect = svg.createSVGRect(); NsvgRect.width = NsvgRect.height = 1;}
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
												 NsvgRect.x = x; NsvgRect.y = y;
												 var NL = svg.getIntersectionList(NsvgRect, null);
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