define( function() {
			 // Define the Brick constructor
			 var msgId = 0;
			 var Brick = function(children) {
				}
			 // Definition of the Brick class
			 Brick.prototype.init = function(children) {
				 this.children 		= children || [];
				 this.parents		= [];
				 this.children		= [];
				 this.presentations = [];
				 this.presoFactories= {};
				 for(var i=0;i<this.children.length;i++) {this.appendChild(this.children[i]);}
				}
			 Brick.prototype.appendPresoFactory = function(name, constr) {
				 this.presoFactories[name] = {name:name,constr:constr};
				}
			 Brick.prototype.getNewPresentation = function(name) {
				 var res = null;
				 if(!res && name && this.presoFactories[name]) {res = new this.presoFactories[name].constr();}
				 var Constrs = Object.keys(this.presoFactories);
				 if(!res && Constrs.length > 0   ) {res = new this.presoFactories[Constrs[0]].constr();}
				 if(res) {res.init(this);}
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
					 for(p in this.presentations) {console.log("append preso",p);this.presentations[p].appendChildFromBrick(c);}
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
			 // Return the reference to the Brick constructor
			 return Brick;
			}
	  );