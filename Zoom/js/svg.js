var DragManager = {
	  can  : null
	, rect : null
	, TabDraggable     : Array()
	, TabDragged_node  : Array()
	, TabDragging_ptr  : Array()
	, init             : function (svgCanvasId) {
		 document.addEventListener("mouseup"    , this.stopDragMouse, false);
		 document.addEventListener("touchend"   , this.stopDragTouch, false);
		 document.addEventListener("touchcancel", this.stopDragTouch, false);
		 document.addEventListener("mousemove"  , this.updateInteractionMouse, false);
		 document.addEventListener("touchmove"  , this.updateInteractionTouch, false);
		 this.can = document.getElementById(svgCanvasId);
		 this.rect = this.can.createSVGRect();
		 this.rect.width = 1; this.rect.height = 1;
		}
	, indexOfIdNode   : function (id_node) {
		 for (var i=0; i<this.TabDraggable.length; i++) {if (this.TabDraggable[i].id_node_str == id_node) {return i;}}
		 return -1;
		}
	, indexOfNode     : function (node) {
		 for (var i=0; i<this.TabDraggable.length; i++) {if (this.TabDraggable[i].node == node) {return i;}}
		 return -1;
		}
	, indexOfPointer  : function (id_ptr) {
		 for (var i=0; i<this.TabDraggable.length; i++) {
			 if ( this.TabDraggable[i].id_ptr1 == id_ptr
				||this.TabDraggable[i].id_ptr2 == id_ptr) {return i;}
			}
		 return -1;
		}
	, getAncestors    : function (node) {
		 var T_rep = new Array();
		 while(node.parentNode) {
			 T_rep.push( node.parentNode );
			 node = node.parentNode;
			}
		 return T_rep;
		}
	, getDescendants   : function (node) {
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
	, get_intersection : function (T1, T2) {
		 var T = new Array();
		 for(var i=0; i<T1.length; i++) {
			 if (T2.indexOf(T1[i]) >= 0) {T.push(T1[i]);}
			}
		 return T;
		}
	, get_difference   : function (T1, T2) {
		 var T = new Array();
		 for(var i=0; i<T1.length; i++) {
			 if (T2.indexOf(T1[i]) == -1) {T.push(T1[i]);}
			}
		 return T;
		}
	, addDraggable    : function (node) {
		 // Is it still draggable?
		 if(this.indexOfNode(node) >= 0) {return;}
		 // If not, create the object in charge of managing its drag
		 var obj_draggable = new Object();
			obj_draggable.id_node_str = node.id;
			obj_draggable.node        = node;
			obj_draggable.id_ptr1     = null;
				obj_draggable.pt1     = this.can.createSVGPoint();
				obj_draggable.pt1p    = this.can.createSVGPoint();
			obj_draggable.id_ptr2     = null;
				obj_draggable.pt2     = this.can.createSVGPoint();
				obj_draggable.pt2p    = this.can.createSVGPoint();
			obj_draggable.depends_of  = null;        // The ancestor node that is also draggable
			obj_draggable.Tab_depend  = new Array(); // The closest descendants nodes that are also draggable
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
		 node.addEventListener("mousedown" , DragManager.startDragMouse, false);
		 node.addEventListener("touchstart", DragManager.startDragTouch, false);
		}
	, removeDraggable : function (node) {
		 var i = this.indexOfNode(id_node_str);
		 this.TabDraggable.splice(i, 1);
		}
	, startDragMouse : function (e) {
		 var coords = DragManager.getCoordinate_relative_to(e.pageX, e.pageY, DragManager.can);
		 DragManager.startDrag(e.target, "mouse", coords.x, coords.y);
		}
	, startDragTouch : function (e) {
		 e.preventDefault();
		 var evt = null, coords = null;
		 for(var i=0;i<e.changedTouches.length;i++) {
			 evt    = e.changedTouches.item(i);
			 coords = DragManager.getCoordinate_relative_to(evt.pageX, evt.pageY, DragManager.can);
			 DragManager.startDrag(evt.target, evt.identifier, coords.x, coords.y);
			}
		}
	, startDrag      : function (node, id_ptr, x, y) {
		 // Still fully used?
		 var i = this.indexOfNode(node);
		 if( this.TabDragged_node.indexOf(node) >= 0
		   &&this.TabDraggable[i].id_ptr2 != null
		   ) {return;}
		 // If not, start the drag
		 // Compute coordinates of the point in the frame of the node
		 // console.log("this.TabDraggable[i].id_ptr1 = " + this.TabDraggable[i].id_ptr1);
		 if(this.TabDraggable[i].id_ptr1 == null) {
			 this.TabDraggable[i].id_ptr1 = id_ptr;
			 this.TabDraggable[i].pt1.x   = x;
			 this.TabDraggable[i].pt1.y   = y;
			 this.TabDraggable[i].pt1     = this.TabDraggable[i].pt1.matrixTransform( node.getCTM().inverse() );
			 this.TabDragged_node.push(node);
			 } else {this.TabDraggable[i].id_ptr2 = id_ptr;
					 this.TabDraggable[i].pt2.x   = x;
					 this.TabDraggable[i].pt2.y   = y;
					 this.TabDraggable[i].pt2     = this.TabDraggable[i].pt2.matrixTransform( node.getCTM().inverse() );
					 // console.log("now using pointer2 = " + this.TabDraggable[i].id_ptr2);
					}
		 // Register
		 this.TabDragging_ptr.push(id_ptr);
		}
	, stopDragMouse  : function (e) {DragManager.stopDrag("mouse");}
	, stopDragTouch  : function (e) {
		 e.preventDefault();
		 for(var i=0;i<e.changedTouches.length;i++) {DragManager.stopDrag(e.changedTouches.item(i).identifier);}
		}
	, stopDrag       : function (id_ptr) {
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
			}
		 // this.TabDraggable[i].id_ptr1 = null;
		}
	, updateInteractionMouse : function (e) {
		 var coords = DragManager.getCoordinate_relative_to(e.pageX, e.pageY, DragManager.can);
		 DragManager.updateInteraction("mouse", coords.x, coords.y);
		}
	, updateInteractionTouch : function (e) {
		 e.preventDefault();
		 var evt = null, coords = null;
		 for(var i=0;i<e.changedTouches.length;i++) {
			 evt = e.changedTouches.item(i);
			 coords = DragManager.getCoordinate_relative_to(evt.pageX, evt.pageY, DragManager.can);
			 DragManager.updateInteraction(evt.identifier, coords.x, coords.y);
			}
		}
	, updateInteraction : function (id_ptr, x, y) {
		 var i = this.TabDragging_ptr.indexOf(id_ptr);
		 if(i == -1) {return;}
		 i    = this.indexOfPointer(id_ptr); 
		 var node = this.TabDraggable[i].node;
		 // Apply translation
		 // console.log("update while id_ptr2 is " + this.TabDraggable[i].id_ptr2);
		 if(this.TabDraggable[i].id_ptr2 != null) {
			 this.RotoZoom(i, id_ptr, x, y);
			} else {this.Drag(i, id_ptr, x, y);}
		 
		 // Update depending nodes
		 for(var j=0; j<this.TabDraggable[i].Tab_depend.length; j++) {
			 var index_child = this.indexOfNode( this.TabDraggable[i].Tab_depend[j] );
			 var id_ptr = this.TabDraggable[index_child].id_ptr1;
			 this.updateInteraction(id_ptr, px, py);
			}
		 /*if(id_ptr == this.TabDraggable[i].id_ptr1) {
			  this.TabDraggable[i].pt1p.x = x;
			  this.TabDraggable[i].pt1p.y = y;
			 } else {
					}*/
		}
	, RotoZoom : function (i, id_ptr, x, y) {
		 var obj = this.TabDraggable[i];
		 if(id_ptr == this.TabDraggable[i].id_ptr1) {
			 obj.pt1p.x = x; obj.pt1p.y = y;
			 obj.pt1p = obj.pt1p.matrixTransform( obj.node.parentNode.getCTM().inverse() );
			} else {obj.pt2p.x = x; obj.pt2p.y = y;
					obj.pt2p = obj.pt2p.matrixTransform( obj.node.parentNode.getCTM().inverse() );
				   }
		 // console.log("RotoZoom with " + id_ptr);
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
		 obj.node.setAttribute('transform', 'matrix('+c+','+s+','+(-s)+','+c+','+e+','+f+')');
		}
	, Drag : function (i, id_ptr, x, y) {
		 // console.log("Drag with " + id_ptr);
		 var obj = this.TabDraggable[i];
			obj.pt1p.x = x; obj.pt1p.y = y;
			obj.pt1p = obj.pt1p.matrixTransform( obj.node.parentNode.getCTM().inverse() );
		 var mat = obj.node.parentNode.getCTM().inverse().multiply( obj.node.getCTM() );;
		 var e = obj.pt1p.x - mat.a*obj.pt1.x - mat.c*obj.pt1.y
		   , f = obj.pt1p.y - mat.b*obj.pt1.x - mat.d*obj.pt1.y;
		 this.TabDraggable[i] = obj;
		 obj.node.setAttribute('transform', 'matrix('+mat.a+','+mat.b+','+mat.c+','+mat.d+','+e+','+f+')');
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

};






