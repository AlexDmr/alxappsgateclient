/*
 * ClassList patch for SVG Elements
 */
// console.log("coucou");
if (typeof SVGElement !== 'undefined' && !SVGElement.prototype.classList && Object.defineProperty) {
// console.log('PATCH');
Object.defineProperty(SVGElement.prototype, 'classList', {
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.getAttribute('class') || ''
                      , index = classes.indexOf(value);
                    classes = classes.split(/\s+/);
					fn(classes, index, value);
                    self.setAttribute('class', classes.join(" "));
                }
            }

            var ret = {                    
                add: update(function(classes, index, value) {
                    ~index || classes.push(value);
                }),

                remove: update(function(classes, index) {
                    ~index && classes.splice(index, 1);
                }),

                toggle: update(function(classes, index, value) {
                    ~index ? classes.splice(index, 1) : classes.push(value);
                }),

                contains: function(value) {
                    return !!~self.className.split(/\s+/).indexOf(value);
                },

                item: function(i) {
                    return self.className.split(/\s+/)[i] || null;
                }
            };
            
            Object.defineProperty(ret, 'length', {
                get: function() {
                    return self.className.split(/\s+/).length;
                }
            });

            return ret;
        }
    });
}