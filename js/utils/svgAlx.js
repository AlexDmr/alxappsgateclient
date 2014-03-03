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
				 this.root.setAttribute('transform', '');
				 return this;
				}
			 svgAlx.prototype.matrix = function(M) {
				 this.root.setAttribute('transform', 'matrix('+M.a+','+M.b+','+M.c+','+M.d+','+M.e+','+M.f+')' );
				 return this;
				}
			 svgAlx.prototype.fillSpace = function(rect, scale) {
				// Compute scale
				 var bbox    = this.getBBox();
				 svgPoint.x  = svgPoint.y = 0;
				 var svgPointO   = svgPoint.matrixTransform( this.root.parentNode.getCTM().inverse().multiply(this.root.getCTM()) );
				 svgPoint.x  = bbox.width; svgPoint.y = bbox.height;
				 var svgPointWH  = svgPoint.matrixTransform( this.root.parentNode.getCTM().inverse().multiply(this.root.getCTM()) );
				 bbox.width  = svgPointWH.x - svgPointO.x;
				 bbox.height = svgPointWH.y - svgPointO.y;
				 var S		 = scale * Math.min(rect.width/bbox.width, rect.height/bbox.height);
				 this.scale(S,S);
				// Compute translation
				 svgPoint.x  = svgPoint.y = 0;
				 svgPointO   = svgPoint.matrixTransform( this.root.parentNode.getCTM().inverse().multiply(this.root.getCTM()) );
				 svgPoint.x  = bbox.width; svgPoint.y = bbox.height;
				 svgPointWH  = svgPoint.matrixTransform( this.root.parentNode.getCTM().inverse().multiply(this.root.getCTM()) );
				 bbox.width  = svgPointWH.x - svgPointO.x;
				 bbox.height = svgPointWH.y - svgPointO.y;
				 svgPoint.x  = bbox.x; svgPoint.y = bbox.y;
				 svgPointO   = svgPoint.matrixTransform( this.root.parentNode.getCTM().inverse().multiply(this.root.getCTM()) );
				 var DX		 = rect.x - svgPoint.x/S + (rect.width  - bbox.width ) / 2
				   , DY		 = rect.y - svgPoint.y/S + (rect.height - bbox.height) / 2;
				 this.translate(DX, DY);
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
	  