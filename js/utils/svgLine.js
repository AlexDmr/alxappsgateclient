define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgLine = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'line');
				 this.configure( { style : {stroke: 'black'}
								 , x1:0, y1:0, x2:0, y2:0
								 }
							   , this.root );
				 this.configure( conf, this.root );
				 return this;
				}
			
			 svgLine.prototype = new svgAlx();
			 
			 return svgLine;
			}
	  );
	  