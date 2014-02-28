define( [ "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgGroup"
		, "utils/svgText"
		, "utils/svgRect"
		]
	  , function( svgAlx, svgUtils
				, svgGroup, svgText, svgRect ) {
			 var svgButton = function(config) {
				 var self = this;
				 this.Aroot = new svgGroup({class: 'svgButton'});
					this.Aroot.root.setAttribute('filter', "url(#dropShadow)");
					this.Arect		= new svgRect(config.bg);
					this.Acontent	= new svgText(config.content).set(config.content.value);
					this.Aroot.appendChild(this.Arect);
					this.Aroot.appendChild(this.Acontent);
					this.Acontent.getRoot().addEventListener( 'DOMNodeInsertedIntoDocument'
						, function(e) {
							 var bbox = self.Acontent.getRoot().getBBox();
							 self.Arect.configure({x:bbox.x-3,y:bbox.y-3,width:bbox.width+6,height:bbox.height+6});
							}
						, false );
				 this.root = this.Aroot.getRoot();
				 return this;
				}
			
			 svgButton.prototype = new svgAlx();
			 svgButton.prototype.command = function(CB) {
				 this.root.addEventListener('click', function() {CB();}, false);
				 return this;
				}
			 return svgButton;
			}
	  );
	  