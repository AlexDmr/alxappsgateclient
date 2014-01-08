define( ["Bricks/protoBricks"]
	  , function(Brick) {
			 var Hue = function(id) {
				 this.color = "FFFFFF";
				};
			 Hue.prototype = Brick;
			 Hue.prototype.render = function() {
				 this.root = document.createElement('div');
				 this.root.innerHTML  = "<span>Lamp <span><span class=\"name\"></span>"
					var T = ['id', 'color'];
					for(var i in T) {
						 var p = document.createElement('p');
							var state = document.createElement('span'); state.innerText = T[i] + " : ";
								p.appendChild(state);
							var value = document.createElement('span'); state.innerText = this[T[i]];
								p.classList.add('state'); p.classList.add(T[i]);
								p.appendChild(value);
						 this.root.appendChild(p);
						}
				 var btOnOff = document.createElement('button');
					btOnOff.innerText = "Allumer";
					this.root.appendChild(btOnOff);
				}
			 return Hue;
			}
	  );