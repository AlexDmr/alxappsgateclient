define( [ "Bricks/Presentations/utils"
	    ]
	  , function(utils) {
			 // Define the Brick constructor
			 var msgId = 0;
			 var Brick = function(children) {
				 this.name = '';
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
			 Brick.prototype.changePresentationsWithContext = function(context, brick) {
				 var preso;
				 brick = brick || this;
				 for(var p=0; p<this.presentations.length; p++) {
					 preso = this.presentations[p].getPresoBrickFromDescendant( brick );
					 brick.changePresentationWithContext(preso, context);
					}
				}
			 Brick.prototype.changePresentationWithContext = function(preso, context) {
				 var newPreso      = this.getNewPresentationWithContext(context)
				   , presoParent   = preso.parent
				   , presoChildren = preso.children.slice();
				 if(newPreso === null) {console.error("There is no presentation for", this, "adapted to context", context); return;}
				 this.unPlugPresentation(preso);
				 for(var i=0; i<presoChildren.length; i++) {
					 presoChildren[i].brick.unPlugPresentation( presoChildren[i] );
					 newPreso.appendChild( presoChildren[i] );
					}
				 presoParent.appendChild( newPreso );
				 newPreso.appendDescendants();
				 newPreso.forceRender();
				}
			 Brick.prototype.getNewPresentationWithContext = function(context) {
				 context 				= context				|| {};
				 context.tags			= context.tags 			|| [];
				 context.pixelsDensity	= context.pixelsDensity || 1;
				 context.pixelsRatio	= context.pixelsRatio	|| 1;
				 // Context contains informations such as ratio and pixels
				 for(var i in this.presoFactories) {
					 var factory = this.presoFactories[i];
					 factory.validity.tags = factory.validity.tags || []
					 if (  factory.validity.pixelsMinDensity <= context.pixelsDensity
						&& factory.validity.pixelsMaxDensity >= context.pixelsDensity
						&& (  factory.validity.pixelsRatio === 0
						   || factory.validity.pixelsRatio === context.pixelsRatio)
						&& utils.intersect(factory.validity.tags, context.tags).length === context.tags.length
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
			 Brick.prototype.ancestors = function() {
				 var Lrep = [], L = this.parents.slice()
				   , p;
				 while(L.length) {
					 p = L.pop();
					 Lrep.push(p);
					 for(var i=0;i<p.parents;i++) {L.push(p.parents[i]);}
					}
				 return Lrep;
				}
			 Brick.prototype.getName = function(    ) {return this.name;}
			 Brick.prototype.setName = function(name) {
				 this.name = name;
				 for(var i=0; i<this.presentations.length; i++) {this.presentations[i].setName(name);}
				 return this;
				}
			 
			 // Return the reference to the Brick constructor
			 return Brick;
			}
	  );