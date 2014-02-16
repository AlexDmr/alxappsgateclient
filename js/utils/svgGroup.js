define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgGroup = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'g');
				 this.configure( conf );
				}
			 svgGroup.prototype = new svgAlx();
			 
			 return svgGroup;
			}
	  );
	  