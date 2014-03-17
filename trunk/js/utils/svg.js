define( [ "Bricks/Presentations/utils"
		]
		, function(utils) {
var DragManager = {
	  can	: null
	, id	: 0
	, rect	: null
	, TabDraggable     : Array()
	, TabDragged_node  : Array()
	, TabDragging_ptr  : Array()
	, init             : function (svgCanvasId) {
		 document.addEventListener("mouseup"    , this.stopDragMouse, false);
		 document.addEventListener("touchend"   , this.stopDragTouch, false);
		 document.addEventListener("touchcancel", this.stopDragTouch, false);
		 document.addEventListener("mousemove"  , this.updateInteractionMouse, false);
		 document.addEventListener("touchmove"  , this.updateInteractionTouch, false);
		 if(svgCanvasId.constructor === SVGSVGElement) {
			 this.can = svgCanvasId;
			} else {if(svgCanvasId.constructor === String) {
						 this.can = document.getElementById(svgCanvasId);
						 if(this.can !== SVGSVGElement) {throw('Invalid canvas id', svgCanvasId, ": It should have identified a SVG tag");}
						} else {throw('invalid reference to SVG canvas, must be a DOM reference or an id.');}
				   }
		 
		 this.rect = this.can.createSVGRect();
		 this.rect.width = 1; this.rect.height = 1;
		 
		 this.idMatrix = this.can.createSVGMatrix();
		 
		 this.mapTransform = {};
		}
	, initSubscribers : function() {
		 DragManager.initSubscribers_AddPtr();
		 DragManager.initSubscribers_SubPtr();
		 DragManager.initSubscribers_StopDrag();
		 DragManager.initSubscribers_Drag();
		}
	, get_uid			: function() {return 'ID_' + (this.id++);}
	, indexOfIdNode		: function (id_node) {
		 for (var i=0; i<this.TabDraggable.length; i++) {if (this.TabDraggable[i].id_node_str == id_node) {return i;}}
		 return -1;
		}
	, indexOfNode		: function (node) {
		 for (var i=0; i<this.TabDraggable.length; i++) {if (this.TabDraggable[i].node === node) {return i;}}
		 return -1;
		}
	, indexOfPointer	: function (id_ptr) {
		 for (var i=0; i<this.TabDraggable.length; i++) {
			 if ( this.TabDraggable[i].id_ptr1 == id_ptr
				||this.TabDraggable[i].id_ptr2 == id_ptr) {return i;}
			}
		 return -1;
		}
	, getAncestors		: function (node) {
		 var T_rep = new Array();
		 while(node.parentElement || node.parentNode) {
			 T_rep.push( node.parentElement || node.parentNode );
			 node = node.parentElement || node.parentNode;
			}
		 return T_rep;
		}
	, getDescendants	: function (node) {
		 var T_rep = new Array();
		 var T_tmp = new Array(node);
		 var n_tmp = null, i;
		 while(T_tmp.length) {
			 n_tmp = T_tmp.pop();
			 for(var i=0; i<n_tmp.childNodes.length; i++) {
				 T_rep.push( n_tmp.childNodes.item(i) );
				 T_tmp.push( n_tmp.childNodes.item(i) );
				}
			}
		 return T_rep;
		}
	, get_intersection	: function (T1, T2) {
		 var T = new Array();
		 for(var i=0; i<T1.length; i++) {
			 if (T2.indexOf(T1[i]) >= 0) {T.push(T1[i]);}
			}
		 return T;
		}
	, get_difference	: function (T1, T2) {
		 var T = new Array();
		 for(var i=0; i<T1.length; i++) {
			 if (T2.indexOf(T1[i]) == -1) {T.push(T1[i]);}
			}
		 return T;
		}
	, addDraggable		: function (node, conf) {
		 conf = conf || {};
		 conf.inter1pt = conf.inter1pt || 'Drag';
		 conf.inter2pt = conf.inter2pt || 'RotoZoom';
		 eventNode = conf.eventNode || node;
		 pathNodes = conf.pathNodes || [];
		 // Is it still draggable?
		 if(this.indexOfNode(node) >= 0) {return;}
		 // If not, create the object in charge of managing its drag
		 var obj_draggable = new Object();
			obj_draggable.id_node_str = node.id;
			obj_draggable.pathNodes	  = pathNodes;
			obj_draggable.node        = node;
			obj_draggable.uid		  = this.get_uid();
			obj_draggable.CB_drag	  = conf.CB_drag || function() {};
			obj_draggable.CB_zoom	  = conf.CB_zoom || function() {};
			obj_draggable.id_ptr1     = null;
				obj_draggable.pt1     = this.can.createSVGPoint();
				obj_draggable.pt1p    = this.can.createSVGPoint();
			obj_draggable.id_ptr2     = null;
				obj_draggable.pt2     = this.can.createSVGPoint();
				obj_draggable.pt2p    = this.can.createSVGPoint();
			obj_draggable.depends_of  = null;        // The ancestor node that is also draggable
			obj_draggable.Tab_depend  = new Array(); // The closest descendants nodes that are also draggable
			
			// Reference interaction techniques
			obj_draggable.interaction = [null, conf.inter1pt, conf.inter2pt];

			// Dependancies
			var T_ancestors   = this.getAncestors  (node), index_ancestor
			  , T_descendants = this.getDescendants(node), index_descendant;
			// Add dependency with respect to ancestors
			for(var i=0; i<T_ancestors.length; i++) {
				 // Is this ancestor still dragged?
				 index_ancestor = this.indexOfNode( T_ancestors[i] );
				 if (index_ancestor >= 0) {
					 console.log("\t\t" + T_ancestors[i].id + " is a draggable ancestor of " + node.id);
					 // Add the node to the dependencies of the ancestor
					 this.TabDraggable[index_ancestor].Tab_depend.push( node );
					 // Add to the dependancies of the node the ones of the ancestors that are part of node's descendants
					 //   remove them from ancestors dependancies
					 var T_intersection = this.get_intersection(T_descendants, this.TabDraggable[index_ancestor].Tab_depend);
					 obj_draggable.Tab_depend = T_intersection;
					 obj_draggable.depends_of = T_ancestors[i];
					 for(var j=0; j<T_intersection.length; j++) {
						 var index = this.TabDraggable.indexOfIdNode( T_intersection[j] );
						 this.TabDraggable[index].depends_of = node;
						}
					 this.TabDraggable[index_ancestor].Tab_depend = this.get_difference(this.TabDraggable[index_ancestor].Tab_depend, T_intersection);
					 break;
					}
				}
			
			// Add dependency with respect to descendants
			var T_tmp = new Array(node), n_tmp, nc_tmp, i_nc_tmp;
			while(T_tmp.length) {
				 n_tmp = T_tmp.pop();
				 for(var i=0; i<n_tmp.childNodes.length; i++) {
					 nc_tmp   = n_tmp.childNodes.item(i);
					 i_nc_tmp = this.indexOfNode(nc_tmp);
					 // Is nc_tmp still dragged?
					 if(i_nc_tmp >= 0) {
						 // Add nc_tmp to the dependencies
						 obj_draggable.Tab_depend.push(nc_tmp);
						 // Check that nc_tmp does not depend from any one
						 if(this.TabDraggable[i_nc_tmp].depends_of) {alert('node ' + nc_tmp.id + " should not depend on anyone... but " + node + ". It actually depends on " + this.TabDraggable[i_nc_tmp].depends_of);}
						 // node is now its closest draggable ancestor
						 this.TabDraggable[i_nc_tmp].depends_of = node;
						} else { // If not, then continue with its descendants
								T_tmp.push(nc_tmp);
							   }
					}
				}
			
		 this.TabDraggable.push( obj_draggable );
		 // Then subscribe to events
		 eventNode.addEventListener("mousedown" , function(e) {DragManager.startDragMouse(e, node);}, false);
		 eventNode.addEventListener("touchstart", function(e) {DragManager.startDragTouch(e, node);}, false);
		}
	, removeDraggable	: function (node) {
		 var i = this.indexOfNode(node);
		 this.TabDraggable.splice(i, 1);
		}
	, startDragMouse	: function (e, node) {
		 var coords = DragManager.getCoordinate_relative_to(e.pageX, e.pageY, DragManager.can);
		 DragManager.startDrag(e, node, "mouse", coords.x, coords.y);
		 e.preventDefault();
		 e.stopPropagation();
		}
	, startDragTouch	: function (e, node) {
		 e.preventDefault();
		 e.stopPropagation();
		 var evt = null, coords = null;
		 for(var i=0;i<e.changedTouches.length;i++) {
			 // console.log('Touch drag started');
			 evt    = e.changedTouches.item(i);
			 coords = DragManager.getCoordinate_relative_to(evt.pageX, evt.pageY, DragManager.can);
			 DragManager.startDrag(evt, node, evt.identifier, coords.x, coords.y);
			}
		}
	, startDrag			: function (e, node, id_ptr, x, y) {
		 // Still fully used?
		 var i = this.indexOfNode(node);
		 if( this.TabDragged_node.indexOf(node) >= 0
		   &&this.TabDraggable[i].id_ptr2 != null
		   ) {return;}
		   
		 // Do we come from the right path if anyone specified?
		 if(this.TabDraggable[i].pathNodes.length) {
			 var doDragThrough = undefined, doDragNotThrough = true;
			 var ancestors = [], child = e.target;
			 while(child) {ancestors.push(child);
						   child = child.parentElement || child.parentNode; }
			 for(var n=0; n<this.TabDraggable[i].pathNodes.length; n++) {
				 var parent	   = this.TabDraggable[i].pathNodes[n].node;
				 var goThrough = this.TabDraggable[i].pathNodes[n].goThrough;
				 if(goThrough) {
					 if(doDragThrough === undefined) {doDragThrough = false;}
					 if(ancestors.indexOf(parent) !== -1) {doDragThrough = true;}
					} else	{if(ancestors.indexOf(parent) !== -1) {doDragNotThrough = false;}
							}
				}
			 if(doDragThrough === undefined) {doDragThrough = true;}
			 if(!doDragThrough || !doDragNotThrough) {
				// console.log(doDragThrough, doDragNotThrough, 'drag not allowed from here', ancestors, e.target); 
				return;}
			}
		 
		 // If not, start the drag
		 // Compute coordinates of the point in the frame of the node
		 // console.log("this.TabDraggable[",i,"].id_ptr1 ===", this.TabDraggable[i].id_ptr1);
		 var M = node.getCTM().inverse();
		 if(this.TabDraggable[i].id_ptr1 === null) {
			 this.TabDraggable[i].id_ptr1 = id_ptr;
			 this.TabDraggable[i].pt1.x   = x;
			 this.TabDraggable[i].pt1.y   = y;
			 this.TabDraggable[i].pt1     = this.TabDraggable[i].pt1.matrixTransform( M );
			 this.TabDragged_node.push(node);
			 } else {this.TabDraggable[i].id_ptr2 = id_ptr;
					 this.TabDraggable[i].pt2.x   = x;
					 this.TabDraggable[i].pt2.y   = y;
					 this.TabDraggable[i].pt2     = this.TabDraggable[i].pt2.matrixTransform( M );
					 // console.log("----------------------------RotoZoom--------------------------------------------");
					 // console.log("now using pointer2 = " + this.TabDraggable[i].id_ptr2);
					}
		 // Register
		 this.TabDragging_ptr.push(id_ptr);
		 this.updateInteraction(id_ptr, x, y);
		 this.CallSubscribers_AddPtr(id_ptr, node, e.target);
		}
	, stopDragMouse		: function (e) {DragManager.stopDrag(e, "mouse");}
	, stopDragTouch		: function (e) {
		 e.preventDefault();
		 for(var i=0;i<e.changedTouches.length;i++) {DragManager.stopDrag(e.changedTouches.item(i), e.changedTouches.item(i).identifier);}
		}
	, stopDragNode		: function(node) {
		 var i = this.indexOfNode(node);
		 console.log('stopDragNode', i, ":", node);
		 if( this.TabDragged_node.indexOf(node) >= 0) {
			 if( typeof this.TabDraggable[i].id_ptr2 !== 'undefined' ) {this.stopDrag({target:node}, this.TabDraggable[i].id_ptr2);}
			 if( typeof this.TabDraggable[i].id_ptr1 !== 'undefined' ) {this.stopDrag({target:node}, this.TabDraggable[i].id_ptr1);}
			}
		}
	, stopDrag			: function (e, id_ptr) {
		 var i = this.indexOfPointer(id_ptr);
		 if(i == -1) {return;}
		 this.TabDragging_ptr.splice(this.TabDragging_ptr.indexOf(id_ptr), 1);
		 if(this.TabDraggable[i].id_ptr1 == id_ptr) {
			 this.TabDraggable[i].id_ptr1 = this.TabDraggable[i].id_ptr2;
			 this.TabDraggable[i].pt1.x = this.TabDraggable[i].pt2.x;
			 this.TabDraggable[i].pt1.y = this.TabDraggable[i].pt2.y;
			}
		 this.TabDraggable[i].id_ptr2 = null;
		 if(this.TabDraggable[i].id_ptr1 == null) {
			 this.TabDragged_node.splice(this.TabDragged_node.indexOf(this.TabDraggable[i].node), 1);
			 this.CallSubscribers_StopDrag( id_ptr, this.TabDraggable[i].node );
			}
		 // this.TabDraggable[i].id_ptr1 = null;
		 this.CallSubscribers_SubPtr(id_ptr, e.target);
		}
	, updateInteractionMouse : function (e) {
		 var coords = DragManager.getCoordinate_relative_to(e.pageX, e.pageY, DragManager.can);
		 DragManager.updateInteraction("mouse", coords.x, coords.y);
		}
	, updateInteractionTouch : function (e) {
		 e.preventDefault();
		 var evt = null, coords = null;
		 // console.log(e);
		 for(var i=0;i<e.changedTouches.length;i++) {
			 evt = e.changedTouches.item(i);
			 coords = DragManager.getCoordinate_relative_to(evt.pageX, evt.pageY, DragManager.can);
			 // console.log('Update touch drag');
			 DragManager.updateInteraction(evt.identifier, coords.x, coords.y);
			}
		}
	, updateInteraction : function (id_ptr, x, y) {
		 var i = this.TabDragging_ptr.indexOf(id_ptr);
		 if(i == -1) {/*console.log('skip', id_ptr);*/ return;}
		 i    = this.indexOfPointer(id_ptr); 
		 var obj  = this.TabDraggable[i]
		   , node = obj.node;
		 // Apply translation
		 // console.log("update TabDraggable[",i,"]");
		 if(this.TabDraggable[i].id_ptr2 != null) {
			 // this.RotoZoom(i, id_ptr, x, y);
			 this[obj.interaction[2]].apply(this, [i, id_ptr, x, y]);
			} else	{//this.Drag(i, id_ptr, x, y);
					 this[obj.interaction[1]].apply(this, [i, id_ptr, x, y]);
					}
		 
		 // Update depending nodes
		 for(var j=0; j<this.TabDraggable[i].Tab_depend.length; j++) {
			 var index_child = this.indexOfNode( this.TabDraggable[i].Tab_depend[j] );
			 var id_ptr = this.TabDraggable[index_child].id_ptr1;
			 this.updateInteraction(id_ptr, x, y /*px, py*/);
			}
		}
	, OrthoZoom : function (i, id_ptr, x, y) {
		 var obj = this.TabDraggable[i], parent = obj.node.parentElement || obj.node.parentNode;
		 if(id_ptr == this.TabDraggable[i].id_ptr1) {
			 obj.pt1p.x = x; obj.pt1p.y = y;
			 obj.pt1p = obj.pt1p.matrixTransform( parent.getCTM().inverse() );
			} else {obj.pt2p.x = x; obj.pt2p.y = y;
					obj.pt2p = obj.pt2p.matrixTransform( parent.getCTM().inverse() );
				   }
		 // Compute the current center point
		 var cx  = (obj.pt1.x  + obj.pt2.x ) / 2
		   , cy  = (obj.pt1.y  + obj.pt2.y ) / 2
		   , cxp = (obj.pt1p.x + obj.pt2p.x) / 2
		   , cyp = (obj.pt1p.y + obj.pt2p.y) / 2;
		 
		 // Compute the scale relative to the original scale
		 var dx  = obj.pt1.x  - obj.pt2.x
		   , dy  = obj.pt1.y  - obj.pt2.y
		   , dxp = obj.pt1p.x - obj.pt2p.x
		   , dyp = obj.pt1p.y - obj.pt2p.y;
		 var s = Math.sqrt(dxp*dxp + dyp*dyp) / Math.sqrt(dx*dx + dy*dy);
		 
		 var tx = cxp - s*cx
		   , ty = cyp - s*cy;
		 // Maintains the central point at the center with respect to the scale
		 this.mapTransform[obj.uid] = {obj:obj,matrix:'matrix('+s+','+0+','+0+','+s+','+tx+','+ty+')'};
		 this.updateRender();
		}
	, RotoZoom : function (i, id_ptr, x, y) {
		 var obj = this.TabDraggable[i]
		   , parent = obj.node.parentElement || obj.node.parentNode;
		 if(id_ptr == this.TabDraggable[i].id_ptr1) {
			 obj.pt1p.x = x; obj.pt1p.y = y;
			 obj.pt1p = obj.pt1p.matrixTransform( parent.getCTM().inverse() );
			} else {obj.pt2p.x = x; obj.pt2p.y = y;
					obj.pt2p = obj.pt2p.matrixTransform( parent.getCTM().inverse() );
				   }
		 // console.log("RotoZoom");
		 /*console.log("RotoZoom <" + this.TabDraggable[i].pt1p.x + ';' + this.TabDraggable[i].pt1p.y + '>'
							+' <' + this.TabDraggable[i].pt2p.x + ';' + this.TabDraggable[i].pt2p.y + '>'
							+ "------"
							+ "<" + this.TabDraggable[i].pt1.x + ';' + this.TabDraggable[i].pt1.y + '>'
							+' <' + this.TabDraggable[i].pt2.x + ';' + this.TabDraggable[i].pt2.y + '>');
		 */
		 var dx  = this.TabDraggable[i].pt1.x - this.TabDraggable[i].pt2.x
		   , dy  = this.TabDraggable[i].pt1.y - this.TabDraggable[i].pt2.y
		   , dxp = this.TabDraggable[i].pt1p.x - this.TabDraggable[i].pt2p.x
		   , dyp = this.TabDraggable[i].pt1p.y - this.TabDraggable[i].pt2p.y
		   , s = 0, c = 0, e = 0, f = 0;
		   
		 if(dx == 0 && dy == 0) {console.log("points confondues!"); return;}
		 if(dx == 0) {
		     s = -dxp/dy; c = dyp/dy;
			} else {if(dy == 0) {
						 s = dyp/dx; c = dxp/dx;
						} else  {s = (dyp/dy - dxp/dx) / (dy/dx + dx/dy);
								 c = (dxp + s*dy)/dx;
								}
				   }
		 e = this.TabDraggable[i].pt1p.x - c*this.TabDraggable[i].pt1.x + s*this.TabDraggable[i].pt1.y
		 f = this.TabDraggable[i].pt1p.y - s*this.TabDraggable[i].pt1.x - c*this.TabDraggable[i].pt1.y
		 this.mapTransform[obj.uid] = {obj:obj,matrix:'matrix('+c+','+s+','+(-s)+','+c+','+e+','+f+')'};
		 this.updateRender();
		}
	, Drag : function (i, id_ptr, x, y) {
		 // console.log("Drag with " + id_ptr);
		 var obj = this.TabDraggable[i], mat
		   , parent = obj.node.parentElement || obj.node.parentNode;
			obj.pt1p.x = x; obj.pt1p.y = y;
			if(parent.getCTM()) {
				 obj.pt1p = obj.pt1p.matrixTransform( parent.getCTM().inverse() );
				 mat = parent.getCTM().inverse().multiply( obj.node.getCTM() );
				} else {mat = obj.node.getCTM();}
						
		 // var mat = obj.node.parentElement.getCTM().inverse().multiply( obj.node.getCTM() );;
		 var e = obj.pt1p.x - mat.a*obj.pt1.x - mat.c*obj.pt1.y
		   , f = obj.pt1p.y - mat.b*obj.pt1.x - mat.d*obj.pt1.y;
		 this.TabDraggable[i] = obj;
		 this.mapTransform[obj.uid] = {obj:obj,matrix:'matrix('+mat.a+','+mat.b+','+mat.c+','+mat.d+','+e+','+f+')'};
		 this.updateRender();
		 // obj.node.setAttribute('transform', 'matrix('+mat.a+','+mat.b+','+mat.c+','+mat.d+','+e+','+f+')');
		 this.CallSubscribers_Drag(id_ptr, x, y);		 
		}
	, getCoordinate_relative_to : function (x, y, node) {
		 var element = node, offsetX = 0, offsetY = 0, mx, my;
		 var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(node, null)['paddingLeft'], 10)      || 0;
		 var stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(node, null)['paddingTop'], 10)       || 0;
		 var styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(node, null)['borderLeftWidth'], 10)  || 0;
		 var styleBorderTop   = parseInt(document.defaultView.getComputedStyle(node, null)['borderTopWidth'], 10)   || 0;

		 // Compute the total offset. It's possible to cache this if you want
		 if (element.offsetParent !== undefined) {
			do {offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
			   } while ((element = element.offsetParent));
		 }

		 // Add padding and border style widths to offset
		 // Also add the <html> offsets in case there's a position:fixed bar (like the stumbleupon bar)
		 // This part is not strictly necessary, it depends on your styling
		 offsetX += stylePaddingLeft + styleBorderLeft + document.body.parentNode.offsetLeft;
		 offsetY += stylePaddingTop  + styleBorderTop  + document.body.parentNode.offsetTop;

		 mx = x - offsetX;
		 my = y - offsetY;

		 // We return a simple javascript object with x and y defined
		 return {x: mx, y: my};
		}
	, updateRender				: function() {
		 if(this.isUpdatingRender) {return}
		 this.isUpdatingRender = true;
		 var self = this;
		 window.requestAnimFrame( function() {
			 self.isUpdatingRender = false;
			 for(var i in self.mapTransform) {
				 self.mapTransform[i].obj.node.setAttribute('transform', self.mapTransform[i].matrix);
				 try {
					if(self.mapTransform[i].obj.id_ptr2)
						self.mapTransform[i].obj.CB_zoom(self.mapTransform[i].obj.node);
					} catch(e) {alert('error' + e);}
				 // alert('arf');
				}
			 self.mapTransform = {};
			} ); 
		}
};

// Generate_accessors
utils.generateSubscribers(DragManager, 'AddPtr');
utils.generateSubscribers(DragManager, 'SubPtr');
utils.generateSubscribers(DragManager, 'StopDrag');
utils.generateSubscribers(DragManager, 'Drag');

DragManager.initSubscribers();

return DragManager;
}

);






