define( [ "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgGroup"
		, "utils/svgText"
		, "utils/svgRect"
		, "utils/svgImage"
		]
	  , function( svgAlx, svgUtils
				, svgGroup, svgText, svgRect, svgImage ) {
			 var svgButton = function(config) {
				 var self = this;
				 this.Aroot = new svgGroup({class: 'svgButton'});
					this.Aroot.root.setAttribute('filter', "url(#dropShadow)");
					if(config.content.value) {
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
						} else	{if(config.content.image) {
									 this.svgImg = new svgImage	( { width	: config.content.width  || 50
																  , height	: config.content.height || 50
																  } 
																).load(config.content.image);
									 this.Aroot.appendChild(this.svgImg);
									}
								}
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
	  