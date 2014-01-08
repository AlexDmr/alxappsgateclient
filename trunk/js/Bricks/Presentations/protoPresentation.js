define( function() {
			 var uid = 0;
			 // Define the Presentation constructor
			 var Presentation = function() {
				}
			 Presentation.prototype.getUniqueId = function() {
				 uid++;
				 return 'PresoId_' + uid;
				}
			 Presentation.prototype.init = function(brick, children) {
				 this.root			= null;
				 this.children 		= children || [];
				 this.parent		= null;
				 this.brick = brick; 
				 if(brick) brick.appendPresentations([this]);
				 for(var i=0;i<this.children.length;i++) {this.appendChild(this.children[i]);}
				}
			 // Definition of the Presentation class
			 Presentation.prototype.setParent = function(p) {
				 if(this.parent === p) {return;}
				 if(this.parent) {
					var parent = this.parent;
					this.parent = null;
					parent.removeChild(this);}
				 this.parent = p;
				 if(p) p.appendChild(this);
				}
			 Presentation.prototype.appendChild = function(c) {
				 if(this.children.indexOf(c) == -1) {
					 this.children.push(c);
					 this.primitivePlug(c);
					 c.setParent(this);
					}
				}
			 Presentation.prototype.removeChild = function(c) {
				 var pos = this.children.indexOf(c)
				 if(pos !== -1) {
					 this.children.splice(pos,1);
					 this.primitiveUnPlug(c);
					 c.setParent(null);
					}
				}
			 Presentation.prototype.appendChildFromBrick = function(brick, fParams, constrName) {
				 // If a presentation constructor has been specified...
				 if(constrName) {
					 var preso = brick.getNewPresentation(constrName);
					 if(preso) {fParams.apply(preso, []);
								this.appendChild(preso);
								return preso;}
					}
				 // If there is an available existing presentation
				 for(var p in brick.presentations) {
					 var preso = brick.presentations[p];
					 if(preso.parent === null) {
						 fParams.apply(preso, []);
						 this.appendChild(preso);
						 return preso;
						} else {console.log("\tchild preso",p,"is still plugged to",preso.parent);}
					}
				 // Last, if there is a factory...
				 var preso = brick.getNewPresentation();
				 if(preso) {fParams.apply(preso, []);
							this.appendChild(preso);
							return preso;}
				 return null;
				}
			 Presentation.prototype.removeChildFromBrick = function(brick) {
				 for(var p in brick.presentations) {
					 if(brick.presentations[p].parent === this) {
						 this.removeChild(brick.presentations[p]);
						 break;
						}
					}
				}
			 Presentation.prototype.Render = function() {
				 if(!this.root) {
					 this.root = document.createElement('div');
					 this.root.classList.add('BrickRoot');
					 for(var i=0;i<this.children.length;i++) {
						 this.primitivePlug(this.children[i]);
						}
					}
				 return this.root;
				}
			 Presentation.prototype.deletePrimitives = function() {
				 if(this.root) {this.root.parentNode.removeChild(this.root);this.root=null;}
				}
			 Presentation.prototype.forceRender = function() {
				 var primitiveParent;
				 if(this.root) {primitiveParent = this.root.parentNode;
								this.deletePrimitives();
							   } else {primitiveParent = null;}
				 var root = this.Render();
				 if(primitiveParent) {primitiveParent.appendChild(root);}
				}
			 Presentation.prototype.primitivePlug = function(c) {
				 // console.log("Primitive plug ", this.root, " ->", c.root);
				 var P = this.Render(),
				     N = c.Render();
				 if(N.parentNode === null) {P.appendChild(N);}
				}
			 Presentation.prototype.primitiveUnPlug = function(c) {
				 if(c.root && c.root.parentNode) {c.root.parentNode.removeChild(c.root);}
				}
			 // Return the reference to the Presentation constructor
			 return Presentation;
			}
	  );