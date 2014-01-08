// Framework for simulating touch events without a mobile device
// Trying to be compatible with
//  http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
// TODO: support more of the touch API: touch{enter, leave, cancel}

// Updated by Alexandre Demeure
// real coordinates (in case of page scroll
// simulation of the touch datastructure

var tuio = {
	Pipo_TouchList: function(L) {
		 this.Tab = L;
		 for(var i=0; i<L.length; i++) {this[i] = L[i];}
		 this.length = L.length;
		 this.item = function(i) {return this.Tab[i];}
		 this.splice = function(index, nb) {
			 this.Tab.splice(index, nb);
			 this.length = this.Tab.length;
			 delete this[ this.length ];
			 for(var i=0; i<L.length; i++) {this[i] = L[i];}
			},
		 this.identifiedTouch = function(id) {
			 for(var i = 0; i < this.length; i++) {
				 if(this.Tab[i].identifier == id) return this.Tab[i];
				}
			 return null;
			}
		 this.push = function(e) {
			 this.Tab.push(e);
			 this[this.length] = this.Tab[this.length];
			 this.length = this.Tab.length;
			}
		 this.setTarget = function(i, n) {return this.Tab[i].target = n;}
		},
		
	cursors: null, //[],

  // Data structure for associating cursors with objects
	_data: {},

  _touchstart:    function(touch) {
    // Create a touchstart event
	// Compute touch target
	//touch.target = null;
	var node = touch.currentTarget;
	// while(node != null && node.ontouchstart == undefined && ) {
		 // node = node.parentNode;
		// }
    this._create_event('touchstart', touch, {});
  },

  _touchmove: function(touch) {
    // Create a touchmove event
    this._create_event('touchmove', touch, {});
  },

  _touchend: function(touch) {
    // Create a touchend event
    this._create_event('touchend', touch, {});
  },

  _create_event: function(name, touch, attrs) {
    // Creates a custom DOM event
    //var evt = document.createEvent('CustomEvent');
	var evt = document.createEvent('HTMLEvents');
	
    evt.initEvent(name, true, true);
    // Attach basic touch lists
    evt.touches = this.cursors;
    // Get targetTouches on the event for the element
    evt.targetTouches  = this._get_target_touches(touch.target);
    evt.changedTouches = new this.Pipo_TouchList( [touch] );
    // Attach custom attrs to the event
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        evt[attr] = attrs[attr];
      }
    }
    // Dispatch the event
	
    if (touch.target) {
      // console.log('Dispatch touch event on ' + touch.target + ' (' + touch.target.getAttribute('id') + ')');
      touch.target.dispatchEvent(evt);
    } else {
      document.dispatchEvent(evt);
    }
  },

  _get_target_touches: function(element) {
    var targetTouches = new this.Pipo_TouchList([]);
    for (var i = 0; i < this.cursors.length; i++) {
      var touch = this.cursors.item(i);
	  // console.log('touch = cursor[' + i + '] = ' + touch);
      if (touch.target == element) {
        targetTouches.push(touch);
      }
    }
    return targetTouches;
  },

	// Callback from the main event handler
	callback: function(type, sid, fid, x, y, angle) {
    // console.log('callback type: ' + type + ' sid: ' + sid + ' fid: ' + fid);
		var data;

		if (type !== 3) {
			data = this._data[sid];
		} else {
			data = {
				sid: sid,
				fid: fid
			};
			this._data[sid] = data;
		}

    // Some properties
    // See http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
    data.identifier = sid;
    data.pageX  = data.clientX = window.innerWidth  * x;
    data.pageY  = data.clientY = window.innerHeight * y;
    data.currentTarget = data.target = document.elementFromPoint(data.pageX, data.pageY);
    data.pageX += window.pageXOffset;
    data.pageY += window.pageYOffset;
	// console.log('Touch target ' + data.target + '(' + data.target.getAttribute('id') + ') from point ' + data.pageX + ' ; ' + data.pageY);

		switch (type) {
			case 3:
			    // console.log('add pointer: ');
				// for (att in data) {
					 // console.log('  ' + att + ': ' + data[att] );
					// }
				this.cursors.push(data);
				this._touchstart(data);
				break;

			case 4:
				this._touchmove(data);
				break;

			case 5:
				// console.log('a pointer disappears... data: ' + data);
				var index_of_touch;
				for(index_of_touch = 0; index_of_touch < this.cursors.length; index_of_touch++) {
					 if(this.cursors.item(index_of_touch).identifier == data.identifier) break;
					}
				this.cursors.splice(index_of_touch, 1);
				this._touchend(data);
				break;

			default:
				break;
		}

		if (type === 5) {
			delete this._data[sid];
		}
	}

};

tuio.cursors = new tuio.Pipo_TouchList([]);

function tuio_callback(type, sid, fid, x, y, angle)	{
	tuio.callback(type, sid, fid, x, y, angle);
}
