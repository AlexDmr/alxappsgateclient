var dataZoom = {
	  x : 0, y : 0
	, w : 12, h : 12
	, name  : "Appartement"
	, image : "img/appart.png"
	, quad : 1
	, children : [
		  {x:0,y:0,w:12,h:4,name:'Gros bandeau'}
		, {x:0,y:4,w:4,h:4,name:'gros carré'
		  , quad : 1
		  , children : [ {x:0,y:0,w:4,h:8,name:'A'}
					   , {x:11,y:11,w:1,h:1,name:'petit carré 0'}
					   , {x:5,y:1,w:6,h:10,name:'B'}
					   ]
		  }
		, {x:4,y:5,w:1,h:1,name:'petit carré 1'}
		, {x:5,y:5,w:1,h:1,name:'petit carré 2'
		  , children : [ {x:0,y:0,w:8,h:8,name:'A+'}
					   , {x:8,y:0,w:4,h:4,name:'B+'}
					   , {x:11,y:11,w:1,h:1,name:'C+'
					     , children: [ {x:0,y:0,w:4,h:4,name:'1'}
									 , {x:4,y:4,w:4,h:4,name:'2'}
									 , {x:8,y:8,w:4,h:4,name:'3'}
									 ]
						 }
					   ]
		  }
		]
};
var svg = null, svg_point = null;
function init() {
	console.log("init");
	initTiles(dataZoom, 48);
	svg = document.querySelector('svg');
	svg_point = svg.createSVGPoint(1,0);

}

function initTiles(data, size) {
	drawTiles( document.querySelector("svg > g"), size);
	// Draw the data, plug the interaction
	var g = initTile( document.querySelector("svg > g"), data, size);
	
}

function initTile(root, data, size) {
	var dt = 0.1;//, scale = (12-2*dt)/12;
	var g  = document.createElementNS("http://www.w3.org/2000/svg", 'g');
		g.setAttribute('transform', 'translate(' + data.x*size
										  + ', ' + data.y*size + ')');
	var gr = document.createElementNS("http://www.w3.org/2000/svg", 'g');
		var scale = (Math.max(data.w,data.h)-2*dt)/12;
		gr.classList.add('rootInternal');
		gr.setAttribute('transform', 'translate('+ dt*size
											+', '+ dt*size
											+') scale('+scale+','+scale+')');
	var r  = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		r.setAttribute('x', 0.5*dt*size);
		r.setAttribute('y', 0.5*dt*size);
		r.setAttribute('width' , size*(data.w-dt));
		r.setAttribute('height', size*(data.h-dt));
		r.classList.add('tile');
	g.appendChild(r); g.appendChild(gr);
	if(data.quad) {drawLines(gr, size, 12*size, 12*size);}
	if(data.children) {
		 for(var i=0; i<data.children.length; i++) {
			 initTile(gr, data.children[i], size/*size*Math.max(data.w,data.h)/12*/);
			}
		}
	root.appendChild(g);
	// Compute zoom for children under gr
	return g;
}

function drawTiles(root, size) {
	var svg = document.querySelector('svg');
	var g  = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	var svg_style = window.getComputedStyle( svg );
	var lg = parseInt(svg_style.width);
	var ht = parseInt(svg_style.height);
	
	for(var i=0; i<Math.ceil(lg/size); i++) {
		 for(var j=0; j<Math.ceil(ht/size); j++) {
			 var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			 g.appendChild( r );
			 r.classList.add('BgTile');
			 r.setAttribute('transform', 'translate('+i*size+', '+j*size+')');
			 r.setAttribute('width' , size);
			 r.setAttribute('height', size);
			}
		}
	//drawLines(g, size, lg, ht);
	root.appendChild( g );
	
	// Subscribe to click on bricks
	
	svg.addEventListener( 'mousedown'
					  , function(e) {
							 console.log("Click!", e);
							 var M1 = root.getCTM();
							 var r = e.target.parentNode.querySelector('g');
							 var M2 = r.getCTM().inverse().multiply(M1);
							 
							 var ms = Date.now(); //(new Date()).getTime();
							 window.requestAnimFrame( function(time) {
								var L_toAppear    = [],
								    L_toDisappear = [];
								ComputeSemanticZoom	( root
													, M1.inverse().multiply(M2)
													, L_toAppear, L_toDisappear
													);
								CB_zoom(ms, ms+1000, M1, M2, root, L_toAppear, L_toDisappear);
								});
							}
					  , false);
}

