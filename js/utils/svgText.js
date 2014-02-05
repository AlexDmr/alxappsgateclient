define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgText = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'text');
				 this.configureText( { style : {fontFamily: 'fontConsolas'}
									 , x:0, y:0
								     } );
				 this.configureText( conf );
				}
			
			 svgText.prototype = new svgAlx();
			 svgText.prototype.configureText = function(conf) {
				 this.configure(conf, this.root);
				}
			 
			 return svgText;
			}
	  );
	  