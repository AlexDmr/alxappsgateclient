define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgOval = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
				 this.configure( { style : {}
								 , cx:0,cy:0,rx:100,ry:50
								 }
							   , this.root );
				 this.configure( conf, this.root );
				 return this;
				}
			
			 svgOval.prototype = new svgAlx();
			 
			 return svgOval;
			}
	  );
	  