function drawLines(root, size, lg, ht) {
	for(var i=0; i<=Math.ceil(lg/size); i++) {
		 var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
		 root.appendChild( l ); l.classList.add('BgTile');
		 l.setAttribute('x1', i*size); l.setAttribute('y1', 0);
		 l.setAttribute('x2', i*size); l.setAttribute('y2', ht);
		}
	for(var j=0; j<=Math.ceil(ht/size); j++) {
		 var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
		 root.appendChild( l ); l.classList.add('BgTile');
		 l.setAttribute('x1', 0) ; l.setAttribute('y1', j*size);
		 l.setAttribute('x2', lg); l.setAttribute('y2', j*size);
		}
}

function ComputeSemanticZoom(root, MT, L_toAppear, L_toDisappear) {
	var M = MT.multiply( root.getCTM() );
	svg_point.x = 0; svg_point.y = 0;
	var P0 = svg_point.matrixTransform( M );
	svg_point.x = 1; svg_point.y = 0;
	var P1 = svg_point.matrixTransform( M );
	var dx = P1.x - P0.x,
	    dy = P1.y - P0.y,
		scale = Math.sqrt( dx*dx + dy*dy );
	console.log(scale);
	if(scale < 0.5) {
		 if(root.dataset.display !== 'none') {
			 root.dataset.display = 'none';
			 root.style.opacity = 1;
			 L_toDisappear.push(root);
			}
		 return;
		} else 	{if(root.dataset.display === 'none') {
					 root.dataset.display = 'true';
					 root.style.display = 'inherit';
					 root.style.opacity = 0;
					 L_toAppear.push(root);
					}
				 root.style.display = 'inherit';
				}
	// Recursing across semantic zoom structure
	for(var i=0;i<root.children.length;i++) {
		 if(root.children[i].tagName !== 'g') {continue;}
		 ComputeSemanticZoom(root.children[i], MT, L_toAppear, L_toDisappear);
		}
}

function CB_zoom(ms1,ms2,M1,M2,node, L_toAppear, L_toDisappear) {
	var ms = Date.now();
	if(ms < ms2) {
		 window.requestAnimFrame( function(time) {CB_zoom(ms1,ms2,M1,M2,node, L_toAppear, L_toDisappear);}
								);
		} else {ms=ms2; 
				// ComputeSemanticZoom(node);
			   }
	for(var i=0;i<L_toAppear.length   ;i++) {   L_toAppear[i].style.opacity = Math.easeInOutQuad(ms-ms1,0, 1,ms2-ms1);}
	for(var i=0;i<L_toDisappear.length;i++) {L_toDisappear[i].style.opacity = Math.easeInOutQuad(ms-ms1,1,-1,ms2-ms1);}
	if(ms === ms2) {
		 for(var i=0;i<L_toDisappear.length;i++) {L_toDisappear[i].style.display = 'none';}
		}
	//var dt = (ms-ms1)/(ms2-ms1); //console.log(ms,dt);
	node.setAttribute( 'transform'
					 , 'matrix(' + Math.easeInOutQuad(ms-ms1,M1.a,M2.a-M1.a,ms2-ms1) //(M1.a+(M2.a-M1.a)*dt)
						   + ',' + Math.easeInOutQuad(ms-ms1,M1.b,M2.b-M1.b,ms2-ms1) //(M1.b+(M2.b-M1.b)*dt)
						   + ',' + Math.easeInOutQuad(ms-ms1,M1.c,M2.c-M1.c,ms2-ms1) //(M1.c+(M2.c-M1.c)*dt)
						   + ',' + Math.easeInOutQuad(ms-ms1,M1.d,M2.d-M1.d,ms2-ms1) //(M1.d+(M2.d-M1.d)*dt)
						   + ',' + Math.easeInOutQuad(ms-ms1,M1.e,M2.e-M1.e,ms2-ms1) //(M1.e+(M2.e-M1.e)*dt)
						   + ',' + Math.easeInOutQuad(ms-ms1,M1.f,M2.f-M1.f,ms2-ms1) //(M1.f+(M2.f-M1.f)*dt)
						   + ')'
					 );
}

Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();