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
					div.innerHTML = '<input class="name" type="text" value="'+svgE.get()+'"/><button class="OK" value="Valider">Valider</button><button type="button" class="Cancel" value="Annuler">Annuler</button>'
					var IN = div.querySelector('input')
					  , ok = div.querySelector('.OK')
					  , ca = div.querySelector('.Cancel');
					IN.addEventListener('keypress', function() {console.log(IN.value);}, false);
					var fctOK = function()  {svgE.set( IN.value );
											 console.log("OK with", IN.value);
											 document.body.removeChild(div); }
					  , fctCA = function()  {document.body.removeChild(div);}
					ok.addEventListener('mousedown', fctOK, false); ok.addEventListener('touchstart', fctOK, false);
					ca.addEventListener('mousedown', fctCA, false); ca.addEventListener('touchstart', fctCA, false);
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
					svgUtils.onDOMNodeInsertedIntoDocument(
						  this.Acontent.getRoot()
						, function() {
							 var bboxR = self.Arect.getBBox()
							   , bboxC = self.Acontent.getBBox();
							 // Left middle alignment
							 self.Acontent.translate(0, bboxC.height);
							}
						);
					/*this.Acontent.getRoot().addEventListener( 'DOMNodeInsertedIntoDocument'
						, function(e) {
							 var bboxR = self.Arect.getBBox()
							   , bboxC = self.Acontent.getBBox();
							 // Left middle alignment
							 self.Acontent.translate(0, bboxC.height);
							 // self.Acontent.configure({x:bbox.x-3,y:bbox.y-3,width:bbox.width+6,height:bbox.height+6});
							}
						, false );*/
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
	  

