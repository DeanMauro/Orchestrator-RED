require('../lib/orchestrator.js');

module.exports = function(RED) {

    /*Login Node functionality*/
    function LoginNode(config) {
        RED.nodes.createNode(this,config);

        this.on('input', function(msg) {
        	
        	Orchestrator.refreshToken(this);    // Authenticate session using provided credentials

            // Display connection status
            if (Orchestrator.token) {
            	this.status({fill:"green",shape:"dot",text:"connected"});
            } else {
            	this.status({fill:"red",shape:"ring",text:"unsuccessful"});
            	this.error("Login Unsuccessful");
            }

            this.send(Orchestrator.token);  // Output status
        });
    }
    
    /*Store credentials*/
    RED.nodes.registerType("login",LoginNode, {
    	credentials: {
         url: {type: "text"},
    	 tenant: {type: "text"},
         username: {type:"text"},
         password: {type:"password"}
     }
    });
}