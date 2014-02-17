define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgImage = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'image');
				 this.configure( { style : {}
								 } );
				 this.configure( conf );
				}
			
			 svgImage.prototype = new svgAlx();
			 svgImage.prototype.load = function(path) {
				 this.root.setAttributeNS('http://www.w3.org/1999/xlink','href', path);
				 return this;
				}
				
			 return svgImage;
			}
	  );
	  