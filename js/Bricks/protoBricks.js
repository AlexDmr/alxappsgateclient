define( function() {
			 // Define the Brick constructor
			 var msgId = 0;
			 var Brick = function(children) {
				}
			 // Definition of the Brick class
			 Brick.prototype.constructor = Brick;
			 Brick.prototype.init = function(children) {
				 this.children 		= children || [];
				 this.parents		= [];
				 this.children		= [];
				 this.presentations = [];
				 this.presoFactories= {};
				 for(var i=0;i<this.children.length;i++) {this.appendChild(this.children[i]);}
				 return this;
				}
			 Brick.prototype.appendPresoFactory = function(name, constr, validity) {
				 validity = validity || { pixelsMinDensity	: 0
										, pixelsMaxDensity	: 999999999
										, pixelsRatio		: 0
										};
				 if(!validity) {throw('Pas de domaine de validité définit pour ' + name);}
				 this.presoFactories[name] = {name:name,constr:constr,validity:validity,UIs:[]};
				}
			 Brick.prototype.unPlugPresentation = function(preso) {
				 if(preso.factory) {preso.factory.UIs.push(preso);}
				 var parent = preso.parent;
				 if(parent) {parent.removeChild(preso);}
				}
			 Brick.prototype.getNewPresentationWithContext = function(context) {
				 // Context contains informations such as ratio and pixels
				 for(var i in this.presoFactories) {
					 var factory = this.presoFactories[i];
					 if (  factory.validity.pixelsMinDensity <= context.pixelsDensity
						&& factory.validity.pixelsMaxDensity >= context.pixelsDensity
						&& (  factory.validity.pixelsRatio === 0
						   || factory.validity.pixelsRatio === context.pixelsRatio)
						) {// This is the right factory!
						   return this.getNewPresentation(factory.name);
						  }
					}
				 return null;
				}
			 Brick.prototype.getNewPresentation = function(name) {
				 var res = null, fact = null;
				 if(name && this.presoFactories[name]) {
					 fact = this.presoFactories[name];
					} else {var Constrs = Object.keys(this.presoFactories);
							if(Constrs.length > 0) {fact = this.presoFactories[Constrs[0]];}
						   }
				 if(fact) {
					 if(fact.UIs.length > 0) {
						 res = fact.UIs.splice(0,1)[0];
						} else {res = new fact.constr();}
					 res.init(this);
					 res.validity = fact.validity;
					 res.factory  = fact;
					}
				 if(res) {
					 res.isGoingToDisappear = false;
					 // Plug to children presentations
					 for(var c=0; c<this.children; c++) {
						 res.appendChildFromBrick( this.children[c] );
						}
					}
				 return res;
				}
			 Brick.prototype.call = function(target, json, CB) {
				 msgId++; var id = String(msgId);
				 socket.on( id
						  , function(data) {
								 CB(data);
								 setTimeout ( function() {socket.removeAllListeners(id);}
											, 100 );
								}
						  );
				 socket.emit('call', {target:target, msg:json, msgId:msgId} );
				}
			 Brick.prototype.appendParent = function(p) {
				 if(this.parents.indexOf(p) == -1) {
					 this.parents.push(p);
					 p.appendChild(this);
					}
				}
			 Brick.prototype.removeParent = function(p) {
				 var pos = this.parents.indexOf(p)
				 if(pos !== -1) {
					 this.parents.splice(pos,1);
					 p.removeChild(this);
					}
				}
			 Brick.prototype.appendChild = function(c) {
				 if(this.children.indexOf(c) == -1) {
					 this.children.push(c);
					 c.appendParent(this);
					 // Also plug presentations
					 for(var p in this.presentations) {this.presentations[p].appendChildFromBrick(c);}
					}
				}
			 Brick.prototype.removeChild = function(c) {
				 var pos = this.children.indexOf(c)
				 if(pos !== -1) {
					 this.children.splice(pos,1);
					 c.removeParent(this);
					 // Also unplug presentations
					 for(p in this.presentations) {this.presentations[p].removeChildFromBrick(c);}
					}
				}
			 Brick.prototype.appendPresentations = function(LP) {
				 for(var p=0;p<LP.length;p++) {
					 if(this.presentations.indexOf( LP[p] ) === -1) {
						 this.presentations.push( LP[p] );
						 LP[p].brick = this;
						}
					}
				}
			 Brick.prototype.removePresentations = function(LP) {
				 var newLP = [];
				 for(var i=0;i<this.presentations.length;i++) {
					 if(LP.indexOf(this.presentations[i]) === -1) {
						 newLP.push(this.presentations[i]);
						} else {this.presentations[i].brick = null;}
					}
				 this.presentations = newLP;
				}
			 Brick.prototype.toConsole = function(indent) {
				 indent = indent || '';
				 console.log(indent, this);
				 for(var i=0; i<this.children.length; i++) {
					 this.children[i].toConsole(indent+'  ');
					}
				}
			 
			 // Return the reference to the Brick constructor
			 return Brick;
			}
	  );