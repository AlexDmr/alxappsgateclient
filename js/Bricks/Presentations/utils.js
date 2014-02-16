define( function() {
			Math.easeInOutQuad = function (t, b, c, d) {
				t /= d/2;
				if (t < 1) return c/2*t*t + b;
				t--;
				return -c/2 * (t*(t-2) - 1) + b;
			};
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       ||
					    window.webkitRequestAnimationFrame ||
					    window.mozRequestAnimationFrame    ||
					    function( callback ){window.setTimeout(callback, 1000 / 60);};
				})();
				
			var pDebug = null, nb = 0;
			var AlxUtils = {
				  generateSubscribers : function(C, name) {
					 C['initSubscribers_'+name] = function() {this['L_CB_'+name] = {};}
					 C['Subscribe_'+name] = function(id, CB) {this['L_CB_'+name][id] = CB;}
					 C['UnSubscribe_'+name] = function(id) {delete this['L_CB_'+name][id];}
					 C['CallSubscribers_'+name] = function() {
						 for(var i in this['L_CB_'+name]) {this['L_CB_'+name][i].apply(this, arguments);}
						}
					}
				// --- Animation ---
				, FormatNumberLength : function(num, length) {
					 var r = "" + num;
					 while (r.length < length) {r = "0" + r;}
					 return r;
					}
				, L_CB		: []
				, animate	: function(ms, CB) {
					 var now = Date.now();
					 var obj =  { CB		: CB
								, duration	: ms
								, start		: now
								, end		: now + ms
								}
					 this.L_CB.push( obj );
					 CB( {ms:now, dt:0} );
					 this.animFrame();
					}
				, animFrame	: function() {
					 if(this.isAnimating) {return;}
					 this.isAnimating = true;
					 var self = this;
					 window.requestAnimFrame( function() {
						 // alert('1');
						 var now = Date.now();
						 var L = self.L_CB, dt, o, ms;
						 self.L_CB = [];
						 for(var i=0; i<L.length; i++) {
							 o = L[i];
							 ms = Math.min(o.duration, now - o.start);
							 dt = ms  / o.duration;
							 o.CB( {ms:ms,dt:dt} );
							 if(dt < 1) {self.L_CB.push(o);}
							}
						 self.isAnimating = false;
						 if(self.L_CB.length) {self.animFrame();}
						});
					}
				, intersect : function(x, y) {
					 var ret = [];
					 for (var i = 0; i < x.length; i++) {
						 for (var z = 0; z < y.length; z++) {
							 if (x[i] === y[z]) {
								 ret.push(i);
								 break;
								}
							}
						}
					 return ret;            
					}
				}
			
			return AlxUtils;
		}
	);
