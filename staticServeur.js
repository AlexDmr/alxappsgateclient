var RRServer = {
	// Dependencies
	  fs		: require('fs-extra')
	, express	: require('express')
	, io		: require('socket.io')
	, upnp		: require("UPnP/lib/upnp-controlpoint").UpnpControlPoint
	, DOMParser	: require('xmldom').DOMParser
	, request	: require('request')
	, CommM		: require("utils/communicator").Communicator
	, comm		: null		// Communicator to AppsGate server
	, ctrlPoint	: null		// UPnP control point, used to detect AppsGate and communicate with Multimedia stuff
	, app		: null		// Express application
	, appsGate_ws_ad : null	// AppsGate websocket adress
	, HueLocation	 : null	// Phillips Hue bridge adress
	// Bricks : Devices and proxies
	, bricks : {}
	// Websocket Clients
	, clients	: {}
	, addClient: function(login, socket) {
		 this.clients[socket.id] = {socket: socket, login: login};
		}
	, removeClient: function(socket) {
		 if(this.clients[socket.id]) {delete this.clients[socket.id];}
		}
	, broadcastToClients: function(event_name, message) {
		 for(var i in this.clients) {this.clients[i].socket.emit(event_name, message);}
		}
	// List of Bricks
	, bricks : {}
	, saveBricksToFile: function(f_name) {
		 this.fs.writeFileSync(f_name, JSON.stringify(this.getBricks()));
		 return f_name;
		}
	, getBricks: function() {
		 var res = {};
		 for(var i in this.bricks) {
			 if(this.bricks[i].origin === "UPnP") {
				 var obj = {};
				 for(var att in this.bricks[i]) {if(att !== "device") {obj[att] = this.bricks[i][att];}}
				 res[i] = obj;
				} else {res[i] = this.bricks[i];}
			}
		 return res;
		}
	, updateBrick: function(obj, ms) {
		 // console.log("Update: " + JSON.stringify(obj));
		 var id = obj.id || obj.objectId;
		 if(!this.bricks[id]) {this.bricks[id] = {appearTime: ms};}
		 var brick = this.bricks[id];
		 for(var a in obj) {
			 if(!brick[a]) {brick[a] = [{ms:ms,val:obj[a]}]}
			 else {if(brick[a][ brick[a].length-1 ].val != obj[a]) {brick[a].push( {ms:ms,val:obj[a]} );} }
			}
		 return brick;
		}
	, updateBricksList: function(origin, json) {	// Received from AppsGate
		 console.log('updateBricksList');
		 var ms = (new Date()).getTime();
		 var T = JSON.parse(json.value);
		 for(var i=0; i<T.length; i++) {
			 if(T[i]) {
				 var brick = this.updateBrick(T[i], ms);
				 brick.origin = origin;
				} else {console.log("WARNING, there is a null device in the list at index", i);}
			}
		}
	// Messages exchange
	, call: function(socket, command) {
		 var self = this;
		 switch(command.target) {
			 case 'AppsGate' :
				 if(this.comm)
				 this.comm.sendMessage(	command.msg
									  , function(json) {socket.emit(command.msgId, json);}
									  );
			 break;
			 case 'AlxServer' :
				 console.log( "---------- Command for AlxServer:"+"\n\tmtd: "+command.msg.mtd+"\n\targs: "+command.msg.args+"\n-------------");
				 if(this[command.msg.mtd]) {
					  try	{console.log("typeof args is", typeof command.msg.args);
							 console.log( command );
							 var res = this[command.msg.mtd].apply(this, command.msg.args);
							 console.log("res is available");
							 socket.emit(command.msgId, {success:true,res:res});
							} catch(e)	{console.log("ERROR", e);
										 socket.emit(command.msgId, {success:false,res:JSON.stringify(e)});
										}
					 } else {socket.emit(command.msgId, {success:false,res:"ERROR, there is no method "+command.msg.mtd});}
			 break;
			 case 'UPnP' : 
				var id			= 'AlxUPnP->'+command.msg.UDN,
				    serviceType	= command.msg.serviceType,
				    action		= command.msg.action,
					arguments	= command.msg.args,
					brick		= this.bricks[id];
				if(brick && brick.origin === 'UPnP') {
					 var device = brick.device;
					 // console.log('Brick found : ' + id + "\n");
					 // for(var att in command.msg) {console.log("\t"+att+" : "+command.msg[att]);}
					 for(var service_name in device.services) {
						 var service = device.services[service_name];
						 // console.log('Considering '+service.serviceType+'/'+serviceType);
						 if(serviceType === service.serviceType) {
							 // console.log("callAction");
							 service.callAction	( action
												, arguments
												, function(err, buf) {
													 if(err) {
														 comment =    "ERROR during UPnP call:" + 
																	  "\n\t device : " + id +
																	  "\n\tservice : " + serviceType +
																	  "\n\t action : " + action +
																	  "\n\t   args : " + arguments + 
																	  "\n\t    err : " + err + 
																	  "\n\t    buf : " + buf;
														 console.log(comment);
														 socket.emit(command.msgId, {success:false,err:err,buf:buf,comment:comment});
														} else {socket.emit(command.msgId, {success:true,buf:buf});
															   }
													}
												);
							 break;
							}
						}
					}
			 break;
			 case 'Hue':
				if(this.HueLocation) {
					var method	= command.msg.method,
						  body	= command.msg.body,
						   url	= command.msg.url,
						    id	= command.msg.id;
					this.request( { url		: url
								  , method	: method
								  , json	: true
								  , body	: body
								  }
								, function (err, res, body) {
									 if(err) {console.error(err); return;}
									 var update = {id:id}, key, val, Atmp;
									 for(var a=0; a<body.length; a++) {
										 if(body[a].success) {
											 Atmp = Object.keys(body[a].success)[0].split('/');
											 key  = Atmp[Atmp.length-1];
											 val  = body[a].success[ Object.keys(body[a].success)[0] ];
											 update[key] = val;
											}
										}
									 self.updateBrick(update, Date.now());
									 socket.emit(command.msgId, {body:update});
									 self.broadcastToClients(id, update);
									}
								);
					}
			 break;
			 default :
				 console.log("Unknown origin", command.origin);
			}
		}
	// Initialisation
	, init		: function(port, params) {
		 if(params.AppsGateServerIP && params.AppsGateServerPORT) {
			 this.AppsGateServerConnection = { IP	: params.AppsGateServerIP
											 , PORT : params.AppsGateServerPORT };
			}
		 this.app	= this.express().use(this.express.static(__dirname))
									.use(this.express.bodyParser())
									.listen(port) ;
		 var self = this;
		 this.ctrlPoint = new this.upnp();
		 this.ctrlPoint.on( "device"
						  , function(self) {return function(device) {return self.UPnP_DeviceDetected(device);}}(this)
						  );
		 this.ctrlPoint.search();
		 //setTimeout(function() {self.ctrlPoint.search();}, 2000);
		 // Init the socket IO part
		 this.io	= this.io.listen( this.app, { log: false } );
		 this.io.on	( 'connection'
					, function (socket) {
						RRServer.addClient('Unknnown', socket);
						socket.on ( 'disconnect'
								  , function() {RRServer.removeClient(socket);} );
						socket.on ( 'call'
								  , function(data) {RRServer.call(socket, data);} );
						}
					);
		 // Direct connection to AppsGate server if specified
		 if(this.AppsGateServerConnection) {
			 this.appsGate_ws_ad = 'ws://'+this.AppsGateServerConnection.IP+':'+this.AppsGateServerConnection.PORT;
			 console.log('----> Direct connection to AppsGate Server', this.appsGate_ws_ad);
			 this.ConnectToAppsGateServer();
			}
		}
	, ConnectToAppsGateServer : function() {
		var self = this;
		self.comm = new self.CommM(self.appsGate_ws_ad);
		self.comm.initialize({});
		self.comm.subscribe ( 'newDevice', null
							, function(json) {
								 if(typeof json.newDevice === "string") {json.newDevice = JSON.parse(json.newDevice);}
								 var brick = RRServer.updateBrick(json.newDevice, (new Date()).getTime());
								 brick.origin = "AppsGate";
								 RRServer.broadcastToClients('newDevice', json);
								}
							);
		self.comm.subscribe ( 'objectId', null
							, function(json) {
								 var update = {id: json.objectId};
								 update[json.varName] = json.value;
								 var ms = (new Date()).getTime();
								 RRServer.updateBrick(update, ms);
								 update.ms = ms;
								 RRServer.broadcastToClients(update.id, update);
								}
							);
		console.log("Sending message getDevices\n");
		self.comm.sendMessage(	{ method: "getDevices"
								, args	: [] }
							 , function(json) {
								 console.log("getDevices result : ---------------");
								 console.log(json);
								 console.log("-----------------------------------");
								 RRServer.updateBricksList("AppsGate", json);
								}
							 );
		}
	, UPnP_DeviceDetected : function(device) {
		 var self = this;
		 // for(var att in device) {console.log("\t"+att);}
		 var ms = Date.now();
		 var newBrick = this.updateBrick( {id:'AlxUPnP->'+device.uuid, uuid:device.uuid, type:device.deviceType, device:device, name:device.friendlyName}, ms );
		 newBrick.origin = 'UPnP';
		 console.log("Adding AlxUPnP->"+device.uuid+"\n" + device.deviceType + " " + device.friendlyName);
		 device.friendlyName = device.friendlyName || 'NO DEVICE NAME...';
		 if(device.friendlyName.indexOf("Philips hue") == 0) {	// Found Hue bridge
			 this.HueLocation = "http://"+device.host+":"+device.port; console.log("Hue bridge at " + device.host + ":" + device.port);
			 this.request( { url	: this.HueLocation + '/api/AlxAppsGate'
						   , method	: 'GET'
						   , json	: true
						   }
						 , function (err, res, body) {
							 console.log("Hue state :",err, body);
							 if(body.lights) {	// Ok we got the description
								 for(var i in body.lights) {
									 // Add the corresponding light
									 var brick = { id			: 'HueLamp://'+device.host+":"+device.port+'/'+i
												 , name			: body.lights[i].name
												 , modelid		: body.lights[i].modelid
												 , type			: 'AlxHueLamp'
												 , origin		: 'Hue'
												 , HueUser		: 'AlxAppsGate'
												 , HueLocation	: self.HueLocation
												 , HueId		: i
												 }
									 for(var a in body.lights[i].state) {brick[a] = body.lights[i].state[a];}
									 self.updateBrick(brick, ms);
									}
								} else	{	// There is no such user probably...
										 
										}
							}
						 );
			}
		 if(device.friendlyName === "AppsGate set-top box" && !this.AppsGateServerConnection) {
			 console.log('--> Found the AppsGate server at ' + device.location);
			 for(var service_name in device.services) {
				 var service = device.services[service_name];
				 if (service.serviceType === "urn:schemas-upnp-org:service:serverInfo:1") {
					 console.log("Found service urn:schemas-upnp-org:service:serverInfo:1");
					 service.callAction	( "getWebsocket"
										, {}
										, function(err, buf) {
											if (err) {
												 console.log("got err when performing action: ", err, " => ", buf);
												} else {//console.log("Success :\n", buf);
														var parser = new self.DOMParser();
														var xmlDoc = parser.parseFromString(buf,"text/xml");
														// console.log(xmlDoc);
														var node_ad = xmlDoc.getElementsByTagName("serverWebsocket").item(0);
														console.log("Detected AppsGate address is " + node_ad);
														self.appsGate_ws_ad = node_ad.childNodes.item(0).toString();
														if(self.appsGate_ws_ad.substr(0,4) === "http") {self.appsGate_ws_ad = "ws"+self.appsGate_ws_ad.substring(4);}
														self.ConnectToAppsGateServer();
													   }
											}
										);
					}
				}
			}
		}
};

var params = {}, p;
for(var i=2; i<process.argv.length; i++) {
	p = process.argv[i].split(':');
	params[p[0]] = p[1];
}

var port = params.port || 8080;
console.log("Listening on port " + port);
RRServer.init( port, params );
