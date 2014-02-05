define( [ 
		]
	  , function(svgUtils) {
			 var svgAlx = function(conf) {
				 this.root = null;
				}
			 svgAlx.prototype.getRoot = function()	{return this.root;}
			 svgAlx.prototype.configure = function(conf, obj) {
				 obj = obj || this.root;
				 var val;
				 for(var a in conf) {
					 val = conf[a];
					 if(typeof val === 'object') {
						 this.configure(conf[a], obj[a]);
						} else {if(obj.setAttribute) {
									 obj.setAttribute(a, conf[a]);
									} else {obj[a] = conf[a];}
							   }
					}
				}
			 svgAlx.prototype.translate = function(dx,dy) {
				 XXX
				}
			 svgAlx.prototype.rotate = function(alpha, cx, cy) {
				 XXX
				}
			 svgAlx.prototype.scale = function(sx,sy) {
				 XXX
				}
			 svgAlx.prototype.matrix = function(M) {
				 this.root.setAttribute('transform', 'matrix('+M.a+','+M.b+','+M.c+','+M.d+','+M.e+','+M.f+')' );
				}
			 return svgAlx;
			}
	  );
	  