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
				 this.root			= this.root || null;
				 if(this.children) {
					 for(var i=0; i<this.children.length; i++) {
						 this.removeChild(this.children[i]);
						}
					}
				 this.children 		= children  || [];
				 if(this.parent) {this.parent.removeChild(this);}
				 this.parent		= null;
				 var prevBrick = this.brick;
				 this.brick = brick; 
				 brick.appendPresentations([this]);
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
			 Presentation.prototype.getAllPresoBrickFromDescendant = function(brick) {
				 if(this.brick === brick) {return [this];}
				 var Lrep = [], L;
				 for(var i=0; i<this.children.length; i++) {
					 L = this.children[i].getAllPresoBrickFromDescendant(brick);
					 for(var j=0; j<L.length; j++) {Lrep.push(L[j]);}
					}
				 return Lrep;
				}
			 Presentation.prototype.getPresoBrickFromDescendant = function(brick) {
				 if(this.brick === brick) {return this;}
				 var rep = null;
				 for(var i=0; i<this.children.length; i++) {
					 rep = this.children[i].getPresoBrickFromDescendant(brick);
					 if(rep) break;
					}
				 return rep;
				}
			 Presentation.prototype.appendChildFromBrick = function(brick, fParams, constrName) {
				 // Stop here if there is still an existing presentation plugged to this and brick
				 var preExistingPreso = false, nb = 0;
				 for(var i=0; i<this.children.length; i++) {
					 if(this.children[i].brick === brick) {nb++;}
					}
				 if(nb >= this.brick.containsChild(brick)) {
					 preExistingPreso = true;
					 console.log('Attention, trying to plug more presentations than necessery...', nb, brick);
					}
				 if(!preExistingPreso) {
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
							 preso.init(brick, []);
							 if(fParams) {fParams.apply(preso, []);}
							 this.appendChild(preso);
							 return preso;
							} else {/*console.log("\tchild preso",p,"is still plugged to",preso.parent);*/}
						}
					 // Last, if there is a factory...
					 var preso = brick.getNewPresentation();
					 if(preso) {if(fParams) {fParams.apply(preso, []);}
								this.appendChild(preso);
								// Recursive plug
								preso.appendDescendants();
								return preso;}
					}
					
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
				 // console.log("Presentation::deletePrimitives", this);
				 if(this.root && (this.root.parentElement || this.root.parentNode)) {
					 (this.root.parentElement || this.root.parentNode).removeChild(this.root);
					 this.root = null;
					}
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
				 if(N.parentElement === null) {P.appendChild(N);}
				}
			 Presentation.prototype.primitiveUnPlug = function(c) {
				 if(c.root && c.root.parentElement) {c.root.parentElement.removeChild(c.root);}
				 if(c.root && c.root.parentNode   ) {c.root.parentNode.removeChild(c.root);}
				}
			 Presentation.prototype.appendDescendants = function() {
				 if(this.brick) {
					 var brick, preso, nb;
					 for(var b=0; b<this.brick.children.length; b++) {
						 brick = this.brick.children[b];
						 nb = this.brick.containsChild( brick );
						 if(nb > 1) {
							 console.log('Presentation::appendDescendants : multiple reference of a child brick');
							}
						 L_preso = this.getAllPresoBrickFromDescendant(brick);
						 for(var p=L_preso.length; p<nb; p++) {
							 preso = brick.getNewPresentation();
							 this.appendChild(preso);
							 L_preso.push( preso );
							}
						 for(var p=0; p<L_preso.length; p++) {
							 L_preso[p].appendDescendants();
							}
						 // if(preso === null) {preso = this.appendChildFromBrick( brick );}
						 // if(preso) preso.appendDescendants();
						}
					}
				}
			 Presentation.prototype.setName = function(name) {}
			 Presentation.prototype.getDescendants = function() {
				 var L = [this], L_rep = [], n;
				 while(L.length) {
					 n = L[0];
					 L_rep.push( L.splice(0,1)[0] );
					 for(var i=0; i<n.children.length; i++) {L.push( n.children[i] );}
					}
				 return L_rep;
				}

			 // Return the reference to the Presentation constructor
			 return Presentation;
			}
	  );