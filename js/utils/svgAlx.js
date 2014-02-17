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
				 return this;
				}
			 svgAlx.prototype.appendChild = function(svgA) {
				 this.root.appendChild( svgA.getRoot() );
				 return this;
				}
			 svgAlx.prototype.removeChild = function(svgA) {
				 this.root.removeChild( svgA.getRoot() );
				 return this;
				}
			 svgAlx.prototype.getBBox = function() {return this.root.getBBox();}
			 svgAlx.prototype.translate = function(dx,dy) {
				 this.root.setAttribute('transform', (this.root.getAttribute('transform')||'') + ' translate('+dx+','+dy+')' );
				 return this;
				}
			 svgAlx.prototype.rotate = function(alpha, cx, cy) {
				 cx = cx || 0; cy = cy || 0;
				 this.root.setAttribute('transform', (this.root.getAttribute('transform')||'') + ' rotate('+alpha+','+cx+','+cy+')' );
				 return this;
				}
			 svgAlx.prototype.scale = function(sx,sy) {
				 this.root.setAttribute('transform', (this.root.getAttribute('transform')||'') + ' scale('+sx+','+sy+')' );
				 return this;
				}
			 svgAlx.prototype.matrixScalars = function(a,b,c,d,e,f) {
				 this.root.setAttribute('transform', 'matrix('+a+','+b+','+c+','+d+','+e+','+f+')' );
				 return this;
				}
			 svgAlx.prototype.matrixId = function() {
				 return this.matrixScalars(1,0,0,1,0,0);;
				}
			 svgAlx.prototype.matrix = function(M) {
				 this.root.setAttribute('transform', 'matrix('+M.a+','+M.b+','+M.c+','+M.d+','+M.e+','+M.f+')' );
				 return this;
				}
			 
			 svgAlx.prototype.fillSpace = function(rect, scale, rotate, x, y) {
				 rotate = rotate || 0; x = x || 0; y = y || 0;
				 this.root.setAttribute('transform', rotate?'rotate('+rotate+')':'');
				 var bbox    = this.root.getBBox()
				   , S		 = scale * Math.min(rect.width/bbox.width, rect.height/bbox.height)
				   , DX		 = x + rect.x - bbox.x*S + (rect.width  - S*bbox.width ) / 2
				   , DY		 = y + rect.y - bbox.y*S + (rect.height - S*bbox.height) / 2
				   , cos	 = Math.cos(3.14159265*rotate/180)
				   , sin	 = Math.sin(3.14159265*rotate/180);
				 this.translate	( DX, DY );
				 this.scale(S,S);
				 return this;
				}
			 
			 return svgAlx;
			}
	  );
	  