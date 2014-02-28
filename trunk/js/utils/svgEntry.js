define( [ "utils/svgAlx"
		, "utils/svgUtils"
		, "utils/svgGroup"
		, "utils/svgText"
		, "utils/svgRect"
		]
	  , function( svgAlx, svgUtils
				, svgGroup, svgText, svgRect ) {
			 
			 function modal(svgE) {
				 // Display a modal window
				 // document.body.classList.remove( 'noUserSelect' );
				 var div = document.createElement('div');
					div.classList.add('AlxModal');
					div.innerHTML = '<form><input class="name" type="text" name="valTextSvgE" value="'+svgE.get()+'"/><input type="button" class="OK" value="OK">OK</input><input type="button" class="Cancel" value="Cancel">Cancel</input></form>'
					var IN = div.querySelector('input')
					  , ok = div.querySelector('.OK')
					  , ca = div.querySelector('.Cancel');
					ok.addEventListener('click', function() {svgE.set(this.form.valTextSvgE.value);
															 document.body.removeChild(div);
															 // document.body.classList.add( 'noUserSelect' );
															 console.log("OK with this", this.form);
															}, false);
					ca.addEventListener('click', function() {document.body.removeChild(div);
															 // document.body.classList.add( 'noUserSelect' );
															}, false);
					document.body.appendChild( div );
					IN.focus();
				}
			 var svgEntry = function(config) {
				 config = config || {}
				 var self = this;
				 this.Aroot = new svgGroup();
					config.bg = config.bg || {}
					config.bg.x      = config.bg.x      || -3;
					config.bg.y      = config.bg.y      || -3;
					config.bg.width  = config.bg.width  || 180;
					config.bg.height = config.bg.height || 30 ;
					this.Aroot.getRoot().classList.add('svgEntry');
					this.Arect		= new svgRect(config.bg);
					config.content = config.content || {};
					config.content.editable = 'true';
					config.content.value = config.content.value || '';
					this.Acontent	= new svgText(config.content).set(config.content.value);
					this.Aroot.appendChild(this.Arect);
					this.Aroot.appendChild(this.Acontent);
					this.Acontent.getRoot().addEventListener( 'DOMNodeInsertedIntoDocument'
						, function(e) {
							 var bboxR = self.Arect.getBBox()
							   , bboxC = self.Acontent.getBBox();
							 // Left middle alignment
							 self.Acontent.translate(0, bboxC.height);
							 // self.Acontent.configure({x:bbox.x-3,y:bbox.y-3,width:bbox.width+6,height:bbox.height+6});
							}
						, false );
				 this.Aroot.getRoot().addEventListener( 'click', function(e) {modal(self);}, false);
				 
				 this.root = this.Aroot.getRoot();
				 return this;
				}
			
			 svgEntry.prototype = new svgAlx();

			 svgEntry.prototype.get = function( ) {return this.Acontent.get();}
			 svgEntry.prototype.set = function(v) {this.Acontent.set(v);
												   if(this.CB) this.CB.apply(this, [v]);
												   return this; }
			 svgEntry.prototype.onSet = function(CB) {this.CB = CB;}
			 
			 return svgEntry;
			}
	  );
	  

