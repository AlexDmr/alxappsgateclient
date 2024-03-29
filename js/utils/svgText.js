define( [ "utils/svgAlx"
		, "utils/svgUtils"
		]
	  , function(svgAlx, svgUtils) {
			 var svgText = function(conf) {
				 this.root = document.createElementNS("http://www.w3.org/2000/svg", 'text');
				 this.configure( { style : {}
								 , x:0, y:0 }
							   , this.root );
				 this.configure(conf, this.root);
				 this.root.classList.add('svgText');
				 return this;
				}
			
			 svgText.prototype = new svgAlx();
			 svgText.prototype.get = function() {return this.root.textContent;}
			 svgText.prototype.set = function( text ) {
				 this.root.textContent = text;
				 return this;
				}
				
			 return svgText;
			}
	  );
	  