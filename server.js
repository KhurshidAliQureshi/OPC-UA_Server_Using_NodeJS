var opcua = require("node-opcua");

var server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "FIS/Server",
});

function initialization() {
    console.log("initialized");
	
	function address_space(server) {

		var addressSpace = server.engine.addressSpace;

		//declare a new object
		var device = addressSpace.addObject({
			organizedBy: addressSpace.rootFolder.objects,
			browseName: "MyDevice"
		});

		//add some variables 
		var variable1 = 10.0;
		
		server.engine.addressSpace.addVariable({

			componentOf: device,

			nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4

			browseName: "MyVariable1",

			dataType: "Double",    

			value: {
				get: function () {
					return new opcua.Variant({dataType: opcua.DataType.Double, value: variable1 });
				},
				set: function (variant) {
					variable1 = parseFloat(variant.value);
					return opcua.StatusCodes.Good;
				}
			}
		});
		
	}
	
	address_space(server);
	
	server.start(function() {
		
		console.log("Server is now listening ... ( press CTRL+C to stop)");
		console.log("port ", server.endpoints[0].port);
		var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
		console.log(" the primary server endpoint url is ", endpointUrl );
		
	});


}

server.initialize(initialization);