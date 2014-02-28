define( [ 
		]
	  , function(svgUtils) {
			 var svgPoint = null;
			 var svgAlx = function(conf) {
				 this.root = null;
				}
			 svgAlx.prototype.init = function(svgCanvas) {
				 svgPoint = svgCanvas.createSVGPoint();
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
				 if(svgA.getRoot().parentNode === null)
					this.root.appendChild( svgA.getRoot() );
				 return this;
				}
			 svgAlx.prototype.removeChild = function(svgA) {
				 if(svgA.getRoot().parentNode === this.root)
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
			 svgAlx.prototype.fillSpace = function(rect, scale) {
				 var bbox    = this.root.getBBox()
				   , S		 = scale * Math.min(rect.width/bbox.width, rect.height/bbox.height)
				   , DX		 = rect.x - bbox.x + (rect.width  - S*bbox.width ) / 2
				   , DY		 = rect.y - bbox.y + (rect.height - S*bbox.height) / 2;
				 this.translate(DX, DY).scale(S,S);
				 return this;
				}
			 svgAlx.prototype.rightTo = function(svgE) {
				 var bbox = svgE.getBBox(), bbox2 = this.getBBox();
				 svgPoint.x = bbox.x+bbox.width-bbox2.x; svgPoint.y = bbox.y;
				 svgPoint = svgPoint.matrixTransform( svgE.getRoot().parentNode.getCTM().inverse().multiply(svgE.getRoot().getCTM()) );
				 this.matrixId().translate(svgPoint.x, svgPoint.y);
				 return this;
				}
			 
			 return svgAlx;
			}
	  );
	  