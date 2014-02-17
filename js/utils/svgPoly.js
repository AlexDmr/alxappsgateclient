define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgPoly = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
				 this.configure( { style : {}
								 } );
				 this.configure( conf );
				}
			
			 svgPoly.prototype = new svgAlx();
			 
			 return svgPoly;
			}
	  );
	  