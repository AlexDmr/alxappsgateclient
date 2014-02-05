define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgRect = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
				 this.configureRect( { style : {fill: 'red', stroke: 'black'}
									 , x:0, y:0, width:100, height:50
								     } );
				 this.configureRect( conf );
				}
			
			 svgRect.prototype = new svgAlx();
			 svgRect.prototype.configureRect = function(conf) {
				 this.configure(conf, this.root);
				}
			 
			 return svgRect;
			}
	  );
	  